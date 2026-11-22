import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateNexerDto {
  @IsInt()
  @Min(1)
  user_id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  public_name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}