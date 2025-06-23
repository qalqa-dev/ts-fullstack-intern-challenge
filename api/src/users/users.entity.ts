import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Логин пользователя',
    example: 'user123',
    required: true,
  })
  @Column({ unique: true })
  login: string;

  @ApiProperty({
    description: 'Хэш пароля',
    example: 'a1b2c3d4e5...',
    required: true,
  })
  @Column()
  passwordHash: string;
}
