import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageQueueService } from '@root/app/core/messaging/message.queue.service';
import { IMessaging } from '@root/models/messaging/messaging.interface';
import { MessagePayloadDto } from '@root/models/messaging/purge-discount.dto';

@Controller('admin/games')
@ApiTags('Admin')
export class GameAdminController {
  constructor(private readonly messagingQueueService: MessageQueueService) {}

  @ApiOperation({ summary: 'Apply discount to a range of game and remove old ones.' })
  @Post('/discount')
  async triggerPurgeAndDiscount(@Body() messageBody: MessagePayloadDto) {
    const messaging: IMessaging = {
      context: 'discount-and-purge',
      payload: messageBody,
    };
    return this.messagingQueueService.sendMessage(messaging);
  }
}
