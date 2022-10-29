import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) {
    };

    @Get()
    async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
        return await this.restaurantsService.findAll(query);
    };

    @Post()
    async createRestaurant(@Body() restaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        return await this.restaurantsService.create(restaurantDto);
    };

    @Get(':id')
    async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
        return await this.restaurantsService.findById(id);
    };

    @Put(':id')
    async updateRestaurant(@Param('id') id: string, @Body() restaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
        await this.restaurantsService.findById(id);
        return await this.restaurantsService.updateById(id, restaurantDto);
    };

    @Delete(':id')
    async deleteRestaurant(@Param('id') id: string): Promise<{ deleted: boolean }> {
        await this.restaurantsService.findById(id);

        const restaurant = await this.restaurantsService.deleteById(id);

        if (restaurant) {
            return {
                deleted: true
            };
        }
    };

    @Put('upload/:id')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        await this.restaurantsService.findById(id);
        return await this.restaurantsService.uploadImages(id, files);
    };
}
