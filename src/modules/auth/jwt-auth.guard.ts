import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const match = /^Bearer\s+(\S+)$/i.exec(request.headers.authorization ?? '');
    if (!match) {
      throw new UnauthorizedException('Se requiere un token de autenticación.');
    }
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number }>(match[1], {
        algorithms: ['HS256'],
      });
      if (!Number.isSafeInteger(payload.sub) || payload.sub < 1) {
        throw new Error('Identificador inválido.');
      }
      request.userId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException('El token no es válido o ha expirado.');
    }
  }
}
