import { Test, TestingModule } from '@nestjs/testing';
import { NexersController } from './nexers.controller.js';
import { NexersService } from './nexers.service.js';

describe('NexersController', () => {
  let controller: NexersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NexersController],
      providers: [NexersService],
    }).compile();

    controller = module.get<NexersController>(NexersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
