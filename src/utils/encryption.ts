import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production';

/**
 * 加密数据
 */
export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

/**
 * 解密数据
 */
export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * 加密敏感数据
 */
export function encryptSensitiveData(data: string): string {
  return encrypt(data);
}

/**
 * 解密敏感数据
 */
export function decryptSensitiveData(ciphertext: string): string {
  return decrypt(ciphertext);
}

/**
 * 哈希密码
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

/**
 * 验证密码
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

/**
 * 验证加密数据
 */
export function verifyEncryptedData(encrypted: string, original: string): boolean {
  try {
    const decrypted = decrypt(encrypted);
    return decrypted === original;
  } catch {
    return false;
  }
}

export default { encrypt, decrypt, encryptSensitiveData, decryptSensitiveData, hashPassword, verifyPassword, verifyEncryptedData };
