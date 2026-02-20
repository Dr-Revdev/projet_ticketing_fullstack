import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUtilisateurDto {
    @IsString()
    @IsNotEmpty()
    id_utilisateur: string;

    @IsString()
    @IsNotEmpty()
    nom: string;

    @IsString()
    @IsNotEmpty()
    prenom: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    id_equipe: string;

}
