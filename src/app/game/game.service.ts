import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublisherDto } from '@root/models/publisher/publisher.dto';
import { MiniatureGameErrors } from '@root/app/core/constants/miniature-game.errors';
import { CrudService } from '@root/app/core/crud/crud.service';
import { Game } from './game.entity';

@Injectable()
export class GameService extends CrudService<Game> {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {
    super(gameRepository);
  }

  async getGameById(gameId: string, relations?: string[]): Promise<Game> {
    const game = await this.gameRepository.findOne(gameId, {
      relations,
    });
    if (!game) {
      throw new NotFoundException(MiniatureGameErrors.Game.NotFound);
    }
    return game;
  }

  async getPublisherByGameId(gameId: string): Promise<PublisherDto> {
    const { publisher } = await this.getGameById(gameId, ['publisher']);
    if (!publisher) {
      throw new NotFoundException(MiniatureGameErrors.Publisher.NotFound);
    }
    return publisher;
  }
}
