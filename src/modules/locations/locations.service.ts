import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateLocationDto } from "./dto/create-location.dto.js";
import { UpdateLocationDto } from "./dto/update-location.dto.js";

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLocationDto) {
    const parentId = dto.parent_id ?? null;
    await this.validateParent(parentId);
    await this.validateName(dto.name, parentId);
    return this.persist(() => this.prisma.locations.create({ data: dto }));
  }

  findAll() {
    return this.prisma.locations.findMany({ orderBy: { id: "asc" } });
  }

  async findOne(id: number) {
    const location = await this.prisma.locations.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException(`No existe una ubicación con id ${id}.`);
    }
    return location;
  }

  async update(id: number, dto: UpdateLocationDto) {
    const current = await this.findOne(id);
    const parentId =
      dto.parent_id === undefined ? current.parent_id : dto.parent_id;
    await this.validateParent(parentId, id);
    await this.validateName(dto.name ?? current.name, parentId, id);

    if (current.parent_id === null && parentId !== null) {
      const children = await this.prisma.locations.count({
        where: { parent_id: id },
      });
      if (children > 0) {
        throw new ConflictException(
          "Una provincia con localidades no puede convertirse en localidad.",
        );
      }
    }
    if (current.parent_id !== null && parentId === null) {
      const [services, ventures, requests] = await Promise.all([
        this.prisma.services.count({ where: { location_id: id } }),
        this.prisma.ventures.count({ where: { location_id: id } }),
        this.prisma.requests.count({ where: { location_id: id } }),
      ]);
      if (services + ventures + requests > 0) {
        throw new ConflictException(
          "Una localidad con publicaciones o solicitudes no puede convertirse en provincia.",
        );
      }
    }
    return this.persist(() =>
      this.prisma.locations.update({ where: { id }, data: dto }),
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.persist(() => this.prisma.locations.delete({ where: { id } }));
  }

  private async validateParent(parentId: number | null, id?: number) {
    if (parentId === null) return;
    if (parentId === id) {
      throw new BadRequestException(
        "Una ubicación no puede ser su propio padre.",
      );
    }
    const parent = await this.prisma.locations.findUnique({
      where: { id: parentId },
    });
    if (!parent || parent.parent_id !== null) {
      throw new BadRequestException(
        "La ubicación padre debe ser una provincia existente.",
      );
    }
  }

  private async validateName(
    name: string,
    parentId: number | null,
    id?: number,
  ) {
    if (!name.trim()) {
      throw new BadRequestException(
        "El nombre de la ubicación no puede estar vacío.",
      );
    }
    const existing = await this.prisma.locations.findFirst({
      where: { name, parent_id: parentId },
    });
    if (existing && existing.id !== id) {
      throw new ConflictException(
        "Ya existe una ubicación con ese nombre en el mismo nivel.",
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
