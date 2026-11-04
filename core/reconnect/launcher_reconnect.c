/* launcher.h without a launcher: the shell has already put the player's data in the core's file system
   (/ct_assets.dat and, when separate, /ct_tables.dat; /ct_settings.ini; /saves). CtLauncherConfigure turns the start
   into "--assets /ct_assets.dat --boot", the arguments Belthasar's own launcher would have made. */
#include "launcher.h"
#include <stdlib.h>
#include <string.h>

int CtLauncherConfigure(int* argc, char*** argv) {
  static char a0[] = "chronoki", a1[] = "--assets", a2[] = "/ct_assets.dat", a3[] = "--boot";
  static char* args[] = { a0, a1, a2, a3, NULL };
  extern int setenv(const char*, const char*, int);
  setenv("CT_SRAM", "/saves/ct_sram.srm", 0);
  setenv("CT_SETTINGS", "/ct_settings.ini", 0);
  *argc = 4; *argv = args;
  return 0;
}
int CtLauncherTakeRom(const CtLauncher* L, const char* path, char* msg, size_t msgLen) { (void)L; (void)path; if (msg && msgLen) msg[0] = 0; return 0; }
CtSetupJob* CtLauncherSetupStart(const CtLauncher* L, char* msg, size_t msgLen) { (void)L; if (msg && msgLen) msg[0] = 0; return NULL; }
void CtLauncherSetupPoll(CtSetupJob* j, CtSetupStatus* st) { (void)j; if (st) { st->running = 0; st->exitCode = 0; st->done = st->total = 0; st->line[0] = 0; } }
void CtLauncherSetupFree(CtSetupJob* j) { (void)j; }
int CtLauncherReady(const CtLauncher* L) { (void)L; return 1; }
int CtLauncherBrowse(char* out, size_t outLen) { if (out && outLen) out[0] = 0; return 0; }
void CtLauncherReveal(const char* path) { (void)path; }
int CtLauncherUi(CtLauncher* L, const char* dropped) { (void)L; (void)dropped; return 1; }
