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
      const keyword = params['topic'];
      this.articles$ = articlesService.getArticlesByKeyword(keyword);
      this.category$.next(keyword);
    });
  }

  ngOnInit(): void {
  }

}
