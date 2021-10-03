import moment from 'moment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  getDuration(date: Date): number {
    const starts = moment(date);
    const ends = moment();
    const duration = moment.duration(ends.diff(starts));
    return duration.months();
  }
}
