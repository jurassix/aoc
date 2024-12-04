import { createInterface } from 'readline';

export async function readStdin(preserveNewlines = false) {
  const rl = createInterface({
    input: process.stdin,
  });

  let data = '';

  try {
    for await (const line of rl) {
      data += line + (preserveNewlines ? '\n' : '');
    }
  } catch (err) {
    console.error(err);
  } finally {
    rl.close();
  }

  // remove the last newline if we're preserving them
  return preserveNewlines ? data.slice(0, -1) : data;
}