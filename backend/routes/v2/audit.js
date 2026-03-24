import { Router } from 'express';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../../db/dynamodb.js';

export const auditV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';

/**
 * Audit log 저장 유틸리티
 * DynamoDB 단일 테이블 내에 AUDIT 레코드로 저장
 *
 * @param {Object} params
 * @param {string} params.entityType  - 'PASS' | 'RESERVATION'
 * @param {string} params.entityId    - passId 또는 reservationId
 * @param {string} params.userId      - 대상 회원 ID
 * @param {string} [params.storeId]   - 매장 ID
 * @param {string} params.action      - 'UPDATE' | 'DEDUCT' | 'STATUS_CHANGE'
 * @param {Object} params.changes     - { field: { before, after }, ... }
 * @param {string} [params.editedBy]  - 수정 주체 (admin ID 또는 'admin')
 * @param {string} [params.reason]    - 수정 사유 (선택)
 */
export async function createAuditLog({
  entityType,
  entityId,
  userId,
  storeId,
  action,
  changes,
  editedBy = 'admin',
  reason,
}) {
  const now = new Date().toISOString();
  const auditId = randomUUID();

  const item = {
    PK: `AUDIT#${entityType}#${entityId}`,
    SK: `${now}#${auditId}`,
    auditId,
    entityType,
    entityId,
    userId,
    ...(storeId && { storeId }),
    action,
    changes,       // { remainingSessions: { before: 10, after: 15 }, ... }
    editedBy,
    ...(reason && { reason }),
    createdAt: now,
  };

  await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

/**
 * GET /api/v2/audit/:entityType/:entityId
 * 특정 패스 또는 예약의 수정 이력 조회
 * entityType: PASS | RESERVATION
 */
auditV2Router.get('/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    if (!['PASS', 'RESERVATION', 'USER'].includes(entityType)) {
      return res.status(400).json({ error: 'entityType은 PASS, RESERVATION, USER 중 하나여야 합니다.' });
    }

    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `AUDIT#${entityType}#${entityId}`,
      },
      ScanIndexForward: false, // 최신순
    }));

    res.json({ logs: result.Items || [], total: (result.Items || []).length });
  } catch (e) {
    console.error('GET /audit error:', e);
    res.status(500).json({ error: e.message || '이력 조회에 실패했습니다.' });
  }
});
