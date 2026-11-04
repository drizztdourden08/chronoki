/* The HOST section: CtHostState (ck_host_state.h) written field by field from its table, by name and size, never as one
   struct copy, so the bytes do not depend on the struct's padding or order. A load matches each record to a field of the
   same name and size and leaves any other field as the caller filled it (the live value); the stamp's schema hash, made
   over the field list, refuses a state whose list differs before it gets here. */
#include "ck_state_internal.h"
#include <string.h>

size_t ck_host_encode(uint8_t* out, const void* host, const CkHostField* table, int count) {
  size_t at = 0;
  for (int i = 0; i < count; i++) {
    size_t n = strlen(table[i].name);
    if (n > 255) n = 255;
    if (out) {
      out[at] = (uint8_t)n;
      memcpy(out + at + 1, table[i].name, n);
      ck_put32(out + at + 1 + n, table[i].size);
      memcpy(out + at + 5 + n, (const uint8_t*)host + table[i].offset, table[i].size);
    }
    at += 5 + n + table[i].size;
  }
  return at;
}

static const CkHostField* fieldNamed(const CkHostField* table, int count, const uint8_t* name, size_t n) {
  for (int i = 0; i < count; i++)
    if (strlen(table[i].name) == n && !memcmp(table[i].name, name, n)) return &table[i];
  return NULL;
}

int ck_host_decode(void* host, const CkHostField* table, int count, CkSpan section) {
  size_t at = 0;
  while (at < section.len) {
    size_t n = section.data[at];
    if (at + 5 + n > section.len) return 0;
    uint32_t size = ck_get32(section.data + at + 1 + n);
    if (size > section.len - at - 5 - n) return 0;
    const CkHostField* f = fieldNamed(table, count, section.data + at + 1, n);
    if (f && f->size == size) memcpy((uint8_t*)host + f->offset, section.data + at + 5 + n, size);
    at += 5 + n + size;
  }
  return 1;
}
