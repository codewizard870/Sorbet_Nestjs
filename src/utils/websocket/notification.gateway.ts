import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private onlineUsers = [];

  addNewUser(userId: string, socketId: string) {
    if (!this.onlineUsers.some((user) => user.userId === userId)) {
      this.onlineUsers.push({ userId, socketId });
    }
  }

  removeUser(socketId: string) {
    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.socketId !== socketId,
    );
  }

  getUser(userId: string) {
    return this.onlineUsers.find((user) => user.userId === userId);
  }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.removeUser(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('newUser')
  handleNewUser(client: any, userId: string) {
    this.addNewUser(userId, client.id);
    console.log('New user added!', userId);
  }

  @SubscribeMessage('sendNotification')
  handleSendNotification(
    // client: any,
    senderId: string, 
    receiverId: string, 
    type: string,
    postId?: string
  ) {
    console.log("SENDING NOTIFICATION...")
    const receiver = this.getUser(receiverId);
    if (receiver) {
      this.server.to(receiver.socketId).emit('getNotification', {
        senderId: senderId,
        type: type,
        postId: postId ? postId : null
      });
    }
    console.log("NOTIFICATION SENT!")
  }

  @SubscribeMessage('milestoneChanged')
  handleMilestone(
    client: any,
    data: any
  ) {
    console.log("Milestone changed...")
    const receiver = this.getUser(data.receiverId);
    if (receiver) {
      this.server.to(receiver.socketId).emit('milestoneChanged', {
        senderId: data.senderId,
        type: data.type,
      });
      console.log(receiver, "mileStoneChanged SENT!")
    }
  }
}