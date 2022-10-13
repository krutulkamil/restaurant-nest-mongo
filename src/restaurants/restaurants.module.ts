import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantSchema } from './schemas/restaurant.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Restaurant', schema: RestaurantSchema }
        ])
    ],
    controllers: [RestaurantsController],
    providers: [RestaurantsService]
})
export class RestaurantsModule {
}
