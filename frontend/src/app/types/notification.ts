export interface Notification {
  id: string;
  type: 'system' | 'friend' | 'badge' | 'reminder';
  title: string;
  message: string;
  content?: string;
  timestamp: string;
  isRead: boolean;
  read?: boolean;
  actionUrl?: string;
}
