/* @layer shared-asset-extraction @kind constants */

const OPCODE_ROWS =
  'BRK:imm8 ORA:idx COP:imm8 ORA:sr TSB:dp ORA:dp ASL:dp ORA:idl ' +
  'PHP:imp ORA:immM ASL:acc PHD:imp TSB:abs ORA:abs ASL:abs ORA:abl ' +
  'BPL:rel ORA:idy ORA:idp ORA:isy TRB:dp ORA:dpx ASL:dpx ORA:idly ' +
  'CLC:imp ORA:aby INC:acc TCS:imp TRB:abs ORA:abx ASL:abx ORA:alx ' +
  'JSR:abs AND:idx JSL:abl AND:sr BIT:dp AND:dp ROL:dp AND:idl ' +
  'PLP:imp AND:immM ROL:acc PLD:imp BIT:abs AND:abs ROL:abs AND:abl ' +
  'BMI:rel AND:idy AND:idp AND:isy BIT:dpx AND:dpx ROL:dpx AND:idly ' +
  'SEC:imp AND:aby DEC:acc TSC:imp BIT:abx AND:abx ROL:abx AND:alx ' +
  'RTI:imp EOR:idx WDM:imm8 EOR:sr MVP:bm EOR:dp LSR:dp EOR:idl ' +
  'PHA:imp EOR:immM LSR:acc PHK:imp JMP:abs EOR:abs LSR:abs EOR:abl ' +
  'BVC:rel EOR:idy EOR:idp EOR:isy MVN:bm EOR:dpx LSR:dpx EOR:idly ' +
  'CLI:imp EOR:aby PHY:imp TCD:imp JML:abl EOR:abx LSR:abx EOR:alx ' +
  'RTS:imp ADC:idx PER:rell ADC:sr STZ:dp ADC:dp ROR:dp ADC:idl ' +
  'PLA:imp ADC:immM ROR:acc RTL:imp JMP:ind ADC:abs ROR:abs ADC:abl ' +
  'BVS:rel ADC:idy ADC:idp ADC:isy STZ:dpx ADC:dpx ROR:dpx ADC:idly ' +
  'SEI:imp ADC:aby PLY:imp TDC:imp JMP:iax ADC:abx ROR:abx ADC:alx ' +
  'BRA:rel STA:idx BRL:rell STA:sr STY:dp STA:dp STX:dp STA:idl ' +
  'DEY:imp BIT:immM TXA:imp PHB:imp STY:abs STA:abs STX:abs STA:abl ' +
  'BCC:rel STA:idy STA:idp STA:isy STY:dpx STA:dpx STX:dpy STA:idly ' +
  'TYA:imp STA:aby TXS:imp TXY:imp STZ:abs STA:abx STZ:abx STA:alx ' +
  'LDY:immX LDA:idx LDX:immX LDA:sr LDY:dp LDA:dp LDX:dp LDA:idl ' +
  'TAY:imp LDA:immM TAX:imp PLB:imp LDY:abs LDA:abs LDX:abs LDA:abl ' +
  'BCS:rel LDA:idy LDA:idp LDA:isy LDY:dpx LDA:dpx LDX:dpy LDA:idly ' +
  'CLV:imp LDA:aby TSX:imp TYX:imp LDY:abx LDA:abx LDX:aby LDA:alx ' +
  'CPY:immX CMP:idx REP:imm8 CMP:sr CPY:dp CMP:dp DEC:dp CMP:idl ' +
  'INY:imp CMP:immM DEX:imp WAI:imp CPY:abs CMP:abs DEC:abs CMP:abl ' +
  'BNE:rel CMP:idy CMP:idp CMP:isy PEI:dp CMP:dpx DEC:dpx CMP:idly ' +
  'CLD:imp CMP:aby PHX:imp STP:imp JML:ial CMP:abx DEC:abx CMP:alx ' +
  'CPX:immX SBC:idx SEP:imm8 SBC:sr CPX:dp SBC:dp INC:dp SBC:idl ' +
  'INX:imp SBC:immM NOP:imp XBA:imp CPX:abs SBC:abs INC:abs SBC:abl ' +
  'BEQ:rel SBC:idy SBC:idp SBC:isy PEA:abs SBC:dpx INC:dpx SBC:idly ' +
  'SED:imp SBC:aby PLX:imp XCE:imp JSR:iax SBC:abx INC:abx SBC:alx';

const FIXED_LENGTH: Record<string, number> = {
  imp: 0, acc: 0, imm8: 1, dp: 1, dpx: 1, dpy: 1, idp: 1, idx: 1, idy: 1, idl: 1, idly: 1, sr: 1, isy: 1, rel: 1,
  abs: 2, abx: 2, aby: 2, ind: 2, iax: 2, ial: 2, rell: 2, bm: 2, abl: 3, alx: 3,
};

export { FIXED_LENGTH, OPCODE_ROWS };
