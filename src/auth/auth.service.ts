import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async login(dto: LoginDto) {
        const user = await this.prisma.adminUser.findUnique({
            where: { email: dto.email },
        });

        if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        await this.prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        const tokens = await this.generateTokens(user.id, user.email, user.role);

        return {
            ...tokens,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            const user = await this.prisma.adminUser.findUnique({
                where: { id: payload.sub },
            });

            if (!user || !user.isActive) {
                throw new UnauthorizedException('User not found or inactive');
            }

            return this.generateTokens(user.id, user.email, user.role);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async getProfile(userId: string) {
        const user = await this.prisma.adminUser.findUniqueOrThrow({
            where: { id: userId },
            select: { id: true, email: true, role: true, lastLoginAt: true, createdAt: true },
        });
        return user;
    }

    private async generateTokens(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const accessExpiresIn = this.configService.get<number>('JWT_ACCESS_EXPIRES_IN') || 900;
        const refreshExpiresIn = this.configService.get<number>('JWT_REFRESH_EXPIRES_IN') || 604800;

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: accessExpiresIn,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: refreshExpiresIn,
            }),
        ]);

        return { accessToken, refreshToken };
    }
}