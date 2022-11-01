import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { UserRoles } from '../auth/schemas/user.schema';

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
    create: jest.fn()
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
            const result = await controller.getAllRestaurants({ keyword: 'restaurant'});

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
            expect(result).toEqual(mockRestaurant)
        });
    });
});