import * as moment from 'moment';
import { Moment } from 'moment';

export function createMoment(dateString: string | undefined |null): Moment {
  if ( dateString === undefined || dateString === null ) {
    return moment();
  }
  return moment(String(dateString), 'YYYY-MM-DD');
}

