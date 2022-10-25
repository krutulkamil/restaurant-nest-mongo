import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private readonly restaurantModel: mongoose.Model<Restaurant>
    ) {}

    async findAll(query: Query): Promise<Restaurant[]> {

        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}

        const restaurants = await this.restaurantModel.find({ ...keyword });
        return restaurants;
    };

    async create(restaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        const restaurant = await this.restaurantModel.create(restaurantDto);
        return restaurant;
    };

    async findById(id: string): Promise<Restaurant> {
        const restaurant = await this.restaurantModel.findById(id);

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found.');
        }

        return restaurant;
    };

    async updateById(id: string, restaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
        return this.restaurantModel.findByIdAndUpdate(id, restaurantDto, {
            new: true,
            runValidators: true
        });
    };

    async deleteById(id: string): Promise<Restaurant> {
        return this.restaurantModel.findByIdAndDelete(id)
    };
}
