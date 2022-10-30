import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Meal } from './schemas/meal.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class MealService {
    constructor(
        @InjectModel(Meal.name) private readonly mealModel: mongoose.Model<Meal>,
        @InjectModel(Restaurant.name) private readonly restaurantModel: mongoose.Model<Restaurant>
    ) {};

    async create(meal: Meal, user: User): Promise<Meal> {
        const data = Object.assign(meal, { user: user._id });

        const restaurant = await this.restaurantModel.findById(meal.restaurant);

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found with this ID.');
        }

        if (restaurant.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You cannot add meal to this restaurant!');
        }

        const mealCreated = await this.mealModel.create(data);

        restaurant.menu.push(mealCreated.id);
        await restaurant.save();

        return mealCreated;
    }
}
