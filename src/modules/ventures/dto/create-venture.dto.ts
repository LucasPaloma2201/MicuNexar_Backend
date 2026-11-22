import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateVentureDto {
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
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}