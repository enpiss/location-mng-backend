import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Paiement } from '../../paiement/entities/paiement.entity';
import { EcheanceLoyer } from './echeances-loyer.entity';

@Entity({ name: 'affectations_paiement' })
export class AffectationPaiement extends AbstractEntity {
  @ManyToOne(() => EcheanceLoyer, (echeance) => echeance.affectationsPaiement, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  echeanceLoyer: EcheanceLoyer;

  @ManyToOne(() => Paiement, (paiement) => paiement.affectationsPaiement, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  paiement: Paiement;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
}
