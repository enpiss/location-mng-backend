import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEcheancesLoyerDto } from './dto/create-echeances-loyer.dto';
import { UpdateEcheancesLoyerDto } from './dto/update-echeances-loyer.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Between, In, IsNull, Not, Repository } from 'typeorm';
import {
  EcheanceLoyer,
  EcheanceStatus,
} from './entities/echeances-loyer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Locataire } from '../locataire/entities/locataire.entity';
import { SearchEcheanceLoyerDto } from './dto/search-echeance-loyer.dto';

@Injectable()
export class EcheancesLoyerService {
  private readonly logger = new Logger(EcheancesLoyerService.name);

  constructor(
    @InjectRepository(EcheanceLoyer)
    private readonly echeanceLoyerRepository: Repository<EcheanceLoyer>,
    @InjectRepository(Locataire)
    private readonly locataireRepository: Repository<Locataire>,
  ) {}

  async create(createEcheancesLoyerDto: CreateEcheancesLoyerDto) {
    this.logger.log(
      'Nouvelle échéance de loyer : ' + JSON.stringify(createEcheancesLoyerDto),
    );

    const locataire = await this.locataireRepository.findOne({
      where: { id: createEcheancesLoyerDto.locataireId },
    });

    if (!locataire) {
      throw new NotFoundException(
        `Locataire ${createEcheancesLoyerDto.locataireId} introuvable`,
      );
    }

    const echeance: EcheanceLoyer = new EcheanceLoyer();

    echeance.amountDue = createEcheancesLoyerDto.amountDue;
    echeance.amountPaid = createEcheancesLoyerDto.amountPaid;
    echeance.monthKey = createEcheancesLoyerDto.monthKey;
    echeance.locataire = locataire;

    this.logger.debug({
      message: "Préparation de l'échéance de loyer à créer ou mettre à jour",
      echeance: echeance,
    });

    // const result = await this.echeanceLoyerRepository.upsert(echeance, {
    //   conflictPaths: ['monthKey', 'locataire'],
    //   skipUpdateIfNoValuesChanged: false,
    // });

    const result = await this.echeanceLoyerRepository
      .createQueryBuilder()
      .insert()
      .into(EcheanceLoyer)
      .values(echeance)
      .orUpdate(['amountDue', 'amountPaid'], ['monthKey', 'locataireId'], {
        overwriteCondition: {
          where: 'amountDue <> :amountDue OR amountPaid <> :amountPaid',
          parameters: {
            amountDue: echeance.amountDue,
            amountPaid: echeance.amountPaid,
          },
        },
      })
      .execute();

    const echeanceResult = await this.findOne(
      result.generatedMaps[0].id as string,
    );

    this.logger.debug({
      message: 'Échéance de loyer créée ou mise à jour',
      echeance: echeanceResult,
    });

    return echeanceResult;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async cronCreateEcheancesLoyer() {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    this.logger.log(
      ` Cron job: Creation échéances loyer mois ${currentMonth}...`,
    );

    const locataires = await this.locataireRepository.find({
      relations: ['logement'],
      where: {
        logement: Not(IsNull()),
      },
    });

    for (const locataire of locataires) {
      void this.create({
        amountDue: locataire.logement.rentAmount,
        amountPaid: 0,
        locataireId: locataire.id,
        monthKey: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`,
      });
      this.logger.log('Échéance créée pour locataire ' + locataire.fullName);
    }
  }

  findAll(searchEcheanceLoyerDto: SearchEcheanceLoyerDto) {
    const {
      skip,
      limit = 10,
      orderBy = 'monthKey',
      order = 'DESC',
    } = searchEcheanceLoyerDto;
    return this.echeanceLoyerRepository.find({
      relations: ['locataire'],
      order: { [orderBy]: order },
      where: {
        ...(searchEcheanceLoyerDto.locataireId && {
          locataire: { id: searchEcheanceLoyerDto.locataireId },
        }),
        ...(searchEcheanceLoyerDto.monthKey && {
          monthKey: searchEcheanceLoyerDto.monthKey,
        }),
        ...(searchEcheanceLoyerDto.minAmountDue !== undefined ||
        searchEcheanceLoyerDto.maxAmountDue !== undefined
          ? {
              amountDue: Between(
                searchEcheanceLoyerDto.minAmountDue ?? 0,
                searchEcheanceLoyerDto.maxAmountDue ?? Number.MAX_SAFE_INTEGER,
              ),
            }
          : {}),
        ...(searchEcheanceLoyerDto.status && {
          status: In(searchEcheanceLoyerDto.status),
        }),
      },
      skip: skip,
      take: limit,
    });
  }

  async findOne(id: string) {
    const echeance = await this.echeanceLoyerRepository.findOne({
      where: { id },
      relations: ['locataire', 'affectationsPaiement'],
    });
    if (!echeance) throw new NotFoundException(`Échéance ${id} introuvable`);
    return echeance;
  }

  async update(id: string, updateEcheancesLoyerDto: UpdateEcheancesLoyerDto) {
    const echeance = await this.findOne(id);

    if (updateEcheancesLoyerDto.locataireId) {
      const locataire = await this.locataireRepository.findOne({
        where: { id: updateEcheancesLoyerDto.locataireId },
      });
      if (!locataire) {
        throw new NotFoundException(
          `Locataire ${updateEcheancesLoyerDto.locataireId} introuvable`,
        );
      }
      echeance.locataire = locataire;
    }

    // Si le montant payé est mis à jour, ajuster le statut de l'échéance
    if (updateEcheancesLoyerDto.amountPaid !== undefined) {
      echeance.status = this.computeEcheanceStatus(
        echeance.amountDue,
        updateEcheancesLoyerDto.amountPaid,
      );
    }

    Object.assign(echeance, updateEcheancesLoyerDto);

    const updated = await this.echeanceLoyerRepository.update(
      id,
      updateEcheancesLoyerDto,
    );

    if (updated.affected && updated.affected > 0) {
      return this.findOne(id);
    }

    throw new NotFoundException(`Échéance ${id} introuvable`);
  }

  async remove(id: string) {
    const result = await this.echeanceLoyerRepository.softDelete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Échéance ${id} introuvable`);
    return { deleted: true };
  }

  async affectationPaiement(id: string, amountPaid: number) {
    const echeance = await this.findOne(id);
    echeance.amountPaid += amountPaid;
    echeance.status = this.computeEcheanceStatus(
      echeance.amountDue,
      echeance.amountPaid,
    );
    return this.echeanceLoyerRepository.save(echeance);
  }

  computeEcheanceStatus(amountDue: number, amountPaid: number): EcheanceStatus {
    if (amountPaid >= amountDue) {
      return EcheanceStatus.PAID;
    } else if (amountPaid > 0) {
      return EcheanceStatus.PARTIAL;
    }
    return EcheanceStatus.DUE;
  }
}
