import { Module } from '@nestjs/common';
import { NexersService } from './nexers.service.js';
import { NexersController } from './nexers.controller.js';

@Module({
  controllers: [NexersController],
  providers: [NexersService],
})
export class NexersModule {}
