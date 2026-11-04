/* The CKST v2 container: "CKST", u32 version 2, u32 section count, then per section a 4 byte tag, u32 section version,
   u32 length and the bytes. Every section is version 1 for now; the stamp's schema hash is what tells layouts apart. */
#include "ck_state_internal.h"
#include <stdlib.h>
#include <string.h>

#define CK_BOX_VERSION 2
#define CK_SECTION_VERSION 1

uint8_t* ck_box_build(const CkSection* sections, int count, size_t* outLen) {
  size_t total = 12;
  for (int i = 0; i < count; i++) total += 12 + sections[i].len;
  uint8_t* out = (uint8_t*)malloc(total);
  if (!out) return NULL;
  memcpy(out, "CKST", 4);
  ck_put32(out + 4, CK_BOX_VERSION);
  ck_put32(out + 8, (uint32_t)count);
  size_t at = 12;
  for (int i = 0; i < count; i++) {
    memcpy(out + at, sections[i].tag, 4);
    ck_put32(out + at + 4, CK_SECTION_VERSION);
    ck_put32(out + at + 8, (uint32_t)sections[i].len);
    if (sections[i].len) memcpy(out + at + 12, sections[i].data, sections[i].len);
    at += 12 + sections[i].len;
  }
  *outLen = at;
  return out;
}

CkSpan ck_box_find(const uint8_t* box, size_t len, const char* tag) {
  CkSpan none = { NULL, 0 };
  uint32_t count = len >= 12 ? ck_get32(box + 8) : 0;
  size_t at = 12;
  for (uint32_t i = 0; i < count; i++) {
    if (at + 12 > len) return none;
    uint32_t n = ck_get32(box + at + 8);
    if (n > len - at - 12) return none;
    if (!memcmp(box + at, tag, 4)) { CkSpan s = { box + at + 12, n }; return s; }
    at += 12 + n;
  }
  return none;
}

int ck_box_has_line(CkSpan stamp, const char* line) {
  size_t n = strlen(line);
  for (size_t i = 0; i + n <= stamp.len; i++)
    if (!memcmp(stamp.data + i, line, n) && (i == 0 || stamp.data[i - 1] == '\n') && (i + n == stamp.len || stamp.data[i + n] == '\n')) return 1;
  return 0;
}
