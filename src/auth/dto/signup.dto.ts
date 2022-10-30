import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty({ message: 'Name field should not be empty' })
    @IsString({ message: 'Name must be a string!' })
    readonly name: string;

    @IsNotEmpty({ message: 'Email field should not be empty' })
    @IsEmail({}, { message: 'Please enter correct email address' })
    readonly email: string;

    @IsNotEmpty({ message: 'Password field should not be empty' })
    @IsString({ message: 'Password must be a string!'})
    @MinLength(8, { message: 'At least 8 characters required!'})
    readonly password: string;
}