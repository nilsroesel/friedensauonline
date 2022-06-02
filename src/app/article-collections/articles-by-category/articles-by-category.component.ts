import { Component, OnInit } from '@angular/core';
import { Article, ArticlesService } from '../../articles.service';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-articles-by-categories',
  templateUrl: './articles-by-category.component.html',
  styleUrls: ['./articles-by-category.component.css']
})
export class ArticlesByCategoryComponent implements OnInit {

  articles$: Observable<Array<Article>> = new ReplaySubject();
  category$: ReplaySubject<string> = new ReplaySubject();

  constructor(activeRoute: ActivatedRoute, articlesService: ArticlesService) {
    activeRoute.params.subscribe(params => {
      const category = params['category'];
      this.articles$ = articlesService.getArticlesByCategory(category);
      this.category$.next(category);
    });
  }

  ngOnInit(): void {
    scrollTo(0,0);
  }

}
