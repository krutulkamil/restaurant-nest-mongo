import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

const mockAuthService = {};

describe('AuthService', () => {
    let service: AuthService;
    let model: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'super-secret',
                    signOptions: { expiresIn: '1d' }
                })
            ],
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockAuthService
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
        model = module.get<Model<User>>(getModelToken(User.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});