"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("./misc");
/**
 * @class StringStream
 * @classdesc A simple string stream that allows user to read a string byte by byte using read().
 * @param {string} str - The string to read as a stream.
 */
class StringStream {
    constructor(str = "") {
        this.str = str;
        this.pter = 0;
    }
    /**
     * Checks if reached the end of the stream. Does not mean stream is actually empty (this.str is not empty)
     */
    isEmpty() {
        return this.pter >= this.str.length;
    }
    /**
     * Peek at the next bytes  on the string. May return less than intended bytes if reaching end of stream.
     */
    peek(bytes = 1) {
        if (this.isEmpty()) {
            return "";
        }
        return this.str.substr(this.pter, bytes * 2);
    }
    /**
     * Reads some bytes off the stream.
     * @param bytes Number of bytes to read
     */
    read(bytes = 1) {
        if (this.isEmpty()) {
            throw new Error("Reached the end of the stream!");
        }
        const out = this.str.substr(this.pter, bytes * 2);
        this.pter += bytes * 2;
        return out;
    }
    /**
     * Reads some bytes off the stream using the first byte as the length indicator.
     */
    readVarBytes() {
        return this.read(this.readVarInt());
    }
    /**
     * Reads a variable Int.
     */
    readVarInt() {
        let len = parseInt(this.read(1), 16);
        if (len === 0xfd) {
            len = parseInt(misc_1.reverseHex(this.read(2)), 16);
        }
        else if (len === 0xfe) {
            len = parseInt(misc_1.reverseHex(this.read(4)), 16);
        }
        else if (len === 0xff) {
            len = parseInt(misc_1.reverseHex(this.read(8)), 16);
        }
        return len;
    }
    /**
     * Resets the pointer to start of string.
     */
    reset() {
        this.pter = 0;
    }
}
exports.StringStream = StringStream;
exports.default = StringStream;
//# sourceMappingURL=StringStream.js.map