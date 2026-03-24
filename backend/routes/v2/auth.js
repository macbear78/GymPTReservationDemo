if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import jwt from 'jsonwebtoken';

export const authV2Router = Router();

function getSecret() {
  return process.env.JWT_SECRET || 'gympt-jwt-secret-change-in-production';
}

/**
 * POST /api/v2/auth/login
 * Body: { password }
 */
authV2Router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: '비밀번호를 입력해주세요.' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  if (password !== adminPassword) {
    return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
  }

  const token = jwt.sign(
    { role: 'admin', storeId: 'store_default' },
    getSecret(),
    { expiresIn: '24h' }
  );

  res.json({ token, expiresIn: 86400 });
});

/**
 * GET /api/v2/auth/me
 * 토큰 유효성 확인
 */
authV2Router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const payload = jwt.verify(auth.slice(7), getSecret());
    res.json({ role: payload.role, storeId: payload.storeId });
  } catch {
    res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
});
