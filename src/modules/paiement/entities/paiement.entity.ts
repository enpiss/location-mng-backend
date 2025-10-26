import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Locataire } from '../../locataire/entities/locataire.entity';
import { AffectationPaiement } from '../../echeances-loyer/entities/affectation-paiement.entity';

@Entity({ name: 'paiements' })
export class Paiement extends AbstractEntity {
  @ManyToOne(() => Locataire, (locataire) => locataire.paiements, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  locataire: Locataire;

  @OneToMany(() => AffectationPaiement, (affectation) => affectation.Paiement, {
    onDelete: 'SET NULL',
  })
  affectationsPaiement: AffectationPaiement[];

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  paidAt: string;

  @Column({ length: 7 })
  monthKey: string;

  @Column({ nullable: true })
  note: string;
}
