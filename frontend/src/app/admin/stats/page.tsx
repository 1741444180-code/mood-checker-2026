'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalContent: number;
  approvedContent: number;
  pendingContent: number;
  rejectedContent: number;
  dailyUsers: Array<{ date: string; users: number }>;
  contentByCategory: Array<{ name: string; value: number }>;
  userGrowth: Array<{ month: string; growth: number }>;
}

const StatsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  // 模拟统计数据
  useEffect(() => {
    // 模拟API加载
    setTimeout(() => {
      const mockData = {
        totalUsers: 1234,
        activeUsers: 892,
        newUsersToday: 15,
        totalContent: 5678,
        approvedContent: 4231,
        pendingContent: 567,
        rejectedContent: 880,
        dailyUsers: [
          { date: '11/14', users: 120 },
          { date: '11/15', users: 150 },
          { date: '11/16', users: 140 },
          { date: '11/17', users: 180 },
          { date: '11/18', users: 160 },
          { date: '11/19', users: 190 },
          { date: '11/20', users: 210 },
        ],
        contentByCategory: [
          { name: '科技', value: 1200 },
          { name: '健康', value: 950 },
          { name: '旅行', value: 780 },
          { name: '教育', value: 1100 },
          { name: '生活', value: 850 },
          { name: '其他', value: 848 },
        ],
        userGrowth: [
          { month: '1月', growth: 45 },
          { month: '2月', growth: 52 },
          { month: '3月', growth: 48 },
          { month: '4月', growth: 61 },
          { month: '5月', growth: 55 },
          { month: '6月', growth: 67 },
          { month: '7月', growth: 72 },
          { month: '8月', growth: 68 },
          { month: '9月', growth: 75 },
          { month: '10月', growth: 82 },
          { month: '11月', growth: 78 },
          { month: '12月', growth: 85 },
        ]
      };
      setStatsData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  // 检查管理员权限
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin || isAdmin !== 'true') {
      router.push('/login');
    }
  }, [router]);

  // 颜色定义
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  // 加载状态
  if (loading || !statsData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center items-center h-64">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 移动端侧边栏覆盖层 */}
      <div 
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">数据统计</h1>
              <p className="text-gray-600 mt-1">平台运营数据概览</p>
            </div>

            {/* 日期范围选择器 */}
            <div className="flex justify-end mb-6">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                {['7d', '30d', '90d', '1y'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${
                      dateRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } border border-gray-200 rounded-md ${
                      range === '7d' ? 'rounded-l-lg' : range === '1y' ? 'rounded-r-lg' : ''
                    }`}
                    onClick={() => setDateRange(range)}
                  >
                    {range === '7d' && '7天'}
                    {range === '30d' && '30天'}
                    {range === '90d' && '90天'}
                    {range === '1y' && '1年'}
                  </button>
                ))}
              </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">总用户数</p>
                    <p className="text-2xl font-semibold text-gray-900">{statsData.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span>+{statsData.newUsersToday} 今日新增</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">活跃用户</p>
                    <p className="text-2xl font-semibold text-gray-900">{statsData.activeUsers.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(statsData.activeUsers / statsData.totalUsers * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((statsData.activeUsers / statsData.totalUsers) * 100).toFixed(1)}% 活跃率
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">总内容数</p>
                    <p className="text-2xl font-semibold text-gray-900">{statsData.totalContent.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-4">
                    <div className="text-xs">
                      <span className="text-green-600">✓ {statsData.approvedContent.toLocaleString()} 已通过</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-yellow-600">⏳ {statsData.pendingContent.toLocaleString()} 待审核</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">内容通过率</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {((statsData.approvedContent / (statsData.approvedContent + statsData.rejectedContent)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>本月审核 {statsData.approvedContent + statsData.rejectedContent} 条内容</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* 日活用户趋势图 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">日活跃用户趋势</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statsData.dailyUsers}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" fill="#3b82f6" name="活跃用户数" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 内容分类分布饼图 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">内容分类分布</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statsData.contentByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={(props: any) => {
                          const { name, percent } = props;
                          return `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`;
                        }}
                      >
                        {statsData.contentByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} 条`, '数量']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 用户增长趋势图 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">用户月增长率</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statsData.userGrowth}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="growth" fill="#10b981" name="新增用户数" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 最近活动表格 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">最近活动</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">详情</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-800 font-medium">Z</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">张三</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">发布内容</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10分钟前</td>
                      <td className="px-6 py-4 text-sm text-gray-500">发布了文章《如何提高工作效率》</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-800 font-medium">L</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">李四</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">内容审核</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25分钟前</td>
                      <td className="px-6 py-4 text-sm text-gray-500">审核通过了《最新科技趋势分析》</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-800 font-medium">W</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">王五</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">注册</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1小时前</td>
                      <td className="px-6 py-4 text-sm text-gray-500">新用户注册</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <span className="text-yellow-800 font-medium">Z</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">赵六</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">评论</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2小时前</td>
                      <td className="px-6 py-4 text-sm text-gray-500">在《旅游攻略分享》下发表了评论</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-800 font-medium">Q</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">钱七</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">内容审核</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3小时前</td>
                      <td className="px-6 py-4 text-sm text-gray-500">拒绝了《理财投资建议》</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StatsPage;