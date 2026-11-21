import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NexersService } from './nexers.service.js';
import { CreateNexerDto } from './dto/create-nexer.dto.js';
import { UpdateNexerDto } from './dto/update-nexer.dto.js';

@Controller('nexers')
export class NexersController {
  constructor(private readonly nexersService: NexersService) {}

  @Post()
  create(@Body() createNexerDto: CreateNexerDto) {
    return this.nexersService.create(createNexerDto);
  }

  @Get()
  findAll() {
    return this.nexersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nexersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNexerDto: UpdateNexerDto) {
    return this.nexersService.update(+id, updateNexerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nexersService.remove(+id);
  }
}
