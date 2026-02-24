import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const MESSAGE_VISIBILITE = ['public', 'interne'] as const;

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    id_message: string;

    @IsString()
    @IsNotEmpty()
    contenu: string;

    @IsString()
    @IsIn(MESSAGE_VISIBILITE)
    visibilite: string;

    @IsString()
    @IsNotEmpty()
    id_utilisateur: string;

    @IsString()
    @IsNotEmpty()
    id_ticket: string;
}
