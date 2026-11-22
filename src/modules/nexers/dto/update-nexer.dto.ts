import {
  PartialType,
  OmitType,
} from '@nestjs/mapped-types';
import { CreateNexerDto } from './create-nexer.dto.js';

export class UpdateNexerDto extends PartialType(
  OmitType(CreateNexerDto, ['user_id'] as const),
  { skipNullProperties: false },
) {}