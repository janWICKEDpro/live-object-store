import { IsNotEmpty, IsString } from 'class-validator';

export class CreateObjectDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
