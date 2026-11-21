import { Injectable } from '@nestjs/common';
import { CreateNexerDto } from './dto/create-nexer.dto.js';
import { UpdateNexerDto } from './dto/update-nexer.dto.js';

@Injectable()
export class NexersService {
  create(createNexerDto: CreateNexerDto) {
    return 'This action adds a new nexer';
  }

  findAll() {
    return `This action returns all nexers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nexer`;
  }

  update(id: number, updateNexerDto: UpdateNexerDto) {
    return `This action updates a #${id} nexer`;
  }

  remove(id: number) {
    return `This action removes a #${id} nexer`;
  }
}
