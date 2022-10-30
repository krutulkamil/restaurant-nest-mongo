import { Body, Controller, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MealService } from './meal.service';
import { Meal } from './schemas/meal.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { UpdateMealDto } from './dto/update-meal.dto';

@Controller('meals')
export class MealController {
    constructor(private readonly mealService: MealService) {}

    @Get()
    async getAllMeals(): Promise<Meal[]> {
        return await this.mealService.findAll();
    };

    @Get('restaurant/:id')
    async getMealsByRestaurant(
        @Param('id') id: string
    ): Promise<Meal[]> {
        return await this.mealService.findByRestaurant(id)
    };

    @Get(':id')
    async getMeal(
        @Param('id') id: string
    ): Promise<Meal> {
        return await this.mealService.findById(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createMeal(
        @Body() createMealDto: CreateMealDto,
        @CurrentUser() user: User
    ): Promise<Meal> {
        return await this.mealService.create(createMealDto, user)
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateMeal(
        @Body() updateMealDto: UpdateMealDto,
        @Param('id') id: string,
        @CurrentUser() user: User
    ): Promise<Meal> {
        const meal = await this.mealService.findById(id);

        if (meal.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You can not update this meal.');
        }

        return this.mealService.updateById(id, updateMealDto);
    };
}
