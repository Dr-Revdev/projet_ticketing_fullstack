import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUtilisateursRoleDto {
    @IsString()
    @IsNotEmpty()
    id_role: string;
}
