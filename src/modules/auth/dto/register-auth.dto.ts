import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto.js';

export class RegisterAuthDto extends LoginAuthDto {
  @IsString({ message: 'El nombre completo debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(120, { message: 'El nombre no puede superar los 120 caracteres.' })
  full_name!: string;
}
