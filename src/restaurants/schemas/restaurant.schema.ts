import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Meal } from '../../meal/schemas/meal.schema';

@Schema({
    timestamps: true
})
export class Location {
    @Prop({ type: String, enum: ['Point'] })
    type: string;

    @Prop({ index: '2dsphere' })
    coordinates: number[];

    @Prop()
    formattedAddress: string;

    @Prop()
    country: string;

    @Prop()
    city: string;

    @Prop()
    streetName: string;

    @Prop()
    streetNumber: string;

    @Prop()
    zipcode: string;
}

export enum Category {
    FAST_FOOD = 'Fast Food',
    CAFE = 'Cafe',
    FINE_DINNING = 'Fine Dinning'
}

@Schema()
export class Restaurant {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    email: string;

    @Prop()
    phoneNo: number;

    @Prop()
    address: string;

    @Prop()
    category: Category;

    @Prop()
    images?: object[];

    @Prop({ type: Object, ref: 'Location' })
    location?: Location;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }])
    menu?: Meal[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);