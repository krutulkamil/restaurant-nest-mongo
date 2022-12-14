import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

    async findAll(): Promise<Meal[]> {
        return this.mealModel.find();
    };

    async findByRestaurant(id: string): Promise<Meal[]> {
        return this.mealModel.find({ restaurant: id })
    };

    async findById(id: string): Promise<Meal> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Wrong mongoose ID error.');
        }

        const meal = await this.mealModel.findById(id);

        if (!meal) {
            throw new NotFoundException('Meal not found with this ID.');
        }

        return meal;
    };

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
    };

    async updateById(id: string, meal: Meal): Promise<Meal> {
        return this.mealModel.findByIdAndUpdate(id, meal, {
            new: true,
            runValidators: true
        });
    };

    async deleteById(id: string): Promise<{ deleted: boolean }> {
        const meal = await this.mealModel.findById(id);
        const restaurant = await this.restaurantModel.findOne({ menu: meal });

        restaurant.menu = restaurant.menu.filter(meals => meal.id.toString() !== meals.toString());
        await restaurant.save();

        const response = await this.mealModel.findByIdAndDelete(id);

        if (response) return { deleted: true };
        return { deleted: false };
    };
}
