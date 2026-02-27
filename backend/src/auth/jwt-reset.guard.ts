import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtResetGuard extends AuthGuard('jwt-reset') {}