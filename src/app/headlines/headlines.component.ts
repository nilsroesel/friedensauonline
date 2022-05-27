import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article, ArticlesService } from '../articles.service';
import { ReplaySubject } from 'rxjs';
import { createMoment } from '../../helpers';
import { Moment } from 'moment';

@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css']
})
export class HeadlinesComponent implements OnInit {

  articles$: ReplaySubject<Array<Article>> = new ReplaySubject();
  date$: ReplaySubject<Moment> = new ReplaySubject();

  constructor(activeRoute: ActivatedRoute, articlesService: ArticlesService) {
    activeRoute.params.subscribe(params => {
      const selectedMoment = createMoment(params['date']);
      this.articles$ = articlesService.getArticlesByDate(selectedMoment);
      this.date$.next(selectedMoment);
    });
  }

  ngOnInit(): void {
  }

}
