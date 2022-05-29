import { Injectable } from '@angular/core';
import { Location} from '@angular/common';
import { ReplaySubject } from 'rxjs';
import * as moment from 'moment';
import { Moment } from 'moment';
import { createMoment } from '../helpers';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


export interface ArticleMetadata {
  readingTime: number;
  date: Moment;
  author: string;
  summary: string;
  category: string;
  keywords: Array<string>
}
export interface Article {
  headline: string;
  text: Array<TextBlock>;
  shortTitle: string;
  metadata: ArticleMetadata;
  picturePaths: Array<string>;
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
  metadata: {
    readingTime: 0,
    date: moment(),
    category: '',
    author: '',
    summary: '',
    keywords:[]
  },
  text: [],
  shortTitle: '',
  picturePaths: [],
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  static FILES: string = 'assets/articles/';
  static PICTURES: string = 'assets/articles/pictures/';

  private loadedArticles$: ReplaySubject<Array<Article>> = new ReplaySubject<Array<Article>>();

  constructor(private location: Location) { }

  getArticle( name: string ): Observable<Article> {
    const replayer = new ReplaySubject<Article>();
    this.loadedArticles$.subscribe((articles$ :Array<Article>) => {
      replayer.next(articles$.filter(article => encodeURI(article.headline) === name)[0]);
    });
    return replayer;
  }

  getArticles(): Observable<Array<Article>> {
    return this.loadedArticles$;
  }

  getArticlesOrderedByCategory(): Observable<OrderedArticles>  {
    const replayer = new ReplaySubject<OrderedArticles>();
    let articleHolder: OrderedArticles = {};

    this.loadedArticles$.subscribe((articles$: Array<Article>) => {
      articles$
        .sort((a, b) => a.metadata.category.localeCompare(b.metadata.category))
        .reverse()
        .forEach(article => {
          const key = article.metadata.category;
          if ( articleHolder[key] === undefined ) {
            articleHolder[key] = [article];
          } else if( !articleHolder[key].filter(a => a === article).length) {
            articleHolder[key] = [...articleHolder[key], article];
          }
        });
      replayer.next(articleHolder);
    });
    return replayer;
  }

  getArticlesOrderedByDate(): Observable<OrderedArticles> {
    const replayer = new ReplaySubject<OrderedArticles>();
    let articleHolder: OrderedArticles = {};

    this.loadedArticles$.subscribe((articles$: Array<Article>) => {
      articles$
        .sort((a, b) => a.metadata.date.diff(b.metadata.date))
        .reverse()
        .forEach(article => {
          const key = article.metadata.date.format('YYYY-MM-DD');
          if ( articleHolder[key] === undefined ) {
            articleHolder[key] = [article];
          } else if( !articleHolder[key].filter(a => a === article).length) {
            articleHolder[key] = [...articleHolder[key], article];
          }
        });
      replayer.next(articleHolder);
    });
    return replayer;
  }

  getArticlesOrderedByKeyword(): Observable<OrderedArticles> {
    const replayer = new ReplaySubject<OrderedArticles>();
    let articleHolder: OrderedArticles = {};

    this.loadedArticles$.subscribe((articles$: Array<Article>) => {
      articles$
        .forEach(article => {
          article.metadata.keywords.forEach(key => {
            if ( articleHolder[key] === undefined ) {
              articleHolder[key] = [article];
            } else if( !articleHolder[key].filter(a => a === article).length) {
              articleHolder[key] = [...articleHolder[key], article];
            }
          });
        });
      replayer.next(articleHolder);
    });
    return replayer;
  }

  getArticlesByDate( date: Moment ): ReplaySubject<Array<Article>> {
    const replayer = new ReplaySubject<Array<Article>>();
    this.loadedArticles$.subscribe((articles$: Array<Article>) => {
      replayer.next(articles$.filter(article => article.metadata.date.diff(date, 'days') === 0));
    });
    return replayer;
  }

  getArticlesByCategory( category: string ): Observable<Array<Article>> {
    return this.getArticlesOrderedByCategory()
      .pipe(
        map((holder: OrderedArticles) => (holder[category] as Array<Article>) || []))
      ;
  }

  getArticlesByKeyword( keyword: string ): Observable<Array<Article>> {
    return this.getArticlesOrderedByKeyword()
      .pipe(
        map((holder: OrderedArticles) => (holder[keyword] as Array<Article>) || []))
      ;
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

        const parser = new DOMParser();
        const xmlArticle = parser.parseFromString(data, "application/xml");

        const articleData = xmlArticle.getElementsByTagName('article').item(0);
        const summary = articleData?.getElementsByTagName('summary').item(0)?.innerHTML;
        const metadata: ArticleMetadata = {
          readingTime: 0,
          date: createMoment(articleData?.getAttribute('date') as string),
          author: articleData?.getAttribute('author') || '',
          summary: summary as any,
          category: articleData?.getAttribute('category') || '',
          keywords: (articleData?.getAttribute('keywords') || '').split(',')
        };
        const text: Array<TextBlock> = Array.from(articleData?.getElementsByTagName('text-block') as HTMLCollectionOf<HTMLElement>)
          .map(element => (
            {  title: element.getAttribute('title') as string,
              text: element.getElementsByTagName('text').item(0)?.innerHTML as string }
            )
          );


        metadata.readingTime = this.calculateReadingTime(
         text.map(t => t.text + ' ' + t.title).reduce((acc, curr) => acc.concat(curr), '')
        );

        const picturePaths: Array<string> = (articleData?.getAttribute('pictures') as string)
          .split(',')
          .filter(s => s !== '')
          .map(name => this.location.prepareExternalUrl(ArticlesService.PICTURES + name));
        return {
          headline: articleData?.getAttribute('headline') as string,
          shortTitle: articleData?.getAttribute('shortTitle') as string,
          metadata,
          text,
          picturePaths
        };
      });
  }

  calculateReadingTime(text: string): number {
    return Math.ceil(text.split(" ").length / 200);
  }
}
