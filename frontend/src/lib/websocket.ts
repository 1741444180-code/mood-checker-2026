import { WebSocketServer, WebSocket } from 'ws';

let wss: WebSocketServer | null = null;
const clients = new Set<WebSocket>();

/**
 * 初始化 WebSocket 服务器
 */
export function initWebSocketServer(server: any): WebSocketServer {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
      console.log('Received:', message.toString());
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  return wss;
}

/**
 * 广播消息给所有客户端
 */
export function broadcast(message: string): void {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

/**
 * 发送消息给特定客户端
 */
export function sendToClient(client: WebSocket, message: string): void {
  if (client.readyState === WebSocket.OPEN) {
    client.send(message);
  }
}

/**
 * 获取在线客户端数量
 */
export function getClientCount(): number {
  return clients.size;
}

/**
 * 标记为已读并通知
 */
export async function markAsReadAndNotify(notificationId: string, userId: string): Promise<void> {
  // 在实际应用中，这里会更新数据库
  console.log(`Notification ${notificationId} marked as read by user ${userId}`);
  
  // 发送通知给客户端
  broadcast(JSON.stringify({
    type: 'NOTIFICATION_READ',
    notificationId,
    userId,
  }));
}

export default { initWebSocketServer, broadcast, sendToClient, getClientCount, markAsReadAndNotify };
