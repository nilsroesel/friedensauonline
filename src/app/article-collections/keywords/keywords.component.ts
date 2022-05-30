import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ArticlesService } from '../../articles.service';
import { map } from 'rxjs/operators';

interface KeywordWithStartIndicator {
  keyword: string;
  mark: boolean;
  id: string;
}

interface ActiveChar {
  char: string;
  active: boolean;
}

@Component({
  selector: 'app-categories',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css']
})
export class KeywordsComponent implements OnInit {

  categories$: Observable<Array<KeywordWithStartIndicator>> = new ReplaySubject();

  categoriesByStartChar: Array<ActiveChar> = [
    { char: 'A', active: false },
    { char: 'B', active: false },
    { char: 'C', active: false },
    { char: 'D', active: false },
    { char: 'E', active: false },
    { char: 'F', active: false },
    { char: 'G', active: false },
    { char: 'H', active: false },
    { char: 'I', active: false },
    { char: 'J', active: false },
    { char: 'K', active: false },
    { char: 'L', active: false },
    { char: 'M', active: false },
    { char: 'N', active: false },
    { char: 'O', active: false },
    { char: 'P', active: false },
    { char: 'Q', active: false },
    { char: 'R', active: false },
    { char: 'S', active: false },
    { char: 'T', active: false },
    { char: 'U', active: false },
    { char: 'V', active: false },
    { char: 'W', active: false },
    { char: 'X', active: false },
    { char: 'Y', active: false },
    { char: 'Z', active: false }
  ]

  constructor(private articlesService: ArticlesService) {
    this.categories$ = articlesService.getArticlesOrderedByKeyword().pipe(
      map(holder => Object
        .keys(holder)
        .sort((a, b) => a.localeCompare(b))
        .map((keyword, index, array) => {
          const mark = !keyword.toLowerCase().startsWith((array[index - 1] || '0').toLowerCase().charAt(0));
          const id = keyword.toUpperCase().charAt(0);

          this.categoriesByStartChar
            .filter(e => e.char === keyword.toUpperCase().charAt(0))
            .forEach(e => e.active = true)
          return { keyword, mark, id }
        })
      )
    );
  }

  ngOnInit(): void {
    scrollTo(0,0);
  }

  scrollToSection( char: string ) {
    document.getElementById(char)?.scrollIntoView({ block: 'center' });
  }

}
