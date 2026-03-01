import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.AdminRole;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(userId: string): Promise<{
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.AdminRole;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    private generateTokens;
}
