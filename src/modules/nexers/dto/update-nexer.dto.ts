import { PartialType } from '@nestjs/mapped-types';
import { CreateNexerDto } from './create-nexer.dto.js';

export class UpdateNexerDto extends PartialType(CreateNexerDto) {}
