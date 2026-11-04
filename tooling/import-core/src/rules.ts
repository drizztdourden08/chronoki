// What is imported from BelthasarProject, and what is left behind.
//
// Imported: the game's C engine (src/**, minus the frontend sources below), the LakeSnes
// emulator (snes/**), the licences, and CMakeLists.txt (read-only reference for the source lists).
// Headers of the frontend (present.h, settings.h, launcher.h, overlay.h, touchpad.h, ...) ARE
// imported: core/reconnect/ implements them. Dropped: the frontend implementations, C++ and
// Objective-C (ImGui overlay, launcher UI, macOS), android/, platform/, tools/ (Python),
// assets/, docs/, tests/, disasm/, binaries and data files.

export const importRoots = ["src", "snes"];

export const importExtensions = [".c", ".h"];

export const extraFiles = ["LICENSE", "CMakeLists.txt", "CREDITS.md", "snes/LICENSE.LakeSnes.txt"];

export const droppedSources = new Set([
  "src/present.c",
  "src/present_vk.c",
  "src/settings.c",
  "src/launcher.c",
  "src/launcher_ui_stub.c",
  "src/touchpad.c",
  "src/android.c",
  "src/viewer.c",
]);

export const isImported = (relPath: string): boolean => {
  if (droppedSources.has(relPath)) return false;
  const inRoot = importRoots.some((root) => relPath.startsWith(`${root}/`));
  return inRoot && importExtensions.some((ext) => relPath.endsWith(ext));
};
