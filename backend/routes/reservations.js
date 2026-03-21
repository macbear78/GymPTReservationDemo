import { Router } from 'express';
import { PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../db/dynamodb.js';

export const reservationsRouter = Router();

const TABLE_NAME = 'reservations';
const TIME_SLOTS = ['06:00', '07:00', '08:00', '09:00', '18:00', '19:00', '20:00'];
const STATUSES = ['Confirmed', 'Completed', 'Cancelled', 'No-show'];

function normalizePhone(phone) {
  return String(phone || '').replace(/\s|-|\./g, '').trim();
}

function sendError(res, statusCode, message) {
  res.status(statusCode).json({ error: message });
}

async function scanAll() {
  const items = [];
  let lastEvaluatedKey;
  do {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );
    items.push(...(result.Items || []));
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
  return items;
}

async function findById(id) {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': String(id) },
    })
  );
  return (result.Items && result.Items[0]) || null;
}

/** GET /api/reservations - 예약 리스트 조회 (query: date?, phone?) */
reservationsRouter.get('/', async (req, res) => {
  try {
    const { date, phone } = req.query;
    let items = await scanAll();

    if (date) {
      items = items.filter((r) => r.date === date);
    }
    if (phone) {
      const normalized = normalizePhone(phone);
      if (normalized) {
        items = items.filter((r) => normalizePhone(r.phone) === normalized);
      }
    }

    items.sort((a, b) => {
      const d = (a.date || '').localeCompare(b.date || '');
      return d !== 0 ? -d : (b.time || '').localeCompare(a.time || '');
    });

    res.json(items);
  } catch (err) {
    console.error('DynamoDB GET /reservations error:', err);
    sendError(res, 500, err.message || '예약 목록 조회에 실패했습니다.');
  }
});

/** POST /api/reservations - 예약 생성 */
reservationsRouter.post('/', async (req, res) => {
  try {
    const { name, phone, trainer, date, time, pt_type } = req.body;
    if (!name || !phone || !trainer || !date || !time || !pt_type) {
      return sendError(res, 400, 'Missing required fields');
    }
    if (!TIME_SLOTS.includes(time)) {
      return sendError(res, 400, 'Invalid time slot');
    }

    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression:
          'trainer = :trainer AND #dt = :date AND #tm = :time AND #st = :status',
        ExpressionAttributeNames: {
          '#dt': 'date',
          '#tm': 'time',
          '#st': 'status',
        },
        ExpressionAttributeValues: {
          ':trainer': trainer,
          ':date': date,
          ':time': time,
          ':status': 'Confirmed',
        },
      })
    );
    if (result.Items && result.Items.length > 0) {
      return sendError(res, 409, 'Time slot already booked');
    }

    const id = randomUUID();
    const created_at = new Date().toISOString();
    const item = {
      id,
      name,
      phone,
      trainer,
      date,
      time,
      pt_type,
      status: 'Confirmed',
      created_at,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    res.status(201).json(item);
  } catch (err) {
    console.error('DynamoDB POST /reservations error:', err);
    sendError(res, 500, err.message || '예약 생성에 실패했습니다.');
  }
});

/** GET /api/reservations/available - 가능한 시간 슬롯 */
reservationsRouter.get('/available', async (req, res) => {
  try {
    const { trainer, date } = req.query;
    if (!trainer || !date) {
      return sendError(res, 400, 'trainer and date required');
    }

    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'trainer = :trainer AND #dt = :date AND #st = :status',
        ExpressionAttributeNames: { '#dt': 'date', '#st': 'status' },
        ExpressionAttributeValues: {
          ':trainer': trainer,
          ':date': date,
          ':status': 'Confirmed',
        },
      })
    );
    const booked = (result.Items || []).map((r) => r.time).filter(Boolean);
    const available = TIME_SLOTS.filter((t) => !booked.includes(t));
    res.json(available);
  } catch (err) {
    console.error('DynamoDB GET /available error:', err);
    sendError(res, 500, err.message || '가능한 시간 조회에 실패했습니다.');
  }
});

/** PATCH /api/reservations/:id - 상태/시간/PT유형 변경 (Admin) */
reservationsRouter.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status, time, pt_type } = req.body;
    const row = await findById(id);
    if (!row) {
      return sendError(res, 404, 'Reservation not found');
    }

    let newStatus = row.status;
    let newTime = row.time;
    let newPtType = row.pt_type;

    if (status != null && STATUSES.includes(status)) {
      newStatus = status;
    }
    if (time != null) {
      if (!TIME_SLOTS.includes(time)) {
        return sendError(res, 400, 'Invalid time slot');
      }
      if (newStatus === 'Confirmed') {
        const conflictResult = await docClient.send(
          new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression:
              'trainer = :trainer AND #dt = :date AND #tm = :time AND #st = :status AND id <> :id',
            ExpressionAttributeNames: { '#dt': 'date', '#tm': 'time', '#st': 'status' },
            ExpressionAttributeValues: {
              ':trainer': row.trainer,
              ':date': row.date,
              ':time': time,
              ':status': 'Confirmed',
              ':id': id,
            },
          })
        );
        if (conflictResult.Items && conflictResult.Items.length > 0) {
          return sendError(res, 409, 'Time slot already booked');
        }
      }
      newTime = time;
    }
    if (pt_type != null && (pt_type === '30min' || pt_type === '60min')) {
      newPtType = pt_type;
    }

    const updated = {
      ...row,
      status: newStatus,
      time: newTime,
      pt_type: newPtType,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: updated,
      })
    );

    res.json(updated);
  } catch (err) {
    console.error('DynamoDB PATCH /reservations/:id error:', err);
    sendError(res, 500, err.message || '예약 수정에 실패했습니다.');
  }
});

/** DELETE /api/reservations/:id - 예약 취소 (DeleteCommand로 항목 삭제) */
reservationsRouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const row = await findById(id);
    if (!row) {
      return sendError(res, 404, 'Reservation not found');
    }

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: String(id) },
      })
    );

    res.json({ ...row, status: 'Cancelled' });
  } catch (err) {
    console.error('DynamoDB DELETE /reservations/:id error:', err);
    sendError(res, 500, err.message || '예약 취소에 실패했습니다.');
  }
});
