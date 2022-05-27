import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ArticleTileComponent } from './article-tile/article-tile.component';
import { ArticleComponent } from './article/article.component';
import { RouterModule } from '@angular/router';
import { ArticlesComponent } from './articles/articles.component';
import { MomentFormatterPipe } from './date-formatter.pipe';
import { SideBarComponent } from './side-bar/side-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleTileComponent,
    ArticleComponent,
    ArticlesComponent,
    MomentFormatterPipe,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full'},
      { path: 'home', component: ArticlesComponent },
      { path: 'article/:title', component: ArticleComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
