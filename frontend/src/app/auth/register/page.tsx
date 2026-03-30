'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';


export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    account: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // 清除错误
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 用户名验证
    if (!formData.username || formData.username.length < 2 || formData.username.length > 20) {
      newErrors.username = '用户名需 2-20 位字符';
    }
    
    // 账号验证（手机号或邮箱）
    if (!formData.account) {
      newErrors.account = '请输入手机号或邮箱';
    } else if (!/^\d{11}$/.test(formData.account) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.account)) {
      newErrors.account = '请输入正确的手机号或邮箱地址';
    }
    
    // 密码验证
    if (!formData.password || formData.password.length < 6 || formData.password.length > 20) {
      newErrors.password = '密码需 6-20 位，包含字母和数字';
    }
    
    // 确认密码验证
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // TODO: 实现注册 API 调用
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('注册成功！正在跳转...');
      // 跳转登录页或首页
    } catch (error) {
      alert('注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
      
      {/* 装饰圆形 */}
      <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-white/8 rounded-full blur-3xl" />
      
      {/* 主容器 */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* 卡片 */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🎨</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">心情打卡</h1>
            <p className="text-sm text-gray-600 tracking-wide">Mood Checker</p>
          </div>
          
          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="用户名"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full h-[52px] pl-12 pr-4 bg-white border border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm flex items-center gap-1.5">
                  <span>⚠️</span> {errors.username}
                </p>
              )}
            </div>
            
            {/* 账号输入 */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="account"
                  placeholder="手机号/邮箱"
                  value={formData.account}
                  onChange={handleChange}
                  className="w-full h-[52px] pl-12 pr-4 bg-white border border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
              {errors.account && (
                <p className="text-red-500 text-sm flex items-center gap-1.5">
                  <span>⚠️</span> {errors.account}
                </p>
              )}
            </div>
            
            {/* 密码输入 */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="密码"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[52px] pl-12 pr-12 bg-white border border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1.5">
                  <span>⚠️</span> {errors.password}
                </p>
              )}
            </div>
            
            {/* 确认密码 */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="确认密码"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-[52px] pl-12 pr-12 bg-white border border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center gap-1.5">
                  <span>⚠️</span> {errors.confirmPassword}
                </p>
              )}
            </div>
            
            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                '注册'
              )}
            </button>
            
            {/* 辅助链接 */}
            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                已有账号？<span className="font-medium">立即登录</span>
              </Link>
            </div>
            
            {/* 服务条款 */}
            <p className="text-center text-xs text-gray-500 mt-4">
              注册即表示您同意我们的{' '}
              <Link href="/tos" className="text-indigo-600 hover:underline">
                服务条款
              </Link>
              {' '}和{' '}
              <Link href="/privacy" className="text-indigo-600 hover:underline">
                隐私政策
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
