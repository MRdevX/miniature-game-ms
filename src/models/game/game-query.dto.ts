import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityQueryDto } from '../../app/common/base/base-query.dto';
import { GameDto } from './game.dto';

export class GameQueryDto extends BaseEntityQueryDto<GameDto> {
  @ApiPropertyOptional()
  get selectFields(): (keyof GameDto)[] {
    return [];
  }
}
