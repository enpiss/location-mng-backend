import { HttpException, Injectable } from '@nestjs/common';
import { CreateLocataireDto } from './dto/create-locataire.dto';
import { UpdateLocataireDto } from './dto/update-locataire.dto';
import { ILike as Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Locataire } from './entities/locataire.entity';
import { PageDto } from '../../common/dto/page.dto';
import { SearchLocataireDto } from './dto/search-locataire.dto';

@Injectable()
export class LocataireService {
  constructor(
    @InjectRepository(Locataire)
    private locataireRepository: Repository<Locataire>,
  ) {}
  create(createLocataireDto: CreateLocataireDto) {
    const locataire = this.locataireRepository.create(createLocataireDto);
    return this.locataireRepository.save(locataire);
  }

  async findAll(pageOptionsDto: SearchLocataireDto) {
    const { limit = 10, skip, fullName, phone, email } = pageOptionsDto;

    const [locataires, locataireCount] =
      await this.locataireRepository.findAndCount({
        where: {
          ...(fullName && { fullName: Like(`%${fullName}%`) }),
          ...(email && { email: Like(`%${email}%`) }),
          ...(phone && { phone: Like(`%${phone}%`) }),
        },
        order: { updatedAt: 'DESC' },
        take: limit,
        skip,
      });

    return PageDto.fromEntities(locataires, locataireCount, pageOptionsDto);
  }

  async findOne(id: string) {
    const result = await this.locataireRepository.findOne({
      where: { id },
    });

    if (result) {
      return result;
    } else {
      throw new HttpException('Locataire introuvable', 404);
    }
  }

  async update(id: string, updateLocataireDto: UpdateLocataireDto) {
    const result = await this.locataireRepository.update(
      id,
      updateLocataireDto,
    );
    if (result.affected && result.affected > 0) {
      return this.findOne(id);
    } else {
      throw new HttpException('Locataire introuvable', 404);
    }
  }

  async remove(id: string) {
    const result = await this.locataireRepository.softDelete(id);
    if (result.affected && result.affected > 0) {
      return;
    } else {
      throw new HttpException('Locataire introuvable', 404);
    }
  }
}
