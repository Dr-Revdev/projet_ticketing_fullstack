import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUtilisateurDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  id_equipe?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}