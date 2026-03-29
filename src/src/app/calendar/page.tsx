import { MoodCalendar } from '@/components/calendar/mood-calendar';

// 模拟心情数据
const mockMoodRecords = [
  { date: '2026-03-28', moodType: '开心', note: '今天天气很好' },
  { date: '2026-03-27', moodType: '平静', note: '看了一本书' },
  { date: '2026-03-26', moodType: '开心', note: '完成了工作' },
  { date: '2026-03-25', moodType: '焦虑', note: '有压力' },
  { date: '2026-03-24', moodType: '平静', note: '周末放松' },
  { date: '2026-03-23', moodType: '兴奋', note: '收到了好消息' },
  { date: '2026-03-21', moodType: '疲惫', note: '加班到很晚' },
];

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">心情日历</h1>
          <p className="text-gray-600 mt-2">查看您的心情历史记录</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <MoodCalendar moodRecords={mockMoodRecords} />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">使用提示</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>点击日期可查看当天心情详情</li>
              <li>黄色表示开心，绿色表示平静</li>
              <li>红色表示生气，蓝色表示低落</li>
              <li>紫色表示焦虑，灰色表示疲惫</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">打卡建议</h2>
            <p className="text-gray-600">
              每天花几分钟记录心情，有助于更好地了解自己的情绪变化。
              坚持打卡可以帮助您发现情绪模式，提升自我认知。
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">隐私保护</h2>
            <p className="text-gray-600">
              您的心情数据仅对您本人可见，
              我们不会向第三方分享您的个人信息。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}