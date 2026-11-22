import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    await this.validateName(dto.name);
    return this.persist(() => this.prisma.categories.create({ data: dto }));
  }

  findAll() {
    return this.prisma.categories.findMany({ orderBy: { id: "asc" } });
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`No existe una categoría con id ${id}.`);
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    if (dto.name !== undefined) {
      await this.validateName(dto.name, id);
    }
    return this.persist(() =>
      this.prisma.categories.update({ where: { id }, data: dto }),
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.persist(() => this.prisma.categories.delete({ where: { id } }));
  }

  private async validateName(name: string, id?: number) {
    if (!name.trim()) {
      throw new BadRequestException(
        "El nombre de la categoría no puede estar vacío.",
      );
    }
    const existing = await this.prisma.categories.findUnique({
      where: { name },
    });
    if (existing && existing.id !== id) {
      throw new ConflictException("Ya existe una categoría con ese nombre.");
    }
  }

  private async persist<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        switch (error.code) {
          case "P2002":
            throw new ConflictException(
              "Ya existe un registro con esos datos.",
            );
          case "P2003":
            throw new ConflictException(
              "La operación afecta a un registro relacionado.",
            );
          case "P2025":
            throw new NotFoundException("El registro ya no existe.");
          case "P2004":
            throw new BadRequestException(
              "Los datos no cumplen las restricciones de integridad.",
            );
        }
      }
      throw error;
    }
  }
}
