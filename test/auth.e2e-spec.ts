import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeAll(() => {
        mongoose.connect(process.env.DB_URI_LOCAL, () => {
            mongoose.connection.db.dropDatabase();
        });
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    const user = {
        name: 'Kamil Krutul',
        email: 'krutulkamil@onet.pl',
        password: 'test12345'
    };

    it('(POST) - register a new user', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send(user)
            .expect(201)
            .then((res) => {
                expect(res.body.token).toBeDefined();
            });
    });

    it('(GET) - login user', () => {
        return request(app.getHttpServer())
            .get('/auth/login')
            .send({ email: user.email, password: user.password })
            .expect(200)
            .then((res) => {
                expect(res.body.token).toBeDefined();
            });
    });
});
