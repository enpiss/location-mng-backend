import { HttpException, Injectable } from '@nestjs/common';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike as Like, Repository } from 'typeorm';
import { Logement } from './entities/logement.entity';
import { SearchLogementDto } from './dto/search-logement.dto';
import { PageDto } from '../../common/dto/page.dto';

@Injectable()
export class LogementService {
  constructor(
    @InjectRepository(Logement)
    private logementRepository: Repository<Logement>,
  ) {}
  create(createLogementDto: CreateLogementDto) {
    const logement = this.logementRepository.create({
      ...createLogementDto,
      owner: { id: createLogementDto.ownerId },
    });
    return this.logementRepository.save(logement);
  }

  async findAll(searchOptionsDto: SearchLogementDto) {
    const {
      limit,
      skip,
      minRentAmount,
      maxRentAmount,
      isActive,
      address,
      title,
      minRentDueDay,
      maxRentDueDay,
    } = searchOptionsDto;

    const [logements, count] = await this.logementRepository.findAndCount({
      where: {
        ...(isActive !== undefined && { isActive }),
        ...(address && { address: Like(`%${address}%`) }),
        ...(title && { title: Like(`%${title}%`) }),
        ...(minRentAmount !== undefined && maxRentAmount !== undefined
          ? { rentAmount: Between(minRentAmount, maxRentAmount) }
          : {}),
        ...(minRentDueDay !== undefined && maxRentDueDay !== undefined
          ? { rentDueDay: Between(minRentDueDay, maxRentDueDay) }
          : {}),
      },
      take: limit,
      skip,
      order: { updatedAt: 'DESC' },
    });

    return PageDto.fromEntities(logements, count, searchOptionsDto);
  }

  async findOne(id: string) {
    const logement = await this.logementRepository.findOne({ where: { id } });
    if (logement) {
      return logement;
    } else {
      throw new HttpException('Logement introuvable', 404);
    }
  }

  async update(id: string, updateLogementDto: UpdateLogementDto) {
    const result = await this.logementRepository.update(id, updateLogementDto);
    if (result.affected && result.affected > 0) {
      return this.findOne(id);
    } else {
      throw new HttpException('Logement introuvable', 404);
    }
  }

  async remove(id: string) {
    const result = await this.logementRepository.softDelete(id);
    if (result.affected && result.affected > 0) {
      return;
    } else {
      throw new HttpException('Logement introuvable', 404);
    }
  }
}
