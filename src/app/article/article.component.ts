import { Component, Input, OnInit } from '@angular/core';
import { Article, ArticlesService, DEFAULT_ARTICLE, TextBlock } from '../articles.service';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input()
  public article$: ReplaySubject<Article> = new ReplaySubject();

  constructor( private route: ActivatedRoute, private articlesService: ArticlesService ) {
    this.route.params.subscribe((params) => {
      this.article$ = this.articlesService.getArticle((params as any).title || '');
    });
  }

  ngOnInit(): void {
    scrollTo(0,0);
  }

}
