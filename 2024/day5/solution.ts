import { readStdin } from "../common/readStdin.js";

function buildDataset(
  input: string
): [pageOrderingDict: Map<string, Set<string>>, pages: string[][]] {
  const lines = input.split("\n");
  let line = lines.shift();

  // page ordering is first - read until the first empty line
  const pageOrderingDict: Map<string, Set<string>> = new Map();
  while (line.length > 0) {
    const [key, before] = line.split("|");
    if (pageOrderingDict.has(key)) {
      pageOrderingDict.get(key).add(before);
    } else {
      pageOrderingDict.set(key, new Set([before]));
    }
    line = lines.shift();
  }
  console.log(pageOrderingDict);

  // pages are next - read until the end of file
  const pages: string[][] = [];
  line = lines.shift();
  while (line) {
    pages.push(line.split(","));
    line = lines.shift();
  }
  console.log(pages);

  return [pageOrderingDict, pages];
}

function separatePages(
  pageOrderingDict: Map<string, Set<string>>,
  pages: string[][]
): [orderedPages: string[][], incorrectlyOrderedPages: string[][]] {
  const orderedPages: string[][] = [];
  const incorrectlyOrderedPages: string[][] = [];
  for (const page of pages) {
    let isValid = true;
    for (let i = 0; i < page.length; i++) {
      const key = page[i];
      // page contains both keys then it must come before
      if (pageOrderingDict.has(key)) {
        const rules = pageOrderingDict.get(key);
        for (let j = 0; j < i; j++) {
          // inspect previous entries
          if (rules.has(page[j])) {
            isValid = false;
            // move element to correct spot
            const [removed] = page.splice(i, 1);
            page.splice(j, 0, removed);
            // reset i to do another pass
            i = -1;
            break;
          }
        }
      }
    }
    if (isValid) {
      orderedPages.push(page);
    } else {
      incorrectlyOrderedPages.push(page);
    }
  }
  return [orderedPages, incorrectlyOrderedPages];
}

function midPointSum(pages: string[][]) {
  let total = 0;
  for (const page of pages) {
    const mid = page[Math.round(page.length / 2) - 1];
    total += parseInt(mid, 10);
  }
  return total;
}

(async function main() {
  const input = await readStdin(true);
  const [pageOrderingDict, pages] = buildDataset(input);
  const [orderedPages, incorrectlyOrderedPages] = separatePages(
    pageOrderingDict,
    pages
  );
  console.log(orderedPages);
  console.log("Total part 1: ", midPointSum(orderedPages));
  console.log(incorrectlyOrderedPages);
  console.log("Total part 2: ", midPointSum(incorrectlyOrderedPages));
})();
