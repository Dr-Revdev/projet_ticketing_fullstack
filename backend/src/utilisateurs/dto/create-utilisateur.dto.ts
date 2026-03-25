import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUtilisateurDto {
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
