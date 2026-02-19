import { IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    id_categorie: string;

    @IsString()
    libelle: string;

    @IsString()
    id_equipe: string;
}
