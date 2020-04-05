import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { UIButtonComponent } from './uibutton/uibutton.component';
import { SnakeComponent } from './snake/snake.component';

@NgModule({
  declarations: [
    UIButtonComponent,
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
    const webComponent = createCustomElement(UIButtonComponent, { injector });
    customElements.define('ui-button', webComponent);

    const snakeComponent = createCustomElement(SnakeComponent, { injector });
    customElements.define('ng-snake', snakeComponent);

  }

  ngDoBootstrap() { }
}
