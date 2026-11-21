import { Module } from '@nestjs/common';
import { VenturesService } from './ventures.service.js';
import { VenturesController } from './ventures.controller.js';

@Module({
  controllers: [VenturesController],
  providers: [VenturesService],
})
export class VenturesModule {}
