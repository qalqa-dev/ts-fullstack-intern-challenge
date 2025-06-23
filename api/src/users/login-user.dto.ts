import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Логин пользователя',
    example: 'user123',
    required: true,
  })
  login: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'myStrongPassword123',
    required: true,
    minLength: 6,
  })
  password: string;
}
