import { PartialType } from '@nestjs/mapped-types';
import { CreateUtilisateursRoleDto } from './create-utilisateurs-role.dto';

export class UpdateUtilisateursRoleDto extends PartialType(
  CreateUtilisateursRoleDto,
) { }
