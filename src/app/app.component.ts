import { Component, OnInit } from '@angular/core';
import { ArticlesService } from './articles.service';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FS Online';

  constructor( private articlesService: ArticlesService, private calendarService: CalendarService ) {
    this.articlesService.loadArticles().then();
    this.articlesService.loadTicker().then();
    this.calendarService.loadCalendar().then();
  }

  ngOnInit() {
  }


}
