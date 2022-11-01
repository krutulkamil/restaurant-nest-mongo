import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { UserRoles } from '../auth/schemas/user.schema';
import APIFeatures from '../utils/apiFeatures.utils';

const mockRestaurant = {
    _id: '635fa337ab4946e81213a56c',
    name: 'Vera Napoli',
    description: 'Italian pizza',
    email: 'vera.n@gmail.com',
    phoneNo: 123456789,
    address: 'Warszawska 23, Katowice, Poland',
    category: 'Fine Dinning',
    images: [],
    location: {
        type: 'Point',
        coordinates: [
            19.0277778,
            50.2572222
        ],
        formattedAddress: 'Warszawska 23, 40-014 Katowice, Poland',
        country: 'Poland',
        city: 'Katowice',
        streetName: 'Warszawska',
        streetNumber: '23',
        zipcode: '40-014'
    },
    menu: [],
    user: '635e59634f714fa8196511a0',
    __v: 4
};

const mockUser = {
    _id: '635e59634f714fa8196511a0',
    email: 'krutulkamil@onet.pl',
    name: 'krutulkamil',
    role: UserRoles.USER
};

const mockRestaurantService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
};

describe('RestaurantsService', () => {
    let service: RestaurantsService;
    let model: Model<Restaurant>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RestaurantsService,
                {
                    provide: getModelToken(Restaurant.name),
                    useValue: mockRestaurantService
                }
            ]
        }).compile();

        service = module.get<RestaurantsService>(RestaurantsService);
        model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should get all restaurants', async () => {
            jest.spyOn(model, 'find').mockImplementationOnce(() => ({
                limit: () => ({
                    skip: jest.fn().mockResolvedValue([mockRestaurant])
                })
            } as any));

            const restaurants = await service.findAll({ keyword: 'restaurant' });
            expect(restaurants).toEqual([mockRestaurant]);
        });
    });

    describe('create', () => {
        const newRestaurant = {
            name: 'Vera Napoli',
            description: 'Italian pizza',
            email: 'vera.n@gmail.com',
            phoneNo: 123456789,
            address: 'Warszawska 23, Katowice, Poland',
            category: 'Fine Dinning'
        };

        it('should create a new restaurant', async () => {
            jest.spyOn(APIFeatures, 'getRestaurantLocation')
                .mockImplementationOnce(() => Promise.resolve(mockRestaurant.location));

            jest.spyOn(model, 'create')
                .mockImplementationOnce(() => Promise.resolve(mockRestaurant));

            const result = await service.create(newRestaurant as any, mockUser as any);
            expect(result).toEqual(mockRestaurant);
        });
    });

    describe('findById', () => {
        it('should get restaurant by Id', async () => {
            jest.spyOn(model, 'findById')
                .mockResolvedValueOnce(mockRestaurant as any);

            const result = await service.findById(mockRestaurant._id);
            expect(result).toEqual(mockRestaurant);
        });

        it('should throw wrong moongose id error', async () => {
            await expect(service.findById('wrongId')).rejects.toThrow(BadRequestException);
        });

        it('should throw restaurant not found error', async () => {
            const mockError = new NotFoundException('Restaurant not found.');
            jest.spyOn(model, 'findById')
                .mockRejectedValue(mockError);

            await expect(service.findById(mockRestaurant._id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateById', () => {
        it('should update the restaurant', async () => {
            const restaurant = { ...mockRestaurant, name: 'Updated name' };
            const updateRestaurant = { name: 'Updated name' };

            jest.spyOn(model, 'findByIdAndUpdate')
                .mockResolvedValueOnce(restaurant as any);

            const updatedRestaurant = await service.updateById(restaurant._id, updateRestaurant as any);
            expect(updatedRestaurant.name).toEqual(updatedRestaurant.name);
        });
    });

    describe('deleteById', () => {
        it('should delete the restaurant', async () => {
            jest.spyOn(model, 'findByIdAndDelete')
                .mockResolvedValueOnce(mockRestaurant as any);

            const result = await service.deleteById(mockRestaurant._id);
            expect(result).toEqual(mockRestaurant);
        });
    });

    describe('uploadImages', () => {
        it('should upload restaurant images on S3 Bucket', async () => {
            const mockImages = [
                {
                    ETag: '"fde2a82dbb1596531209fcdb9638f732"',
                    Location: 'https://nest-restaurants-api.s3.amazonaws.com/restaurants/TEAM-1_1667131773236.jpg',
                    key: 'restaurants/TEAM-1_1667131773236.jpg',
                    Key: 'restaurants/TEAM-1_1667131773236.jpg',
                    Bucket: 'nest-restaurants-api'
                },
                {
                    ETag: '"2f54e7ecb45aeff727ec88c98b99ce6c"',
                    Location: 'https://nest-restaurants-api.s3.amazonaws.com/restaurants/hero-background_1667131773214.jpg',
                    key: 'restaurants/hero-background_1667131773214.jpg',
                    Key: 'restaurants/hero-background_1667131773214.jpg',
                    Bucket: 'nest-restaurants-api'
                }
            ];

            const updatedRestaurant = { ...mockRestaurant, images: mockImages };

            jest.spyOn(APIFeatures, 'upload')
                .mockResolvedValueOnce(mockImages);

            jest.spyOn(model, 'findByIdAndUpdate')
                .mockResolvedValueOnce(updatedRestaurant as any);

            const files = [
                {
                    fieldname: 'files',
                    originalname: 'TEAM-1.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: `<Buffer ff d8 ff e2 0c 58 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 0c 48 4c 69 6e 6f 02 10 00 00 6d 6e 74 72 52 47 42 20 58 59 5a 20 07 ce 00 02 00 09 ... 121698 mor
                    e bytes>`,
                    size: 121748
                },
                {
                    fieldname: 'files',
                    originalname: 'TEAM-1@2x.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: `<Buffer ff d8 ff e2 0c 58 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 0c 48 4c 69 6e 6f 02 10 00 00 6d 6e 74 72 52 47 42 20 58 59 5a 20 07 ce 00 02 00 09 ... 276257 mor
                    e bytes>`,
                    size: 276307
                }
            ];

            const result = await service.uploadImages(mockRestaurant._id, files as any);
            expect(result).toEqual(updatedRestaurant);
        });
    });

    describe('deleteImages', () => {
        it('should delete restaurant images from S3 Bucket', async () => {
            const mockImages = [
                {
                    ETag: '"fde2a82dbb1596531209fcdb9638f732"',
                    Location: 'https://nest-restaurants-api.s3.amazonaws.com/restaurants/TEAM-1_1667131773236.jpg',
                    key: 'restaurants/TEAM-1_1667131773236.jpg',
                    Key: 'restaurants/TEAM-1_1667131773236.jpg',
                    Bucket: 'nest-restaurants-api'
                },
                {
                    ETag: '"2f54e7ecb45aeff727ec88c98b99ce6c"',
                    Location: 'https://nest-restaurants-api.s3.amazonaws.com/restaurants/hero-background_1667131773214.jpg',
                    key: 'restaurants/hero-background_1667131773214.jpg',
                    Key: 'restaurants/hero-background_1667131773214.jpg',
                    Bucket: 'nest-restaurants-api'
                }
            ];

            jest.spyOn(APIFeatures, 'deleteImages')
                .mockResolvedValueOnce(true)

            const result = await service.deleteImages(mockImages);
            expect(result).toBe(true);
        });
    });
});