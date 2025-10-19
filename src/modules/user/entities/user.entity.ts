import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Locataire } from '../../locataire/entities/locataire.entity';
import { Logement } from '../../logement/entities/logement.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Locataire, (locataire) => locataire.proprietaire, {
    nullable: true,
    cascade: true,
  })
  locataires: Locataire[];

  @OneToMany(() => Logement, (logement) => logement.owner, {
    nullable: true,
    cascade: true,
  })
  proprieteLogements: Logement[];
}
