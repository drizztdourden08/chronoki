/* src/settings.h without the SDL window, key bindings or file dialogs. The host's options arrive as a ct_settings.ini in
   the core's file system (same keys as Belthasar's own file: [video] widescreen, render_scale, interpolation,
   wide_width (ChronoKi: the picture's even pixel width, 256 to 544), steam_margins, fill_bottom_lines, scene_adjustments, [sound] volume, mute, [timing] sync, instant_sound_uploads).
   The mods live in this struct, not in WRAM: vanilla (all off) is the cartridge's own behaviour. A change takes effect
   at the next core start; Save is a no-op. */
#include "settings.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static CtSettings g_set;
static int g_have = 0;
static int g_wideWidth = 0;

int ck_wide_width(void) { return g_wideWidth; }
void CtSettingsDefaults(CtSettings* s) {
  g_wideWidth = 0;
  memset(s, 0, sizeof *s);
  s->windowScale = 2; s->renderScale = 1; s->vsync = 1;
  s->volume = 100;
  for (int b = 0; b < CT_BTN_COUNT; b++) s->pad[b] = -1;
  s->touchOpacity = 45; s->touchScale = 100;
  s->sync = CT_SYNC_FRAME_PERFECT;
}
CtSettings* CtSettingsGet(void) {
  if (!g_have) { CtSettingsDefaults(&g_set); g_have = 1; }
  return &g_set;
}
static int truthy(const char* v) {
  return !strcmp(v, "1") || !strcmp(v, "true") || !strcmp(v, "on") || !strcmp(v, "yes");
}
static char* trim(char* s) {
  while (*s == ' ' || *s == '\t') s++;
  size_t n = strlen(s);
  while (n && (s[n - 1] == ' ' || s[n - 1] == '\t' || s[n - 1] == '\r' || s[n - 1] == '\n')) s[--n] = 0;
  return s;
}
static void apply(CtSettings* s, const char* sec, const char* key, const char* val) {
  int iv = atoi(val);
  if (!strcmp(sec, "video")) {
    if (!strcmp(key, "render_scale")) s->renderScale = iv < 1 ? 1 : iv > 4 ? 4 : iv;
    else if (!strcmp(key, "interpolation")) s->interpolate = truthy(val) || iv != 0;
    else if (!strcmp(key, "steam_margins")) s->wideSteamMargins = truthy(val) || iv != 0;
    else if (!strcmp(key, "fill_bottom_lines")) s->fillBottomLines = truthy(val) || iv != 0;
    else if (!strcmp(key, "scene_adjustments")) s->sceneAdjust = truthy(val) || iv != 0;
    else if (!strcmp(key, "wide_width")) g_wideWidth = iv >= 256 && iv <= 544 ? iv & ~1 : 0;
    else if (!strcmp(key, "widescreen"))
      s->widescreen = !strcmp(val, "16:9") ? CT_WIDE_16_9 : !strcmp(val, "16:10") ? CT_WIDE_16_10 : !strcmp(val, "21:9") ? CT_WIDE_21_9 : CT_WIDE_OFF;
  } else if (!strcmp(sec, "sound")) {
    if (!strcmp(key, "volume")) s->volume = iv < 0 ? 0 : iv > 100 ? 100 : iv;
    else if (!strcmp(key, "mute")) s->mute = truthy(val) || iv != 0;
  } else if (!strcmp(sec, "timing")) {
    if (!strcmp(key, "sync")) s->sync = !strcmp(val, "free") ? CT_SYNC_FREE : CT_SYNC_FRAME_PERFECT;
    else if (!strcmp(key, "instant_sound_uploads")) s->instantUploads = truthy(val) || iv != 0;
  }
}
int CtSettingsLoad(int interactive) {
  CtSettings* s = CtSettingsGet();
  CtSettingsDefaults(s);
  if (!interactive) return 0;
  FILE* f = fopen(CtSettingsPath(), "rb");
  if (!f) return 0;
  char line[256], sec[32] = "";
  while (fgets(line, sizeof line, f)) {
    char* t = trim(line);
    if (*t == '[') { char* e = strchr(t, ']'); if (e) { *e = 0; snprintf(sec, sizeof sec, "%s", t + 1); } continue; }
    char* eq = strchr(t, '=');
    if (!eq || *t == ';' || *t == '#') continue;
    *eq = 0;
    apply(s, sec, trim(t), trim(eq + 1));
  }
  fclose(f);
  return 1;
}
int CtSettingsSave(void) { return 1; }
const char* CtSettingsPath(void) { const char* p = getenv("CT_SETTINGS"); return p && *p ? p : "/ct_settings.ini"; }
const char* CtSettingsButtonName(int btn) {
  static const char* n[CT_BTN_COUNT] = { "Up", "Down", "Left", "Right", "A", "B", "X", "Y", "L", "R", "Select", "Start" };
  return btn >= 0 && btn < CT_BTN_COUNT ? n[btn] : "";
}
