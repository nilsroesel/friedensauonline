import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../articles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'article-tile',
  templateUrl: './article-tile.component.html',
  styleUrls: ['./article-tile.component.css']
})
export class ArticleTileComponent implements OnInit {

  @Input()
  public article: Article | undefined;
  constructor(private router: Router) { }

  ngOnInit(): void {}

  openArticle() {
    if (this.article)
    this.router.navigate(['article', encodeURI(this.article.headline)]);
  }



}
