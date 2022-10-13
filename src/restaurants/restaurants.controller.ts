import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) {};

    @Get()
    async getAllRestaurants(): Promise<Restaurant[]> {
        return await this.restaurantsService.findAll();
    };

    @Post()
    async createRestaurant(@Body() restaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        return await this.restaurantsService.create(restaurantDto);
    };

    @Get(':id')
    async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
        return await this.restaurantsService.findById(id);
    }
}
