import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class LocataireDto extends AbstractDto {
  @ApiProperty({
    description: 'Le nom complet du locataire',
    example: 'John Doe',
  })
  @IsString({
    message: 'Le nom complet doit être une chaîne de caractères',
  })
  @IsNotEmpty()
  @Expose()
  fullName: string;

  @ApiProperty({
    description: "L'email du locataire",
    example: 'exemple@exemple.com',
  })
  @IsString()
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Date de debut du bail du locataire',
    example: '2023-01-01',
  })
  @IsString()
  @Expose()
  @Type(() => Date)
  startDate: string;

  @ApiProperty({
    description: 'Date de fin du bail du locataire',
    example: '2024-01-01',
  })
  @IsString()
  @Expose()
  @Type(() => Date)
  endDate: string;

  @ApiProperty({
    description: 'Le numéro de téléphone du locataire',
    example: '1234567890',
  })
  @IsString()
  @Expose()
  phone: string;

  @ApiProperty({
    description: 'Proprietaire ID associated with the tenant',
    example: 'uuid-of-proprietaire',
  })
  @IsUUID()
  @Expose()
  proprietaireId: string;
}
