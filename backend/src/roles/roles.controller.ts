import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_role: string) {
    return this.rolesService.findOne(id_role);
  }

  @Patch(':id')
  update(@Param('id') id_role: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id_role, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id_role: string) {
    return this.rolesService.remove(id_role);
  }
}
