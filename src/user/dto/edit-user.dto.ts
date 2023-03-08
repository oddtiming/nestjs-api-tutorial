import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional() // `IsOptional` for validation to know
  @ApiProperty({ required: false, nullable: true }) // For Swagger to know
  email?: string; // `field?` for TypeScript to know

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  lastName?: string;
}
