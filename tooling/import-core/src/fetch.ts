import { execFile } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { ImportError } from "./types.ts";
import type { Pin } from "./types.ts";

const run = promisify(execFile);

const git = async (args: string[], cwd?: string): Promise<string> => {
  try {
    const { stdout } = await run("git", args, { cwd, maxBuffer: 64 * 1024 * 1024 });
    return stdout.trim();
  } catch (error) {
    throw new ImportError(`git ${args[0]} failed: ${(error as Error).message}`);
  }
};

export const fetchPinned = async (pin: Pin): Promise<{ dir: string; temp: string }> => {
  const temp = await mkdtemp(join(tmpdir(), "chronoki-belthasar-"));
  const dir = join(temp, "src");
  await git(["clone", "--quiet", "--depth", "1", "--branch", pin.tag, pin.repo, dir]);
  const head = await git(["rev-parse", "HEAD"], dir);
  if (head !== pin.commit) {
    throw new ImportError(`Tag ${pin.tag} is at ${head}, but the pin says ${pin.commit}; refusing to import`);
  }
  return { dir, temp };
};
