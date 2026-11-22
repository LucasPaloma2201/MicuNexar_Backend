import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio.' })
  @MaxLength(100, {
    message: 'El nombre no puede superar los 100 caracteres.',
  })
  name!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  @MaxLength(255, {
    message: 'La descripción no puede superar los 255 caracteres.',
  })
  description?: string | null;
}