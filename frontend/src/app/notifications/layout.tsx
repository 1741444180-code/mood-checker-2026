// frontend/src/app/notifications/layout.tsx

import { ReactNode } from 'react';

export default function NotificationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="notifications-layout">
      {children}
    </div>
  );
}