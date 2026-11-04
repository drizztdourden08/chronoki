/* The save state's stamp and its schema check (I-77). The stamp lists the schema id of every section the state carries
   (`sections=NAME:id,...`, the ids from core/wasm-build/state-stamp.mjs); a state loads when each section it carries is
   listed with this build's id. A section it does not carry (MENU in a field state) is never compared, and a core version
   bump that changes no section refuses nothing. A state from a core before per-section ids stamped only the whole-state
   `schema=` hash: CK_STATE_PAST (state-past.mjs) gives the section ids of each layout those cores wrote, and the same rule
   applies. The stamp this build reports (ck_state_stamp) lists all its ids and the past layouts, for the app's own check. */
#include "ck_state_internal.h"
#include "ck_state_stamp.h"
#include <string.h>

typedef struct { const char* tag; const char* name; const char* id; } CkSectionId;
typedef struct { const char* schema; const char* sections; } CkPastLayout;

static const CkSectionId g_ids[CK_STATE_SECTION_COUNT] = CK_STATE_SECTION_IDS;
static const CkPastLayout g_past[CK_STATE_PAST_COUNT] = CK_STATE_PAST;

static void put(char* out, size_t cap, size_t* at, const char* text) {
  size_t n = strlen(text);
  if (*at + n >= cap) n = *at + 1 < cap ? cap - *at - 1 : 0;
  memcpy(out + *at, text, n);
  *at += n;
  out[*at] = 0;
}

static const CkSectionId* idOfTag(const char* tag) {
  for (int i = 0; i < CK_STATE_SECTION_COUNT; i++) if (!memcmp(g_ids[i].tag, tag, 4)) return &g_ids[i];
  return NULL;
}

static void putId(char* out, size_t cap, size_t* at, const CkSectionId* id, int* first) {
  if (!id) return;
  if (!*first) put(out, cap, at, ",");
  put(out, cap, at, id->name); put(out, cap, at, ":"); put(out, cap, at, id->id);
  *first = 0;
}

int ck_schema_stamp(char* out, size_t cap, const char* mode, const CkSection* sections, int count, int current) {
  size_t at = 0;
  int first = 1;
  if (!out || !cap) return 0;
  out[0] = 0;
  put(out, cap, &at, "pin=" CK_STATE_PIN_COMMIT "\ncore=" CK_STATE_CORE_VERSION "\nschema=" CK_STATE_SCHEMA "\nmode=");
  put(out, cap, &at, mode);
  put(out, cap, &at, "\nsections=");
  if (current) for (int i = 0; i < CK_STATE_SECTION_COUNT; i++) putId(out, cap, &at, &g_ids[i], &first);
  else for (int i = 0; i < count; i++) putId(out, cap, &at, idOfTag(sections[i].tag), &first);
  put(out, cap, &at, "\n");
  if (!current) return (int)at;
  put(out, cap, &at, "past=");
  for (int i = 0; i < CK_STATE_PAST_COUNT; i++) {
    if (i) put(out, cap, &at, ";");
    put(out, cap, &at, g_past[i].schema); put(out, cap, &at, "/"); put(out, cap, &at, g_past[i].sections);
  }
  put(out, cap, &at, "\n");
  return (int)at;
}

static CkSpan lineValue(CkSpan stamp, const char* key) {
  CkSpan none = { NULL, 0 };
  size_t k = strlen(key);
  for (size_t i = 0; i + k <= stamp.len; i++) {
    if ((i && stamp.data[i - 1] != '\n') || memcmp(stamp.data + i, key, k)) continue;
    size_t e = i + k;
    while (e < stamp.len && stamp.data[e] != '\n') e++;
    CkSpan v = { stamp.data + i + k, (uint32_t)(e - i - k) };
    return v;
  }
  return none;
}

static int listHas(CkSpan list, const CkSectionId* id) {
  size_t a = strlen(id->name), b = strlen(id->id), n = a + 1 + b;
  for (size_t i = 0; i + n <= list.len; i++) {
    const uint8_t* q = list.data + i;
    if ((i && q[-1] != ',') || (i + n < list.len && q[n] != ',')) continue;
    if (!memcmp(q, id->name, a) && q[a] == ':' && !memcmp(q + a + 1, id->id, b)) return 1;
  }
  return 0;
}

static int sectionsMatch(const uint8_t* box, size_t len, CkSpan list) {
  uint32_t carried = 1;   /* STMP */
  for (int i = 0; i < CK_STATE_SECTION_COUNT; i++) {
    if (!ck_box_find(box, len, g_ids[i].tag).data) continue;
    carried++;
    if (!listHas(list, &g_ids[i])) return 0;
  }
  return carried == ck_get32(box + 8);   /* a section this build does not know refuses the state */
}

int ck_schema_accepts(const uint8_t* box, size_t len, CkSpan stamp) {
  if (ck_box_has_line(stamp, "legacy=1")) return 1;
  CkSpan list = lineValue(stamp, "sections=");
  if (list.data) return sectionsMatch(box, len, list);
  CkSpan schema = lineValue(stamp, "schema=");
  for (int i = 0; schema.data && i < CK_STATE_PAST_COUNT; i++) {
    size_t n = strlen(g_past[i].schema);
    if (schema.len != n || memcmp(schema.data, g_past[i].schema, n)) continue;
    CkSpan past = { (const uint8_t*)g_past[i].sections, (uint32_t)strlen(g_past[i].sections) };
    return sectionsMatch(box, len, past);
  }
  return 0;
}
