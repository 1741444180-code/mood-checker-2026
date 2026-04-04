'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码至少6位');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 保存 token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('注册成功！即将跳转到首页');
        router.push('/dashboard');
      } else {
        setError(data.error || '注册失败，请重试');
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
          免费注册
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="用户名"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <TextField
            fullWidth
            label="邮箱"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <TextField
            fullWidth
            label="密码"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            helperText="至少6位"
          />
          <TextField
            fullWidth
            label="确认密码"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>
        <Typography className="text-center mt-4">
          已有账号？<Link href="/auth/login" className="text-purple-600">立即登录</Link>
        </Typography>
      </Box>
    </Box>
  );
}
