import { Component, OnInit } from '@angular/core';
import { Article, ArticlesService } from '../../articles.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './all-articles.component.html',
  styleUrls: ['./all-articles.component.css']
})
export class AllArticlesComponent implements OnInit {

  public articles: Observable<Array<Article>>;

  constructor( private articlesService: ArticlesService ) {
    this.articles = articlesService.getArticles();
  }

  ngOnInit() {
    scrollTo(0,0);
  }

}
