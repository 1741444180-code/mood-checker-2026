-- 数据库优化脚本 - 添加必要的索引以提高查询性能

-- 在 User 表上为经常用于查询的字段添加索引
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_created_at ON users(createdAt);

-- 在 FriendRequest 表上为经常用于查询的字段添加索引
CREATE INDEX IF NOT EXISTS idx_friend_request_sender ON friend_requests(senderId);
CREATE INDEX IF NOT EXISTS idx_friend_request_receiver ON friend_requests(receiverId);
CREATE INDEX IF NOT EXISTS idx_friend_request_status ON friend_requests(status);
CREATE INDEX IF NOT EXISTS idx_friend_request_sender_receiver ON friend_requests(senderId, receiverId);
CREATE INDEX IF NOT EXISTS idx_friend_request_created_at ON friend_requests(createdAt);

-- 在 Friendship 表上为经常用于查询的字段添加索引
CREATE INDEX IF NOT EXISTS idx_friendship_user_id ON friendships(userId);
CREATE INDEX IF NOT EXISTS idx_friendship_friend_id ON friendships(friendId);
CREATE INDEX IF NOT EXISTS idx_friendship_user_friend ON friendships(userId, friendId);
CREATE INDEX IF NOT EXISTS idx_friendship_created_at ON friendships(createdAt);

-- 在 Notification 表上为经常用于查询的字段添加索引
CREATE INDEX IF NOT EXISTS idx_notification_user_id ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_notification_read_status ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notification_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notification_created_at ON notifications(createdAt);

-- 在 UserBadge 表上为经常用于查询的字段添加索引
CREATE INDEX IF NOT EXISTS idx_user_badge_user_id ON user_badges(userId);
CREATE INDEX IF NOT EXISTS idx_user_badge_badge_id ON user_badges(badgeId);
CREATE INDEX IF NOT EXISTS idx_user_badge_created_at ON user_badges(createdAt);

-- 在 CalendarEvent 表上为经常用于查询的字段添加索引
CREATE INDEX IF NOT EXISTS idx_calendar_event_user_id ON calendar_events(userId);
CREATE INDEX IF NOT EXISTS idx_calendar_event_start_time ON calendar_events(startTime);
CREATE INDEX IF NOT EXISTS idx_calendar_event_category ON calendar_events(category);
CREATE INDEX IF NOT EXISTS idx_calendar_event_priority ON calendar_events(priority);