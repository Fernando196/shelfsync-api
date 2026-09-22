import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";


export class CreateUserDto{

    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsString()
    fullName: string;
}