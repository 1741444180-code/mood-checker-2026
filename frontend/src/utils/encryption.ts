import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-secret-key';

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}
