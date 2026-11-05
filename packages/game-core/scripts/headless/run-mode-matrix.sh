#!/bin/sh
# Usage: run-mode-matrix.sh <pack> <out dir>. Runs the Wave 3 game-mode seeds through headless-seed.mjs; run once the mode coders have landed.
pack="$1"
out="$2"
run() {
  name="$1"; shift
  node --experimental-wasm-jspi scripts/headless-seed.mjs --pack "$pack" "$@" > "$out/$name.txt" 2>&1
  echo "$name exit $?"
}
run lost-worlds --seed w3-lw --mode lost-worlds --expect-location 0x1F2 --expect 7E2885!=00 --expect 7E2887!=00 --expect 7E2889!=00
run legacy-of-cyrus --seed w3-loc --mode legacy-of-cyrus --expect 7F00F4=40/40
run ice-age --seed w3-ia --mode ice-age
run epoch-fail --seed w3-ef --option epochFail=true --expect 7E0294=80
