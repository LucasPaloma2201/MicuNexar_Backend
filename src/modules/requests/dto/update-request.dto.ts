import {
  PartialType,
  OmitType,
} from '@nestjs/mapped-types';
import {
  IsIn,
  ValidateIf,
} from 'class-validator';
import { CreateRequestDto } from './create-request.dto.js';

export class UpdateRequestDto extends PartialType(
  OmitType(
    CreateRequestDto,
    ['user_id', 'service_id', 'venture_id'] as const,
  ),
  { skipNullProperties: false },
) {
  @ValidateIf((_, value) => value !== undefined)
  @IsIn([
    'PENDING',
    'ACCEPTED',
    'IN_PROGRESS',
    'AWAITING_CONFIRMATION',
    'COMPLETED',
    'CANCELLED',
    'REJECTED',
  ])
  status?: string;
}