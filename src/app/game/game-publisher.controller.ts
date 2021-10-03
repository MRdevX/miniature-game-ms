import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublisherDto } from '@root/models/publisher/publisher.dto';
import { GameService } from './game.service';

@Controller('games/:gameId/publisher')
@ApiTags('Game')
export class GamePublisherController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: 'Retrieve publisher by game id.' })
  @Get()
  async getPublisher(@Param('gameId') gameId: string): Promise<PublisherDto> {
    return this.gameService.getPublisherByGameId(gameId);
  }
}
