import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    id_role: string;

    @IsString()
    @IsNotEmpty()
    libelle: string;
}
