import { Router } from 'express';
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../db/dynamodb.js';

export const debugDbRouter = Router();

const MAX_SCAN = 200;

function isDebugAllowed() {
  if (process.env.ENABLE_DB_DEBUG === 'false' || process.env.ENABLE_DB_DEBUG === '0') return false;
  if (process.env.ENABLE_DB_DEBUG === 'true' || process.env.ENABLE_DB_DEBUG === '1') return true;
  return process.env.NODE_ENV !== 'production';
}

function guard(req, res, next) {
  if (!isDebugAllowed()) {
    return res.status(404).json({ error: 'DB 디버그 API가 비활성화되어 있습니다.' });
  }
  next();
}

debugDbRouter.use(guard);

/** GET /api/debug/db/tables — 계정의 DynamoDB 테이블 이름 목록 */
debugDbRouter.get('/tables', async (req, res) => {
  try {
    const result = await docClient.send(new ListTablesCommand({}));
    const tables = (result.TableNames || []).slice().sort();
    res.json({ tables });
  } catch (e) {
    console.error('debugDb tables:', e);
    res.status(500).json({ error: e.message || '테이블 목록 조회 실패' });
  }
});

/** GET /api/debug/db/scan/:tableName?limit=50&nextToken=… — 테이블 스캔(읽기 전용, 상한) */
debugDbRouter.get('/scan/:tableName', async (req, res) => {
  try {
    const rawName = req.params.tableName;
    if (!/^[a-zA-Z0-9_.-]+$/.test(rawName)) {
      return res.status(400).json({ error: '유효하지 않은 테이블 이름입니다.' });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), MAX_SCAN);
    let exclusiveStartKey;
    if (req.query.nextToken) {
      try {
        const json = Buffer.from(req.query.nextToken, 'base64url').toString('utf8');
        exclusiveStartKey = JSON.parse(json);
      } catch {
        return res.status(400).json({ error: 'nextToken 형식이 올바르지 않습니다.' });
      }
    }

    const out = await docClient.send(new ScanCommand({
      TableName: rawName,
      Limit: limit,
      ...(exclusiveStartKey && { ExclusiveStartKey: exclusiveStartKey }),
    }));

    let nextToken = null;
    if (out.LastEvaluatedKey && Object.keys(out.LastEvaluatedKey).length > 0) {
      nextToken = Buffer.from(JSON.stringify(out.LastEvaluatedKey)).toString('base64url');
    }

    res.json({
      tableName: rawName,
      items: out.Items || [],
      count: out.Count,
      scannedCount: out.ScannedCount,
      nextToken,
    });
  } catch (e) {
    console.error('debugDb scan:', e);
    res.status(500).json({ error: e.message || '스캔 실패' });
  }
});
