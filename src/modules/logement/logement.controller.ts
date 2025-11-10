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
  // UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { LogementService } from './logement.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';
import { SearchLogementDto } from './dto/search-logement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { LogementDto } from './dto/logement.dto';
import { Serialize } from '../../common/decorators/serialize.decorator';

@Controller('logements')
@UseGuards(JwtAuthGuard)
@Serialize(LogementDto)
export class LogementController {
  constructor(private readonly logementService: LogementService) {}

  @Post()
  create(@Req() req: Request, @Body() createLogementDto: CreateLogementDto) {
    console.log('Creating logement with data:', req);
    createLogementDto.ownerId = (req.user as User).id;
    return this.logementService.create(createLogementDto);
  }

  @Get()
  findAll(@Query() searchOptionsDto: SearchLogementDto) {
    return this.logementService.findAll(searchOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logementService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogementDto: UpdateLogementDto,
  ) {
    return this.logementService.update(id, updateLogementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logementService.remove(id);
  }
}
