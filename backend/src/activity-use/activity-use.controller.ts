import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActivityUseService } from './activity-use.service';
import { CreateActivityUseDto } from './dto/create-activity-use.dto';
import { UpdateActivityUseDto } from './dto/update-activity-use.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Activity Use')
@Controller('activity-use')
export class ActivityUseController {
  constructor(private readonly activityUseService: ActivityUseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity use' })
  @ApiResponse({
    status: 201,
    description: 'Activity use created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createActivityUseDto: CreateActivityUseDto) {
    return this.activityUseService.create(createActivityUseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activity uses' })
  @ApiResponse({ status: 200, description: 'Return all activity uses' })
  findAll() {
    return this.activityUseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an activity use by id' })
  @ApiResponse({ status: 200, description: 'Return the activity use' })
  @ApiResponse({ status: 404, description: 'Activity use not found' })
  findOne(@Param('id') id: string) {
    return this.activityUseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an activity use' })
  @ApiResponse({
    status: 200,
    description: 'Activity use updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Activity use not found' })
  update(
    @Param('id') id: string,
    @Body() updateActivityUseDto: UpdateActivityUseDto,
  ) {
    return this.activityUseService.update(id, updateActivityUseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity use' })
  @ApiResponse({
    status: 200,
    description: 'Activity use deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Activity use not found' })
  remove(@Param('id') id: string) {
    return this.activityUseService.remove(id);
  }
}
