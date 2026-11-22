import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateNexerDto } from "./dto/create-nexer.dto.js";
import { UpdateNexerDto } from "./dto/update-nexer.dto.js";

@Injectable()
export class NexersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNexerDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: dto.user_id },
    });
    if (!user) throw new BadRequestException("El usuario indicado no existe.");
    const existing = await this.prisma.nexers.findUnique({
      where: { user_id: dto.user_id },
    });
    if (existing)
      throw new ConflictException("El usuario ya tiene un perfil Nexer.");
    if (!dto.public_name.trim()) {
      throw new BadRequestException("El nombre público no puede estar vacío.");
    }
    return this.persist(() => this.prisma.nexers.create({ data: dto }));
  }

  findAll() {
    return this.prisma.nexers.findMany({
      where: { verification_status: "APPROVED" },
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    const nexer = await this.prisma.nexers.findFirst({
      where: { id, verification_status: "APPROVED" },
    });
    if (!nexer) {
      throw new NotFoundException(`No existe un Nexer publicado con id ${id}.`);
    }
    return nexer;
  }

  async update(id: number, dto: UpdateNexerDto) {
    const nexer = await this.findStored(id);
    if (nexer.verification_status === "PENDING") {
      throw new ConflictException(
        "No se puede editar el perfil mientras está en revisión.",
      );
    }
    if (dto.public_name !== undefined && !dto.public_name.trim()) {
      throw new BadRequestException("El nombre público no puede estar vacío.");
    }
    return this.persist(() =>
      this.prisma.nexers.update({ where: { id }, data: dto }),
    );
  }

  async remove(id: number) {
    await this.findStored(id);
    return this.persist(() => this.prisma.nexers.delete({ where: { id } }));
  }

  private async findStored(id: number) {
    const nexer = await this.prisma.nexers.findUnique({ where: { id } });
    if (!nexer) throw new NotFoundException(`No existe un Nexer con id ${id}.`);
    return nexer;
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
