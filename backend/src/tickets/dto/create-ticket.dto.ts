import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export const TICKET_ETATS = [
  'nouveau',
  'en_cours',
  'en_attente',
  'resolu',
  'ferme',
] as const;

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsIn(TICKET_ETATS)
  etat: string;

  @IsOptional()
  @IsString()
  resultat?: string;

  @IsString()
  @IsNotEmpty()
  id_createur: string;

  @IsString()
  @IsNotEmpty()
  id_categorie: string;

  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_agent_assigne?: string | null;

  @IsOptional()
  @IsDateString()
  archived_at?: string;
}
