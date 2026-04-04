'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Button, Typography, Grid, Paper } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import InsightsIcon from '@mui/icons-material/Insights';

export default function HomePage() {
  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="flex items-center space-x-2">
              <EmojiEmotionsIcon className="text-purple-600" style={{ fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} className="text-purple-600 font-bold">
                心情打卡
              </Typography>
            </Link>
            {/* 桌面端导航 */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link href="/help" className="text-gray-600 hover:text-purple-600 transition-colors">
                帮助中心
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                免费注册
              </Link>
            </div>
            {/* 移动端导航 */}
            <div className="flex sm:hidden items-center space-x-2">
              <Link href="/auth/login" className="text-purple-600 text-sm font-medium">
                登录
              </Link>
              <Link
                href="/auth/register"
                className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium"
              >
                注册
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="py-10 sm:py-16 md:py-20">
        <Container maxWidth="md">
          <Box className="text-center px-4 sm:px-0">
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' }, lineHeight: 1.2 }}
              className="font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"
            >
              记录每一天的心情
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: '0.95rem', sm: '1.125rem', md: '1.5rem' } }}
              className="text-gray-600 mb-6 sm:mb-10"
            >
              追踪情绪变化，发现内心规律，成为更好的自己
            </Typography>
            <Box className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transition-all hover:scale-105 text-center"
              >
                开始记录心情
              </Link>
              <Link
                href="/auth/login"
                className="bg-white text-purple-600 px-6 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all text-center"
              >
                立即登录
              </Link>
            </Box>
          </Box>
        </Container>
      </section>

      {/* 核心功能 */}
      <section className="py-16 bg-white">
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem' } }} className="text-center font-bold mb-3 sm:mb-4 text-gray-900">
            为什么选择心情打卡？
          </Typography>
          <Typography variant="h6" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }} className="text-center text-gray-600 mb-6 sm:mb-12">
            全方位的情绪管理工具，帮助您更好地了解自己
          </Typography>
          
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
            {/* 功能 1 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                className="p-4 sm:p-6 md:p-8 text-center rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2"
                style={{ height: '100%' }}
              >
                <Box className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <EmojiEmotionsIcon className="text-purple-600" style={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-semibold mb-2 sm:mb-3">
                  每日心情记录
                </Typography>
                <Typography className="text-gray-600">
                  7 种标准心情 + 自定义心情，简单快捷记录每天的情绪状态
                </Typography>
              </Paper>
            </Grid>

            {/* 功能 2 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                className="p-4 sm:p-6 md:p-8 text-center rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2"
                style={{ height: '100%' }}
              >
                <Box className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TrendingUpIcon className="text-indigo-600" style={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-semibold mb-2 sm:mb-3">
                  数据分析
                </Typography>
                <Typography className="text-gray-600">
                  可视化图表展示心情趋势，发现情绪变化的规律和周期
                </Typography>
              </Paper>
            </Grid>

            {/* 功能 3 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                className="p-4 sm:p-6 md:p-8 text-center rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2"
                style={{ height: '100%' }}
              >
                <Box className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CalendarTodayIcon className="text-pink-600" style={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-semibold mb-2 sm:mb-3">
                  心情日历
                </Typography>
                <Typography className="text-gray-600">
                  以日历形式查看历史心情，快速回顾过去的情绪状态
                </Typography>
              </Paper>
            </Grid>

            {/* 功能 4 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                className="p-4 sm:p-6 md:p-8 text-center rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2"
                style={{ height: '100%' }}
              >
                <Box className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <PeopleIcon className="text-purple-600" style={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-semibold mb-2 sm:mb-3">
                  好友互动
                </Typography>
                <Typography className="text-gray-600">
                  添加好友、分享心情，与朋友一起关注心理健康
                </Typography>
              </Paper>
            </Grid>

            {/* 功能 5 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                className="p-4 sm:p-6 md:p-8 text-center rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2"
                style={{ height: '100%' }}
              >
                <Box className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BadgeIcon className="text-indigo-600" style={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-semibold mb-2 sm:mb-3">
                  徽章系统
                </Typography>
                <Typography className="text-gray-600">
                  完成成就解锁专属徽章，让心情管理更有趣味性
                </Typography>
              </Paper>
            </Grid>

            {/* 功能 6 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                className="p-4 sm:p-6 md:p-8 text-center rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2"
                style={{ height: '100%' }}
              >
                <Box className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <InsightsIcon className="text-pink-600" style={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-semibold mb-2 sm:mb-3">
                  智能洞察
                </Typography>
                <Typography className="text-gray-600">
                  AI 分析心情数据，提供个性化的心理健康建议
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* CTA 区域 */}
      <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <Container maxWidth="md">
          <Box className="text-center text-white px-4 sm:px-0">
            <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem' } }} className="font-bold mb-3 sm:mb-4">
              开始您的心情管理之旅
            </Typography>
            <Typography variant="h6" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }} className="mb-6 sm:mb-10 text-purple-100">
              加入 10 万 + 用户，一起关注心理健康
            </Typography>
            <Link
              href="/auth/register"
              className="inline-block bg-white text-purple-600 px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              免费开始使用
            </Link>
          </Box>
        </Container>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, sm: 6, md: 8 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} className="text-white font-semibold mb-3 sm:mb-4">
                心情打卡
              </Typography>
              <Typography className="text-sm">
                记录每一天的心情，成为更好的自己
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} className="text-white font-semibold mb-3 sm:mb-4">
                功能
              </Typography>
              <ul className="space-y-2 text-sm">
                <li><Link href="/stats" className="hover:text-white transition-colors">数据统计</Link></li>
                <li><Link href="/calendar" className="hover:text-white transition-colors">心情日历</Link></li>
                <li><Link href="/badges" className="hover:text-white transition-colors">徽章系统</Link></li>
              </ul>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} className="text-white font-semibold mb-3 sm:mb-4">
                支持
              </Typography>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white transition-colors">帮助中心</Link></li>
                <li><Link href="/feedback" className="hover:text-white transition-colors">意见反馈</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
              </ul>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} className="text-white font-semibold mb-3 sm:mb-4">
                账户
              </Typography>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">登录</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">注册</Link></li>
                <li><Link href="/settings" className="hover:text-white transition-colors">设置</Link></li>
              </ul>
            </Grid>
          </Grid>
          <Box className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <Typography>
              © 2026 心情打卡。All rights reserved.
            </Typography>
          </Box>
        </Container>
      </footer>
    </Box>
  );
}
