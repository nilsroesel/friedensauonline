import * as moment from 'moment';
import { Moment } from 'moment';

export function createMoment(dateString: string): Moment {
  return moment(String(dateString), 'YYYY-MM-DD');
}

