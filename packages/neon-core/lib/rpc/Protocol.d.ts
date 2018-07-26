export interface ProtocolLike {
    magic: number;
    addressVersion: number;
    standbyValidators: string[];
    seedList: string[];
    systemFee: {
        [key: string]: number;
    };
}
export interface ProtocolJSON {
    Magic: number;
    AddressVersion: number;
    StandbyValidators: string[];
    SeedList: string[];
    SystemFee: {
        [key: string]: number;
    };
}
export declare class Protocol {
    magic: number;
    addressVersion: number;
    standbyValidators: string[];
    seedList: string[];
    systemFee: {
        [key: string]: number;
    };
    constructor(config?: Partial<ProtocolLike & ProtocolJSON>);
    readonly [Symbol.toStringTag]: string;
    export(): ProtocolJSON;
    equals(other: Partial<ProtocolLike & ProtocolJSON>): boolean;
}
export default Protocol;
//# sourceMappingURL=Protocol.d.ts.map