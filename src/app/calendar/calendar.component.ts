import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createMoment } from '../../helpers';
import { CalendarEntry, CalendarService } from '../calendar.service';
import { Observable, ReplaySubject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarEntriesFromToday$: Observable<Array<CalendarEntry>> = new ReplaySubject();
  private currentHour = moment().hour();

  constructor(private activatedRoute: ActivatedRoute, private calendarService: CalendarService) {
    this.activatedRoute.queryParams.subscribe(params => {
      const date = createMoment(params['date']);
      this.calendarEntriesFromToday$  = calendarService.getCalendarEntriesFromDay(date);
    });
  }

  ngOnInit(): void {
  }

}
