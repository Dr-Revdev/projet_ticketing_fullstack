import { IsInt, IsString } from "class-validator";

export class CreateEquipeDto {
    @IsString()
    id_equipe: string;

    @IsString()
    nom: string;
}
