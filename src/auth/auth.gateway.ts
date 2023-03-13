import { Inject, Logger, UseInterceptors } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Redis } from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { IORedisKey } from '../redis/redis.module';

const logger = new Logger('AuthGateway');

@WebSocketGateway()
export class AuthGateway {
  constructor(
    @Inject(PrismaService) private prismaClient: PrismaService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {}

  @SubscribeMessage('login')
  async handleMessage(client: any, payload: any) {
    console.log(client.id);
    logger.log(payload);

    const key = `${client.id}`;

    const msg = await this.redisClient.get(key);
    if (msg) {
      logger.log(`msg was already in the cache: ${msg}`);
      console.log(msg);

      if (msg !== payload) {
        logger.log('Payload differs, updating cache');
        await this.redisClient.set(key, payload);
        return payload;
      }

      return msg;
    }

    await this.prismaClient.user.create({
      data: {
        email: client.id,
        hash: payload,
      },
    });
    logger.log(`Added user to the database: ${client.id}`);

    this.redisClient.set(key, payload);
    logger.log(
      `msg was not in the cache, so we created it: ${payload}`,
    );

    return {
      client,
      payload,
    };
  }
}
