import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ArticlesService, TickerValue } from '../articles.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {

  tickerValues$: Observable<Array<TickerValue>> = of([] as Array<TickerValue>)

  constructor(private articlesService: ArticlesService) {
    this.tickerValues$ = articlesService.getTicker()
      .pipe(map(tickerValues => tickerValues.filter(t => t.date.diff(moment(), 'days') === 0)));
  }

  ngOnInit(): void {
  }

}
