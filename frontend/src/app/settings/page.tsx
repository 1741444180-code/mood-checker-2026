import { SettingsForm } from '@/components/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">账户设置</h1>
        <SettingsForm />
      </div>
    </div>
  );
}