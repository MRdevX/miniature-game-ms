import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGameDto, GameDto, UpdateGameDto } from '@root/models/game/game.dto';
import { CrudController } from '@root/app/core/crud/crud.controller';
import { GameService } from './game.service';
import { UpdateResult } from 'typeorm';

@Controller('games')
@ApiTags('Game')
export class GameController extends CrudController<GameDto> {
  constructor(private readonly gameService: GameService) {
    super(gameService);
  }

  @ApiOperation({ summary: 'Create a new record' })
  @Post()
  async create(@Body() requestBody: CreateGameDto): Promise<GameDto> {
    const game = await this.gameService.create(requestBody);
    return game;
  }

  @ApiOperation({ summary: 'Update an existing record' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestBody: UpdateGameDto): Promise<UpdateResult> {
    return this.gameService.update(id, requestBody);
  }
}
