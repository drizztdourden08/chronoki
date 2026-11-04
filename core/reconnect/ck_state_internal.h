/* What the save-state files share (ck_state.c, ck_state_box.c, ck_state_host.c): little-endian words, a span of bytes,
   the container's sections and the host section's coding. */
#ifndef CK_STATE_INTERNAL_H
#define CK_STATE_INTERNAL_H
#include "ck_reconnect.h"
#include <stddef.h>
#include <stdint.h>

typedef struct { const uint8_t* data; uint32_t len; } CkSpan;
typedef struct { const char* tag; const uint8_t* data; size_t len; } CkSection;

static inline void ck_put32(uint8_t* p, uint32_t v) { p[0] = (uint8_t)v; p[1] = (uint8_t)(v >> 8); p[2] = (uint8_t)(v >> 16); p[3] = (uint8_t)(v >> 24); }
static inline uint32_t ck_get32(const uint8_t* p) { return (uint32_t)p[0] | ((uint32_t)p[1] << 8) | ((uint32_t)p[2] << 16) | ((uint32_t)p[3] << 24); }

/* ck_state_box.c: the CKST v2 container */
uint8_t* ck_box_build(const CkSection* sections, int count, size_t* outLen);   /* malloc'd container, NULL on failure */
CkSpan ck_box_find(const uint8_t* box, size_t len, const char* tag);          /* {NULL, 0} when absent or malformed */
int ck_box_has_line(CkSpan stamp, const char* line);                          /* the stamp holds this exact "key=value" line */

/* ck_state_schema.c: the stamp text and the per-section schema check */
int ck_schema_stamp(char* out, size_t cap, const char* mode, const CkSection* sections, int count, int current);
                                              /* current: all this build's ids and the past layouts; else those of sections */
int ck_schema_accepts(const uint8_t* box, size_t len, CkSpan stamp);   /* every section the state carries has this build's id */

/* ck_state_host.c: the HOST section, one record per field: u8 name length, the name, u32 size, the bytes */
size_t ck_host_encode(uint8_t* out, const void* host, const CkHostField* table, int count);   /* out NULL: the size only */
int ck_host_decode(void* host, const CkHostField* table, int count, CkSpan section);          /* 0 if malformed */

/* ck_state_host.c: the WRLD section, the same records over live objects (strict on load) */
size_t ck_fields_encode(uint8_t* out, const CkPtrField* table, int count);   /* out NULL: the size only */
int ck_fields_check(const CkPtrField* table, int count, CkSpan section);     /* 1 if the section holds exactly the table's records */
int ck_fields_decode(const CkPtrField* table, int count, CkSpan section);    /* check, then write; 0 if not matching */
int ck_fields_get(CkSpan section, const char* name, void* dst, uint32_t size);   /* one record out by name and size, no live object touched */

/* ck_state_host.c: the MPIC section (the frozen field frame, run-length coded) */
size_t ck_rle_pack(uint8_t* out, const uint8_t* px, size_t npx);              /* out NULL: the size only */
int ck_rle_unpack(uint8_t* px, size_t npx, CkSpan section);                  /* 0 if malformed or not exactly npx pixels */
#endif
