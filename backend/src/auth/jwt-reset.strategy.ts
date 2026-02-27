import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type JwtResetPayload = {
    sub: string;
    purpose?: string;
    iat?: number;
    exp?: number;
};

@Injectable()
export class JwtResetStrategy extends PassportStrategy(Strategy, 'jwt-reset') {
    constructor(config: ConfigService) {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET manquant');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
    }

    async validate(payload: JwtResetPayload) {
        if (payload.purpose !== 'pwd_reset') {
            throw new UnauthorizedException('Reset token requis');
        }
        return { userId: payload.sub };
    }
}