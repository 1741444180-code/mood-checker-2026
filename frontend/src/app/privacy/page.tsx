import { PrivacySettings } from '@/components/privacy/PrivacySettings';


export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">隐私设置</h1>
        <PrivacySettings />
      </div>
    </div>
  );
}