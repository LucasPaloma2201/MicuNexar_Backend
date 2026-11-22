import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateRequestDto {
  @IsInt()
  @Min(1)
  user_id!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  service_id?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  venture_id?: number | null;

  @IsInt()
  @Min(1)
  location_id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}