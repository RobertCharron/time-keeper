import { PartialType } from '@nestjs/swagger';
import { CreateActivityUseDto } from './create-activity-use.dto';

export class UpdateActivityUseDto extends PartialType(CreateActivityUseDto) {}
