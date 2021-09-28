/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Min, Max, IsString, IsIn, IsArray } from 'class-validator';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BaseEntitySearchDto } from '../../app/common/base/base-search.dto';
import { IGame } from './game.model';
import { QueryNarrowingOperators } from '../../app/common/enum/query-operators.enum';
import { IFilterField } from '../../app/common/interface/filter-field.interface';

const sortFields = ['id', 'createdAt', 'updatedAt'];

export class GameSearchDto extends BaseEntitySearchDto<IGame> {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform((value) => Number(value))
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform((value) => Number(value))
  offset: number = 0;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @IsIn(sortFields, { each: true })
  @Type(() => Array)
  sortFields: string[] = ['updatedAt'];

  @IsOptional()
  @IsInt({ each: true })
  @IsIn([-1, 1], { each: true })
  @IsArray()
  sortDirections: number[] = [-1];

  get filterFields(): IFilterField<IGame>[] {
    return [
      {
        name: 'title',
        operation: QueryNarrowingOperators.EQ,
      },
    ];
  }

  get selectFields(): (keyof IGame)[] {
    return [];
  }
}
