import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoriqueActionDto } from './create-historique-action.dto';

export class UpdateHistoriqueActionDto extends PartialType(CreateHistoriqueActionDto) {}
