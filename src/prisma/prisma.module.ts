import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

// Global allows all other modules to access this without importing it
@Global()
@Module({
  imports: [ConfigModule.forRoot({})],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
