import { readStdin } from "../common/readStdin.js";

const sample = `..X...
.SAMX.
.A..A.
XMAS.S
.X....`;

(async function main () {
  const input = await readStdin(true);
  console.log(input);

  // horizontal, vertical, diagonal, written backwards, or even overlapping other words

  // brute force could be to extend the dataset to contain all possible foldings
  // then do a scan for XMAS|SAMX

  // note preserving newlines prevents wrapping during search which is what we want
  const inputRows = input.split('\n');
  const numRows = inputRows.length;
  const numCols = inputRows[0].split('').length;

  // pass one add all rows to the dataset
  let dataset = input + '\n'; // preserve newlines add separator
  console.log('pass 1, flattened', dataset);

  // for vertical and diagonal we need to have the data in a 2x2 matrix
  const dataset2d: string[][] = inputRows.map(row => row.split(''));

  // pass two add all cols to the dataset
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      dataset += dataset2d[row][col];
    }
    // add newline to separate cols
    dataset += '\n';
  }
  console.log('pass 2, with cols', dataset);

  // pass three add all diagonals to the dataset
  // note this might be different since I'm not sure diagonal
  // wraps around they may be isolated...

  // top left to bottom right (scanning down)
  for(let row = 0; row < numRows; row++) {
    let currentRow = row;
    for (let col = 0; col < numCols && currentRow < numRows; col++) {
      dataset += dataset2d[currentRow][col];
      currentRow++;
    }
    // add newline to separate diagonals
    dataset += '\n';
  }

  console.log('pass 3, with diag', dataset);

  // top left to bottom right (scanning right)
  for (let col = 1; col < numCols; col++) {
    let currentCol = col;
    for (let row = 0; row < numRows && currentCol < numCols; row++) {
      dataset += dataset2d[row][currentCol];
      currentCol++;
    }
    // add newline to separate diagonals
    dataset += '\n';
  }

  console.log('pass 4, with diag', dataset);

  // top right to bottom left (scanning down)
  for (let row = 0; row < numRows; row++) {
    let currentRow = row;
    for (let col = numCols-1; col >= 0 && currentRow < numRows; col--) {
      dataset += dataset2d[currentRow][col];
      currentRow++;
    }
    // add newline to separate diagonals
    dataset += '\n';
  }

  console.log('pass 5, with diag', dataset);

  // top right to bottom left (scanning left)
  for (let col = numCols-2; col >= 0; col--) {
    let currentCol = col;
    for (let row = 0; row < numRows && currentCol >= 0; row++) {
      dataset += dataset2d[row][currentCol];
      currentCol--;
    }
    // add newline to separate diagonals
    dataset += '\n';
  }

  console.log('pass 6, with diag', dataset);

  // finally we need to scan the dataset for the word XMAS|SAMX
  const total = dataset.match(/XMAS/g).length + dataset.match(/SAMX/g).length;
  console.log('total XMAS|SAMX:', total);
})()