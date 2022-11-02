import { TestingModule, Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtStrategy } from './jwt.strategy';
import { User, UserRoles } from './schemas/user.schema';

const mockUser = {
    _id: '635e59634f714fa8196511a0',
    email: 'krutulkamil@onet.pl',
    name: 'krutulkamil',
    role: UserRoles.USER,
};

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let model: Model<User>;

    beforeEach(async () => {

        process.env.JWT_SECRET = 'super_secret';

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findById: jest.fn()
                    }
                }
            ]
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        model = module.get<Model<User>>(getModelToken(User.name));
    });

    afterEach(() => {
        delete process.env.JWT_SECRET;
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });

    describe('validate', () => {
        it('should validate and return the user', async () => {
            jest.spyOn(model, 'findById')
                .mockResolvedValueOnce(mockUser as any);

            const result = await jwtStrategy.validate({ id: mockUser._id });

            expect(model.findById).toHaveBeenCalledWith(mockUser._id);
            expect(result).toEqual(mockUser);
        });

        it('should throw Unauthorized Exception', async () => {
            jest.spyOn(model, 'findById')
                .mockResolvedValueOnce(null);

            await expect(jwtStrategy.validate({ id: mockUser._id })).rejects.toThrow(UnauthorizedException);
        });
    });
});