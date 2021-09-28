import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGameDto, UpdateGameDto } from '@root/models/game/game.dto';
import { CrudController } from '@root/app/core/crud/crud.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';
import { UpdateResult } from 'typeorm';

@Controller('games')
@ApiTags('Game')
export class GameController extends CrudController<Game> {
  constructor(private readonly gameService: GameService) {
    super(gameService);
  }

  @ApiOperation({ summary: 'Create a new record' })
  @Post()
  async create(@Body() entity: CreateGameDto): Promise<Game> {
    return this.gameService.create(entity);
  }

  @ApiOperation({ summary: 'Update an existing record' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() entity: UpdateGameDto): Promise<UpdateResult> {
    return this.gameService.update(id, entity);
  }
}
