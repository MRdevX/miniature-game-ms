import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { IMessagePayload } from './message.payload';

export class MessagePayloadDto implements IMessagePayload {
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiPropertyOptional({ description: 'Price Discount Percentage', default: 20 })
  discountPercentage: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'Discount games with release date older than?', default: 12 })
  discountStartMonth: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'Discount games with release date newer than?', default: 18 })
  discountEndMonth: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'Remove games with release date older than?', default: 18 })
  deleteOlderThan: number;
}
