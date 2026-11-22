import {
  PartialType,
  OmitType,
} from '@nestjs/mapped-types';
import {
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { CreateVentureDto } from './create-venture.dto.js';

export class UpdateVentureDto extends PartialType(
  OmitType(CreateVentureDto, ['nexer_id'] as const),
  { skipNullProperties: false },
) {
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  is_active?: boolean;
}