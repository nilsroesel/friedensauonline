import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Article, ArticlesService } from '../articles.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

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
  toggleFilter = false;

  filtersForm : FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articlesService: ArticlesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filtersForm = this.formBuilder.group({
      'searchTimeframe': [],
      'searchContents': []
    });
  }

  ngOnInit(): void {
    scrollTo(0, 0);
    this.activatedRoute.queryParams.subscribe(params => {

      const searchPhrase = params['searchPhrase'];
      const filterTimeframe = params['searchTimeframe'];
      const filterContents = params['searchContents'];
      this.filtersForm.controls['searchContents'].patchValue(filterContents || 'all');
      this.filtersForm.controls['searchTimeframe'].patchValue(filterTimeframe || 'all');
      this.searchPhrase$.next(searchPhrase);
      this.searchPhrase = searchPhrase;
      this.articles$ = this.articlesService.searchArticles(searchPhrase)
        .pipe(map((articles: Array<Article>) => articles
                    .filter(article => {
                      let articleMatchesTimeframe = false;
                      if ( filterTimeframe === 'all' || filterTimeframe === undefined ) {
                        articleMatchesTimeframe = true;
                      }
                      if ( filterTimeframe === 'today' ) {
                        articleMatchesTimeframe = article.metadata.date.diff(moment(), 'days') === 0;
                      } else if ( filterTimeframe === 'older' ) {
                        articleMatchesTimeframe = article.metadata.date.isBefore(moment());
                      }

                      let articleMatchesContent = true;
                      if ( filterContents === 'all' || filterContents === undefined ) {
                        articleMatchesContent = true;
                      } else if ( filterContents === 'author') {
                        articleMatchesContent = article.metadata.author.toLowerCase()
                          .includes(searchPhrase.toLowerCase());
                      } else if ( filterContents === 'headlines') {
                        articleMatchesContent = article.metadata.summary.toLowerCase()
                          .includes(searchPhrase.toLowerCase()) ||
                          article.headline.toLowerCase()
                            .includes(searchPhrase.toLowerCase()) ||
                          article.shortTitle.toLowerCase()
                            .includes(searchPhrase.toLowerCase());
                      }

                      return articleMatchesTimeframe && articleMatchesContent;
                    })
        ));
    });
  }

  search() {
    const searchPhrase = this.searchInput?.nativeElement.value;
    this.router.navigate(['search'], { queryParams: { searchPhrase } })
  }

  clearInput() {
    this.searchPhrase = '';
  }

  resetFilters() {
    this.filtersForm.reset();
    this.updateSearchFilter();
  }

  updateSearchFilter() {
    const searchTimeframe = this.filtersForm.controls['searchTimeframe'].value;
    const searchContents = this.filtersForm.controls['searchContents'].value;

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { searchTimeframe, searchContents },
        queryParamsHandling: 'merge'
      });
  }

}
