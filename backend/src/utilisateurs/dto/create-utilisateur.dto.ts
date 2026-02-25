import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

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

    @IsString()
    @MinLength(12)
    password: string;
}
