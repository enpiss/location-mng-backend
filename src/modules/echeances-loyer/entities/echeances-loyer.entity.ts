import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { Locataire } from '../../locataire/entities/locataire.entity';
import { AffectationPaiement } from './affectation-paiement.entity';

export enum EcheanceStatus {
  DUE = 'DUE',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

@Entity({ name: 'echeances_loyer' })
@Index(['locataire', 'monthKey'], { unique: true })
export class EcheanceLoyer extends AbstractEntity {
  @ManyToOne(() => Locataire, (locataire) => locataire.echeanceLoyer, {
    onDelete: 'SET NULL',
  })
  locataire: Locataire;

  @OneToMany(
    () => AffectationPaiement,
    (affectation) => affectation.echeanceLoyer,
    {
      onDelete: 'SET NULL',
    },
  )
  affectationsPaiement: AffectationPaiement[];

  @Column({ length: 7, comment: 'Format YYYY-MM' })
  monthKey: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amountDue: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({
    type: 'enum',
    enum: EcheanceStatus,
    default: EcheanceStatus.DUE,
  })
  status: EcheanceStatus;
}
