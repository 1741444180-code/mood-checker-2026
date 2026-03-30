'use client';

import React from 'react';
import { Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, BarChart, AreaChart } from 'recharts';

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
    return (
      <ResponsiveContainer width="100%" height={height}>
        {type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        ) : type === 'area' ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Area
                key={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Line
                key={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
              />
            ))}
          </LineChart>
        )}
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
