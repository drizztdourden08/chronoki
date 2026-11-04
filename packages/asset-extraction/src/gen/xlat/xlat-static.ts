/* @layer shared-asset-extraction @kind logic */
import { decodeAt } from './decode-at';
import { successors } from './successors';
import type { Site, Sites, XlatInput } from './xlat-site.type';
import { BRANCH, NOT_CODE, STATIC_RUN } from './xlat-static.constants';
import type { Work } from './xlat-static.type';

const seedWork = (sites: Sites): Work[] =>
  [...sites].flatMap(([adr, s]) => {
    if (!BRANCH.has(s.op)) return [];
    const r = successors(adr, s);
    const starts = r.falls ? [...r.targets, r.next] : r.targets;
    return starts.map((to) => ({ adr: to, m: r.m, x: r.x, depth: 0, image: s.image }));
  });

const followers = (w: Work, site: Site): Work[] => {
  if (site.op === 0x28 || site.op === 0xfb) return [];
  const r = successors(w.adr, site);
  const follows = BRANCH.has(site.op) || site.op === 0x80 || site.op === 0x82;
  const to = [...(follows ? r.targets : []), ...(r.falls ? [r.next] : [])];
  return to.map((adr) => ({ adr, m: r.m, x: r.x, depth: w.depth + 1, image: w.image }));
};

const admit = (input: XlatInput, sites: Sites, w: Work): Site | null => {
  if (sites.has(w.adr) || input.stops.has(w.adr) || w.depth >= STATIC_RUN) return null;
  const d = decodeAt(input, w);
  if (d === null || NOT_CODE.has(d.op)) return null;
  const site: Site = { ...d, m: w.m, x: w.x, traced: false, smc: false, variants: new Set([d.bytes.join(',')]), image: w.image };
  sites.set(w.adr, site);
  return site;
};

const extendStatically = (input: XlatInput, sites: Sites): number => {
  const work = seedWork(sites);
  let added = 0;
  for (let w = work.pop(); w !== undefined; w = work.pop()) {
    const site = admit(input, sites, w);
    if (site === null) continue;
    added += 1;
    work.push(...followers(w, site));
  }
  return added;
};

export { extendStatically };
