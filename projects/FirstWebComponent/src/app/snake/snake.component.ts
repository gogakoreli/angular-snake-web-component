import { Component, OnInit, ɵmarkDirty as markDirty, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { fromEvent, Subject, interval, BehaviorSubject, merge } from 'rxjs';
import { takeUntil, tap, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';
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

  private running = new BehaviorSubject<boolean>(false);

  private unsubscribe$ = new Subject();

  public get grid(): Tile[][] {
    return this.state.game.map.grid;
  }

  public get isRunning(): boolean {
    return this.running.value;
  }

  constructor(private store: Store) { }

  ngOnInit() {
    const direction$ = fromEvent(document, 'keydown').pipe(
      tap((event: KeyboardEvent) => this.store.reduce(state => directionReducer(state, event))),
    );
    const tick$ = interval(TICK_INTERVAL).pipe(
      tap(() => this.store.reduce(tickReducer)),
    );
    const game$ = merge(direction$, tick$);

    const gameOver$ = this.store.select(state => state.game.gameOver).pipe(
      filter(gameOver => gameOver),
    );

    this.running.pipe(
      distinctUntilChanged(),
      tap(() => markDirty(this)),
      switchMap((running) => running ? game$ : []),
      takeUntil(gameOver$),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      complete: () => console.log('completed')
    });

    this.store.select().pipe(
      filter(state => state.shouldRender),
      tap(state => {
        this.state = state;
        markDirty(this);
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  public handleStartClick() {
    this.running.next(true);
  }

  public handlePauseClick() {
    this.running.next(false);
  }

  public handleResetClick() {
    console.log('reset');
  }

  public trackByIndex(index: number): number {
    return index;
  }

}
