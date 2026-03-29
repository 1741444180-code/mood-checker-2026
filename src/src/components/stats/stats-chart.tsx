'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MoodStats {
  moodDistribution: Record<string, number>;
  totalEntries: number;
  checkInRate: string;
  consecutiveDays: number;
}

interface PieDataItem {
  name: string;
  value: number;
}

const COLORS = ['#FFD700', '#90EE90', '#87CEEB', '#FF6B6B', '#DDA0DD', '#D3D3D3', '#FF69B4'];

export function StatsChart({ stats }: { stats: MoodStats }) {
  // 准备饼图数据
  const pieData: PieDataItem[] = Object.entries(stats.moodDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // 准备柱状图数据（如果需要按时间段展示）
  const barData = pieData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>打卡统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold">{stats.totalEntries}</p>
              <p className="text-gray-600">总打卡数</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold">{stats.consecutiveDays}</p>
              <p className="text-gray-600">连续打卡</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold">{stats.checkInRate}</p>
              <p className="text-gray-600">打卡率</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold">{pieData.length}</p>
              <p className="text-gray-600">心情种类</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>心情分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} 次`, '次数']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>心情统计详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="打卡次数" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}