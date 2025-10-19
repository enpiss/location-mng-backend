import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { SearchPaiementDto } from './dto/search-paiement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { PaiementDto } from './dto/paiement.dto';

@Controller('paiements')
@UseGuards(JwtAuthGuard)
@Serialize(PaiementDto)
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Post()
  create(@Body() createPaiementDto: CreatePaiementDto) {
    return this.paiementService.create(createPaiementDto);
  }

  @Get()
  findAll(@Query() searchPaiementDto: SearchPaiementDto) {
    return this.paiementService.findAll(searchPaiementDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paiementService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaiementDto: UpdatePaiementDto,
  ) {
    return this.paiementService.update(id, updatePaiementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paiementService.remove(id);
  }
}
