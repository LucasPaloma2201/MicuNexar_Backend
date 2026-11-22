import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import { VenturesService } from "./ventures.service.js";
import { CreateVentureDto } from "./dto/create-venture.dto.js";
import { UpdateVentureDto } from "./dto/update-venture.dto.js";

@Controller("ventures")
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

  @Get(":id")
  findOne(
    @Param(
      "id",
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException("El ID debe ser un número entero."),
      }),
    )
    id: number,
  ) {
    return this.venturesService.findOne(this.validateId(id));
  }

  @Patch(":id")
  update(
    @Param(
      "id",
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException("El ID debe ser un número entero."),
      }),
    )
    id: number,
    @Body() updateVentureDto: UpdateVentureDto,
  ) {
    return this.venturesService.update(this.validateId(id), updateVentureDto);
  }

  @Delete(":id")
  remove(
    @Param(
      "id",
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException("El ID debe ser un número entero."),
      }),
    )
    id: number,
  ) {
    return this.venturesService.remove(this.validateId(id));
  }
  private validateId(id: number): number {
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
      throw new BadRequestException(
        "El ID debe ser un número entero positivo dentro del rango permitido.",
      );
    }
    return id;
  }
}
