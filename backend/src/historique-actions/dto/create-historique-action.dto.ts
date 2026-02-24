import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHistoriqueActionDto {
  @IsString()
  @IsNotEmpty()
  id_action: string;

  @IsString()
  @IsNotEmpty()
  type_action: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsString()
  @IsNotEmpty()
  id_cible: string;

  @IsString()
  @IsNotEmpty()
  id_auteur: string;

  @IsString()
  @IsNotEmpty()
  id_ticket: string;
}
