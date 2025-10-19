import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

import bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { AccessToken, AccessTokenPayload } from './types/access-token';
import { RegisterRequestDto } from './dto/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  comparePasswords(plainTextPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = user ? this.comparePasswords(pass, user.password) : false;
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload: AccessTokenPayload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  async register(registerRequestDto: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(
      registerRequestDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }
    const hashedPassword = await this.usersService.hashString(
      registerRequestDto.password,
    );
    const newUser = await this.usersService.create({
      ...registerRequestDto,
      password: hashedPassword,
    });
    return this.login(newUser);
  }
}
