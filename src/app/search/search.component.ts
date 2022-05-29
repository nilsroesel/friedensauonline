import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Article, ArticlesService } from '../articles.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('searchField')
  searchInput: ElementRef | undefined;

  searchPhrase$: ReplaySubject<string> = new ReplaySubject<string>()

  articles$: Observable<Array<Article>> = new ReplaySubject();

  searchPhrase: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private articlesService: ArticlesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    scrollTo(0, 0);
    this.activatedRoute.queryParams.subscribe(params => {
      const searchPhrase = params['searchPhrase'];
      this.searchPhrase$.next(searchPhrase);
      this.searchPhrase = searchPhrase;
      this.articles$ = this.articlesService.searchArticles(searchPhrase);
    });
  }

  search() {
    const searchPhrase = this.searchInput?.nativeElement.value;
    this.router.navigate(['search'], { queryParams: { searchPhrase } })
  }

  clearInput() {
    this.searchPhrase = '';
  }

}
