import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto {
    @IsEmail()
    @IsOptional()
    @ApiProperty()
    email: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    password: string;
}
