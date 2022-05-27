import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Article, ArticlesService } from '../articles.service';
import { ReplaySubject } from 'rxjs';
import { Moment } from 'moment';
import { createMoment } from '../../helpers';

interface ArticleByDate {
  date: Moment;
  articles: Array<Article>;
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  @ViewChild('searchInput')
  searchInput: ElementRef | undefined;

  articleByDate$: ReplaySubject<Array<ArticleByDate>> = new ReplaySubject<Array<ArticleByDate>>();

  constructor(private router: Router, private articlesService: ArticlesService) {
    articlesService.getArticlesOrderedByDate().subscribe(articles$ => {
      const articleListByDateAsArray: Array<ArticleByDate> = Object.keys(articles$).map(key =>
        ({ date: createMoment(key), articles: articles$[key] })
      );
      this.articleByDate$.next(articleListByDateAsArray);
    });
  }

  ngOnInit(): void {
  }

  search() {
    const searchPhrase = this.searchInput?.nativeElement.value;

  }

  redirect(route: string) {
    const menuButton: any = document.getElementById('menuButton');
    menuButton.checked = false;
    this.router.navigateByUrl(route);
  }

  redirectDate(moment: Moment) {
    this.redirect('/headlines/'.concat(moment.format('YYYY-MM-DD')));
  }

}
