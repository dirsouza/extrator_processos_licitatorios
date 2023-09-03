import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export class DateHelper {
  static nowUTC(): Date {
    return dayjs.utc().toDate();
  }
}
