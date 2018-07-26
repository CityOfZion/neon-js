export declare enum StackItemType {
    "ByteArray" = 0,
    "Boolean" = 1,
    "Integer" = 2,
    "InteropInterface" = 4,
    "Array" = 128,
    "Struct" = 129,
    "Map" = 130
}
export interface StackItemLike {
    type: StackItemType | keyof typeof StackItemType | number;
    value: string | number | boolean | StackItemLike[] | StackItemMapLike[];
}
export interface StackItemMapLike {
    key: StackItem | StackItemLike;
    value: StackItem | StackItemLike;
}
export interface StackItemMap {
    key: StackItem;
    value: StackItem;
}
export declare class StackItem {
    static deserialize(hex: string): StackItem;
    private static _deserialize;
    type: StackItemType;
    value: string | number | boolean | StackItem[] | StackItemMap[];
    constructor(obj: Partial<StackItemLike>);
    export(): StackItemLike;
}
export default StackItem;
/**
 * Determine if there's a nested set based on type
 */
export declare function hasChildren(type: StackItemType): boolean;
//# sourceMappingURL=StackItem.d.ts.map