import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer() server: Server;

  sendNotificationToUser(userId: string, notification: Notification) {
    this.server.to(userId).emit('notification', notification);
  }
}