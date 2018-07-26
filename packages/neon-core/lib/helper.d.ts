export interface NeonObject {
    export(): object;
    equals<T>(other: Partial<T>): boolean;
}
export declare function compareNeonObjectArray(arr1: NeonObject[], arr2?: any[]): boolean;
export declare function compareObject(current: {
    [key: string]: any;
}, other: {
    [key: string]: any;
}): boolean;
export declare function compareUnsortedPlainArrays(current: any[], other: any[]): boolean;
export declare function compareArray(current: any[], other: any[]): boolean;
//# sourceMappingURL=helper.d.ts.map