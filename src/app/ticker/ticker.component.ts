import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {

  tickerValues: Observable<Array<string>> = of([
    'Hier könnte Ihre Werbng stehen',
    'Die Friedensau ist jetzt auch online verfügbar'
  ])

  constructor() { }

  ngOnInit(): void {
  }

}
