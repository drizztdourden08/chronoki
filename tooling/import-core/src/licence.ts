import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImportError } from "./types.ts";

const mitBody = `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;

const normalise = (text: string): string => text.replace(/\s+/g, " ").trim().toLowerCase();

export const isMit = (text: string): boolean => normalise(text).includes(normalise(mitBody));

export const assertMitLicence = async (sourceDir: string): Promise<void> => {
  let text: string;
  try {
    text = await readFile(join(sourceDir, "LICENSE"), "utf8");
  } catch {
    throw new ImportError("The fetched source has no LICENSE file; refusing to import");
  }
  if (!isMit(text)) throw new ImportError("The fetched LICENSE is not the MIT licence; refusing to import");
};
