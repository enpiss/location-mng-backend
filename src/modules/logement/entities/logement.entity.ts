import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../user/entities/user.entity';
import { Locataire } from '../../locataire/entities/locataire.entity';

@Entity({ name: 'logements' })
export class Logement extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.proprieteLogements, { nullable: false })
  owner: User;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  rentAmount: number;

  @Column()
  rentDueDay: number; // Ex : 5 pour le 5 du mois

  @OneToMany(() => Locataire, (locataire) => locataire.logement, {
    nullable: true,
    cascade: true,
  })
  locataires: Locataire[];

  @Column({ default: true })
  isActive: boolean;
}
