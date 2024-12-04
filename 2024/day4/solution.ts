import { readStdin } from "../common/readStdin.js";

const sample = `..X...
.SAMX.
.A..A.
XMAS.S
.X....`;

function buildDataset(input: string, onChar: (char: string) => string) {
  const inputRows = input.split("\n");
  const numRows = inputRows.length;
  const numCols = inputRows[0].split("").length;
  const dataset2d: string[][] = inputRows.map((row) =>
    row.split("").map(onChar)
  );

  return {
    dataset2d,
    numRows,
    numCols,
  };
}

function flattenRows(dataset: string[][], numRows: number, numCols: number) {
  let flattened = "";
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      flattened += dataset[row][col];
    }
    // add newline to separate rows
    flattened += "\n";
  }
  return flattened + "\n";
}

function flattenCols(dataset: string[][], numRows: number, numCols: number) {
  let flattened = "";
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      flattened += dataset[row][col];
    }
    // add newline to separate cols
    flattened += "\n";
  }
  return flattened + "\n";
}

function flattenDiagonals(
  dataset: string[][],
  numRows: number,
  numCols: number
) {
  let flattened = "";

  // top left to bottom right (scanning down)
  for (let row = 0; row < numRows; row++) {
    let currentRow = row;
    for (let col = 0; col < numCols && currentRow < numRows; col++) {
      flattened += dataset[currentRow][col];
      currentRow++;
    }
    // add newline to separate diagonals
    flattened += "\n";
  }

  // top left to bottom right (scanning right)
  for (let col = 1; col < numCols; col++) {
    let currentCol = col;
    for (let row = 0; row < numRows && currentCol < numCols; row++) {
      flattened += dataset[row][currentCol];
      currentCol++;
    }
    // add newline to separate diagonals
    flattened += "\n";
  }

  // top right to bottom left (scanning down)
  for (let row = 0; row < numRows; row++) {
    let currentRow = row;
    for (let col = numCols - 1; col >= 0 && currentRow < numRows; col--) {
      flattened += dataset[currentRow][col];
      currentRow++;
    }
    // add newline to separate diagonals
    flattened += "\n";
  }

  // top right to bottom left (scanning left)
  for (let col = numCols - 2; col >= 0; col--) {
    let currentCol = col;
    for (let row = 0; row < numRows && currentCol >= 0; row++) {
      flattened += dataset[row][currentCol];
      currentCol--;
    }
    // add newline to separate diagonals
    flattened += "\n";
  }

  return flattened;
}

function flatten(
  dataset: string[][],
  numRows: number,
  numCols: number,
  ...types: ("rows" | "cols" | "diagonals")[]
) {
  let flattened = '';
  // turn into a set to remove duplicates
  for (const type of Array.from(new Set(types))) {
    switch (type) {
      case "rows":
        flattened += flattenRows(dataset, numRows, numCols);
        break;
      case "cols":
        flattened += flattenCols(dataset, numRows, numCols);
        break;
      case "diagonals":
        flattened += flattenDiagonals(dataset, numRows, numCols);
        break;
    }
  }

  return flattened;
}

function getNumMatches(dataset: string, ...regexes: RegExp[]): number {
  return regexes.reduce((acc, regexp) => {
    return acc + (dataset.match(regexp) ?? []).length;
  }, 0);
}

(async function main() {
  const input = await readStdin(true);

  // pt1
  const datasetPt1 = buildDataset(input, (char) =>
    /[XMAS]/.test(char) ? char : "."
  );
  const flattenedDataP1 = flatten(
    datasetPt1.dataset2d,
    datasetPt1.numRows,
    datasetPt1.numCols,
    "rows",
    "cols",
    "diagonals"
  );
  const totalPt1 = getNumMatches(flattenedDataP1, /XMAS/g, /SAMX/g);
  console.log("pt1 total (XMAS|SAMX):", totalPt1);

  // pt 2
  const datasetPt2 = buildDataset(input, (char) =>
    /[MAS]/.test(char) ? char : "."
  );
  const flattenedDataP2 = flatten(
    datasetPt2.dataset2d,
    datasetPt2.numRows,
    datasetPt2.numCols,
    "rows",
    "cols",
    "diagonals"
  );
  const totalPt2 = getNumMatches(flattenedDataP2, /MAS/g, /SAM/g);
  console.log("pt1 total (MAS|SAM in X formation):", totalPt2);
})();
