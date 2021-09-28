import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from '../core/crud/crud.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Controller('games')
@ApiTags('Game')
export class GameController extends CrudController<Game> {
  constructor(private readonly gameService: GameService) {
    super(gameService);
  }
}
