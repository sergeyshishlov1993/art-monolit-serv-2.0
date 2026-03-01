import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.AdminRole;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(req: {
        user: {
            sub: string;
        };
    }): Promise<{
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.AdminRole;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
}
