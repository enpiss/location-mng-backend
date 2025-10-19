import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "Le nom complet de l'utilisateur",
    example: 'John Doe',
  })
  @IsString()
  fullName!: string;

  @ApiProperty({
    description: "L'adresse email de l'utilisateur",
    example: 'exemple@email.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "Le mot de passe de l'utilisateur",
    example: 'motdepasse123',
  })
  @IsString({
    message: 'Le mot de passe doit être une chaîne de caractères',
  })
  password!: string;
  @IsString({
    message: 'Le numéro de téléphone doit être une chaîne de caractères',
  })
  phone!: string;
}
