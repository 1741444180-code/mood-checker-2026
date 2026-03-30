import { NotificationSettingsForm } from '@/components/notifications/NotificationSettingsForm';

export const metadata = {
  title: '设置',
};

export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">通知设置</h1>
        <NotificationSettingsForm />
      </div>
    </div>
  );
}