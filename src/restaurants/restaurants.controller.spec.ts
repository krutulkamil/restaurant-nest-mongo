import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { UserRoles } from '../auth/schemas/user.schema';
import { ForbiddenException } from '@nestjs/common';

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
    findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
    create: jest.fn(),
    findById: jest.fn().mockResolvedValueOnce(mockRestaurant),
    updateById: jest.fn(),
    deleteImages: jest.fn().mockResolvedValueOnce(true),
    deleteById: jest.fn().mockResolvedValueOnce({ deleted: true})
};

describe('RestaurantsController', () => {
    let controller: RestaurantsController;
    let service: RestaurantsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [RestaurantsController],
            providers: [
                {
                    provide: RestaurantsService,
                    useValue: mockRestaurantService
                }
            ]
        }).compile();

        controller = module.get<RestaurantsController>(RestaurantsController);
        service = module.get<RestaurantsService>(RestaurantsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllRestaurants', () => {
        it('should get all restaurants', async () => {
            const result = await controller.getAllRestaurants({ keyword: 'restaurant' });

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockRestaurant]);
        });
    });

    describe('createRestaurant', () => {
        it('should create a new restaurant', async () => {
            const newRestaurant = {
                name: 'Vera Napoli',
                description: 'Italian pizza',
                email: 'vera.n@gmail.com',
                phoneNo: 123456789,
                address: 'Warszawska 23, Katowice, Poland',
                category: 'Fine Dinning'
            };

            mockRestaurantService.create = jest.fn().mockResolvedValueOnce(mockRestaurant);

            const result = await controller.createRestaurant(newRestaurant as any, mockUser as any);

            expect(service.create).toHaveBeenCalled();
            expect(result).toEqual(mockRestaurant);
        });
    });

    describe('getRestaurant', () => {
        it('should get restaurant by ID', async () => {
            const result = await controller.getRestaurant(mockRestaurant._id);

            expect(service.findById).toHaveBeenCalled();
            expect(result).toEqual(mockRestaurant);
        });
    });

    describe('updateRestaurant', () => {
        const restaurant = { ...mockRestaurant, name: 'Updated name' };
        const updateRestaurant = { name: 'Updated name' };

        it('should update restaurant by ID', async () => {
            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);

            mockRestaurantService.updateById = jest.fn().mockResolvedValueOnce(restaurant);

            const result = await controller.updateRestaurant(restaurant._id, updateRestaurant as any, mockUser as any);

            expect(service.updateById).toHaveBeenCalled();
            expect(result).toEqual(restaurant);
            expect(result.name).toEqual(restaurant.name);
        });

        it('should throw forbidden error', async () => {
            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);

            const user = {
                ...mockUser,
                _id: 'wrongid'
            };

            await expect(controller.updateRestaurant(restaurant._id, updateRestaurant as any, user as any)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('deleteRestaurant', () => {
        it('should delete restaurant by ID', async () => {

            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);

            const result = await controller.deleteRestaurant(mockRestaurant._id, mockUser as any);

            expect(service.deleteById).toHaveBeenCalled();
            expect(result).toEqual({ deleted: true });
        });

        it('should not delete restaurant because images are not deleted', async () => {

            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);

            mockRestaurantService.deleteImages = jest.fn().mockResolvedValueOnce(false);

            const result = await controller.deleteRestaurant(mockRestaurant._id, mockUser as any);

            expect(service.deleteById).toHaveBeenCalled();
            expect(result).toEqual({ deleted: false });
        });

        it('should throw forbidden error', async () => {
            mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant);

            const user = {
                ...mockUser,
                _id: 'wrongid'
            };

            await expect(controller.deleteRestaurant(mockRestaurant._id, user as any)).rejects.toThrow(ForbiddenException);
        });
    });
});