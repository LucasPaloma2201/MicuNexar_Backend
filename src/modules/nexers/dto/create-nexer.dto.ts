import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateNexerDto {
  @IsInt({ message: 'El ID del usuario debe ser un número entero.' })
  @Min(1, { message: 'El ID del usuario debe ser mayor que cero.' })
  user_id!: number;

  @IsString({ message: 'El nombre público debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre público del Nexer es obligatorio.' })
  @MaxLength(120, {
    message: 'El nombre público no puede superar los 120 caracteres.',
  })
  public_name!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  description?: string | null;
}