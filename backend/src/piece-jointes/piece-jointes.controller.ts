import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PieceJointesService } from './piece-jointes.service';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Request } from 'express';
// import { UpdatePieceJointeDto } from './dto/update-piece-jointe.dto';

@Controller('piece-jointes')
export class PieceJointesController {
  constructor(private readonly pieceJointesService: PieceJointesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request & { user: { userId: string } },
    @Body() createPieceJointeDto: CreatePieceJointeDto,
  ) {
    return this.pieceJointesService.createForUser(
      req.user.userId,
      createPieceJointeDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: Request & { user: { userId: string } }) {
    return this.pieceJointesService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Req() req: Request & { user: { userId: string } },
    @Param('id') id_piece_jointe: string,
  ) {
    return this.pieceJointesService.findOneForUser(req.user.userId, id_piece_jointe);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  remove(@Param('id') id_piece_jointe: string) {
    return this.pieceJointesService.remove(id_piece_jointe);
  }
}
