import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { SearchPaiementDto } from './dto/search-paiement.dto';
import { Paiement } from './entities/paiement.entity';
import { PageDto } from '../../common/dto/page.dto';
import { LocataireService } from '../locataire/locataire.service';

@Injectable()
export class PaiementService {
  constructor(
    @InjectRepository(Paiement)
    private paiementRepository: Repository<Paiement>,
    private locataireService: LocataireService,
  ) {}

  async create(createPaiementDto: CreatePaiementDto) {
    // determine monthKey from paidAt
    const paidAtDate = new Date(createPaiementDto.paidAt);
    const month = (paidAtDate.getMonth() + 1).toString().padStart(2, '0');
    const year = paidAtDate.getFullYear();
    const monthKey = `${year}-${month}`;

    // verifier l'existence du locataire
    const locataire = await this.locataireService.findOne(
      createPaiementDto.locataireId,
    );

    if (!locataire) {
      throw new HttpException('Locataire introuvable', 404);
    }

    const paiement = this.paiementRepository.create({
      ...createPaiementDto,
      monthKey,
      locataire: { id: createPaiementDto.locataireId },
    });
    return await this.paiementRepository.save(paiement);
  }

  async findAll(searchOptionsDto: SearchPaiementDto) {
    const {
      limit,
      skip,
      minAmount,
      maxAmount,
      minPaidAt,
      maxPaidAt,
      monthKey,
      locataireId,
    } = searchOptionsDto;

    const [paiements, count] = await this.paiementRepository.findAndCount({
      relations: ['locataire'],
      where: {
        ...(minAmount !== undefined && maxAmount !== undefined
          ? { amount: Between(minAmount, maxAmount) }
          : {}),
        ...(minPaidAt && maxPaidAt
          ? { paidAt: Between(minPaidAt, maxPaidAt) }
          : {}),
        ...(monthKey && { monthKey }),
        ...(locataireId && { locataireId }),
      },
      take: limit,
      skip,
      order: { paidAt: 'DESC' },
    });
    return PageDto.fromEntities(paiements, count, searchOptionsDto);
  }

  async findOne(id: string) {
    const paiement = await this.paiementRepository.findOne({ where: { id } });
    if (paiement) {
      return paiement;
    }
    throw new HttpException('Paiement introuvable', 404);
  }

  async update(id: string, updatePaiementDto: UpdatePaiementDto) {
    const { locataireId = null, ...rest } = updatePaiementDto;

    if (locataireId) {
      // verifier l'existence du locataire
      const locataire = await this.locataireService.findOne(locataireId);

      if (!locataire) {
        throw new HttpException('Locataire introuvable', 404);
      }
    }

    const result = await this.paiementRepository.update(id, {
      ...rest,
      locataire: locataireId ? { id: locataireId } : undefined,
    });
    if (result.affected && result.affected > 0) {
      return await this.paiementRepository.findOne({ where: { id } });
    }
    throw new HttpException('Paiement introuvable', 404);
  }

  async remove(id: string) {
    const result = await this.paiementRepository.softDelete(id);
    if (!result.affected) {
      throw new HttpException('Paiement introuvable', 404);
    }
  }
}
