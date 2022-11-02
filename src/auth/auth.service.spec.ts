import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User, UserRoles } from './schemas/user.schema';
import APIFeatures from '../utils/apiFeatures.utils';

const mockUser = {
    _id: '635e59634f714fa8196511a0',
    email: 'krutulkamil@onet.pl',
    name: 'krutulkamil',
    role: UserRoles.USER,
    password: 'hashedPassword'
};

const token = 'jwtToken';

const mockAuthService = {
    create: jest.fn()
};

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

    describe('signup', () => {

        const signUpDto = {
            name: 'krutulkamil',
            email: 'krutulkamil@onet.pl',
            password: 'test12345'
        };

        it('should register a new user', async () => {
            jest.spyOn(bcrypt, 'hash')
                .mockResolvedValueOnce('testHash');

            jest.spyOn(model, 'create')
                .mockImplementationOnce(() => Promise.resolve(mockUser));

            jest.spyOn(APIFeatures, 'assignJwtToken')
                .mockResolvedValueOnce(token);

            const result = await service.signUp(signUpDto);

            expect(bcrypt.hash).toHaveBeenCalled();
            expect(result.token).toEqual(token);
        });

        it('should throw duplicate email entered', async () => {
            jest.spyOn(model, 'create')
                .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

            await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
        });
    });
});