import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '@root/app/core/crud/crud.service';
import { Publisher } from './publisher.entity';
import { MiniatureGameErrors } from '../core/constants/miniature-game.errors';

@Injectable()
export class PublisherService extends CrudService<Publisher> {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {
    super(publisherRepository);
  }

  async getPublisherById(publisherId: string, relations?: string[]): Promise<Publisher> {
    const publisher = await this.publisherRepository.findOne(publisherId, {
      relations,
    });
    if (!publisher) {
      throw new NotFoundException(MiniatureGameErrors.Publisher.NotFound);
    }
    return publisher;
  }
}
