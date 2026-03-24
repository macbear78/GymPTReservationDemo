import jwt from 'jsonwebtoken';

/**
 * 관리자 JWT 인증 미들웨어
 * Authorization: Bearer <token> 헤더 필요
 */
export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '관리자 인증이 필요합니다.' });
  }

  const secret = process.env.JWT_SECRET || 'gympt-jwt-secret-change-in-production';
  try {
    const payload = jwt.verify(auth.slice(7), secret);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: '관리자 권한이 없습니다.' });
    }
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
}
