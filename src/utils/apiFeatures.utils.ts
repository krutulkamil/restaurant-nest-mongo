import { S3 } from 'aws-sdk';

const nodeGeoCoder = require('node-geocoder');
import { Location } from '../restaurants/schemas/restaurant.schema';

export default class APIFeatures {
    static async getRestaurantLocation(address: string) {
        try {
            const options = {
                provider: 'google',
                apiKey: process.env.GOOGLE_MAPS_API_KEY,
                formatter: null
            }

            const geoCoder = nodeGeoCoder(options);
            const loc = await geoCoder.geocode(address);

            const location: Location = {
                type: 'Point',
                coordinates: [loc[0].longitude, loc[0].latitude],
                formattedAddress: loc[0].formattedAddress,
                country: loc[0].country,
                city: loc[0].city,
                streetName: loc[0].streetName,
                streetNumber: loc[0].streetNumber || loc[0].formattedAddress.split(',')[0].match(/\d+/gm)[0],
                zipcode: loc[0].zipcode,
            };

            return location;

        } catch (error) {
            console.log(error.message);
        }
    };

    static async upload(files) {
        return new Promise((resolve, reject) => {

            const s3 = new S3({
                accessKeyId: process.env.AWS_S3_KEY_ID,
                secretAccessKey: process.env.AWS_S3_ACCESS_KEY
            });

            let images = [];

            files.forEach(async (file) => {
                const splitFile = file.originalname.split('.');
                const random = Date.now();

                const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;

                const params = {
                    Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
                    Key: fileName,
                    Body: file.buffer
                };

                const uploadResponse = await s3.upload(params).promise();

                images.push(uploadResponse);

                if (images.length === files.length) {
                    resolve(images);
                }
            })
        });
    }
}