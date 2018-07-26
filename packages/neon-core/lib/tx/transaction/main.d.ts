import { StringStream } from "../../u";
import { TransactionLike } from "./BaseTransaction";
export declare function deserializeType(ss: StringStream, tx?: Partial<TransactionLike>): Partial<TransactionLike>;
export declare function deserializeVersion(ss: StringStream, tx?: Partial<TransactionLike>): Partial<TransactionLike>;
export declare function deserializeAttributes(ss: StringStream, tx: Partial<TransactionLike>): Partial<TransactionLike>;
export declare function deserializeInputs(ss: StringStream, tx: Partial<TransactionLike>): Partial<TransactionLike>;
export declare function deserializeOutputs(ss: StringStream, tx: Partial<TransactionLike>): Partial<TransactionLike>;
export declare function deserializeWitnesses(ss: StringStream, tx: Partial<TransactionLike>): Partial<TransactionLike>;
export declare function deserializeArrayOf<T>(type: (ss: StringStream) => T, ss: StringStream): T[];
export declare function serializeArrayOf(prop: any[]): string;
//# sourceMappingURL=main.d.ts.map