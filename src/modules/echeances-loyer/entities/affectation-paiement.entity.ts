import { AbstractEntity } from '../../../common/abstract.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Paiement } from '../../paiement/entities/paiement.entity';
import { EcheanceLoyer } from './echeances-loyer.entity';

@Entity({ name: 'affectations_paiement' })
export class AffectationPaiement extends AbstractEntity {
  @ManyToOne(() => EcheanceLoyer, (echeance) => echeance.affectationsPaiement, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  EcheanceLoyer: EcheanceLoyer;

  @ManyToOne(() => Paiement, (paiement) => paiement.affectationsPaiement, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  Paiement: Paiement;

  @ManyToOne(() => Paiement, (paiement) => paiement.affectationsPaiement, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  amount: number;
}
