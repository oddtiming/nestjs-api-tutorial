import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MyGateway implements OnModuleInit {
  @WebSocketServer() // Gives us the instance of the WebSocket server
  server: Server;

  // OnModuleInit implementation
  onModuleInit() {
    this.server.on('connection', (socket) => {
        console.log(socket.id);
        console.log('Connected');
    })
  }

  // Server will subscribe to a certain emitted message from the client
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);

    this.server.emit('onMessage', {
        msg: "new message",
        content: body,
    })    
  }
}
