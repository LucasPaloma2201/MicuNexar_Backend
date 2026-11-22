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
import { NexersService } from "./nexers.service.js";
import { CreateNexerDto } from "./dto/create-nexer.dto.js";
import { UpdateNexerDto } from "./dto/update-nexer.dto.js";

@Controller("nexers")
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
    return this.nexersService.findOne(this.validateId(id));
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
    @Body() updateNexerDto: UpdateNexerDto,
  ) {
    return this.nexersService.update(this.validateId(id), updateNexerDto);
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
    return this.nexersService.remove(this.validateId(id));
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
