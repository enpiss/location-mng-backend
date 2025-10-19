import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LocataireService } from './locataire.service';
import { CreateLocataireDto } from './dto/create-locataire.dto';
import { UpdateLocataireDto } from './dto/update-locataire.dto';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { LocataireDto } from './dto/locataire.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { SearchLocataireDto } from './dto/search-locataire.dto';

@Controller({
  path: 'locataires',
})
export class LocataireController {
  constructor(private readonly locataireService: LocataireService) {}

  @Serialize(LocataireDto)
  @Post()
  create(@Body() createLocataireDto: CreateLocataireDto) {
    return this.locataireService.create(createLocataireDto);
  }

  @Serialize(LocataireDto)
  @Get()
  findAll(@Query() pageOptionsDto: SearchLocataireDto) {
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
