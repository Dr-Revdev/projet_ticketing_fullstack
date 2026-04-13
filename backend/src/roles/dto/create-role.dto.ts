import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    libelle!: string;
}
