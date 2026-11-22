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
import { RequestsService } from "./requests.service.js";
import { CreateRequestDto } from "./dto/create-request.dto.js";
import { UpdateRequestDto } from "./dto/update-request.dto.js";

@Controller("requests")
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Get()
  findAll() {
    return this.requestsService.findAll();
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
    return this.requestsService.findOne(this.validateId(id));
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
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return this.requestsService.update(this.validateId(id), updateRequestDto);
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
    return this.requestsService.remove(this.validateId(id));
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
