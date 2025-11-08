import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocataireService } from './locataire.service';
import { CreateLocataireDto } from './dto/create-locataire.dto';
import { UpdateLocataireDto } from './dto/update-locataire.dto';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { LocataireDto } from './dto/locataire.dto';
import { SearchLocataireDto } from './dto/search-locataire.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type Request } from 'express';
import { User } from '../user/entities/user.entity';

@Controller({
  path: 'locataires',
})
@UseGuards(JwtAuthGuard)
export class LocataireController {
  constructor(private readonly locataireService: LocataireService) {}

  @Serialize(LocataireDto)
  @Post()
  create(@Req() req: Request, @Body() createLocataireDto: CreateLocataireDto) {
    const user = req.user as User;
    return this.locataireService.create(createLocataireDto, user);
  }

  @Serialize(LocataireDto)
  @Get()
  findAll(@Req() req: Request, @Query() pageOptionsDto: SearchLocataireDto) {
    const user = req.user as User;
    pageOptionsDto.proprietaireId = user.id;
    return this.locataireService.findAll(pageOptionsDto);
  }

  @Serialize(LocataireDto)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locataireService.findOne(id);
  }

  @Serialize(LocataireDto)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocataireDto: UpdateLocataireDto,
  ) {
    return this.locataireService.update(id, updateLocataireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locataireService.remove(id);
  }
}
