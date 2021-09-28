import { Get, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseEntity, DeleteResult, UpdateResult } from 'typeorm';
import { ICrudService } from './crud.service.model';

export class CrudController<T extends BaseEntity> {
  constructor(private readonly crudService: ICrudService<T>) {}

  @Get()
  @ApiOperation({ summary: 'List all records.' })
  @ApiResponse({ status: 200, description: 'Ok' })
  async findAll(): Promise<T[]> {
    return this.crudService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a record by Id.' })
  @ApiResponse({ status: 200, description: 'Entity retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Entity does not exist' })
  async findById(@Param('id') id: string): Promise<T> {
    return this.crudService.getOne(id);
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
  async update(@Param('id') id: string, @Body() entity: T): Promise<UpdateResult> {
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
