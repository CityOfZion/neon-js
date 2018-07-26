/**
 * @class StringStream
 * @classdesc A simple string stream that allows user to read a string byte by byte using read().
 * @param {string} str - The string to read as a stream.
 */
export declare class StringStream {
    str: string;
    pter: number;
    constructor(str?: string);
    /**
     * Checks if reached the end of the stream. Does not mean stream is actually empty (this.str is not empty)
     */
    isEmpty(): boolean;
    /**
     * Peek at the next bytes  on the string. May return less than intended bytes if reaching end of stream.
     */
    peek(bytes?: number): string;
    /**
     * Reads some bytes off the stream.
     * @param bytes Number of bytes to read
     */
    read(bytes?: number): string;
    /**
     * Reads some bytes off the stream using the first byte as the length indicator.
     */
    readVarBytes(): string;
    /**
     * Reads a variable Int.
     */
    readVarInt(): number;
    /**
     * Resets the pointer to start of string.
     */
    reset(): void;
}
export default StringStream;
//# sourceMappingURL=StringStream.d.ts.map