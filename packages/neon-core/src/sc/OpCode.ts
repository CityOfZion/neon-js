export enum OpCode {
  /* Constants */

  PUSHINT8 = 0x00,
  PUSHINT16 = 0x01,
  PUSHINT32 = 0x02,
  PUSHINT64 = 0x03,
  PUSHINT128 = 0x04,
  PUSHINT256 = 0x05,
  // Convert the next four bytes to an address, and push the address onto the stack.
  PUSHA = 0x0a,
  // The item <see langword="null"/> is pushed onto the stack.
  PUSHNULL = 0x0b,
  // The next byte contains the number of bytes to be pushed onto the stack.
  PUSHDATA1 = 0x0c,
  // The next two bytes contain the number of bytes to be pushed onto the stack.
  PUSHDATA2 = 0x0d,
  // The next four bytes contain the number of bytes to be pushed onto the stack.
  PUSHDATA4 = 0x0e,
  // The number -1 is pushed onto the stack.
  PUSHM1 = 0x0f,
  // The number 0 is pushed onto the stack.
  PUSH0 = 0x10,
  // The number 1 is pushed onto the stack.
  PUSH1 = 0x11,
  // The number 2 is pushed onto the stack.
  PUSH2 = 0x12,
  // The number 3 is pushed onto the stack.
  PUSH3 = 0x13,
  // The number 4 is pushed onto the stack.
  PUSH4 = 0x14,
  // The number 5 is pushed onto the stack.
  PUSH5 = 0x15,
  // The number 6 is pushed onto the stack.
  PUSH6 = 0x16,
  // The number 7 is pushed onto the stack.
  PUSH7 = 0x17,
  // The number 8 is pushed onto the stack.
  PUSH8 = 0x18,
  // The number 9 is pushed onto the stack.
  PUSH9 = 0x19,
  // The number 10 is pushed onto the stack.
  PUSH10 = 0x1a,
  // The number 11 is pushed onto the stack.
  PUSH11 = 0x1b,
  // The number 12 is pushed onto the stack.
  PUSH12 = 0x1c,
  // The number 13 is pushed onto the stack.
  PUSH13 = 0x1d,
  // The number 14 is pushed onto the stack.
  PUSH14 = 0x1e,
  // The number 15 is pushed onto the stack.
  PUSH15 = 0x1f,
  // The number 16 is pushed onto the stack.
  PUSH16 = 0x20,

  /* Flow control */

  // The operation does nothing. It is intended to fill in space if opcodes are patched.
  NOP = 0x21,
  // Unconditionally transfers control to a target instruction. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMP = 0x22,
  // Unconditionally transfers control to a target instruction. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMP_L = 0x23,
  // Transfers control to a target instruction if the value is <see langword="true"/>, not <see langword="null"/>, or non-zero. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMPIF = 0x24,
  // Transfers control to a target instruction if the value is <see langword="true"/>, not <see langword="null"/>, or non-zero. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMPIF_L = 0x25,
  // Transfers control to a target instruction if the value is <see langword="false"/>, a <see langword="null"/> reference, or zero. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMPIFNOT = 0x26,
  // Transfers control to a target instruction if the value is <see langword="false"/>, a <see langword="null"/> reference, or zero. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMPIFNOT_L = 0x27,
  // Transfers control to a target instruction if two values are equal. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMPEQ = 0x28,
  // Transfers control to a target instruction if two values are equal. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMPEQ_L = 0x29,
  // Transfers control to a target instruction when two values are not equal. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMPNE = 0x2a,
  // Transfers control to a target instruction when two values are not equal. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMPNE_L = 0x2b,
  // Transfers control to a target instruction if the first value is greater than the second value. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMPGT = 0x2c,
  // Transfers control to a target instruction if the first value is greater than the second value. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMPGT_L = 0x2d,
  // Transfers control to a target instruction if the first value is greater than or equal to the second value. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMPGE = 0x2e,
  // Transfers control to a target instruction if the first value is greater than or equal to the second value. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMPGE_L = 0x2f,
  // Transfers control to a target instruction if the first value is less than the second value. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMPLT = 0x30,
  // Transfers control to a target instruction if the first value is less than the second value. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMPLT_L = 0x31,
  // Transfers control to a target instruction if the first value is less than or equal to the second value. The target instruction is represented as a 1-byte signed offset from the beginning of the current instruction.
  JMPLE = 0x32,
  // Transfers control to a target instruction if the first value is less than or equal to the second value. The target instruction is represented as a 4-bytes signed offset from the beginning of the current instruction.
  JMPLE_L = 0x33,
  // Calls the function at the target address which is represented as a 1-byte signed offset from the beginning of the current instruction.
  CALL = 0x34,
  // Calls the function at the target address which is represented as a 4-bytes signed offset from the beginning of the current instruction.
  CALL_L = 0x35,
  // Pop the address of a function from the stack, and call the function.
  CALLA = 0x36,
  // Calls the function which is described by the token.
  CALLT = 0x37,
  // It turns the vm state to FAULT immediately, and cannot be caught.
  ABORT = 0x38,
  // Pop the top value of the stack, if it false, then exit vm execution and set vm state to FAULT.
  ASSERT = 0x39,
  // Pop the top value of the stack, and throw it.
  THROW = 0x3a,
  // TRY CatchOffset(sbyte) FinallyOffset(sbyte). If there's no catch body, set CatchOffset 0. If there's no finally body, set FinallyOffset 0.
  TRY = 0x3b,
  // TRY_L CatchOffset(int) FinallyOffset(int). If there's no catch body, set CatchOffset 0. If there's no finally body, set FinallyOffset 0.
  TRY_L = 0x3c,
  // Ensures that the appropriate surrounding finally blocks are executed. And then unconditionally transfers control to the specific target instruction, represented as a 1-byte signed offset from the beginning of the current instruction.
  ENDTRY = 0x3d,
  // Ensures that the appropriate surrounding finally blocks are executed. And then unconditionally transfers control to the specific target instruction, represented as a 4-byte signed offset from the beginning of the current instruction.
  ENDTRY_L = 0x3e,
  // End finally, If no exception happen or be catched, vm will jump to the target instruction of ENDTRY/ENDTRY_L. Otherwise vm will rethrow the exception to upper layer.
  ENDFINALLY = 0x3f,
  // Returns from the current method.
  RET = 0x40,
  // Calls to an interop service.
  SYSCALL = 0x41,

  /* Stack */

  // Puts the number of stack items onto the stack.
  DEPTH = 0x43,
  // Removes the top stack item.
  DROP = 0x45,
  // Removes the second-to-top stack item.
  NIP = 0x46,
  // The item n back in the main stack is removed.
  XDROP = 0x48,
  // Clear the stack
  CLEAR = 0x49,
  // Duplicates the top stack item.
  DUP = 0x4a,
  // Copies the second-to-top stack item to the top.
  OVER = 0x4b,
  // The item n back in the stack is copied to the top.
  PICK = 0x4d,
  // The item at the top of the stack is copied and inserted before the second-to-top item.
  TUCK = 0x4e,
  // The top two items on the stack are swapped.
  SWAP = 0x50,
  // The top three items on the stack are rotated to the left.
  ROT = 0x51,
  // The item n back in the stack is moved to the top.
  ROLL = 0x52,
  // Reverse the order of the top 3 items on the stack.
  REVERSE3 = 0x53,
  // Reverse the order of the top 4 items on the stack.
  REVERSE4 = 0x54,
  // Pop the number N on the stack, and reverse the order of the top N items on the stack.
  REVERSEN = 0x55,

  /* Slot */

  // Initialize the static field list for the current execution context.
  INITSSLOT = 0x56,
  // Initialize the argument slot and the local variable list for the current execution context.
  INITSLOT = 0x57,
  // Loads the static field at index 0 onto the evaluation stack.
  LDSFLD0 = 0x58,
  // Loads the static field at index 1 onto the evaluation stack.
  LDSFLD1 = 0x59,
  // Loads the static field at index 2 onto the evaluation stack.
  LDSFLD2 = 0x5a,
  // Loads the static field at index 3 onto the evaluation stack.
  LDSFLD3 = 0x5b,
  // Loads the static field at index 4 onto the evaluation stack.
  LDSFLD4 = 0x5c,
  // Loads the static field at index 5 onto the evaluation stack.
  LDSFLD5 = 0x5d,
  // Loads the static field at index 6 onto the evaluation stack.
  LDSFLD6 = 0x5e,
  // Loads the static field at a specified index onto the evaluation stack. The index is represented as a 1-byte unsigned integer.
  LDSFLD = 0x5f,
  // Stores the value on top of the evaluation stack in the static field list at index 0.
  STSFLD0 = 0x60,
  // Stores the value on top of the evaluation stack in the static field list at index 1.
  STSFLD1 = 0x61,
  // Stores the value on top of the evaluation stack in the static field list at index 2.
  STSFLD2 = 0x62,
  // Stores the value on top of the evaluation stack in the static field list at index 3.
  STSFLD3 = 0x63,
  // Stores the value on top of the evaluation stack in the static field list at index 4.
  STSFLD4 = 0x64,
  // Stores the value on top of the evaluation stack in the static field list at index 5.
  STSFLD5 = 0x65,
  // Stores the value on top of the evaluation stack in the static field list at index 6.
  STSFLD6 = 0x66,
  // Stores the value on top of the evaluation stack in the static field list at a specified index. The index is represented as a 1-byte unsigned integer.
  STSFLD = 0x67,
  // Loads the local variable at index 0 onto the evaluation stack.
  LDLOC0 = 0x68,
  // Loads the local variable at index 1 onto the evaluation stack.
  LDLOC1 = 0x69,
  // Loads the local variable at index 2 onto the evaluation stack.
  LDLOC2 = 0x6a,
  // Loads the local variable at index 3 onto the evaluation stack.
  LDLOC3 = 0x6b,
  // Loads the local variable at index 4 onto the evaluation stack.
  LDLOC4 = 0x6c,
  // Loads the local variable at index 5 onto the evaluation stack.
  LDLOC5 = 0x6d,
  // Loads the local variable at index 6 onto the evaluation stack.
  LDLOC6 = 0x6e,
  // Loads the local variable at a specified index onto the evaluation stack. The index is represented as a 1-byte unsigned integer.
  LDLOC = 0x6f,
  // Stores the value on top of the evaluation stack in the local variable list at index 0.
  STLOC0 = 0x70,
  // Stores the value on top of the evaluation stack in the local variable list at index 1.
  STLOC1 = 0x71,
  // Stores the value on top of the evaluation stack in the local variable list at index 2.
  STLOC2 = 0x72,
  // Stores the value on top of the evaluation stack in the local variable list at index 3.
  STLOC3 = 0x73,
  // Stores the value on top of the evaluation stack in the local variable list at index 4.
  STLOC4 = 0x74,
  // Stores the value on top of the evaluation stack in the local variable list at index 5.
  STLOC5 = 0x75,
  // Stores the value on top of the evaluation stack in the local variable list at index 6.
  STLOC6 = 0x76,
  // Stores the value on top of the evaluation stack in the local variable list at a specified index. The index is represented as a 1-byte unsigned integer.
  STLOC = 0x77,
  // Loads the argument at index 0 onto the evaluation stack.
  LDARG0 = 0x78,
  // Loads the argument at index 1 onto the evaluation stack.
  LDARG1 = 0x79,
  // Loads the argument at index 2 onto the evaluation stack.
  LDARG2 = 0x7a,
  // Loads the argument at index 3 onto the evaluation stack.
  LDARG3 = 0x7b,
  // Loads the argument at index 4 onto the evaluation stack.
  LDARG4 = 0x7c,
  // Loads the argument at index 5 onto the evaluation stack.
  LDARG5 = 0x7d,
  // Loads the argument at index 6 onto the evaluation stack.
  LDARG6 = 0x7e,
  // Loads the argument at a specified index onto the evaluation stack. The index is represented as a 1-byte unsigned integer.
  LDARG = 0x7f,
  // Stores the value on top of the evaluation stack in the argument slot at index 0.
  STARG0 = 0x80,
  // Stores the value on top of the evaluation stack in the argument slot at index 1.
  STARG1 = 0x81,
  // Stores the value on top of the evaluation stack in the argument slot at index 2.
  STARG2 = 0x82,
  // Stores the value on top of the evaluation stack in the argument slot at index 3.
  STARG3 = 0x83,
  // Stores the value on top of the evaluation stack in the argument slot at index 4.
  STARG4 = 0x84,
  // Stores the value on top of the evaluation stack in the argument slot at index 5.
  STARG5 = 0x85,
  // Stores the value on top of the evaluation stack in the argument slot at index 6.
  STARG6 = 0x86,
  // Stores the value on top of the evaluation stack in the argument slot at a specified index. The index is represented as a 1-byte unsigned integer.
  STARG = 0x87,

  /* Splice */

  NEWBUFFER = 0x88,
  MEMCPY = 0x89,
  // Concatenates two strings.
  CAT = 0x8b,
  // Returns a section of a string.
  SUBSTR = 0x8c,
  // Keeps only characters left of the specified point in a string.
  LEFT = 0x8d,
  // Keeps only characters right of the specified point in a string.
  RIGHT = 0x8e,

  /* Bitwise logic */

  // Flips all of the bits in the input.
  INVERT = 0x90,
  // Boolean and between each bit in the inputs.
  AND = 0x91,
  // Boolean or between each bit in the inputs.
  OR = 0x92,
  // Boolean exclusive or between each bit in the inputs.
  XOR = 0x93,
  // Returns 1 if the inputs are exactly equal, 0 otherwise.
  EQUAL = 0x97,
  // Returns 1 if the inputs are not equal, 0 otherwise.
  NOTEQUAL = 0x98,
  // Arithmetic
  // Puts the sign of top stack item on top of the main stack. If value is negative, put -1; if positive, put 1; if value is zero, put 0.
  SIGN = 0x99,
  // The input is made positive.
  ABS = 0x9a,
  // The sign of the input is flipped.
  NEGATE = 0x9b,
  // 1 is added to the input.
  INC = 0x9c,
  // 1 is subtracted from the input.
  DEC = 0x9d,
  // a is added to b.
  ADD = 0x9e,
  // b is subtracted from a.
  SUB = 0x9f,
  // a is multiplied by b.
  MUL = 0xa0,
  // a is divided by b.
  DIV = 0xa1,
  // Returns the remainder after dividing a by b.
  MOD = 0xa2,
  // The result of raising value to the exponent power.
  POW = 0xa3,
  // Returns the square root of a specified number.
  SQRT = 0xa4,
  // Shifts a left b bits, preserving sign.
  SHL = 0xa8,
  // Shifts a right b bits, preserving sign.
  SHR = 0xa9,
  // If the input is 0 or 1, it is flipped. Otherwise the output will be 0.
  NOT = 0xaa,
  // If both a and b are not 0, the output is 1. Otherwise 0.
  BOOLAND = 0xab,
  // If a or b is not 0, the output is 1. Otherwise 0.
  BOOLOR = 0xac,
  // Returns 0 if the input is 0. 1 otherwise.
  NZ = 0xb1,
  // Returns 1 if the numbers are equal, 0 otherwise.
  NUMEQUAL = 0xb3,
  // Returns 1 if the numbers are not equal, 0 otherwise.
  NUMNOTEQUAL = 0xb4,
  // Returns 1 if a is less than b, 0 otherwise.
  LT = 0xb5,
  // Returns 1 if a is less than or equal to b, 0 otherwise.
  LE = 0xb6,
  // Returns 1 if a is greater than b, 0 otherwise.
  GT = 0xb7,
  // Returns 1 if a is greater than or equal to b, 0 otherwise.
  GE = 0xb8,
  // Returns the smaller of a and b.
  MIN = 0xb9,
  // Returns the larger of a and b.
  MAX = 0xba,
  // Returns 1 if x is within the specified range (left-inclusive), 0 otherwise.
  WITHIN = 0xbb,

  /* Compound-type */

  // A value n is taken from top of main stack. The next n items on main stack are removed, put inside n-sized array and this array is put on top of the main stack.
  PACK = 0xc0,
  // An array is removed from top of the main stack. Its elements are put on top of the main stack (in reverse order) and the array size is also put on main stack.
  UNPACK = 0xc1,
  // An empty array (with size 0) is put on top of the main stack.
  NEWARRAY0 = 0xc2,
  // A value n is taken from top of main stack. A null-filled array with size n is put on top of the main stack.
  NEWARRAY = 0xc3,
  // A value n is taken from top of main stack. An array of type T with size n is put on top of the main stack.
  NEWARRAY_T = 0xc4,
  // An empty struct (with size 0) is put on top of the main stack.
  NEWSTRUCT0 = 0xc5,
  // A value n is taken from top of main stack. A zero-filled struct with size n is put on top of the main stack.
  NEWSTRUCT = 0xc6,
  // A Map is created and put on top of the main stack.
  NEWMAP = 0xc8,
  // An array is removed from top of the main stack. Its size is put on top of the main stack.
  SIZE = 0xca,
  // An input index n (or key) and an array (or map) are removed from the top of the main stack. Puts True on top of main stack if array) exist, and False otherwise.
  HASKEY = 0xcb,
  // A map is taken from top of the main stack. The keys of this map are put on top of the main stack.
  KEYS = 0xcc,
  // A map is taken from top of the main stack. The values of this map are put on top of the main stack.
  VALUES = 0xcd,
  // An input index n (or key) and an array (or map) are taken from main stack. Element array) is put on top of the main stack.
  PICKITEM = 0xce,
  // The item on top of main stack is removed and appended to the second item on top of the main stack.
  APPEND = 0xcf,
  // A value v, index n (or key) and an array (or map) are taken from main stack. Attribution array=v) is performed.
  SETITEM = 0xd0,
  // An array is removed from the top of the main stack and its elements are reversed.
  REVERSEITEMS = 0xd1,
  // An input index n (or key) and an array (or map) are removed from the top of the main stack. Element array) is removed.
  REMOVE = 0xd2,
  // Remove all the items from the compound-type.
  CLEARITEMS = 0xd3,
  // Remove the last element from an array and push it onto the stack.
  POPITEM = 0xd4,

  /* Types */

  // Returns true if the input is null. Returns false otherwise.
  ISNULL = 0xd8,
  // Returns true if the top item is of the specified type.
  ISTYPE = 0xd9,
  // Converts the top item to the specified type.
  CONVERT = 0xdb,
}

export function fromHex(hexstring: string): OpCode {
  const parsedInt = parseInt(hexstring, 16);
  if (parsedInt in OpCode) {
    return parsedInt as OpCode;
  }
  throw new Error(`OpCode not found! Value: ${hexstring}`);
}
export default OpCode;
