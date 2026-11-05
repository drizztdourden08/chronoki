#!/bin/sh
# Usage: run-matrix.sh <pack> <out dir>. Runs the V4 seed matrix through headless-seed.mjs, one file of check lines per run.
pack="$1"
out="$2"
run() {
  name="$1"; shift
  node --experimental-wasm-jspi scripts/headless-seed.mjs --pack "$pack" "$@" > "$out/$name.txt" 2>&1
  echo "$name exit $?"
}
run r2 --seed v4-2 --party crono,lucca,robo
run r3 --seed v4-3 --party marle,crono,lucca,robo,frog
run r4 --seed v4-4 --option earlyPendantCharge=true
run r5 --seed v4-5 --option unlockedMagic=true
run r6 --seed v4-6 --option itemDifficulty=hard
run r7 --seed v4-7 --party frog,ayla,magus --option unlockedMagic=true --option earlyPendantCharge=true --option itemDifficulty=hard
