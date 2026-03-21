import { Router } from 'express';
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';
import docClient  from '../db/dynamodb.js';

export const healthRouter = Router();

/** GET /health/db - DynamoDB 연결 상태 확인 */
healthRouter.get('/db', async (req, res) => {
  try {
    const result = await docClient.send(new ListTablesCommand({}));
    res.json({
      status: 'ok',
      tables: result.TableNames || [],
    });
  } catch (err) {
    console.error('Health check DynamoDB error:', err);
    res.status(500).json({
      status: 'error',
      error: err.message || 'DynamoDB 연결 확인에 실패했습니다.',
    });
  }
});
