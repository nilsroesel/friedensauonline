import { Injectable } from '@angular/core';
import { Location} from '@angular/common';
import { ReplaySubject } from 'rxjs';
import * as moment from 'moment';
import { Moment } from 'moment';
import { createMoment } from '../helpers';

export interface Article {
  headline: string;
  text: Array<TextBlock>;
  category: string;
  shortTitle: string;
  summary: string;
  readingTime: number;
  picturePaths: Array<string>;
  date: Moment;
  author: string;
}

export interface TextBlock {
  title: string;
  text: string;
}

export interface OrderedArticles {
  [key: string]: Array<Article>;
}

export const DEFAULT_ARTICLE: Article = {
  headline: '',
  text: [],
  category: '',
  shortTitle: '',
  summary: '',
  readingTime: 0,
  picturePaths: [],
  date: moment(),
  author: ''
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  static TITLE_SEARCH = 'Title:';
  static SHORT_SEARCH = 'Short:';
  static SUMMARY_SEARCH = 'Summary:';
  static CATEGORY_SEARCH = 'Category:';
  static PICTURE_NAMES_SEARCH = 'Pictures:';
  static BLOCK_SEARCH = 'Block:';
  static DATE_SEARCH = 'Date:';
  static AUTHOR_SEARCH = 'Author:';

  static FILES: string = 'assets/articles/';
  static PICTURES: string = 'assets/articles/pictures/'

  private loadedArticles$: ReplaySubject<Array<Article>> = new ReplaySubject<Array<Article>>();

  constructor(private location: Location) { }

  getArticle( name: string ): ReplaySubject<Article> {
    const replayer = new ReplaySubject<Article>();
    this.loadedArticles$.subscribe((articles$ :Array<Article>) => {
      replayer.next(articles$.filter(article => encodeURI(article.headline) === name)[0]);
    });
    return replayer;
  }

  getArticles(): ReplaySubject<Array<Article>> {
    return this.loadedArticles$;
  }

  getArticlesOrderedByDate(): ReplaySubject<OrderedArticles> {
    const replayer = new ReplaySubject<OrderedArticles>();
    let articleHolder: OrderedArticles = {};

    this.loadedArticles$.subscribe((articles$: Array<Article>) => {
      articles$.forEach(article => {
        const key = article.date.format('YYYY-MM-DD');
        if ( articleHolder[key] === undefined ) {
          articleHolder[key] = [article];
        } else {
          articleHolder[key] = [...articleHolder[key], article];
        }
      });
      replayer.next(articleHolder);
    });
    return replayer;
  }

  getArticlesByDate( date: Moment ): ReplaySubject<Array<Article>> {
    const replayer = new ReplaySubject<Array<Article>>();
    this.loadedArticles$.subscribe((articles$: Array<Article>) => {
      replayer.next(articles$.filter(article => article.date.diff(date, 'days') === 0));
    });
    return replayer;
  }

  async loadArticles(articles: Array<Article> = [], index = 0): Promise<Array<Article>> {
    const assetUrl = this.location.prepareExternalUrl(ArticlesService.FILES + "article" + index);
    const article: Article | null = await this.readArticle(assetUrl);
    if ( article === null ) {
      return articles;
    }
    return this.loadArticles(articles.concat(article), ++index).then(a => {
      this.loadedArticles$.next(a);
      return a;
    });
  }

  async readArticle( file: string ): Promise<Article | null> {
    return await fetch(file).then(response => response.status !== 200? null : response.text())
      .then((data: string | null) => {
        if ( data === null ) return null;

        const startShortSearchIndex = data.indexOf(ArticlesService.SHORT_SEARCH) !== -1 ?
          data.indexOf(ArticlesService.SHORT_SEARCH) + ArticlesService.SHORT_SEARCH.length : -1;
        const startLongSearchIndex = data.indexOf(ArticlesService.TITLE_SEARCH) !== -1 ?
          data.indexOf(ArticlesService.TITLE_SEARCH) + ArticlesService.TITLE_SEARCH.length : -1;
        const startSummarySearchIndex = data.indexOf(ArticlesService.SUMMARY_SEARCH) !== -1 ?
          data.indexOf(ArticlesService.SUMMARY_SEARCH) + ArticlesService.SUMMARY_SEARCH.length : -1;
        const startCategorySearchIndex = data.indexOf(ArticlesService.CATEGORY_SEARCH) !== -1 ?
          data.indexOf(ArticlesService.CATEGORY_SEARCH) + ArticlesService.CATEGORY_SEARCH.length : -1;
        const startPicturesSearchIndex = data.indexOf(ArticlesService.PICTURE_NAMES_SEARCH) !== -1 ?
          data.indexOf(ArticlesService.PICTURE_NAMES_SEARCH) + ArticlesService.PICTURE_NAMES_SEARCH.length : -1;
        const startDateSearchIndex = data.indexOf(ArticlesService.DATE_SEARCH) !== -1 ?
          data.indexOf(ArticlesService.DATE_SEARCH) + ArticlesService.DATE_SEARCH.length : -1;
        const startAuthorSearchIndex = data.indexOf(ArticlesService.AUTHOR_SEARCH) !== -1 ?
          data.indexOf(ArticlesService.AUTHOR_SEARCH) + ArticlesService.AUTHOR_SEARCH.length : -1;

        const shortTitle: string = startShortSearchIndex !== -1 ?
          data.substring(startShortSearchIndex, data.indexOf('#', startShortSearchIndex)).trimStart().trimEnd() : '';
        const headline: string = startLongSearchIndex !== -1 ?
          data.substring(startLongSearchIndex, data.indexOf('#', startLongSearchIndex)).trimStart().trimEnd() : '';
        const summary: string = startSummarySearchIndex !== -1 ?
          data.substring(startSummarySearchIndex, data.indexOf('#', startSummarySearchIndex)).trimStart().trimEnd() : '';
        const category: string = startCategorySearchIndex !== -1 ?
          data.substring(startCategorySearchIndex, data.indexOf('#', startCategorySearchIndex)).trimStart().trimEnd() : '';
        const picturePaths: Array<string> = startPicturesSearchIndex !== -1 ? data
          .substring(startPicturesSearchIndex, data.indexOf('#', startPicturesSearchIndex))
          .split(' ')
          .filter(v => !!v)
          .map(name => name.trimStart().trimEnd())
          .map(name => ArticlesService.PICTURES.concat(name)) : [];
        const dateString: string = startDateSearchIndex !== -1 ?
          data.substring(startDateSearchIndex, data.indexOf('#', startDateSearchIndex)).trimStart().trimEnd() : '';
        const date: Moment = createMoment(dateString);
        const author: string = startDateSearchIndex !== -1 ?
          data.substring(startAuthorSearchIndex, data.indexOf('#', startAuthorSearchIndex)).trimStart().trimEnd() : '';

        const text = this.parseTextBlocksFromData(data);

        const readingTime: number = this.calculateReadingTime(
          text.map(t => t.text + ' ' + t.title).reduce((acc, curr) => acc.concat(curr), '')
        );

        return { shortTitle, headline, summary, category, text, readingTime, picturePaths, date, author };
      });
  }

  parseTextBlocksFromData(data: string, currentIndex = 0): Array<TextBlock> {
    const blockStartIndex = data.indexOf(ArticlesService.BLOCK_SEARCH, currentIndex);

    if ( blockStartIndex === -1 ) {
      return [];
    }

    const titleEndIndex = data.indexOf('#', blockStartIndex);
    let blockEnd = data.indexOf(ArticlesService.BLOCK_SEARCH, titleEndIndex);
    if ( blockEnd === -1 ) {
      blockEnd = data.length;
    }

    const title = data.substring(blockStartIndex + ArticlesService.BLOCK_SEARCH.length, titleEndIndex)
      .trimStart().trimEnd();
    const text = data.substring(titleEndIndex + 1, blockEnd)
      .trimStart().trimEnd();

    return [{ title, text }, ...this.parseTextBlocksFromData(data, blockEnd)]
  }

  calculateReadingTime(text: string): number {
    return Math.ceil(text.split(" ").length / 200);
  }
}
