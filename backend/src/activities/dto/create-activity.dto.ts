import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ example: 'Running' })
  name: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  stationId: string;
}
