import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';

export class UserDto extends AbstractDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @Expose()
  fullName: string;

  @ApiProperty({
    example: '0102030405',
    description: 'The phone number of the user',
  })
  @Expose()
  phone: string;

  @ApiProperty({
    example: 'exemple@exemple.com',
    description: 'The email address of the user',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: 'The hashed password of the user',
  })
  @Exclude()
  password: string;
}
