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
import { LocationsService } from "./locations.service.js";
import { CreateLocationDto } from "./dto/create-location.dto.js";
import { UpdateLocationDto } from "./dto/update-location.dto.js";

@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
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
    return this.locationsService.findOne(this.validateId(id));
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
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(this.validateId(id), updateLocationDto);
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
    return this.locationsService.remove(this.validateId(id));
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
