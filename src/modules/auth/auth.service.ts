import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

import bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import {
  AccessToken,
  AccessTokenPayload,
  AccessTokenWithUserInfo,
} from './types/access-token';
import { RegisterRequestDto } from './dto/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneByEmailOrPhone(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this.comparePasswords(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User): Promise<AccessTokenWithUserInfo> {
    const payload: AccessTokenPayload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      fullName: user.fullName,
      email: user.email,
      id: user.id,
    };
  }

  async register(registerRequestDto: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmailOrPhone(
      registerRequestDto.email,
      registerRequestDto.phone,
    );
    if (existingUser) {
      throw new UnauthorizedException(
        'User with given email or phone already exists',
      );
    }

    const newUser = await this.usersService.create({
      ...registerRequestDto,
    });

    return this.login(newUser);
  }
}
