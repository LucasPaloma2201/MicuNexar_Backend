import { Test, TestingModule } from '@nestjs/testing';
import { VenturesController } from './ventures.controller.js';
import { VenturesService } from './ventures.service.js';

describe('VenturesController', () => {
  let controller: VenturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenturesController],
      providers: [VenturesService],
    }).compile();

    controller = module.get<VenturesController>(VenturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
