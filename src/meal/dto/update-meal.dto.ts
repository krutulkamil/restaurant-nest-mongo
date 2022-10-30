import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../schemas/meal.schema';
import { User } from '../../auth/schemas/user.schema';

export class UpdateMealDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string!' })
    readonly name: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string!' })
    readonly description: string;

    @IsOptional()
    @IsNumber({},{ message: 'Please enter correct price for this meal (number)'})
    readonly price: number;

    @IsOptional()
    @IsEnum(Category, { message: 'Please enter correct category for this meal.'})
    readonly category: Category;

    @IsOptional()
    @IsString({ message: 'Please enter correct restaurant ID.'})
    readonly restaurant: string;

    @IsEmpty()
    readonly user: User;
}