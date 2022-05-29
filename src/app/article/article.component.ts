import { Component, Input, OnInit } from '@angular/core';
import { Article, ArticlesService, DEFAULT_ARTICLE, TextBlock } from '../articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input()
  public article$: Observable<Article> = new ReplaySubject();

  constructor( private route: ActivatedRoute, private articlesService: ArticlesService, private router: Router ) {
    this.route.params.subscribe((params) => {
      this.article$ = this.articlesService.getArticle((params as any).title || '');
    });
  }

  ngOnInit(): void {
    scrollTo(0,0);
  }

  navigateToKeyword( keyword: string ) {
    this.router.navigate(['topics', keyword])
  }

}
