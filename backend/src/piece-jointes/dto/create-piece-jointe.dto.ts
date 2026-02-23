import { IsNotEmpty, IsString } from "class-validator";

export class CreatePieceJointeDto {
    @IsString()
    @IsNotEmpty()
    id_piece_jointe: string;

    @IsString()
    @IsNotEmpty()    
    nom_fichier: string;

    @IsString()
    @IsNotEmpty()    
    url_path: string;

    @IsString()
    @IsNotEmpty()
    id_utilisateur: string;

    @IsString()
    @IsNotEmpty()
    id_ticket: string;
}
