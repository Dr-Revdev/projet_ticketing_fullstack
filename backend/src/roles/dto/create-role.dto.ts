import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['user', 'agent', 'manager', 'admin'])
    libelle!: string;
}
