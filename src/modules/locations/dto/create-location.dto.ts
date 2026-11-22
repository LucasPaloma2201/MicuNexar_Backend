import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateLocationDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre de la ubicación es obligatorio.' })
  @MaxLength(120, {
    message: 'El nombre no puede superar los 120 caracteres.',
  })
  name!: string;

  @IsOptional()
  @IsInt({
    message: 'El ID de la ubicación padre debe ser un número entero.',
  })
  @Min(1, {
    message: 'El ID de la ubicación padre debe ser mayor que cero.',
  })
  parent_id?: number | null;
}