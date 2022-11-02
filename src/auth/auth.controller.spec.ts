import { TestingModule, Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const jwtToken = 'jwtToken';

const mockAuthService = {
    signUp: jest.fn().mockResolvedValueOnce(jwtToken),
    login: jest.fn().mockResolvedValueOnce(jwtToken)
};

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ]
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signUp', () => {
        it('should register a new user', async () => {
            const signUpDto = {
                name: 'krutulkamil',
                email: 'krutulkamil@onet.pl',
                password: 'test12345'
            };

            const result = await controller.signUp(signUpDto);

            expect(service.signUp).toHaveBeenCalled();
            expect(result).toEqual(jwtToken);
        });
    });
});