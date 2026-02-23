import { PartialType } from '@nestjs/mapped-types';
import { CreatePieceJointeDto } from './create-piece-jointe.dto';

export class UpdatePieceJointeDto extends PartialType(CreatePieceJointeDto) {}
