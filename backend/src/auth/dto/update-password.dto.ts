import { IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    currentPassword: string;
    
    @IsString()
    @MinLength(12)
    newPassword: string;
}