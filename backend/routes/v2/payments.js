if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import fetch from 'node-fetch';
import docClient from '../../db/dynamodb.js';

export const paymentsV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';

// 패스 상품 정의 (실서비스에서는 DB에서 관리)
const PASS_PRODUCTS = [
  { productId: 'pt_10', name: 'PT 10회권', sessions: 10, price: 500000, validDays: 90 },
  { productId: 'pt_20', name: 'PT 20회권', sessions: 20, price: 900000, validDays: 180 },
  { productId: 'pt_30', name: 'PT 30회권', sessions: 30, price: 1200000, validDays: 180 },
];

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

/**
 * GET /api/v2/stores/:storeId/payments/products
 * 결제 가능한 패스 상품 목록
 */
paymentsV2Router.get('/products', (req, res) => {
  res.json({ products: PASS_PRODUCTS });
});

/**
 * POST /api/v2/stores/:storeId/payments/prepare
 * 결제 준비 — orderId 생성 및 주문 레코드 저장
 * Body: { userId, productId }
 */
paymentsV2Router.post('/prepare', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return sendError(res, 400, 'userId, productId는 필수입니다.');
    }

    const product = PASS_PRODUCTS.find((p) => p.productId === productId);
    if (!product) {
      return sendError(res, 404, '존재하지 않는 상품입니다.');
    }

    const orderId = `order_${randomUUID()}`;
    const now = new Date().toISOString();

    // 주문 레코드 저장 (결제 전 pending 상태)
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: `PAYMENT#${now}`,
        paymentId: orderId,
        orderId,
        userId,
        storeId,
        productId,
        productName: product.name,
        sessions: product.sessions,
        amount: product.price,
        validDays: product.validDays,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      },
    }));

    res.json({
      orderId,
      amount: product.price,
      orderName: product.name,
      customerKey: userId,
    });
  } catch (e) {
    console.error('POST /payments/prepare error:', e);
    return sendError(res, 500, e.message || '결제 준비에 실패했습니다.');
  }
});

/**
 * POST /api/v2/stores/:storeId/payments/confirm
 * 토스 결제 승인 + 패스 발급
 * Body: { paymentKey, orderId, amount, userId }
 */
paymentsV2Router.post('/confirm', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { paymentKey, orderId, amount, userId } = req.body;

    if (!paymentKey || !orderId || !amount || !userId) {
      return sendError(res, 400, 'paymentKey, orderId, amount, userId는 필수입니다.');
    }

    // 결제위젯 클라이언트 키와 같은 상점의 시크릿 키 사용 (문서용 테스트: test_gsk_docs_…)
    const secretKey = process.env.TOSS_SECRET_KEY || 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';
    const encKey = Buffer.from(`${secretKey}:`).toString('base64');

    // 토스 결제 승인 API 호출
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    });

    const tossData = await tossRes.json();

    if (!tossRes.ok) {
      return sendError(res, 400, tossData.message || '결제 승인에 실패했습니다.');
    }

    // 주문 레코드에서 상품 정보 조회
    // (간단화: orderId에서 products 매핑 재계산)
    const matchedProduct = PASS_PRODUCTS.find((p) => p.price === Number(amount));
    if (!matchedProduct) {
      return sendError(res, 400, '주문 정보를 확인할 수 없습니다.');
    }

    const now = new Date().toISOString();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + matchedProduct.validDays);
    const expiryDateStr = expiryDate.toISOString().slice(0, 10);

    const passId = randomUUID();

    // 패스 발급
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `USER#${userId}`,
        SK: `PASS#${passId}`,
        passId,
        userId,
        storeId,
        totalSessions: matchedProduct.sessions,
        remainingSessions: matchedProduct.sessions,
        expiryDate: expiryDateStr,
        status: 'ACTIVE',
        paymentId: orderId,
        memo: `${matchedProduct.name} 결제`,
        createdAt: now,
        updatedAt: now,
      },
    }));

    // 결제 레코드 PAID 업데이트 (새 레코드로 저장)
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `STORE#${storeId}`,
        SK: `PAYMENT#${now}`,
        paymentId: orderId,
        paymentKey,
        userId,
        storeId,
        productName: matchedProduct.name,
        sessions: matchedProduct.sessions,
        amount: Number(amount),
        status: 'PAID',
        passId,
        method: tossData.method || 'card',
        createdAt: now,
      },
    }));

    res.json({
      success: true,
      passId,
      sessions: matchedProduct.sessions,
      expiryDate: expiryDateStr,
      amount: Number(amount),
      productName: matchedProduct.name,
    });
  } catch (e) {
    console.error('POST /payments/confirm error:', e);
    return sendError(res, 500, e.message || '결제 승인에 실패했습니다.');
  }
});

/**
 * GET /api/v2/stores/:storeId/payments
 * 스토어 결제 이력 (관리자)
 */
paymentsV2Router.get('/', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { QueryCommand: QC } = await import('@aws-sdk/lib-dynamodb');

    const result = await docClient.send(new QC({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `STORE#${storeId}`,
        ':prefix': 'PAYMENT#',
      },
      ScanIndexForward: false,
      Limit: 50,
    }));

    res.json({ payments: result.Items || [] });
  } catch (e) {
    console.error('GET /payments error:', e);
    return sendError(res, 500, e.message || '결제 이력 조회에 실패했습니다.');
  }
});
