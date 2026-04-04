'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function HelpPage() {
  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-purple-600">← 返回首页</Link>
        </div>
      </nav>
      <Box className="max-w-4xl mx-auto px-4 py-8">
        <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem' } }} className="font-bold mb-6 sm:mb-8 text-center">
          帮助中心
        </Typography>
        <Box className="space-y-4">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>如何注册账号？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>点击首页右上角的"免费注册"按钮，填写用户名、邮箱和密码即可完成注册。</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>如何记录心情？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>登录后在首页选择当前心情，填写备注后点击提交即可完成打卡。</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>如何查看历史数据？</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>在个人中心可以查看心情日历和统计数据。</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
}
