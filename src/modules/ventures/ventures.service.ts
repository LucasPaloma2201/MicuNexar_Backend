import { Injectable } from '@nestjs/common';
import { CreateVentureDto } from './dto/create-venture.dto.js';
import { UpdateVentureDto } from './dto/update-venture.dto.js';

@Injectable()
export class VenturesService {
  create(createVentureDto: CreateVentureDto) {
    return 'This action adds a new venture';
  }

  findAll() {
    return `This action returns all ventures`;
  }

  findOne(id: number) {
    return `This action returns a #${id} venture`;
  }

  update(id: number, updateVentureDto: UpdateVentureDto) {
    return `This action updates a #${id} venture`;
  }

  remove(id: number) {
    return `This action removes a #${id} venture`;
  }
}
