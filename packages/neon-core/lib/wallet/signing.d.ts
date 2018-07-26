import { ec as EC } from "elliptic";
export declare const curve: EC;
export declare function sign(hex: string, privateKey: string): string;
export declare function verify(hex: string, sig: string, publicKey: string): boolean;
//# sourceMappingURL=signing.d.ts.map