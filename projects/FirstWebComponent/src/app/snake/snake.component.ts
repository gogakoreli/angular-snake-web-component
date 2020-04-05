import { Component, OnInit, Injectable, ɵmarkDirty as markDirty, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { fromEvent, Subject, BehaviorSubject, Observable, interval } from 'rxjs';
import { takeUntil, map, distinctUntilChanged } from 'rxjs/operators';
import { defaultGameState, directionReducer, tickReducer, renderConsole } from './snake';
import { GameState, Tile } from './models';

@Injectable({ providedIn: 'root' })
export class Store {
  private state = new BehaviorSubject<GameState>(defaultGameState());

  public select(): Observable<GameState>
  public select<T>(selector?: (state: GameState) => T | GameState): Observable<T | GameState> {
    selector = selector ?? (state => state);
    return this.state.asObservable().pipe(
      map(selector),
      distinctUntilChanged(),
    );
  }

  public reduce(reducer: (state: GameState) => GameState) {
    const newState = reducer(this.state.value);
    this.state.next(newState);
  }
}

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
    fromEvent(document, 'keydown').pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((event: KeyboardEvent) => {
      this.store.reduce(state => directionReducer(state, event));
    });

    interval(TICK_INTERVAL).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      this.store.reduce(tickReducer);
    });

    this.store.select().pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(state => {
      // renderConsole(state);
      this.state = state;
      markDirty(this);
    });
  }

  public handleStartClick() {

  }

  public trackByIndex(index: number): number {
    return index;
  }

}
