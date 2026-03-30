'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Container, TextField, Button, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import Person from '@mui/icons-material/Person';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

export const metadata = {
  title: '注册',
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现注册逻辑
    alert('注册功能开发中...');
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 flex items-center justify-center py-12 px-4">
      {/* 导航栏 */}
      <nav className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <EmojiEmotionsIcon className="text-purple-600" style={{ fontSize: 32 }} />
              <Typography variant="h6" className="text-purple-600 font-bold">
                心情打卡
              </Typography>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="text-gray-600 hover:text-purple-600 transition-colors">
                帮助中心
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                已有账号？登录
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Container maxWidth="sm">
        <Paper elevation={3} className="p-8 rounded-2xl">
          {/* 标题 */}
          <Box className="text-center mb-8">
            <Typography variant="h4" className="font-bold mb-2 text-gray-900">
              免费注册
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              创建您的心情打卡账户
            </Typography>
          </Box>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名 */}
            <TextField
              fullWidth
              required
              label="用户名"
              name="username"
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              placeholder="请输入用户名"
            />

            {/* 邮箱 */}
            <TextField
              fullWidth
              required
              type="email"
              label="邮箱"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              placeholder="请输入邮箱"
            />

            {/* 密码 */}
            <TextField
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              label="密码"
              name="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="请输入密码"
            />

            {/* 确认密码 */}
            <TextField
              fullWidth
              required
              type={showConfirmPassword ? 'text' : 'password'}
              label="确认密码"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="请再次输入密码"
            />

            {/* 提交按钮 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-3 rounded-full font-semibold"
            >
              立即注册
            </Button>
          </form>

          {/* 其他选项 */}
          <Box className="mt-6 text-center">
            <Typography variant="body2" className="text-gray-600">
              已有账号？{' '}
              <Link href="/auth/login" className="text-purple-600 hover:underline font-semibold">
                立即登录
              </Link>
            </Typography>
          </Box>

          {/* 服务条款 */}
          <Box className="mt-4 text-center">
            <Typography variant="caption" className="text-gray-500">
              注册即表示您同意我们的{' '}
              <Link href="/tos" className="text-purple-600 hover:underline">
                服务条款
              </Link>
              {' '}和{' '}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                隐私政策
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
