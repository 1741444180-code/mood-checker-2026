interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, color = 'blue', icon }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  };

  const textColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="mt-2 flex justify-center items-baseline">
        {icon && <span className="mr-2">{icon}</span>}
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  );
}