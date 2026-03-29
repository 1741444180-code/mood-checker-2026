'use client';

import React, { useState, useEffect } from 'react';
import { Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ChartComponent from '@/components/charts/chart-component';

// Mock data for revenue trends
const revenueData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 9800, profit: 2000 },
  { name: 'Apr', revenue: 3908, profit: 2780 },
  { name: 'May', revenue: 4800, profit: 1890 },
  { name: 'Jun', revenue: 3800, profit: 2390 },
  { name: 'Jul', revenue: 4300, profit: 3490 },
];

// Mock data for user growth
const userData = [
  { name: 'Jan', users: 4000, newUsers: 2400 },
  { name: 'Feb', users: 3000, newUsers: 1398 },
  { name: 'Mar', users: 2000, newUsers: 9800 },
  { name: 'Apr', users: 2780, newUsers: 3908 },
  { name: 'May', users: 1890, newUsers: 4800 },
  { name: 'Jun', users: 2390, newUsers: 3800 },
  { name: 'Jul', users: 3490, newUsers: 4300 },
];

// Mock data for metrics
const metrics = [
  { title: 'Total Revenue', value: '$42,567', change: '+12.5%', positive: true },
  { title: 'Active Users', value: '12,345', change: '+8.2%', positive: true },
  { title: 'Orders', value: '1,243', change: '-2.1%', positive: false },
  { title: 'Conversion Rate', value: '4.7%', change: '+1.3%', positive: true },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('monthly');
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Reports</h1>
        <p className="text-gray-600 mt-2">Analytics and insights for your platform</p>
      </div>
      
      {/* Time range selector */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {['daily', 'weekly', 'monthly'].map((range) => (
            <button
              key={range}
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-200 rounded-md ${
                range === 'daily' ? 'rounded-l-lg' : 
                range === 'monthly' ? 'rounded-r-lg' : ''
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-sm mt-1 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue and profit overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent 
              data={revenueData} 
              type="bar" 
              dataKey="revenue" 
              name="Revenue" 
              height={300}
            >
              <Bar dataKey="profit" name="Profit" fill="#10b981" />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </ChartComponent>
          </CardContent>
        </Card>
        
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Active users and new signups</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent 
              data={userData} 
              type="area" 
              dataKey="users" 
              name="Active Users" 
              height={300}
            >
              <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#ec4899" fill="#ec4899" name="New Users" />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </ChartComponent>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart example */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>Daily active users and session duration</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent 
              data={revenueData} 
              type="line" 
              dataKey="revenue" 
              name="Engagement" 
              height={300}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </ChartComponent>
          </CardContent>
        </Card>
        
        {/* Another chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Response times and uptime metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent 
              data={userData} 
              type="line" 
              dataKey="users" 
              name="Response Time" 
              height={300}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </ChartComponent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}