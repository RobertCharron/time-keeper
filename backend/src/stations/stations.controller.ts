import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new station' })
  @ApiResponse({ status: 201, description: 'Station created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.create(createStationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stations' })
  @ApiResponse({ status: 200, description: 'Return all stations' })
  findAll() {
    return this.stationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a station by id' })
  @ApiResponse({ status: 200, description: 'Return the station' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  findOne(@Param('id') id: string) {
    return this.stationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a station' })
  @ApiResponse({ status: 200, description: 'Station updated successfully' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationsService.update(id, updateStationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a station' })
  @ApiResponse({ status: 200, description: 'Station deleted successfully' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  remove(@Param('id') id: string) {
    return this.stationsService.remove(id);
  }
}
