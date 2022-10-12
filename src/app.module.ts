import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
          isGlobal: true
      }),
      MongooseModule.forRoot(process.env.DB_URI_LOCAL),
      RestaurantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
