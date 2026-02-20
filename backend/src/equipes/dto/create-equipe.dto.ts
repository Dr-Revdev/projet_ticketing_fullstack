import { IsNotEmpty, IsString } from "class-validator";

export class CreateEquipeDto {
    @IsString()
    @IsNotEmpty()
    id_equipe: string;

    @IsString()
    @IsNotEmpty()
    nom: string;
}
