import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// Datos editables del perfil. El alta de usuarios se realiza solo desde Auth.
export class CreateUserDto {
  @IsString({ message: 'El nombre completo debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(120, { message: 'El nombre no puede superar los 120 caracteres.' })
  full_name!: string;

  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido.' })
  @MaxLength(180, { message: 'El correo no puede superar los 180 caracteres.' })
  email!: string;
}
