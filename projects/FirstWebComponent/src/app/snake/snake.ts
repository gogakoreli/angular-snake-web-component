import { Direction, Food, Snake, SnakePart, Game, GameState } from './models';
import { InputKey, getInputKey } from './input';
import { defaultMap, randomFood, updateMap } from './map';

export function defaultGameState(): GameState {
  return {
    game: defaultGame(),
    directions: [Direction.East],
    shouldRender: true,
  };
}

function defaultGame(): Game {
  const food = defaultFood();
  const snake = defaultSnake();
  const map = updateMap(defaultMap(), snake, food);
  return { snake, map, food };
}

function defaultSnake(): Snake {
  const parts = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }];
  return {
    direction: Direction.East,
    head: parts[parts.length - 1],
    length: parts.length,
    parts,
    foodEaten: false,
  };
}

function defaultFood(): Food {
  return { i: 0, j: 10 };
}

export function updateDirection(snake: Snake, direction: Direction): Snake {
  if (validNextDirection(snake.direction, direction)) {
    snake = {
      ...snake,
      direction,
    };
  }
  return snake;
}

export function moveToDirection(snake: Snake, food: Food): Snake {
  let newParts = snake.parts;
  const newHead = getNewHead(snake);
  newParts.push(newHead);

  return {
    ...snake,
    head: newHead,
    parts: newParts,
    length: newParts.length,
  };
}

export function snakeFoodEaten(snake: Snake, food: Food) {
  const foodEaten = hasFoodEaten(snake, food);
  let parts = snake.parts;
  if (!foodEaten) {
    parts = parts.filter((_, i) => i > 0);
  }

  return {
    ...snake,
    foodEaten,
    parts,
    length: parts.length,
  };
}

/**
 * @description shouldn't be used from outside of snake
 * this is mainly for checking by itself to set property foodEaten
 * @see snake.foodEaten for using from outside
 */
function hasFoodEaten(snake: Snake, food: Food): boolean {
  return snake.head.i === food.i && snake.head.j === food.j;
}

function getNewHead(snake: Snake) {
  const head = snake.head;
  let newHead: SnakePart;
  switch (snake.direction) {
    case Direction.North:
      newHead = { i: head.i - 1, j: head.j };
      break;
    case Direction.East:
      newHead = { i: head.i, j: head.j + 1 };
      break;
    case Direction.South:
      newHead = { i: head.i + 1, j: head.j };
      break;
    case Direction.West:
      newHead = { i: head.i, j: head.j - 1 };
      break;
  }
  return newHead;
}

function validNextDirection(curr: Direction, next: Direction): boolean {
  let result = false;
  if (next !== Direction.None) {
    switch (curr) {
      case Direction.North:
        result = next !== Direction.South;
        break;
      case Direction.East:
        result = next !== Direction.West;
        break;
      case Direction.South:
        result = next !== Direction.North;
        break;
      case Direction.West:
        result = next !== Direction.East;
        break;
      case Direction.None:
        result = false;
        break;
    }
  }
  return result;
}

export function tick(game: Game, direction: Direction): Game {
  game = { ...game, snake: updateDirection(game.snake, direction) };
  game = { ...game, snake: moveToDirection(game.snake, game.food) };
  game = { ...game, snake: snakeFoodEaten(game.snake, game.food) };
  game = { ...game, food: randomFood(game, game.snake.foodEaten) };

  game = { ...game, map: updateMap(game.map, game.snake, game.food) };

  return game;
}

export function tickReducer(state: GameState): GameState {
  const [curDirection, nextDirection, ...rest] = state.directions;

  let direction = curDirection;
  if (nextDirection !== undefined) {
    direction = nextDirection;
  }
  const directions =
    state.directions.length === 1
      ? state.directions
      : [nextDirection, ...rest];
  return {
    ...state,
    game: tick(state.game, direction),
    directions,
    shouldRender: true,
  };
}

export function directionReducer(state: GameState, event: KeyboardEvent): GameState {
  let result = state;
  const newDirection = getDirection(event);
  if (newDirection !== Direction.None) {
    result = {
      ...state,
      directions: [...state.directions, newDirection],
      shouldRender: false,
    };
  }
  return result;
}

function inputToDirection(inputKey: InputKey): Direction {
  let res: Direction = Direction.None;
  switch (inputKey) {
    case InputKey.Left:
      res = Direction.West;
      break;
    case InputKey.Right:
      res = Direction.East;
      break;
    case InputKey.Down:
      res = Direction.South;
      break;
    case InputKey.Up:
      res = Direction.North;
      break;
  }
  return res;
}

function getDirection(event: KeyboardEvent): Direction {
  const inputKey = getInputKey(event.keyCode);
  const newDirection = inputToDirection(inputKey);
  return newDirection;
}

export function renderConsole(state: GameState) {
  if (state.shouldRender) {
    const map = state.game.map;
    const strGrid = map.grid
      .map((row) =>
        row
          .map((item) =>
            item.isSnakeHead ? '@' : item.isSnake ? 'x' : item.isFood ? '*' : '.',
          )
          .join(' '),
      )
      .join('\n');
    console.log(strGrid);
    console.log();
  }
}
