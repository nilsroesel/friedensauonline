import { Component, OnInit } from '@angular/core';
import { Article, ArticlesService } from './articles.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FS Online';

  constructor( private articlesService: ArticlesService ) {
    this.articlesService.loadArticles().then();
  }

  ngOnInit() {
  }


}
