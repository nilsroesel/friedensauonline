import { Component, OnInit } from '@angular/core';
import { Article, ArticlesService } from '../articles.service';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-articles-by-categories',
  templateUrl: './articles-by-keywords.component.html',
  styleUrls: ['./articles-by-keywords.component.css']
})
export class ArticlesByKeywordsComponent implements OnInit {

  articles$: Observable<Array<Article>> = new ReplaySubject();
  category$: ReplaySubject<string> = new ReplaySubject();

  constructor(activeRoute: ActivatedRoute, articlesService: ArticlesService) {
    activeRoute.params.subscribe(params => {
      const category = params['topic'];
      this.articles$ = articlesService.getArticlesByCategory(category);
      this.category$.next(category);
    });
  }

  ngOnInit(): void {
  }

}
