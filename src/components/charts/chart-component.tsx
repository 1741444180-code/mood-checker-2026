'use client';

import React from 'react';
import { Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from 'recharts';

interface ChartComponentProps {
  type?: 'bar' | 'line' | 'area';
  data: any[];
  title?: string;
  xKey?: string;
  dataKey?: string;
  name?: string;
  yKeys?: string[];
  colors?: string[];
  height?: number;
  children?: React.ReactNode;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  type = 'line',
  data,
  title,
  xKey = 'name',
  yKeys = ['value'],
  colors = ['#3b82f6', '#10b981', '#f59e0b'],
  height = 300,
}) => {
  const renderChart = () => {
    const ChartType = type === 'bar' ? Bar : type === 'area' ? Area : Line;
    
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <ChartType
              key={key}
              type={type}
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
