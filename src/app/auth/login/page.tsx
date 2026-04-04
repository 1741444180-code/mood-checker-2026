'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || '登录失败，请重试');
      }
    } catch (err) {
      setError('网络错误，请检查连接后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Box className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 sm:mx-auto">
        <Typography variant="h4" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }} className="font-bold text-center mb-4 sm:mb-6">
          登录
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="用户名或邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </form>
        <Typography className="text-center mt-4">
          没有账号？<Link href="/auth/register" className="text-purple-600">立即注册</Link>
        </Typography>
      </Box>
    </Box>
  );
}
