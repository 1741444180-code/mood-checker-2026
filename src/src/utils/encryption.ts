// src/utils/encryption.ts
import bcrypt from 'bcryptjs';

/**
 * 哈希密码
 * @param password 明文密码
 * @returns 哈希后的密码
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hashedPassword 哈希后的密码
 * @returns 验证结果
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
