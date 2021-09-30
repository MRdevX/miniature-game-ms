import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from '../core/crud/crud.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';
import { UpdateResult } from 'typeorm';
import { GameSearchDto } from '../../models/game/game.search.dto';

@Controller('games')
@ApiTags('Game')
export class GameController extends CrudController<GameDto> {
  constructor(private readonly gameService: GameService) {
    super(gameService);
  }
}
