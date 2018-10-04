export enum OpCode {
  PUSH0 = 0,
  PUSHF = 0,
  PUSHBYTES1 = 1,
  PUSHBYTES75 = 75,
  PUSHDATA1 = 76,
  PUSHDATA2 = 77,
  PUSHDATA4 = 78,
  PUSHM1 = 79,
  PUSH1 = 81,
  PUSHT = 81,
  PUSH2 = 82,
  PUSH3 = 83,
  PUSH4 = 84,
  PUSH5 = 85,
  PUSH6 = 86,
  PUSH7 = 87,
  PUSH8 = 88,
  PUSH9 = 89,
  PUSH10 = 90,
  PUSH11 = 91,
  PUSH12 = 92,
  PUSH13 = 93,
  PUSH14 = 94,
  PUSH15 = 95,
  PUSH16 = 96,
  NOP = 97,
  JMP = 98,
  JMPIF = 99,
  JMPIFNOT = 100,
  CALL = 101,
  RET = 102,
  APPCALL = 103,
  SYSCALL = 104,
  TAILCALL = 105,
  DUPFROMALTSTACK = 106,
  TOALTSTACK = 107,
  FROMALTSTACK = 108,
  XDROP = 109,
  XSWAP = 114,
  XTUCK = 115,
  DEPTH = 116,
  DROP = 117,
  DUP = 118,
  NIP = 119,
  OVER = 120,
  PICK = 121,
  ROLL = 122,
  ROT = 123,
  SWAP = 124,
  TUCK = 125,
  CAT = 126,
  SUBSTR = 127,
  LEFT = 128,
  RIGHT = 129,
  SIZE = 130,
  INVERT = 131,
  AND = 132,
  OR = 133,
  XOR = 134,
  EQUAL = 135,
  INC = 139,
  DEC = 140,
  SIGN = 141,
  NEGATE = 143,
  ABS = 144,
  NOT = 145,
  NZ = 146,
  ADD = 147,
  SUB = 148,
  MUL = 149,
  DIV = 150,
  MOD = 151,
  SHL = 152,
  SHR = 153,
  BOOLAND = 154,
  BOOLOR = 155,
  NUMEQUAL = 156,
  NUMNOTEQUAL = 158,
  LT = 159,
  GT = 160,
  LTE = 161,
  GTE = 162,
  MIN = 163,
  MAX = 164,
  WITHIN = 165,
  SHA1 = 167,
  SHA256 = 168,
  HASH160 = 169,
  HASH256 = 170,
  CHECKSIG = 172,
  CHECKMULTISIG = 174,
  ARRAYSIZE = 192,
  PACK = 193,
  UNPACK = 194,
  PICKITEM = 195,
  SETITEM = 196,
  NEWARRAY = 197,
  NEWSTRUCT = 198,
  APPEND = 200,
  REVERSE = 201,
  THROW = 240,
  THROWIFNOT = 241
}

export default OpCode;
