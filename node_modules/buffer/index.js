if ('undefined' === typeof Buffer) {
  // implicit global
  Buffer = undefined;
}

(function () {
  "use strict";

  function createBuffer() {
    return Array;

    /*
    function Buffer(sizeOrArrayOrString, encoding) {
      var size, arr, str;

      if ('number' === typeof sizeOrArrayOrString) {
        size = sizeOrArrayOrString;
      } else if ('string' === typeof sizeOrArrayOrString) {
        // TODO handle encoding
        str = String(sizeOrArrayOrString);
        arr = arr.split('');
        size = arr.length;
      } else {
        arr = sizeOrArrayOrString;
        size = arr.length;
      }

      this.length = size;
    }

    Buffer.prototype = new Array();
    delete Buffer.prototype.push;
    delete Buffer.prototype.pop;
    delete Buffer.prototype.shift;
    delete Buffer.prototype.unshift;
    delete Buffer.prototype.splice;

    Buffer.isBuffer = function (buf) {
      return buf instanceof Buffer;
    };

    // TODO
    Buffer.byteLength = function (string, encoding) {
      console.log('[todo] byteLength');
      encoding = encoding || 'utf8';
      // return string.length;
    };

    // TODO
    Buffer.prototype.write = function (string, offset, encoding) {
      console.log('[todo] write');
    };

    Buffer.prototype.toString = function (encoding, start, end) {
      var res = {}
        , i
        ;

      start = start || 0;
      end = end || this.length - 1;
      res.length = end + 1;

      if (this.length === res.length) {
        res = this;
      } else {
        i = 0;
        while (start <= end) {
          res[i] = this[start];
          i += 1;
          start += 1;
        }
      }

      return JSON.stringify(res);
    };

    Buffer.prototype.copy = function (targetBuffer, targetStart, sourceStart, sourceEnd) {
      targetStart = targetStart || 0;
      sourceStart = sourceStart || 0;
      sourceEnd = sourceEnd || targetBuffer.length;

    };

    Buffer.prototype.slice = function (start, end) {
      end = end || this.length;
      this.slice(start, end);
    }

    return Buffer;
    */
  }

  if ('undefined' === typeof Buffer) {
    Buffer = createBuffer();
  }

  module.exports = Buffer;
}());
