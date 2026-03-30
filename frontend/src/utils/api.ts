// API 工具函数

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const friendAPI = {
  async getList() {
    const res = await fetch(`${API_BASE}/friends`);
    if (!res.ok) throw new Error('Failed to fetch friends');
    return res.json();
  },
  
  async getFriends() {
    const res = await fetch(`${API_BASE}/friends/list`);
    if (!res.ok) throw new Error('Failed to fetch friends');
    return res.json();
  },
  
  async getFriendRequests() {
    const res = await fetch(`${API_BASE}/friends/requests`);
    if (!res.ok) throw new Error('Failed to fetch friend requests');
    return res.json();
  },
  
  async acceptFriendRequest(requestId: string) {
    const res = await fetch(`${API_BASE}/friends/requests/${requestId}/accept`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to accept friend request');
    return res.json();
  },
  
  async rejectFriendRequest(requestId: string) {
    const res = await fetch(`${API_BASE}/friends/requests/${requestId}/reject`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reject friend request');
    return res.json();
  },
  
  async add(friendData: any) {
    const res = await fetch(`${API_BASE}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(friendData),
    });
    if (!res.ok) throw new Error('Failed to add friend');
    return res.json();
  },
  
  async remove(id: string) {
    const res = await fetch(`${API_BASE}/friends/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove friend');
    return res.json();
  },
};

export const userAPI = {
  async getProfile() {
    const res = await fetch(`${API_BASE}/user`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },
  
  async updateProfile(data: any) {
    const res = await fetch(`${API_BASE}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },
};

export const moodAPI = {
  async checkIn(mood: number, note?: string) {
    const res = await fetch(`${API_BASE}/mood/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note }),
    });
    if (!res.ok) throw new Error('Failed to check in');
    return res.json();
  },
  
  async getHistory() {
    const res = await fetch(`${API_BASE}/mood/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },
};

export const messageAPI = {
  async getList() {
    const res = await fetch(`${API_BASE}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },
  
  async getMessages() {
    const res = await fetch(`${API_BASE}/messages/list`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },
  
  async markAsRead(messageId: string) {
    const res = await fetch(`${API_BASE}/messages/${messageId}/read`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    return res.json();
  },
  
  async send(toUserId: string, content: string) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toUserId, content }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },
  
  async deleteMessage(messageId: string) {
    const res = await fetch(`${API_BASE}/messages/${messageId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return res.json();
  },
  
  async markAllAsRead() {
    const res = await fetch(`${API_BASE}/messages/mark-all-read`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
    return res.json();
  },
};
