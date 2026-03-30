'use client';

import React from 'react';
import PerformanceChart from '@/components/PerformanceChart';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { usePerformance } from '@/hooks/usePerformance';

export default function PerformanceDashboard() {
  const { performanceData, loading, error } = usePerformance();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Dashboard</h1>
        <p className="text-gray-600">Real-time monitoring of application performance metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Page Load Time</h3>
          <p className="text-2xl font-bold text-blue-600">{performanceData?.pageLoadTime} ms</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">DOM Processing</h3>
          <p className="text-2xl font-bold text-green-600">{performanceData?.domProcessingTime} ms</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Resource Count</h3>
          <p className="text-2xl font-bold text-yellow-600">{performanceData?.resourceCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">CPU Usage</h3>
          <p className="text-2xl font-bold text-purple-600">{performanceData?.cpuUsage}%</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h2>
        <PerformanceChart data={performanceData?.metrics || []} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance Events</h3>
          <ul className="space-y-2">
            {performanceData?.events?.map((event: any, index: number) => (
              <li key={index} className="flex justify-between border-b pb-2">
                <span className="font-medium">{event.name}</span>
                <span className="text-gray-600">{event.duration} ms</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Memory Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Used Heap Size</span>
              <span>{performanceData?.memory?.usedHeapSize} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Heap Size</span>
              <span>{performanceData?.memory?.totalHeapSize} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">JS Heap Size</span>
              <span>{performanceData?.memory?.jsHeapSize} MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}