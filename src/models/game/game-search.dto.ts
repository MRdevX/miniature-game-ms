import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseEntitySearchDto } from '@root/app/common/base/base-search.dto';
import { GameDto } from './game.dto';
import { IRelation } from '@root/app/common/base/relation.interface';

export class GameSearchDto extends BaseEntitySearchDto<GameDto> {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => Number(value))
  @ApiPropertyOptional()
  limit = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  @ApiPropertyOptional()
  offset = 0;

  get selectFields(): (keyof GameDto)[] {
    return [];
  }

  get relations(): string[] | IRelation<GameDto>[] {
    return ['publisher'];
  }
}
