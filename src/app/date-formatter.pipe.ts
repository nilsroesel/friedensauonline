import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';

@Pipe({
  name: 'momentFormatter'
})
export class MomentFormatterPipe implements PipeTransform {

  transform( date: Moment, format: string ): any {
    if ( date ) {
      return date.locale('DE-de').format(format);
    }
  }
}
