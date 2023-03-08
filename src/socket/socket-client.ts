import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketClient implements OnModuleInit {
  public socketClient: Socket;
  private logger = new Logger();
  private log = this.logger.log;

  constructor() {
    this.socketClient = io('http://localhost:3333');
  }

  onModuleInit() {
    this.registerConsumerEvents();
  }

  private registerConsumerEvents() {
    this.socketClient.emit('newMessage', { msg: 'hey there!' });
    this.socketClient.on('connect', () => {
      this.log('SocketClient Connected to Gateway');
    });
    this.socketClient.on('onMessage', (payload: any) => {
      console.log('SocketClient: onMessage event triggered: ');
      console.log('payload: ', payload);
      this.logger.verbose('payload: ', payload);
      this.socketClient.emit('onMessage', payload);
    });
  }
}
