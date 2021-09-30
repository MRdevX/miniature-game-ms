import { IsDate, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty, OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IGame } from './game.model';
import { PublisherDto } from '@root/models/publisher/publisher.dto';

export class GameDto implements IGame {
  @IsUUID('4')
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
  @IsString()
  @IsOptional()
  tags: string[];

  @ApiPropertyOptional({
    description: 'Release Date.',
  })
  @IsDate()
  releaseDate: Date;
}

export class UpdateGameDto extends PartialType(OmitType(GameDto, ['id'] as const)) {}
