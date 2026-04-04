'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';

export default function PrivacyPage() {
  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-purple-600">← 返回首页</Link>
        </div>
      </nav>
      <Box className="max-w-4xl mx-auto px-4 py-8">
        <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem' } }} className="font-bold mb-6 sm:mb-8 text-center">
          隐私政策
        </Typography>
        <Box className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg space-y-4">
          <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' } }} className="font-bold">
            1. 信息收集
          </Typography>
          <Typography>
            我们收集您注册时提供的邮箱、用户名等信息，以及您记录的心情数据。
          </Typography>
          
          <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' } }} className="font-bold">
            2. 信息使用
          </Typography>
          <Typography>
            我们仅使用您的信息为您提供心情记录和分析服务。
          </Typography>
          
          <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' } }} className="font-bold">
            3. 信息保护
          </Typography>
          <Typography>
            我们采取严格的安全措施保护您的个人信息。
          </Typography>
          
          <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' } }} className="font-bold">
            4. 联系我们
          </Typography>
          <Typography>
            如有隐私相关问题，请联系我们的客服团队。
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
