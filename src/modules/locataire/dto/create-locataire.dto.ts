import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLocataireDto {
  @ApiProperty({
    description: 'Le nom complet du locataire',
    example: 'John Doe',
  })
  @IsString({
    message: 'Le nom complet doit être une chaîne de caractères',
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: "L'email du locataire",
    example: 'exemple@exemple.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Le numéro de téléphone du locataire',
    example: '1234567890',
  })
  @IsString({
    message: 'Le numéro de téléphone doit être une chaîne de caractères',
  })
  phone: string;

  @ApiProperty({
    description: 'Proprietaire ID associated with the tenant',
    example: 'uuid-of-proprietaire',
  })
  @IsUUID('4', { message: 'Le proprietaireId doit être un UUID valide' })
  proprietaireId: string;

  @ApiProperty({
    description: 'Logement ID associated with the tenant',
    example: 'uuid-of-logement',
  })
  @IsUUID('4', { message: 'Le logementId doit être un UUID valide' })
  logementId?: string = undefined;
}
