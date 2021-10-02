import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Repository,
  BaseEntity,
  DeepPartial,
  DeleteResult,
  UpdateResult,
  FindOneOptions,
  FindConditions,
} from 'typeorm';
import { ErrorMessage } from '../../common/enum/error-message.enum';
import { ICrudService } from './crud.service.model';

@Injectable()
export class CrudService<T extends BaseEntity> implements ICrudService<T> {
  private readonly entityName = this.genericRepository.metadata.targetName;

  constructor(private readonly genericRepository: Repository<T>) {}

  async getAll(): Promise<T[]> {
    return await this.genericRepository.find();
  }

  async getOne(id: string): Promise<T> {
    return await this.genericRepository.findOne(id);
  }

  async create<E extends DeepPartial<T>>(entity: E): Promise<T> {
    return await this.genericRepository.create(entity).save();
  }

  async update(id: string, entity: DeepPartial<T>): Promise<UpdateResult> {
    return await this.genericRepository.update(id, entity);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.genericRepository.delete(id);
  }

  public async findOne(
    id: string | number | FindOneOptions<T> | FindConditions<T>,
    options?: FindOneOptions<T>,
  ): Promise<T> {
    const result = await this.genericRepository.findOne(id as any, options);
    if (!result) {
      return result;
    }
    return result;
  }

  public async findById(id: string | number, options?: FindOneOptions<T>): Promise<T> {
    if (id) {
      const result: T = await this.findOne(id, options);
      if (result) {
        return result;
      }
    }
    throw new NotFoundException(ErrorMessage.Common.EntityNotFound(this.entityName));
  }
}
