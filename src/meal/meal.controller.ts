import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MealService } from './meal.service';
import { Meal } from './schemas/meal.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';

@Controller('meals')
export class MealController {
    constructor(private readonly mealService: MealService) {}

    @Get()
    async getAllMeals(): Promise<Meal[]> {
        return this.mealService.findAll();
    };

    @Get('restaurant/:id')
    async getMealsByRestaurant(
        @Param('id') id: string
    ): Promise<Meal[]> {
        return this.mealService.findByRestaurant(id)
    };

    @Post()
    @UseGuards(AuthGuard())
    async createMeal(
        @Body() createMealDto: CreateMealDto,
        @CurrentUser() user: User
    ): Promise<Meal> {
        return await this.mealService.create(createMealDto, user)
    }
}
