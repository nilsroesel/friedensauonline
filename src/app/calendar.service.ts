import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { createMomentWithTime } from '../helpers';
import { ReplaySubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CalendarEntry {
  startDate: Moment;
  endDate: Moment;
  title: string;
  description: string;
}


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  static CALENDAR: string = 'assets/articles/calendar'

  calendarEntries$: ReplaySubject<Array<CalendarEntry>> = new ReplaySubject();

  constructor() { }

  loadCalendar(): Promise<any> {
    return fetch(CalendarService.CALENDAR).then(response => response.status !== 200? null : response.text())
      .then((data: string | null) => {
        if ( data === null ) return;
        const parser = new DOMParser();
        const xmlArticle = parser.parseFromString(data, "application/xml");
        const entries = Array.from(xmlArticle.getElementsByTagName('calendar').item(0)?.getElementsByTagName('entry') || [])
          .map(element => {
            const startDate = createMomentWithTime(element.getAttribute('startDate'));
            const endDate = createMomentWithTime(element.getAttribute('endDate'));
            const title = element.getElementsByTagName('title').item(0)?.innerHTML || '';
            const description = element.getElementsByTagName('description').item(0)?.innerHTML || '';

            return { startDate, endDate, title, description }
          });
        this.calendarEntries$.next(entries);
      });
  }

  getCalendarEntriesFromDay(date: Moment): Observable<Array<CalendarEntry>> {
    return this.calendarEntries$.pipe(map(entries => {
      let e = entries
        .sort((a, b) => a.startDate.diff(b.startDate))
        .filter(e => e.startDate.clone().day() === date.day());
      console.log(e)
      return e;
    }));
  }


}
