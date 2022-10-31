import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

const mockRestaurant = {
    '_id': '635fa337ab4946e81213a56c',
    'name': 'Vera Napoli',
    'description': 'Italian pizza',
    'email': 'vera.n@gmail.com',
    'phoneNo': 123456789,
    'address': 'Warszawska 23, Katowice, Poland',
    'category': 'Fine Dinning',
    'images': [],
    'location': {
        'type': 'Point',
        'coordinates': [
            19.0277778,
            50.2572222
        ],
        'formattedAddress': 'Warszawska 23, 40-014 Katowice, Poland',
        'country': 'Poland',
        'city': 'Katowice',
        'streetName': 'Warszawska',
        'streetNumber': '23',
        'zipcode': '40-014'
    },
    'menu': [],
    'user': '635e59634f714fa8196511a0',
    '__v': 4
};

const mockRestaurantService = {
    find: jest.fn()
};

describe('RestaurantService', () => {
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

    describe('findAll',  () => {
        it('should get all restaurants', async() => {
            jest.spyOn(model, 'find').mockImplementationOnce(() => ({
                limit: () => ({
                    skip: jest.fn().mockResolvedValue([mockRestaurant])
                })
            } as any));

            const restaurants = await service.findAll({ keyword: 'restaurant'})
            expect(restaurants).toEqual([mockRestaurant]);
        });
    });
});