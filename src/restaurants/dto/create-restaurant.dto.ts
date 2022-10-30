import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Category } from '../schemas/restaurant.schema';
import { User } from '../../auth/schemas/user.schema';

export class CreateRestaurantDto {
    @IsNotEmpty({ message: 'Name field should not be empty' })
    @IsString({ message: 'Name must be a string!' })
    readonly name: string;

    @IsNotEmpty({ message: 'Description field should not be empty' })
    @IsString({ message: 'Description must be a string!' })
    readonly description: string;

    @IsNotEmpty({ message: 'Email field should not be empty' })
    @IsEmail({}, { message: 'Please enter correct email address' })
    readonly email: string;

    @IsNotEmpty({ message: 'Phone number field should not be empty' })
    @IsPhoneNumber('PL', { message: 'Please enter correct phone number' })
    readonly phoneNo: number;

    @IsNotEmpty({ message: 'Address field should not be empty' })
    @IsString({ message: 'Address is required!' })
    readonly address: string;

    @IsNotEmpty({ message: 'Category field should not be empty' })
    @IsEnum(Category, { message: 'Please enter correct category' })
    readonly category: Category;

    @IsEmpty({ message: 'You cannot provide the user ID.' })
    readonly user: User;
}