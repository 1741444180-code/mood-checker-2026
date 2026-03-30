import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;