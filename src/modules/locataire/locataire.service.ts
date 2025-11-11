import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateLocataireDto } from './dto/create-locataire.dto';
import { UpdateLocataireDto } from './dto/update-locataire.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Locataire } from './entities/locataire.entity';
import { SearchLocataireDto } from './dto/search-locataire.dto';
import { PageDto } from '../../common/dto/page.dto';
import { User } from '../user/entities/user.entity';
import { LocataireEvent } from './events/locataire.event';

@Injectable()
export class LocataireService {
  private readonly logger = new Logger(LocataireService.name);
  constructor(
    @InjectRepository(Locataire)
    private locataireRepository: Repository<Locataire>,
    private locataireEvent: LocataireEvent,
  ) {}

  private async enrichLocatairesWithTotalDue(locataires: Locataire[]) {
    if (locataires.length === 0) return [];

    type RawLocataireRow = {
      locataire_id: string;
      locataire_totalDue: string | null;
    };

    const locataireIds = locataires.map((l) => l.id);

    const rawData: RawLocataireRow[] = await this.locataireRepository
      .createQueryBuilder('locataire')
      .select('locataire.id', 'locataire_id')
      .addSelect((subQuery) => {
        return subQuery
          .select('COALESCE(SUM(e.amountDue), 0)', 'totalDue')
          .from('echeances_loyer', 'e')
          .where('e.locataireId = locataire.id')
          .andWhere("e.monthKey <= TO_CHAR(NOW(), 'YYYY-MM')");
      }, 'locataire_totalDue')
      .whereInIds(locataireIds)
      .getRawMany();

    return locataires.map((locataire) => {
      const data = rawData.find((r) => r.locataire_id === locataire.id);
      return {
        ...locataire,
        totalDue: data?.locataire_totalDue ?? '0.00',
      };
    });
  }

  async create(createLocataireDto: CreateLocataireDto, proprietaire: User) {
    const locataireData = this.locataireRepository.create({
      ...createLocataireDto,
      proprietaire: { id: proprietaire.id },
      logement: { id: createLocataireDto.logementId },
    });

    this.logger.log({
      message: 'Creating new locataire',
      locataire: locataireData,
    });

    const locataire = await this.locataireRepository.save(locataireData);

    this.locataireEvent.created({ locataire });

    return locataire;
  }

  async findAll(pageOptionsDto: SearchLocataireDto) {
    const { limit = 10, skip, fullName, phone, email } = pageOptionsDto;

    const queryBuilder = this.locataireRepository
      .createQueryBuilder('locataire')
      .leftJoinAndSelect(
        'locataire.echeanceLoyer',
        'echeanceLoyer',
        "echeanceLoyer.monthKey <= TO_CHAR(NOW(), 'YYYY-MM')",
      )
      .leftJoinAndSelect('locataire.logement', 'logement')
      .where('1=1')
      // .andWhere(
      //   proprietaireId ? 'locataire.proprietaireId = :proprietaireId' : '1=1',
      //   {
      //     proprietaireId,
      //   },
      // )
      .andWhere(fullName ? 'locataire.fullName ILIKE :fullName' : '1=1', {
        fullName: `%${fullName}%`,
      })
      .andWhere(email ? 'locataire.email ILIKE :email' : '1=1', {
        email: `%${email}%`,
      })
      .andWhere(phone ? 'locataire.phone ILIKE :phone' : '1=1', {
        phone: `%${phone}%`,
      })
      .orderBy('locataire.updatedAt', 'DESC')
      .take(limit)
      .skip(skip);

    const [locataires, locataireCount] = await queryBuilder.getManyAndCount();
    const locatairesWithTotalDue =
      await this.enrichLocatairesWithTotalDue(locataires);

    return PageDto.fromEntities(
      locatairesWithTotalDue,
      locataireCount,
      pageOptionsDto,
    );
  }

  async findOne(id: string) {
    const locataire = await this.locataireRepository
      .createQueryBuilder('locataire')
      .leftJoinAndSelect(
        'locataire.echeanceLoyer',
        'echeanceLoyer',
        "echeanceLoyer.monthKey <= TO_CHAR(NOW(), 'YYYY-MM')",
      )
      .leftJoinAndSelect('locataire.logement', 'logement')
      .where('locataire.id = :id', { id })
      .getOne();

    if (!locataire) {
      throw new HttpException('Locataire introuvable', 404);
    }

    const [enrichedLocataire] = await this.enrichLocatairesWithTotalDue([
      locataire,
    ]);

    this.logger.debug({ enrichedLocataire });

    return enrichedLocataire;
  }

  async update(id: string, updateLocataireDto: UpdateLocataireDto) {
    const { logementId = undefined, ...rest } = updateLocataireDto;
    const locataire = await this.findOne(id);
    const previousLogementId = locataire.logement.id;

    // Mettre a jour et sauvegarder
    Object.assign(locataire, {
      ...rest,
      logement:
        logementId !== undefined
          ? logementId !== null
            ? { id: logementId }
            : null
          : locataire.logement,
    });

    const locataireUpdated = await this.locataireRepository.save(locataire);

    this.locataireEvent.updated({
      locataire: locataireUpdated,
      previousLogementId,
    });

    return locataireUpdated;
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
