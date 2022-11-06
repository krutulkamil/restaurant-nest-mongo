import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) {};

    @Get()
    async getAllRestaurants(
        @Query() query: ExpressQuery
    ): Promise<Restaurant[]> {
        return await this.restaurantsService.findAll(query);
    };

    @Post()
    @UseGuards(AuthGuard())
    // @UseGuards(AuthGuard(), RolesGuard)
    @Roles('admin')
    async createRestaurant(
        @Body() restaurantDto: CreateRestaurantDto,
        @CurrentUser() user: User
    ): Promise<Restaurant> {
        return await this.restaurantsService.create(restaurantDto, user);
    };

    @Get(':id')
    async getRestaurant(
        @Param('id') id: string
    ): Promise<Restaurant> {
        return await this.restaurantsService.findById(id);
    };

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateRestaurant(
        @Param('id') id: string,
        @Body() restaurantDto: UpdateRestaurantDto,
        @CurrentUser() user: User
    ): Promise<Restaurant> {
        const response = await this.restaurantsService.findById(id);

        if (response.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You cannot update this restaurant.');
        }

        return await this.restaurantsService.updateById(id, restaurantDto);
    };

    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteRestaurant(
        @Param('id') id: string,
        @CurrentUser() user: User
    ): Promise<{ deleted: boolean }> {
        const restaurant = await this.restaurantsService.findById(id);

        if (restaurant.user.toString() !== user._id.toString()) {
            throw new ForbiddenException('You cannot delete this restaurant.');
        }

        const isDeleted = await this.restaurantsService.deleteImages(restaurant.images);
        if (isDeleted) {
            await this.restaurantsService.deleteById(id);

            return {
                deleted: true
            };

        } else {
            return {
                deleted: false
            };
        }
    };

    @Put('upload/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        await this.restaurantsService.findById(id);
        return await this.restaurantsService.uploadImages(id, files);
    };
}
