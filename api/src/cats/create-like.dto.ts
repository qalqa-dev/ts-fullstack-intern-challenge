import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({
    description: 'Идентификатор котика из cat api',
    example: '1',
    required: true,
  })
  cat_id: string;
}
