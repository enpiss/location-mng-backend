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
import { EcheancesLoyerService } from './echeances-loyer.service';
import { CreateEcheancesLoyerDto } from './dto/create-echeances-loyer.dto';
import { UpdateEcheancesLoyerDto } from './dto/update-echeances-loyer.dto';
import { SearchEcheanceLoyerDto } from './dto/search-echeance-loyer.dto';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { EcheanceLoyerDto } from './dto/echeance-loyer.dto';

@Controller('echeances-loyer')
export class EcheancesLoyerController {
  constructor(private readonly echeancesLoyerService: EcheancesLoyerService) {}

  @Post()
  @Serialize(EcheanceLoyerDto)
  create(@Body() createEcheancesLoyerDto: CreateEcheancesLoyerDto) {
    return this.echeancesLoyerService.create(createEcheancesLoyerDto);
  }

  @Get()
  findAll(@Query() search: SearchEcheanceLoyerDto) {
    return this.echeancesLoyerService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.echeancesLoyerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEcheancesLoyerDto: UpdateEcheancesLoyerDto,
  ) {
    return this.echeancesLoyerService.update(id, updateEcheancesLoyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.echeancesLoyerService.remove(id);
  }
}
