interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray';
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, subtitle, color = 'blue', icon }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  };

  const textColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="mt-2 flex justify-center items-baseline">
        {icon && <span className="mr-2">{icon}</span>}
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}