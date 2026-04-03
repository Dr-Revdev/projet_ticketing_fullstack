import { Controller, Get, Post, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PieceJointesService } from './piece-jointes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'node:crypto';

@Controller('piece-jointes')
export class PieceJointesController {
  constructor(private readonly pieceJointesService: PieceJointesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname)}`)
    })
  }))
  create(
    @Req() req: Request & { user: { userId: string } },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Fichier manquant')
    const id_ticket = (req as any).body.id_ticket
    if (!id_ticket) throw new BadRequestException('id_ticket manquant')

    return this.pieceJointesService.createForUser(req.user.userId, {
      id_piece_jointe: randomUUID(),
      nom_fichier: file.originalname,
      url_path: `/uploads/${file.filename}`,
      id_utilisateur: req.user.userId,
      id_ticket,
    })
  }

  @Get(':id_ticket')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req: Request & { user: { userId: string } },
    @Param('id_ticket') id_ticket: string,
    ) {
    return this.pieceJointesService.findAllForTicket(req.user.userId, id_ticket);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  remove(@Param('id') id_piece_jointe: string) {
    return this.pieceJointesService.remove(id_piece_jointe);
  }
}
