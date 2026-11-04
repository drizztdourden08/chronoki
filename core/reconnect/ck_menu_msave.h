/* The members of main()'s anonymous-struct local mSave (the C0/011B save block mirrored on the live values: lead tile and facing,
   3x PC pixel position, the party shadow) that the MENU section keeps. The host-fields parser (core/wasm-build/main-locals.mjs)
   cannot see an anonymous-struct local, so this local is not in HOST and the MENU section carries it by member; the build
   (core/wasm-build/menu-fields.mjs) checks the member list against the struct body. An X-macro list with no guard: whoever
   includes it defines CK_MSAVE(member) first. */
CK_MSAVE(valid) CK_MSAVE(px) CK_MSAVE(py) CK_MSAVE(pz) CK_MSAVE(pfac) CK_MSAVE(pcObj) CK_MSAVE(pcX) CK_MSAVE(pcY) CK_MSAVE(pcPrio)
CK_MSAVE(party)
