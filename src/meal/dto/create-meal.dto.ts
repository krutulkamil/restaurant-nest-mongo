import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../schemas/meal.schema';
import { User } from '../../auth/schemas/user.schema';

export class CreateMealDto {
    @IsNotEmpty({ message: 'Name field should not be empty' })
    @IsString({ message: 'Name must be a string!' })
    readonly name: string;

    @IsNotEmpty({ message: 'Description field should not be empty' })
    @IsString({ message: 'Description must be a string!' })
    readonly description: string;

    @IsNotEmpty({ message: 'Price field should not be empty' })
    @IsNumber({},{ message: 'Please enter correct price for this meal (number)'})
    readonly price: number;

    @IsNotEmpty({ message: 'Category field should not be empty' })
    @IsEnum(Category, { message: 'Please enter correct category for this meal.'})
    readonly category: Category;

    @IsNotEmpty({ message: 'Restaurant field should not be empty'})
    @IsString({ message: 'Please enter correct restaurant ID.'})
    readonly restaurant: string;

    @IsEmpty({ message: 'You cannot provide a user ID.' })
    readonly user: User;
}