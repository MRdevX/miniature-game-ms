import { IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IPublisher } from '@root/models/publisher/publisher.model';

export class PublisherDto implements IPublisher {
  @IsUUID('4')
  id?: string;

  @ApiProperty({
    description: 'Publisher Name.',
    example: 'Rockstar Games',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Publisher SIRET.',
    example: 'RCS PARIS 453 983 245',
  })
  @IsString()
  siret: string;

  @ApiProperty({
    description: 'Publisher Phone Number.',
    example: '02077512555',
  })
  @IsPhoneNumber()
  phone: string;
}

export class UpdatePublisherDto extends PartialType(OmitType(PublisherDto, ['id', 'siret'] as const)) {}
