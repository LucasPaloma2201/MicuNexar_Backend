import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterAuthDto) {
    const fullName = dto.full_name.trim();
    const email = dto.email.trim().toLowerCase();
    if (fullName.length < 2) {
      throw new BadRequestException('El nombre debe tener al menos 2 caracteres.');
    }
    this.validatePasswordLength(dto.password);
    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      // Prisma crea el usuario y sus credenciales en una operación atómica.
      return await this.prisma.users.create({
        data: {
          full_name: fullName,
          email,
          auth: { create: { password_hash: passwordHash } },
        },
        select: {
          id: true,
          full_name: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
        throw new ConflictException('Ya existe una cuenta con ese correo electrónico.');
      }
      throw error;
    }
  }

  async login(dto: LoginAuthDto) {
    this.validatePasswordLength(dto.password);
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
      select: {
        id: true,
        full_name: true,
        email: true,
        created_at: true,
        updated_at: true,
        auth: { select: { password_hash: true } },
      },
    });

    if (!user?.auth || !(await bcrypt.compare(dto.password, user.auth.password_hash))) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos.');
    }

    const { auth, ...publicUser } = user;
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { access_token: accessToken, user: publicUser };
  }

  private validatePasswordLength(password: string) {
    // bcrypt solo procesa los primeros 72 bytes; no truncamos contraseñas.
    if (Buffer.byteLength(password, 'utf8') > 72) {
      throw new BadRequestException('La contraseña no puede superar los 72 bytes en UTF-8.');
    }
  }
}
