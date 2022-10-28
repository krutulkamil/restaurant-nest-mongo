import { Category } from '../schemas/restaurant.schema';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateRestaurantDto {
    @IsString({ message: 'Name must be a string!' })
    @IsOptional()
    readonly name: string;

    @IsString({ message: 'Description must be a string!' })
    @IsOptional()
    readonly description: string;

    @IsEmail({}, { message: 'Please enter correct email address' })
    @IsOptional()
    readonly email: string;

    @IsPhoneNumber('PL', { message: 'Please enter correct phone number' })
    @IsOptional()
    readonly phoneNo: number;

    @IsString({ message: 'Address is required!' })
    @IsOptional()
    readonly address: string;

    @IsEnum(Category, { message: 'Please enter correct category' })
    @IsOptional()
    readonly category: Category;
}