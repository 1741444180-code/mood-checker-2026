import { Notification } from '../types/notification';

const API_BASE = '/api';

export const NotificationService = {
  async getList(): Promise<Notification[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },
  
  async markAsRead(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to mark as read');
  },
  
  async markAllAsRead(): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
  },
  
  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete notification');
  },
};

export default NotificationService;
