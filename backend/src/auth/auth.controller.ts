import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtResetGuard } from './jwt-reset.guard';
import { ChangePasswordDto } from './dto/change-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() dto: AuthDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('change-password')
  @UseGuards(JwtResetGuard)
  changePassword(
    @Req() req: Request & { user: { userId: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePasswordFirstLogin(req.user.userId, dto.newPassword);
  }
}
