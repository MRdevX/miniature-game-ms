import { Game } from '@root/app/game/game.entity';
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Min, Max, IsString, IsIn, IsArray } from 'class-validator';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BaseEntitySearchDto } from '../../app/common/base/base-search.dto';
import { IGame } from './game.model';

export class GameSearchDto extends BaseEntitySearchDto<Game> {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => Number(value))
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset: number = 0;
}
