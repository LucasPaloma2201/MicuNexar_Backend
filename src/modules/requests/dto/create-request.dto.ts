import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateRequestDto {
  @IsInt({ message: 'El ID del usuario debe ser un número entero.' })
  @Min(1, { message: 'El ID del usuario debe ser mayor que cero.' })
  user_id!: number;

  @IsOptional()
  @IsInt({ message: 'El ID del servicio debe ser un número entero.' })
  @Min(1, { message: 'El ID del servicio debe ser mayor que cero.' })
  service_id?: number | null;

  @IsOptional()
  @IsInt({
    message: 'El ID del emprendimiento debe ser un número entero.',
  })
  @Min(1, {
    message: 'El ID del emprendimiento debe ser mayor que cero.',
  })
  venture_id?: number | null;

  @IsInt({ message: 'El ID de la ubicación debe ser un número entero.' })
  @Min(1, { message: 'El ID de la ubicación debe ser mayor que cero.' })
  location_id!: number;

  @IsString({ message: 'El título debe ser un texto.' })
  @IsNotEmpty({ message: 'El título de la solicitud es obligatorio.' })
  @MaxLength(150, {
    message: 'El título no puede superar los 150 caracteres.',
  })
  title!: string;

  @IsString({ message: 'La descripción debe ser un texto.' })
  @IsNotEmpty({ message: 'La descripción de la solicitud es obligatoria.' })
  description!: string;
}