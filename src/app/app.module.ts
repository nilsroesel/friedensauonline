import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ArticleTileComponent } from './article-tile/article-tile.component';
import { ArticleComponent } from './article/article.component';
import { RouterModule } from '@angular/router';
import { ArticlesComponent } from './articles/articles.component';
import { MomentFormatterPipe } from './date-formatter.pipe';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeadlinesComponent } from './headlines/headlines.component';
import { ArticlesByKeywordsComponent } from './articles-by-keywords/articles-by-keywords.component';
import { KeywordsComponent } from './categories/keywords.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleTileComponent,
    ArticleComponent,
    ArticlesComponent,
    MomentFormatterPipe,
    SideBarComponent,
    HeadlinesComponent,
    ArticlesByKeywordsComponent,
    KeywordsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full'},
      { path: 'home', component: ArticlesComponent },
      { path: 'headlines/:date', component: HeadlinesComponent },
      { path: 'article/:title', component: ArticleComponent },
      { path: 'topics', component: KeywordsComponent, pathMatch: 'full' },
      { path: 'topics/:topic', component: ArticlesByKeywordsComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
