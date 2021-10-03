import { TestingModule, Test } from '@nestjs/testing';
import { PublisherController } from '@root/app/publisher/publisher.controller';

describe('PublisherController', () => {
  let controller: PublisherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherController],
    }).compile();

    controller = module.get<PublisherController>(PublisherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
