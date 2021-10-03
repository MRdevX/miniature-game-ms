import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrudController } from '@root/app/core/crud/crud.controller';
import { UpdateResult } from 'typeorm';
import { CreatePublisherDto, PublisherDto, UpdatePublisherDto } from '@root/models/publisher/publisher.dto';
import { PublisherService } from './publisher.service';

@Controller('publishers')
@ApiTags('Publisher')
export class PublisherController extends CrudController<PublisherDto> {
  constructor(private readonly publisherService: PublisherService) {
    super(publisherService);
  }

  @ApiOperation({ summary: 'Create a new record' })
  @Post()
  async create(@Body() requestBody: CreatePublisherDto): Promise<PublisherDto> {
    const publisher = await this.publisherService.create(requestBody);
    return publisher;
  }

  @ApiOperation({ summary: 'Update an existing record' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestBody: UpdatePublisherDto): Promise<UpdateResult> {
    return this.publisherService.update(id, requestBody);
  }
}
