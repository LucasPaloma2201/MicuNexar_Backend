import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateServiceDto } from "./dto/create-service.dto.js";
import { UpdateServiceDto } from "./dto/update-service.dto.js";

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    await this.validateReferences(
      dto.nexer_id,
      dto.category_id,
      dto.location_id,
      false,
    );
    if (!dto.title.trim()) {
      throw new BadRequestException("El título no puede estar vacío.");
    }
    return this.persist(() => this.prisma.services.create({ data: dto }));
  }

  findAll() {
    return this.prisma.services.findMany({
      where: { is_active: true, nexers: { verification_status: "APPROVED" } },
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.services.findFirst({
      where: {
        id,
        is_active: true,
        nexers: { verification_status: "APPROVED" },
      },
    });
    if (!item) {
      throw new NotFoundException(
        `No existe un servicio publicado con id ${id}.`,
      );
    }
    return item;
  }

  async update(id: number, dto: UpdateServiceDto) {
    const current = await this.findStored(id);
    await this.validateReferences(
      current.nexer_id,
      dto.category_id ?? current.category_id,
      dto.location_id ?? current.location_id,
      dto.is_active ?? current.is_active,
    );
    if (dto.title !== undefined && !dto.title.trim()) {
      throw new BadRequestException("El título no puede estar vacío.");
    }
    return this.persist(() =>
      this.prisma.services.update({ where: { id }, data: dto }),
    );
  }

  async remove(id: number) {
    await this.findStored(id);
    return this.persist(() => this.prisma.services.delete({ where: { id } }));
  }

  private async findStored(id: number) {
    const item = await this.prisma.services.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`No existe un servicio con id ${id}.`);
    }
    return item;
  }

  private async validateReferences(
    nexerId: number,
    categoryId: number,
    locationId: number,
    active: boolean,
  ) {
    const [nexer, category, location] = await Promise.all([
      this.prisma.nexers.findUnique({ where: { id: nexerId } }),
      this.prisma.categories.findUnique({ where: { id: categoryId } }),
      this.prisma.locations.findUnique({ where: { id: locationId } }),
    ]);
    if (!nexer) throw new BadRequestException("El Nexer indicado no existe.");
    if (!category)
      throw new BadRequestException("La categoría indicada no existe.");
    if (!location || location.parent_id === null) {
      throw new BadRequestException(
        "La ubicación debe ser una localidad existente.",
      );
    }
    if (active && nexer.verification_status !== "APPROVED") {
      throw new ConflictException(
        "El Nexer debe estar aprobado para activar la publicación.",
      );
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
