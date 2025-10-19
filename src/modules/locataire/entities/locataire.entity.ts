import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../user/entities/user.entity';
import { Logement } from '../../logement/entities/logement.entity';
import { Paiement } from '../../paiement/entities/paiement.entity';

@Entity({ name: 'locataires' })
export class Locataire extends AbstractEntity {
  @Column()
  fullName: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  // Propriétaire relation (Many-to-One)
  @ManyToOne(() => User, (user) => user.locataires, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn()
  proprietaire: User;

  // Logement relation (Many-to-One)
  @ManyToOne(() => Logement, (logement) => logement.locataires, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  logement: Logement;

  @OneToMany(() => Paiement, (paiement) => paiement.locataire, {
    cascade: true,
  })
  paiements: Paiement[];
}
