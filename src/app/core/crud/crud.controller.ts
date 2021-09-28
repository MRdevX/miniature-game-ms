import { Get, Post, Delete, Body, Param, Patch, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { BaseEntitySearchDto } from '@root/app/common/base/base-search.dto';
import { ICrudService } from './crud.service.model';

export class CrudController<T> {
  constructor(private readonly crudService: ICrudService<T>) {}

  @ApiOperation({ summary: 'Search paginated' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Found records' })
  @Get()
  async search(@Query() options?: BaseEntitySearchDto<T>, ...args: any[]): Promise<{ items: T[]; total: number }> {
    return this.crudService.search(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a record by Id.' })
  @ApiResponse({ status: 200, description: 'Entity retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Entity does not exist' })
  async findById(@Param('id') id: string): Promise<T> {
    return this.crudService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a record.' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() entity: T): Promise<T> {
    return this.crudService.create(entity);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing record.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 200, description: 'Entity updated successfully.' })
  async update(@Param('id') id: string, @Body() entity: T): Promise<UpdateResult | T> {
    return this.crudService.update(id, entity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a record.' })
  @ApiResponse({ status: 200, description: 'Entity deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.crudService.delete(id);
  }
}
