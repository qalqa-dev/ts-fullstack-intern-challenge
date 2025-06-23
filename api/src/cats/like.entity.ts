import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @ApiProperty({
    description: 'Уникальный идентификатор понравившегося кота',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'id кота с cat api',
    example: '1',
    required: true,
  })
  @Column()
  cat_id: string;

  @ApiProperty({
    description: 'Временной таймстемп',
    example: '2023-01-01 00:00:00',
    required: true,
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  userId: string;
}
