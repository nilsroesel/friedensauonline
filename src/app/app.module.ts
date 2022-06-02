import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ArticleTileComponent } from './article-tile/article-tile.component';
import { ArticleComponent } from './article/article.component';
import { RouterModule } from '@angular/router';
import { AllArticlesComponent } from './article-collections/all-articles/all-articles.component';
import { MomentFormatterPipe } from './date-formatter.pipe';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeadlinesComponent } from './article-collections/headlines/headlines.component';
import { ArticlesByKeywordsComponent } from './article-collections/articles-by-keywords/articles-by-keywords.component';
import { KeywordsComponent } from './article-collections/keywords/keywords.component';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TickerComponent } from './ticker/ticker.component';
import { ArticlesByCategoryComponent } from './article-collections/articles-by-category/articles-by-category.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleTileComponent,
    ArticleComponent,
    ArticlesByKeywordsComponent,
    ArticlesByCategoryComponent,
    AllArticlesComponent,
    MomentFormatterPipe,
    SideBarComponent,
    HeadlinesComponent,
    KeywordsComponent,
    SearchComponent,
    TickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full'},
      { path: 'home', component: AllArticlesComponent },
      { path: 'headlines/:date', component: HeadlinesComponent },
      { path: 'article/:title', component: ArticleComponent },
      { path: 'topics', component: KeywordsComponent, pathMatch: 'full' },
      { path: 'topics/:topic', component: ArticlesByKeywordsComponent },
      { path: 'categories/:category', component: ArticlesByCategoryComponent },
      { path: 'search', component: SearchComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
