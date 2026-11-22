import {
  PartialType,
  OmitType,
} from '@nestjs/mapped-types';
import {
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { CreateServiceDto } from './create-service.dto.js';

export class UpdateServiceDto extends PartialType(
  OmitType(CreateServiceDto, ['nexer_id'] as const),
  { skipNullProperties: false },
) {
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean({
    message: 'El estado de activación debe ser verdadero o falso.',
  })
  is_active?: boolean;
}