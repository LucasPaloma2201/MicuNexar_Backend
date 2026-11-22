import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateRequestDto } from "./dto/create-request.dto.js";
import { UpdateRequestDto } from "./dto/update-request.dto.js";

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRequestDto) {
    const serviceId = dto.service_id ?? null;
    const ventureId = dto.venture_id ?? null;
    if ((serviceId === null) === (ventureId === null)) {
      throw new BadRequestException(
        "La solicitud debe indicar un servicio o un emprendimiento, pero no ambos.",
      );
    }
    const user = await this.prisma.users.findUnique({
      where: { id: dto.user_id },
    });
    if (!user) throw new BadRequestException("El usuario indicado no existe.");
    await this.validateLocation(dto.location_id);
    this.validateText(dto.title, dto.description);

    if (serviceId !== null) {
      const service = await this.prisma.services.findFirst({
        where: {
          id: serviceId,
          is_active: true,
          nexers: { verification_status: "APPROVED" },
        },
      });
      if (!service)
        throw new BadRequestException(
          "El servicio no existe o no está publicado.",
        );
    } else if (ventureId !== null) {
      const venture = await this.prisma.ventures.findFirst({
        where: {
          id: ventureId,
          is_active: true,
          nexers: { verification_status: "APPROVED" },
        },
      });
      if (!venture)
        throw new BadRequestException(
          "El emprendimiento no existe o no está publicado.",
        );
    }
    return this.persist(() => this.prisma.requests.create({ data: dto }));
  }

  findAll() {
    return this.prisma.requests.findMany({ orderBy: { id: "asc" } });
  }

  async findOne(id: number) {
    const request = await this.prisma.requests.findUnique({ where: { id } });
    if (!request)
      throw new NotFoundException(`No existe una solicitud con id ${id}.`);
    return request;
  }

  async update(id: number, dto: UpdateRequestDto) {
    const current = await this.findOne(id);
    if (dto.location_id !== undefined)
      await this.validateLocation(dto.location_id);
    this.validateText(dto.title, dto.description);

    const { status, ...fields } = dto;
    if (status !== undefined && status !== current.status) {
      this.validateTransition(current.status, status);
      return this.persist(() =>
        this.prisma.requests.update({
          where: { id, status: current.status },
          data: {
            ...fields,
            status,
            completed_at: status === "COMPLETED" ? new Date() : null,
          },
        }),
      );
    }
    return this.persist(() =>
      this.prisma.requests.update({ where: { id }, data: fields }),
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.persist(() => this.prisma.requests.delete({ where: { id } }));
  }

  private async validateLocation(id: number) {
    const location = await this.prisma.locations.findUnique({ where: { id } });
    if (!location || location.parent_id === null) {
      throw new BadRequestException(
        "La ubicación debe ser una localidad existente.",
      );
    }
  }

  private validateText(title?: string, description?: string) {
    if (title !== undefined && !title.trim()) {
      throw new BadRequestException("El título no puede estar vacío.");
    }
    if (description !== undefined && !description.trim()) {
      throw new BadRequestException("La descripción no puede estar vacía.");
    }
  }

  private validateTransition(current: string, next: string) {
    const allowed: Record<string, string[]> = {
      PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
      ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
      IN_PROGRESS: ["AWAITING_CONFIRMATION", "CANCELLED"],
      AWAITING_CONFIRMATION: ["COMPLETED"],
      COMPLETED: [],
      CANCELLED: [],
      REJECTED: [],
    };
    if (!allowed[current]?.includes(next)) {
      throw new ConflictException(
        `No se puede cambiar el estado de ${current} a ${next}.`,
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
