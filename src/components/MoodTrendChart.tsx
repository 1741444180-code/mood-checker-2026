interface MoodTrendChartProps {
  data: { date: string; mood: number }[];
}

export default function MoodTrendChart({ data }: MoodTrendChartProps) {
  // Find the maximum mood value to normalize heights
  const maxMood = Math.max(...data.map(item => item.mood), 5);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">近期心情趋势</h3>
      <div className="h-64 flex items-end space-x-2 md:space-x-4 pt-4">
        {data.map((item, index) => {
          // Normalize height based on max mood value
          const heightPercentage = (item.mood / maxMood) * 100;
          const height = `${Math.max(heightPercentage, 10)}%`; // Ensure minimum height for visibility
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex flex-col items-center flex-grow justify-end h-full">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-md transition-all duration-300 hover:opacity-75"
                  style={{ height }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                {new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}