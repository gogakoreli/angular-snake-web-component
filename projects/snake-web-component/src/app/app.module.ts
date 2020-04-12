import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { SnakeComponent } from './snake/snake.component';

@NgModule({
  declarations: [
    SnakeComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: []
})
export class AppModule implements DoBootstrap {

  constructor(injector: Injector) {
    const snakeComponent = createCustomElement(SnakeComponent, { injector });
    customElements.define('ng-snake', snakeComponent);
  }

  ngDoBootstrap() { }
}
