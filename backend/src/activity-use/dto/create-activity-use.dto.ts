import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityUseDto {
  @ApiProperty({ example: '2024-01-01T10:00:00Z' })
  startTime: Date;

  @ApiProperty({ example: '2024-01-01T11:00:00Z' })
  endTime: Date;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  activityId: string;
}
