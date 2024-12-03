import fs from 'fs';

const _sample_data = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

const filePath = './2024/day3/input.txt';

const isValidChar: RegExp = /[muldon't\(\)0-9,]/;
const isValidMutExpression: RegExp = /^mul\([0-9]{1,3},[0-9]{1,3}\)$/;
const extractMutExpression: RegExp = /^mul\(([0-9]{1,3}),([0-9]{1,3})\)$/;
const isValidEnableExpression: RegExp = /^do\(\)$/;
const isValidDisableExpression: RegExp = /^don't\(\)$/;

const OPENING_MUT_CHAR = 'm';
const OPENING_ENABLE_CHAR = 'd';
const CLOSING_CHAR = ')';

let total = 0;
let instructionsEnabled = true;
let expression = '';

function parser(character: string) {
  expression += character;

  if (!isValidChar.test(character)) {
    expression = '';
    return;
  }

  switch (character) {
    case OPENING_MUT_CHAR:
      expression = character;
      break;
    case OPENING_ENABLE_CHAR:
      expression = character;
      break;
    case CLOSING_CHAR:
      if (isValidMutExpression.test(expression)) {
        if (instructionsEnabled) {
          let [_, a, b] = expression.match(extractMutExpression);
          total += parseInt(a) * parseInt(b);
        }
      } else if (isValidEnableExpression.test(expression)) {
        instructionsEnabled = true;
      } else if (isValidDisableExpression.test(expression)) {
        instructionsEnabled = false;
      }

      expression = '';
      break;
  }
}

// Creates a readable stream with highWaterMark set to 1 to read char by char
const readStream = fs.createReadStream(filePath, {
  encoding: 'utf8',
  highWaterMark: 1
});

// Listen for 'data' event to read the file char by char
readStream.on('data', (chunk: string) => {
  parser(chunk);
});

// Listen for 'end' event when the reading is finished
readStream.on('end', () => {
  console.log('total:', total);
});

// Listen for 'error' event to handle any errors during the read process
readStream.on('error', (err: Error) => {
  console.error('An error occurred:', err.message);
  console.log('total:', total);
});