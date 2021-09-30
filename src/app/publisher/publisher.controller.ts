import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from '@root/app/core/crud/crud.controller';
import { Publisher } from './publisher.entity';
import { PublisherService } from './publisher.service';

@Controller('publishers')
@ApiTags('Publisher')
export class PublisherController extends CrudController<Publisher> {
  constructor(private readonly publisherService: PublisherService) {
    super(publisherService);
  }
}
