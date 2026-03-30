"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - replace with real API calls
const generateMockData = (days: number) => {
  const moodTypes = ["开心", "平静", "焦虑", "疲惫", "兴奋"] as const;
  const moodColors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
  
  const checkInData: Array<{ date: string; count: number; mood: string }> = [];
  const moodCount: Record<string, number> = { 开心: 0, 平静: 0, 焦虑: 0, 疲惫: 0, 兴奋: 0 };
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
    
    const checkInCount = Math.floor(Math.random() * 5) + 1;
    const moodIndex = Math.floor(Math.random() * 5);
    const mood = moodTypes[moodIndex];
    
    checkInData.push({
      date: dateStr,
      count: checkInCount,
      mood: mood,
    });
    
    moodCount[mood] += checkInCount;
  }
  
  const moodData = moodTypes.map((mood, index) => ({
    name: mood,
    value: moodCount[mood],
    color: moodColors[index],
  }));
  
  return { checkInData, moodData };
};

const TIME_RANGES = [
  { value: "week", label: "近一周", days: 7 },
  { value: "month", label: "近一月", days: 30 },
  { value: "threeMonths", label: "近三月", days: 90 },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];


export default function StatsPage() {
  const [timeRange, setTimeRange] = useState("week");
  
  const selectedDays = useMemo(() => {
    const range = TIME_RANGES.find((r) => r.value === timeRange);
    return range?.days || 7;
  }, [timeRange]);
  
  const { checkInData, moodData } = useMemo(() => {
    return generateMockData(selectedDays);
  }, [selectedDays]);
  
  const totalCheckIns = checkInData.reduce((sum, item) => sum + item.count, 0);
  const averagePerDay = (totalCheckIns / selectedDays).toFixed(1);
  
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-8 pb-8 sm:pb-12">
      <div className="mx-auto max-w-6xl w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">统计数据</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">查看你的心情打卡趋势和分布</p>
          </div>
          
          {/* Time Filter */}
          <div className="flex-shrink-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="选择时间范围" />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="mb-4 sm:mb-6 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="min-h-[100px]">
            <CardHeader className="pb-3 sm:pb-4">
              <CardDescription className="text-xs sm:text-sm">总打卡次数</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{totalCheckIns}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="min-h-[100px]">
            <CardHeader className="pb-3 sm:pb-4">
              <CardDescription className="text-xs sm:text-sm">统计天数</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{selectedDays}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="min-h-[100px]">
            <CardHeader className="pb-3 sm:pb-4">
              <CardDescription className="text-xs sm:text-sm">日均打卡</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{averagePerDay}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="min-h-[100px]">
            <CardHeader className="pb-3 sm:pb-4">
              <CardDescription className="text-xs sm:text-sm">主要心情</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {moodData.sort((a, b) => b.value - a.value)[0]?.name || "-"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        {/* Charts - 瀑布流布局 */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Mood Distribution - Pie Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">心情分布</CardTitle>
              <CardDescription className="text-xs sm:text-sm">不同心情的占比情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} 次`, "打卡次数"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend - 移动端改为两行显示 */}
              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {moodData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Check-in Trend - Bar Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">打卡趋势</CardTitle>
              <CardDescription className="text-xs sm:text-sm">每日打卡次数变化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={checkInData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      interval={selectedDays > 30 ? "preserveStartEnd" : 0}
                      angle={selectedDays > 14 ? -45 : 0}
                      textAnchor={selectedDays > 14 ? "end" : "middle"}
                      height={selectedDays > 14 ? 55 : 40}
                    />
                    <YAxis
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} 次`, "打卡次数"]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Trend Analysis - Placeholder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">趋势分析</CardTitle>
              <CardDescription className="text-xs sm:text-sm">心情变化趋势深度分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[240px] flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted">
                <div className="text-center px-4">
                  <div className="text-3xl sm:text-4xl mb-2">📈</div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">趋势分析图表</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">开发中，敬请期待</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Mood Insights - Placeholder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">心情洞察</CardTitle>
              <CardDescription className="text-xs sm:text-sm">AI 驱动的心情洞察建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[240px] flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted">
                <div className="text-center px-4">
                  <div className="text-3xl sm:text-4xl mb-2">💡</div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">心情洞察建议</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">开发中，敬请期待</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mobile Optimization Note */}
        <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground">
          <p>💡 提示：在移动设备上查看时，图表会自动适配屏幕尺寸</p>
        </div>
      </div>
    </div>
  );
}
