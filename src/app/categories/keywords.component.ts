import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ArticlesService } from '../articles.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css']
})
export class KeywordsComponent implements OnInit {

  categories$: Observable<Array<string>> = new ReplaySubject();

  constructor(private articlesService: ArticlesService) {
    this.categories$ = articlesService.getArticlesOrderedByCategory().pipe(map(holder => Object.keys(holder)));
  }

  ngOnInit(): void {
  }

}
