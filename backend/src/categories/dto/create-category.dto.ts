import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    id_categorie: string;

    @IsString()
    @IsNotEmpty()
    libelle: string;

    @IsString()
    @IsNotEmpty()
    id_equipe: string;
}
