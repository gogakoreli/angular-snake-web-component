import { Component, OnInit, ɵmarkDirty as markDirty, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { fromEvent, Subject, interval } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Store } from './store.service';
import { directionReducer, tickReducer } from './snake';
import { GameState, Tile } from './models';

const TICK_INTERVAL = 150;

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnakeComponent implements OnInit {

  @HostBinding('class.game-container') gameContainerClass = true;

  public state: GameState;

  private unsubscribe$ = new Subject();

  public get grid(): Tile[][] {
    return this.state.game.map.grid;
  }

  constructor(private store: Store) { }

  ngOnInit() {
    const direction$ = fromEvent(document, 'keydown').pipe(
      tap((event: KeyboardEvent) => this.store.reduce(state => directionReducer(state, event))),
    );

    const tick$ = interval(TICK_INTERVAL).pipe(
      tap(() => this.store.reduce(tickReducer)),
    );

    const state$ = this.store.select().pipe(
      tap(state => {
        console.log(state);
        this.state = state;
        markDirty(this);
      }),
    );

    state$.subscribe();
  }

  public handleStartClick() {

  }

  public trackByIndex(index: number): number {
    return index;
  }

}
