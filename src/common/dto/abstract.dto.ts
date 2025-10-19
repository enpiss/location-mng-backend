import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class AbstractDto {
  constructor(partial: Partial<AbstractDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Identifiant unique' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Date de création', required: false })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour', required: false })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Date de suppression', required: false })
  @Expose()
  deletedAt?: Date;
}
