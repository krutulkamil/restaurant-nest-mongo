import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import APIFeatures from '../utils/apiFeatures.utils';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private readonly restaurantModel: mongoose.Model<Restaurant>
    ) {
    };

    async findAll(query: Query): Promise<Restaurant[]> {
        const resultsPerPage: number = 5;
        const currentPage: number = Number(query.page) || 1;
        const skip: number = resultsPerPage * (currentPage - 1);

        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {};

        return this.restaurantModel
            .find({ ...keyword })
            .limit(resultsPerPage)
            .skip(skip);
    };

    async create(restaurantDto: CreateRestaurantDto, user: User): Promise<Restaurant> {
        const location = await APIFeatures.getRestaurantLocation(restaurantDto.address);
        const data = Object.assign(restaurantDto, { user: user._id, location });

        return await this.restaurantModel.create(data);
    };

    async findById(id: string): Promise<Restaurant> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Wrong mongoose ID error. Please enter correct ID.');
        }

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
        return this.restaurantModel.findByIdAndDelete(id);
    };

    async uploadImages(id: string, files: Array<Express.Multer.File>) {
        const images = await APIFeatures.upload(files);
        return this.restaurantModel.findByIdAndUpdate(id, { images: images as Object[] },
            {
                new: true,
                runValidators: true
            });
    };

    async deleteImages(images) {
        if (images.length === 0) return true;
        return await APIFeatures.deleteImages(images);
    };
}
