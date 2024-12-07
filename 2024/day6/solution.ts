import { readStdin } from "../common/readStdin.js";

type Point = {
  x: number;
  y: number;
  value: string;
};

const enum GuardDirection {
  Up = "^",
  Down = "v",
  Left = "<",
  Right = ">",
}

const Obstruction = "#";
const Visited = "X";

function isGuard(value: string): value is GuardDirection {
  switch (value) {
    case GuardDirection.Up:
    case GuardDirection.Down:
    case GuardDirection.Left:
    case GuardDirection.Right:
      return true;
    default:
      return false;
  }
}

function takeStep(grid: Record<string, Point>, guard: Point): Point | null {
  switch (guard.value) {
    case GuardDirection.Up:
      return grid[asKey({x: guard.x - 1, y: guard.y })];
    case GuardDirection.Down:
      return grid[asKey({x: guard.x + 1, y: guard.y })];
    case GuardDirection.Left:
      return grid[asKey({x: guard.x, y: guard.y - 1 })];
    case GuardDirection.Right:
      return grid[asKey({x: guard.x, y: guard.y + 1})];
  }
}

function turnRight(grid: Record<string, Point>, guard: Point) {
  switch (guard.value) {
    case GuardDirection.Up:
      guard.value = GuardDirection.Right;
      break;
    case GuardDirection.Down:
      guard.value = GuardDirection.Left;
      break;
    case GuardDirection.Left:
      guard.value = GuardDirection.Up;
      break;
    case GuardDirection.Right:
      guard.value = GuardDirection.Down;
      break;
  }
}

// travel in the direction of the guard until an Obstruction is hit
// then turn right end when the guard has no points to visit (hits a wall).
function traverse(grid: Record<string, Point>, guard: Point): Set<Point> {
  const visited: Set<Point> = new Set([grid[asKey(guard)]]);
  let next = takeStep(grid, guard);
  while (next) {
    if (next.value !== Obstruction) {
      // update guard to new position
      guard.x = next.x;
      guard.y = next.y;
      visited.add(next);
    } else {
      // turn right from previous position
      turnRight(grid, guard);
    }
    next = takeStep(grid, guard);
  }
  return visited;
}

function asKey(pt: Pick<Point, "x" | "y">): string {
  return `${pt.x},${pt.y}`;
}

function printGrid(grid: Record<string, Point>, rows: number, cols: number) {
  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let col = 0; col < cols; col++) {
      line += grid[asKey({ x: row, y: col })].value;
    }
    console.log(line);
  }
}

(async function main() {
  const input = await readStdin(true);
  console.log(input);

  let guard: Point;
  const grid: Record<string, Point> = {};
  const rows = input.split("\n");
  const rowCount = rows.length;
  const colCount = rows[0].length;
  for (let x = 0; x < rows.length; x++) {
    const rData = rows[x].split("");
    for (let y = 0; y < rData.length; y++) {
      const value = rData[y];
      const pt = { x, y, value };
      if (isGuard(value)) {
        // copy pt
        guard = { ...pt };
        pt.value = '.'; // remove guard token (optional)
      }
      grid[asKey(pt)] = pt;
    }
  }
  console.log(grid);
  console.log(guard);
  const visited = traverse(grid, guard);
  console.log(visited);
  console.log('total distinct positions', visited.size);
  visited.forEach(x => {
    if (x.value === Obstruction) console.log('FAILURE')
    x.value = Visited;
  });
  printGrid(grid, rowCount, colCount);
})();
