import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '.prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, // create(), findUnique()
    private jwt: JwtService, // signAsync()
    private config: ConfigService, // JWT_SECRET
  ) {}

  async signup(dto: AuthDto) {
    try {
      // Generate the password hash
      const hash = await argon.hash(dto.password);
      
      // Save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // Strip secret fields before returning
      delete user.hash;

      // Return the saved user
      return this.signToken(user.id, user.email);
    } catch (error) {
      // Check if the error comes from Prisma
      if (error instanceof PrismaClientKnownRequestError) {
        // Prisma error code for duplicate fields
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken, biatch');
        }
      }

      // Otherwise throw it back. Hot potato, baby.
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If user does not exist, throw exception
    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect, user not found',
      );

    // Compare password
    const passMatches = await argon.verify(user.hash, dto.password);

    // If password incorrect, throw exception
    if (!passMatches)
      throw new ForbiddenException('Credentials incorrect, bad pass');

    // Return the signed token for the user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      id: userId, // identifies the principal that is the subject of the JWT
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token, // creates a string object
    };
  }
}
