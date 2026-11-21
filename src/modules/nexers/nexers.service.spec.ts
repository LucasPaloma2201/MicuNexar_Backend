import { Test, TestingModule } from '@nestjs/testing';
import { NexersService } from './nexers.service.js';

describe('NexersService', () => {
  let service: NexersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NexersService],
    }).compile();

    service = module.get<NexersService>(NexersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
