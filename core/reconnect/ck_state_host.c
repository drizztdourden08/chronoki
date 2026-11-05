/* The HOST section: CtHostState (ck_host_state.h) written field by field from its table, by name and size, never as one
   struct copy, so the bytes do not depend on the struct's padding or order. A load matches each record to a field of the
   same name and size and leaves any other field as the caller filled it (the live value); the HOST section's schema id in
   the stamp, made over the field list, refuses a state whose list differs before it gets here (ck_state_schema.c). */
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

/* One int record of a HOST section by name, read without a CtHostState (ck_state_load_in_sequence). */
int ck_host_get_int(CkSpan section, const char* name, int* out) {
  const size_t want = strlen(name);
  size_t at = 0;
  while (at < section.len) {
    size_t n = section.data[at];
    if (at + 5 + n > section.len) return 0;
    uint32_t size = ck_get32(section.data + at + 1 + n);
    if (size > section.len - at - 5 - n) return 0;
    if (n == want && size == sizeof(int) && !memcmp(section.data + at + 1, name, n)) {
      memcpy(out, section.data + at + 5 + n, sizeof(int));
      return 1;
    }
    at += 5 + n + size;
  }
  return 0;
}

/* The WRLD section (overworld) uses the same records over live objects: CkPtrField gives each one's address, so a World
   field, a world.c static and a field.c static are all written by name and size. Unlike HOST, a load is strict: the
   section must hold exactly the table's records (ck_fields_check, run before the load touches anything) and a record
   whose size differs is an error, because the overworld's state is only half a state when a record is skipped. */
size_t ck_fields_encode(uint8_t* out, const CkPtrField* table, int count) {
  size_t at = 0;
  for (int i = 0; i < count; i++) {
    size_t n = strlen(table[i].name);
    if (n > 255) n = 255;
    if (out) {
      out[at] = (uint8_t)n;
      memcpy(out + at + 1, table[i].name, n);
      ck_put32(out + at + 1 + n, table[i].size);
      memcpy(out + at + 5 + n, table[i].ptr, table[i].size);
    }
    at += 5 + n + table[i].size;
  }
  return at;
}

#define CK_FIELDS_MAX 512

static int fieldIndex(const CkPtrField* table, int count, const uint8_t* name, size_t n) {
  for (int i = 0; i < count; i++)
    if (strlen(table[i].name) == n && !memcmp(table[i].name, name, n)) return i;
  return -1;
}

static int walkFields(const CkPtrField* table, int count, CkSpan section, int apply) {
  uint8_t seen[CK_FIELDS_MAX] = { 0 };
  if (count > CK_FIELDS_MAX) return 0;
  size_t at = 0;
  int matched = 0;
  while (at < section.len) {
    size_t n = section.data[at];
    if (at + 5 + n > section.len) return 0;
    uint32_t size = ck_get32(section.data + at + 1 + n);
    if (size > section.len - at - 5 - n) return 0;
    int i = fieldIndex(table, count, section.data + at + 1, n);
    if (i < 0 || seen[i] || table[i].size != size) return 0;
    seen[i] = 1;
    matched++;
    if (apply) memcpy(table[i].ptr, section.data + at + 5 + n, size);
    at += 5 + n + size;
  }
  return matched == count;
}

int ck_fields_check(const CkPtrField* table, int count, CkSpan section) { return walkFields(table, count, section, 0); }
int ck_fields_decode(const CkPtrField* table, int count, CkSpan section) { return walkFields(table, count, section, 1); }

/* One record of a section by name, copied out without touching any live object (the menu load reads the caller's stash this
   way, before the underlying mode is entered). 0 if the record is absent or its size differs. */
int ck_fields_get(CkSpan section, const char* name, void* dst, uint32_t size) {
  size_t want = strlen(name), at = 0;
  while (at < section.len) {
    size_t n = section.data[at];
    if (at + 5 + n > section.len) return 0;
    uint32_t rec = ck_get32(section.data + at + 1 + n);
    if (rec > section.len - at - 5 - n) return 0;
    if (n == want && !memcmp(section.data + at + 1, name, n)) {
      if (rec != size) return 0;
      memcpy(dst, section.data + at + 5 + n, size);
      return 1;
    }
    at += 5 + n + rec;
  }
  return 0;
}

/* The MPIC section: the frozen field frame (3 bytes a pixel) run-length coded as [count 1..255][r g b] records. */
size_t ck_rle_pack(uint8_t* out, const uint8_t* px, size_t npx) {
  size_t at = 0;
  for (size_t i = 0; i < npx;) {
    size_t run = 1;
    while (i + run < npx && run < 255 && !memcmp(px + 3 * i, px + 3 * (i + run), 3)) run++;
    if (out) { out[at] = (uint8_t)run; memcpy(out + at + 1, px + 3 * i, 3); }
    at += 4;
    i += run;
  }
  return at;
}

int ck_rle_unpack(uint8_t* px, size_t npx, CkSpan section) {
  size_t at = 0, i = 0;
  if (section.len % 4) return 0;
  while (at < section.len) {
    size_t run = section.data[at];
    if (!run || i + run > npx) return 0;
    for (size_t k = 0; k < run; k++) memcpy(px + 3 * (i + k), section.data + at + 1, 3);
    i += run;
    at += 4;
  }
  return i == npx;
}
