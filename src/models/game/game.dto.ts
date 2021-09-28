import { IsArray, IsDate, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty, OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IGame } from './game.model';
import { PublisherDto } from '@root/models/publisher/publisher.dto';
import { Exclude } from 'class-transformer';

export class GameDto implements IGame {
  id?: string;

  @ApiProperty({
    description: 'Game Title.',
    example: 'Red Dead Redemption II',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Game Price (in dollars)',
    example: 50,
  })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiPropertyOptional({
    description: 'Game Publisher.',
  })
  @ValidateNested()
  publisher: PublisherDto;

  @ApiPropertyOptional({
    description: 'Game Tags.',
  })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiPropertyOptional({
    description: 'Release Date.',
  })
  @IsDate()
  releaseDate: Date;
}
export class CreateGameDto extends PartialType(OmitType(GameDto, ['id', 'publisher'] as const)) {}

export class UpdateGameDto extends PartialType(OmitType(GameDto, ['id'] as const)) {}
