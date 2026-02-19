import { IsEmail, IsString } from "class-validator";

export class CreateUtilisateurDto {
    @IsString()
    id_utilisateur: string;

    @IsString()
    nom: string;

    @IsString()
    prenom: string;

    @IsEmail()
    email: string;

    @IsString()
    id_equipe: string;

}
