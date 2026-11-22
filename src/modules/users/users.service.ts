import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.users.findMany({
      select: { id: true, full_name: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('El usuario no existe.');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const fullName = dto.full_name?.trim();
    if (fullName !== undefined && fullName.length < 2) {
      throw new BadRequestException('El nombre debe tener al menos 2 caracteres.');
    }
    const email = dto.email?.trim().toLowerCase();
    return this.persist(() => this.prisma.users.update({
      where: { id },
      data: {
        ...(fullName !== undefined ? { full_name: fullName } : {}),
        ...(email !== undefined ? { email } : {}),
        updated_at: new Date(),
      },
    }));
  }

  async remove(id: number) {
    // Las credenciales se borran por ON DELETE CASCADE; las demás relaciones se respetan.
    await this.persist(() => this.prisma.users.delete({ where: { id } }));
    return { message: 'Usuario eliminado correctamente.' };
  }

  private async persist<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        switch (error.code) {
          case 'P2002': throw new ConflictException('Ya existe una cuenta con ese correo electrónico.');
          case 'P2003': throw new ConflictException('No se puede eliminar el usuario porque tiene registros relacionados.');
          case 'P2025': throw new NotFoundException('El usuario no existe.');
        }
      }
      throw error;
    }
  }
}
