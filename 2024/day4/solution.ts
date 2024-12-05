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

function as3x3(dataset: string[][], numRows: number, numCols: number) {
  // a list of 3x3 datasets
  const datasets: string[][][] = [];
  for (let row = 0; row < numRows - 2; row++) {
    for (let col = 0; col < numCols - 2; col++) {
      const dataset3x3 = [];
      for (let r = row; r < row + 3; r++) {
        dataset3x3.push(dataset[r].slice(col, col + 3));
      }
      datasets.push(dataset3x3);
    }
  }
  return datasets;
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

  // top left to bottom right
  for (let colOffset = 0; colOffset < numCols; colOffset++) {
    for (let row = 0; row < numRows; row++) {
      let currentRow = row;
      for (let col = colOffset; col < numCols && currentRow < numRows; col++) {
        flattened += dataset[currentRow][col];
        currentRow++;
      }
      // add newline to separate diagonals
      flattened += "\n";
    }
  }

  // top right to bottom left (scanning left)
  for (let colOffset = numCols - 1; colOffset >= 0; colOffset--) {
    for (let row = 0; row < numRows; row++) {
      let currentRow = row;
      for (let col = numCols - colOffset; col >= 0 && currentRow < numRows; col--) {
        flattened += dataset[currentRow][col];
        currentRow++;
      }
      // add newline to separate diagonals
      flattened += "\n";
    }
  }

  return flattened;
}

function flatten(
  dataset: string[][],
  numRows: number,
  numCols: number,
  ...types: ("rows" | "cols" | "diagonals")[]
) {
  let flattened = "";
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

  // pt1 - XMAS|SAMX
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

  // pt 2 - MAS X SAM (X formation)
  const datasetPt2 = buildDataset(input, (char) =>
    /[MAS]/.test(char) ? char : "."
  );
  let totalPt2 = 0;
  for (const dataset of as3x3(
    datasetPt2.dataset2d,
    datasetPt2.numRows,
    datasetPt2.numCols
  )) {
    const flattenedDataP2 = flatten(dataset, 3, 3, "rows");
    totalPt2 += getNumMatches(
      flattenedDataP2,
      /M.S\n.A.\nM.S/g,
      /M.M\n.A.\nS.S/g,
      /S.M\n.A.\nS.M/g,
      /S.S\n.A.\nM.M/g
    );
  }
  console.log("pt1 total (MAS X SAM in X formation):", totalPt2);
})();
