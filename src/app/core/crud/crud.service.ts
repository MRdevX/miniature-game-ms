import { Injectable } from '@nestjs/common';
import { Repository, BaseEntity, DeepPartial, DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class CrudService<T extends BaseEntity> {
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
}
