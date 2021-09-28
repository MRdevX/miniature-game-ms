import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '@root/app/core/crud/crud.service';
import { Publisher } from './publisher.entity';

@Injectable()
export class PublisherService extends CrudService<Publisher> {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {
    super(publisherRepository);
  }
}
