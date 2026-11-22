import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsInt({ message: 'El ID del Nexer debe ser un número entero.' })
  @Min(1, { message: 'El ID del Nexer debe ser mayor que cero.' })
  nexer_id!: number;

  @IsInt({ message: 'El ID de la categoría debe ser un número entero.' })
  @Min(1, { message: 'El ID de la categoría debe ser mayor que cero.' })
  category_id!: number;

  @IsInt({ message: 'El ID de la ubicación debe ser un número entero.' })
  @Min(1, { message: 'El ID de la ubicación debe ser mayor que cero.' })
  location_id!: number;

  @IsString({ message: 'El título debe ser un texto.' })
  @IsNotEmpty({ message: 'El título del servicio es obligatorio.' })
  @MaxLength(150, {
    message: 'El título no puede superar los 150 caracteres.',
  })
  title!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  description?: string | null;
}