import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGameDto, GameDto, UpdateGameDto } from '@root/models/game/game.dto';
import { CrudController } from '@root/app/core/crud/crud.controller';
import { GameService } from './game.service';
import { UpdateResult } from 'typeorm';
import { GameSearchDto } from '@root/models/game/game-query.dto';

@Controller('games')
@ApiTags('Game')
export class GameController extends CrudController<GameDto> {
  constructor(private readonly gameService: GameService) {
    super(gameService);
  }

  @ApiOperation({ summary: 'Search paginated' })
  @Get()
  async search(@Query() query?: GameSearchDto): Promise<{ items: GameDto[]; total: number }> {
    return this.gameService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a record by Id.' })
  async findById(@Param('id') id: string, @Query() query?: GameSearchDto): Promise<GameDto> {
    console.log(query);
    return this.gameService.findById(id);
  }

  @ApiOperation({ summary: 'Create a new record' })
  @Post()
  async create(@Body() requestBody: CreateGameDto): Promise<GameDto> {
    const game = await this.gameService.createGameWithPublisher(requestBody);
    return game;
  }

  @ApiOperation({ summary: 'Update an existing record' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestBody: UpdateGameDto): Promise<UpdateResult> {
    return this.gameService.update(id, requestBody);
  }
}
