import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchLocataireDto extends PageOptionsDto {
  @ApiProperty({
    description: 'Nom complet du locataire',
    example: 'Jean Dupont',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly fullName?: string;

  @ApiProperty({
    description: 'Adresse e-mail du locataire',
    example: 'jean@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({
    description: 'Numéro de téléphone du locataire',
    example: '+33123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly phone?: string;
}
