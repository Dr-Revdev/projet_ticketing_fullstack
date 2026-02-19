import { IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    id_role: string;

    @IsString()
    libelle: string;
}
