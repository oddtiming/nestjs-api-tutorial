import {
  CacheInterceptor,
  Logger,
  OnModuleInit,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthDto } from '../auth/dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'], // :3000 is location of the React App
    // origin: ['*'],
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer() // Gives us the instance of the WebSocket server
  server: Server;

  // OnModuleInit implementation
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log("MyGateway: 'connection' event triggered:");
      console.log('socket.id: ', socket.id);
    });
  }

  // Server will subscribe to a certain emitted message from the client
  @UseInterceptors(CacheInterceptor)
  @SubscribeMessage('newMessage')
  onNewMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const dto = new AuthDto(body);
    console.log("MyGateway: 'newMessage' subscription triggered: ");
    console.log('Message body: ', body);

    console.log("\nMyGateWay: Emitting 'onMessage' event...");
    console.log(
      `\nMyGateway: Client ${client.id} (${client.handshake.address}) emitted 'newMessage' event`,
    );
    const toJSON = JSON.parse(JSON.stringify(body));
    const email = toJSON.email;
    Logger.log('email: ' + email);
    Logger.log('toJSON: ' + toJSON);
    this.server.emit('onMessage', {
      msg: 'new message',
      clientId: client.id,
      content: body,
    });
  }
}
