import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublisherDto } from '@root/models/publisher/publisher.dto';
import { MiniatureGameErrors } from '@root/app/core/constants/miniature-game.errors';
import { CrudService } from '@root/app/core/crud/crud.service';
import { Game } from './game.entity';
import { PublisherService } from '../publisher/publisher.service';
import { CreateGameDto, GameDto } from '@root/models/game/game.dto';

@Injectable()
export class GameService extends CrudService<Game> {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly publisherService: PublisherService,
  ) {
    super(gameRepository);
  }

  async createGameWithPublisher(gameData: CreateGameDto): Promise<GameDto> {
    const { publisher: publisherDetails, ...gameDetails } = gameData;
    const gameFound = await this.gameRepository.findOne({ title: gameDetails.title });
    if (gameFound) {
      throw new BadRequestException(MiniatureGameErrors.Game.Exists);
    }
    const publisherFound = await this.publisherService.findOne({ name: publisherDetails.name });
    if (publisherFound) {
      throw new BadRequestException(MiniatureGameErrors.Publisher.Exists);
    }
    const publisher = await this.publisherService.create(publisherDetails);
    const newGame = await this.gameRepository.save({ ...gameDetails, publisher });
    return newGame;
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
