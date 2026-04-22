import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEquipeDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;
}
