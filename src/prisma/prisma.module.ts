import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Global allows all other modules to access this without importing it
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
