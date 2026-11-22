import {
  BadRequestException, Body, Controller, Delete, ForbiddenException,
  Get, Param, ParseIntPipe, Patch, Req, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // La creación de cuentas se realiza exclusivamente en POST /auth/register.
  @Get('me')
  findMe(@Req() request: AuthenticatedRequest) {
    return this.usersService.findOne(request.userId);
  }

  // No hay roles administrativos en el esquema actual.
  @Get()
  findAll() {
    throw new ForbiddenException('El listado de usuarios requiere permisos administrativos.');
  }

  @Get(':id')
  findOne(@Req() request: AuthenticatedRequest, @Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('El ID debe ser un número entero.') })) id: number) {
    this.validateOwner(request, id);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Req() request: AuthenticatedRequest, @Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('El ID debe ser un número entero.') })) id: number, @Body() dto: UpdateUserDto) {
    this.validateOwner(request, id);
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('El ID debe ser un número entero.') })) id: number) {
    this.validateOwner(request, id);
    return this.usersService.remove(id);
  }

  private validateOwner(request: AuthenticatedRequest, id: number) {
    if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
      throw new BadRequestException('El ID debe ser un número entero positivo válido.');
    }
    if (id !== request.userId) {
      throw new ForbiddenException('Solo podés acceder a tu propio perfil.');
    }
  }
}
