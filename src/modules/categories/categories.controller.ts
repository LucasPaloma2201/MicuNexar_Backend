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
import { CategoriesService } from "./categories.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
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
    return this.categoriesService.findOne(this.validateId(id));
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
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(
      this.validateId(id),
      updateCategoryDto,
    );
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
    return this.categoriesService.remove(this.validateId(id));
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
