import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsInt()
  @Min(1)
  nexer_id!: number;

  @IsInt()
  @Min(1)
  category_id!: number;

  @IsInt()
  @Min(1)
  location_id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}