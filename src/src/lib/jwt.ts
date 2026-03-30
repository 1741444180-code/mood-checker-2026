// src/lib/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

/**
 * 生成 JWT token
 * @param payload JWT 负载数据
 * @returns JWT token
 */
export function generateToken(payload: JWTPayload): string {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // 7 天有效期
  });
  return token;
}

/**
 * 验证 JWT token
 * @param token JWT token
 * @returns 解码后的 payload
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * 从请求头获取 token
 * @param authHeader Authorization header
 * @returns token 或 null
 */
export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // 移除 'Bearer ' 前缀
}
