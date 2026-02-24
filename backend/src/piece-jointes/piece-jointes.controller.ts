import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PieceJointesService } from './piece-jointes.service';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';
// import { UpdatePieceJointeDto } from './dto/update-piece-jointe.dto';

@Controller('piece-jointes')
export class PieceJointesController {
  constructor(private readonly pieceJointesService: PieceJointesService) { }

  @Post()
  create(@Body() createPieceJointeDto: CreatePieceJointeDto) {
    return this.pieceJointesService.create(createPieceJointeDto);
  }

  @Get()
  findAll() {
    return this.pieceJointesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_piece_jointe: string) {
    return this.pieceJointesService.findOne(id_piece_jointe);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePieceJointeDto: UpdatePieceJointeDto) {
  //   return this.pieceJointesService.update(+id, updatePieceJointeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id_piece_jointe: string) {
    return this.pieceJointesService.remove(id_piece_jointe);
  }
}
