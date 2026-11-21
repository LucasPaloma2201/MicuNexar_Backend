import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VenturesService } from './ventures.service.js';
import { CreateVentureDto } from './dto/create-venture.dto.js';
import { UpdateVentureDto } from './dto/update-venture.dto.js';

@Controller('ventures')
export class VenturesController {
  constructor(private readonly venturesService: VenturesService) {}

  @Post()
  create(@Body() createVentureDto: CreateVentureDto) {
    return this.venturesService.create(createVentureDto);
  }

  @Get()
  findAll() {
    return this.venturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venturesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentureDto: UpdateVentureDto) {
    return this.venturesService.update(+id, updateVentureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venturesService.remove(+id);
  }
}
