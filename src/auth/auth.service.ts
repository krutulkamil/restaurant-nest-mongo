import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<User> {
        const { name, email, password } = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            return await this.userModel.create({
                name, email, password: hashedPassword
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Duplicate email entered!');
            }
        }
    };

    async login(loginDto: LoginDto): Promise<User> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email }).select('+password');

        if (!user) {
            throw new UnauthorizedException('Invalid email address or password!');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email address or password!');
        }

        return user;
    }
}
