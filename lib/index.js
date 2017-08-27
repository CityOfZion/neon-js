(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("assert"), require("buffer"), require("crypto"), require("util"), require("fs"), require("http"), require("https"), require("url"), require("child_process"), require("os"), require("path"), require("stream"), require("tty"), require("net"), require("zlib"));
	else if(typeof define === 'function' && define.amd)
		define(["assert", "buffer", "crypto", "util", "fs", "http", "https", "url", "child_process", "os", "path", "stream", "tty", "net", "zlib"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("assert"), require("buffer"), require("crypto"), require("util"), require("fs"), require("http"), require("https"), require("url"), require("child_process"), require("os"), require("path"), require("stream"), require("tty"), require("net"), require("zlib")) : factory(root["assert"], root["buffer"], root["crypto"], root["util"], root["fs"], root["http"], root["https"], root["url"], root["child_process"], root["os"], root["path"], root["stream"], root["tty"], root["net"], root["zlib"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_17__, __WEBPACK_EXTERNAL_MODULE_18__, __WEBPACK_EXTERNAL_MODULE_29__, __WEBPACK_EXTERNAL_MODULE_41__, __WEBPACK_EXTERNAL_MODULE_46__, __WEBPACK_EXTERNAL_MODULE_47__, __WEBPACK_EXTERNAL_MODULE_49__, __WEBPACK_EXTERNAL_MODULE_112__, __WEBPACK_EXTERNAL_MODULE_114__, __WEBPACK_EXTERNAL_MODULE_117__, __WEBPACK_EXTERNAL_MODULE_129__, __WEBPACK_EXTERNAL_MODULE_134__, __WEBPACK_EXTERNAL_MODULE_135__, __WEBPACK_EXTERNAL_MODULE_136__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 53);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {
	    /*
	     * Local polyfil of Object.create
	     */
	    var create = Object.create || (function () {
	        function F() {};

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }())

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var i = 0; i < thatSigBytes; i += 4) {
	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            var r = (function (m_w) {
	                var m_w = m_w;
	                var m_z = 0x3ade68b1;
	                var mask = 0xffffffff;

	                return function () {
	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
	                    var result = ((m_z << 0x10) + m_w) & mask;
	                    result /= 0x100000000;
	                    result += 0.5;
	                    return result * (Math.random() > .5 ? 1 : -1);
	                }
	            });

	            for (var i = 0, rcache; i < nBytes; i += 4) {
	                var _r = r((rcache || Math.random()) * 0x100000000);

	                rcache = _r() * 0x3ade67b7;
	                words.push((_r() * 0x100000000) | 0);
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                var processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(7));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./evpkdf"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Cipher core components.
	 */
	CryptoJS.lib.Cipher || (function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var Base64 = C_enc.Base64;
	    var C_algo = C.algo;
	    var EvpKDF = C_algo.EvpKDF;

	    /**
	     * Abstract base cipher template.
	     *
	     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
	     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
	     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
	     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
	     */
	    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {WordArray} iv The IV to use for this operation.
	         */
	        cfg: Base.extend(),

	        /**
	         * Creates this cipher in encryption mode.
	         *
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {Cipher} A cipher instance.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
	         */
	        createEncryptor: function (key, cfg) {
	            return this.create(this._ENC_XFORM_MODE, key, cfg);
	        },

	        /**
	         * Creates this cipher in decryption mode.
	         *
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {Cipher} A cipher instance.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
	         */
	        createDecryptor: function (key, cfg) {
	            return this.create(this._DEC_XFORM_MODE, key, cfg);
	        },

	        /**
	         * Initializes a newly created cipher.
	         *
	         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
	         */
	        init: function (xformMode, key, cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Store transform mode and key
	            this._xformMode = xformMode;
	            this._key = key;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this cipher to its initial state.
	         *
	         * @example
	         *
	         *     cipher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-cipher logic
	            this._doReset();
	        },

	        /**
	         * Adds data to be encrypted or decrypted.
	         *
	         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
	         *
	         * @return {WordArray} The data after processing.
	         *
	         * @example
	         *
	         *     var encrypted = cipher.process('data');
	         *     var encrypted = cipher.process(wordArray);
	         */
	        process: function (dataUpdate) {
	            // Append
	            this._append(dataUpdate);

	            // Process available blocks
	            return this._process();
	        },

	        /**
	         * Finalizes the encryption or decryption process.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
	         *
	         * @return {WordArray} The data after final processing.
	         *
	         * @example
	         *
	         *     var encrypted = cipher.finalize();
	         *     var encrypted = cipher.finalize('data');
	         *     var encrypted = cipher.finalize(wordArray);
	         */
	        finalize: function (dataUpdate) {
	            // Final data update
	            if (dataUpdate) {
	                this._append(dataUpdate);
	            }

	            // Perform concrete-cipher logic
	            var finalProcessedData = this._doFinalize();

	            return finalProcessedData;
	        },

	        keySize: 128/32,

	        ivSize: 128/32,

	        _ENC_XFORM_MODE: 1,

	        _DEC_XFORM_MODE: 2,

	        /**
	         * Creates shortcut functions to a cipher's object interface.
	         *
	         * @param {Cipher} cipher The cipher to create a helper for.
	         *
	         * @return {Object} An object with encrypt and decrypt shortcut functions.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
	         */
	        _createHelper: (function () {
	            function selectCipherStrategy(key) {
	                if (typeof key == 'string') {
	                    return PasswordBasedCipher;
	                } else {
	                    return SerializableCipher;
	                }
	            }

	            return function (cipher) {
	                return {
	                    encrypt: function (message, key, cfg) {
	                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
	                    },

	                    decrypt: function (ciphertext, key, cfg) {
	                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
	                    }
	                };
	            };
	        }())
	    });

	    /**
	     * Abstract base stream cipher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
	     */
	    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
	        _doFinalize: function () {
	            // Process partial blocks
	            var finalProcessedBlocks = this._process(!!'flush');

	            return finalProcessedBlocks;
	        },

	        blockSize: 1
	    });

	    /**
	     * Mode namespace.
	     */
	    var C_mode = C.mode = {};

	    /**
	     * Abstract base block cipher mode template.
	     */
	    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
	        /**
	         * Creates this mode for encryption.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
	         */
	        createEncryptor: function (cipher, iv) {
	            return this.Encryptor.create(cipher, iv);
	        },

	        /**
	         * Creates this mode for decryption.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
	         */
	        createDecryptor: function (cipher, iv) {
	            return this.Decryptor.create(cipher, iv);
	        },

	        /**
	         * Initializes a newly created mode.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
	         */
	        init: function (cipher, iv) {
	            this._cipher = cipher;
	            this._iv = iv;
	        }
	    });

	    /**
	     * Cipher Block Chaining mode.
	     */
	    var CBC = C_mode.CBC = (function () {
	        /**
	         * Abstract base CBC mode.
	         */
	        var CBC = BlockCipherMode.extend();

	        /**
	         * CBC encryptor.
	         */
	        CBC.Encryptor = CBC.extend({
	            /**
	             * Processes the data block at offset.
	             *
	             * @param {Array} words The data words to operate on.
	             * @param {number} offset The offset where the block starts.
	             *
	             * @example
	             *
	             *     mode.processBlock(data.words, offset);
	             */
	            processBlock: function (words, offset) {
	                // Shortcuts
	                var cipher = this._cipher;
	                var blockSize = cipher.blockSize;

	                // XOR and encrypt
	                xorBlock.call(this, words, offset, blockSize);
	                cipher.encryptBlock(words, offset);

	                // Remember this block to use with next block
	                this._prevBlock = words.slice(offset, offset + blockSize);
	            }
	        });

	        /**
	         * CBC decryptor.
	         */
	        CBC.Decryptor = CBC.extend({
	            /**
	             * Processes the data block at offset.
	             *
	             * @param {Array} words The data words to operate on.
	             * @param {number} offset The offset where the block starts.
	             *
	             * @example
	             *
	             *     mode.processBlock(data.words, offset);
	             */
	            processBlock: function (words, offset) {
	                // Shortcuts
	                var cipher = this._cipher;
	                var blockSize = cipher.blockSize;

	                // Remember this block to use with next block
	                var thisBlock = words.slice(offset, offset + blockSize);

	                // Decrypt and XOR
	                cipher.decryptBlock(words, offset);
	                xorBlock.call(this, words, offset, blockSize);

	                // This block becomes the previous block
	                this._prevBlock = thisBlock;
	            }
	        });

	        function xorBlock(words, offset, blockSize) {
	            // Shortcut
	            var iv = this._iv;

	            // Choose mixing block
	            if (iv) {
	                var block = iv;

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            } else {
	                var block = this._prevBlock;
	            }

	            // XOR blocks
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= block[i];
	            }
	        }

	        return CBC;
	    }());

	    /**
	     * Padding namespace.
	     */
	    var C_pad = C.pad = {};

	    /**
	     * PKCS #5/7 padding strategy.
	     */
	    var Pkcs7 = C_pad.Pkcs7 = {
	        /**
	         * Pads data using the algorithm defined in PKCS #5/7.
	         *
	         * @param {WordArray} data The data to pad.
	         * @param {number} blockSize The multiple that the data should be padded to.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
	         */
	        pad: function (data, blockSize) {
	            // Shortcut
	            var blockSizeBytes = blockSize * 4;

	            // Count padding bytes
	            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

	            // Create padding word
	            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

	            // Create padding
	            var paddingWords = [];
	            for (var i = 0; i < nPaddingBytes; i += 4) {
	                paddingWords.push(paddingWord);
	            }
	            var padding = WordArray.create(paddingWords, nPaddingBytes);

	            // Add padding
	            data.concat(padding);
	        },

	        /**
	         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
	         *
	         * @param {WordArray} data The data to unpad.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
	         */
	        unpad: function (data) {
	            // Get number of padding bytes from last byte
	            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	            // Remove padding
	            data.sigBytes -= nPaddingBytes;
	        }
	    };

	    /**
	     * Abstract base block cipher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
	     */
	    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {Mode} mode The block mode to use. Default: CBC
	         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
	         */
	        cfg: Cipher.cfg.extend({
	            mode: CBC,
	            padding: Pkcs7
	        }),

	        reset: function () {
	            // Reset cipher
	            Cipher.reset.call(this);

	            // Shortcuts
	            var cfg = this.cfg;
	            var iv = cfg.iv;
	            var mode = cfg.mode;

	            // Reset block mode
	            if (this._xformMode == this._ENC_XFORM_MODE) {
	                var modeCreator = mode.createEncryptor;
	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
	                var modeCreator = mode.createDecryptor;
	                // Keep at least one block in the buffer for unpadding
	                this._minBufferSize = 1;
	            }

	            if (this._mode && this._mode.__creator == modeCreator) {
	                this._mode.init(this, iv && iv.words);
	            } else {
	                this._mode = modeCreator.call(mode, this, iv && iv.words);
	                this._mode.__creator = modeCreator;
	            }
	        },

	        _doProcessBlock: function (words, offset) {
	            this._mode.processBlock(words, offset);
	        },

	        _doFinalize: function () {
	            // Shortcut
	            var padding = this.cfg.padding;

	            // Finalize
	            if (this._xformMode == this._ENC_XFORM_MODE) {
	                // Pad data
	                padding.pad(this._data, this.blockSize);

	                // Process final blocks
	                var finalProcessedBlocks = this._process(!!'flush');
	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
	                // Process final blocks
	                var finalProcessedBlocks = this._process(!!'flush');

	                // Unpad data
	                padding.unpad(finalProcessedBlocks);
	            }

	            return finalProcessedBlocks;
	        },

	        blockSize: 128/32
	    });

	    /**
	     * A collection of cipher parameters.
	     *
	     * @property {WordArray} ciphertext The raw ciphertext.
	     * @property {WordArray} key The key to this ciphertext.
	     * @property {WordArray} iv The IV used in the ciphering operation.
	     * @property {WordArray} salt The salt used with a key derivation function.
	     * @property {Cipher} algorithm The cipher algorithm.
	     * @property {Mode} mode The block mode used in the ciphering operation.
	     * @property {Padding} padding The padding scheme used in the ciphering operation.
	     * @property {number} blockSize The block size of the cipher.
	     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
	     */
	    var CipherParams = C_lib.CipherParams = Base.extend({
	        /**
	         * Initializes a newly created cipher params object.
	         *
	         * @param {Object} cipherParams An object with any of the possible cipher parameters.
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.lib.CipherParams.create({
	         *         ciphertext: ciphertextWordArray,
	         *         key: keyWordArray,
	         *         iv: ivWordArray,
	         *         salt: saltWordArray,
	         *         algorithm: CryptoJS.algo.AES,
	         *         mode: CryptoJS.mode.CBC,
	         *         padding: CryptoJS.pad.PKCS7,
	         *         blockSize: 4,
	         *         formatter: CryptoJS.format.OpenSSL
	         *     });
	         */
	        init: function (cipherParams) {
	            this.mixIn(cipherParams);
	        },

	        /**
	         * Converts this cipher params object to a string.
	         *
	         * @param {Format} formatter (Optional) The formatting strategy to use.
	         *
	         * @return {string} The stringified cipher params.
	         *
	         * @throws Error If neither the formatter nor the default formatter is set.
	         *
	         * @example
	         *
	         *     var string = cipherParams + '';
	         *     var string = cipherParams.toString();
	         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
	         */
	        toString: function (formatter) {
	            return (formatter || this.formatter).stringify(this);
	        }
	    });

	    /**
	     * Format namespace.
	     */
	    var C_format = C.format = {};

	    /**
	     * OpenSSL formatting strategy.
	     */
	    var OpenSSLFormatter = C_format.OpenSSL = {
	        /**
	         * Converts a cipher params object to an OpenSSL-compatible string.
	         *
	         * @param {CipherParams} cipherParams The cipher params object.
	         *
	         * @return {string} The OpenSSL-compatible string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
	         */
	        stringify: function (cipherParams) {
	            // Shortcuts
	            var ciphertext = cipherParams.ciphertext;
	            var salt = cipherParams.salt;

	            // Format
	            if (salt) {
	                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
	            } else {
	                var wordArray = ciphertext;
	            }

	            return wordArray.toString(Base64);
	        },

	        /**
	         * Converts an OpenSSL-compatible string to a cipher params object.
	         *
	         * @param {string} openSSLStr The OpenSSL-compatible string.
	         *
	         * @return {CipherParams} The cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
	         */
	        parse: function (openSSLStr) {
	            // Parse base64
	            var ciphertext = Base64.parse(openSSLStr);

	            // Shortcut
	            var ciphertextWords = ciphertext.words;

	            // Test for salt
	            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
	                // Extract salt
	                var salt = WordArray.create(ciphertextWords.slice(2, 4));

	                // Remove salt from ciphertext
	                ciphertextWords.splice(0, 4);
	                ciphertext.sigBytes -= 16;
	            }

	            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
	        }
	    };

	    /**
	     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
	     */
	    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
	         */
	        cfg: Base.extend({
	            format: OpenSSLFormatter
	        }),

	        /**
	         * Encrypts a message.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {WordArray|string} message The message to encrypt.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {CipherParams} A cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         */
	        encrypt: function (cipher, message, key, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Encrypt
	            var encryptor = cipher.createEncryptor(key, cfg);
	            var ciphertext = encryptor.finalize(message);

	            // Shortcut
	            var cipherCfg = encryptor.cfg;

	            // Create and return serializable cipher params
	            return CipherParams.create({
	                ciphertext: ciphertext,
	                key: key,
	                iv: cipherCfg.iv,
	                algorithm: cipher,
	                mode: cipherCfg.mode,
	                padding: cipherCfg.padding,
	                blockSize: cipher.blockSize,
	                formatter: cfg.format
	            });
	        },

	        /**
	         * Decrypts serialized ciphertext.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {WordArray} The plaintext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         */
	        decrypt: function (cipher, ciphertext, key, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Convert string to CipherParams
	            ciphertext = this._parse(ciphertext, cfg.format);

	            // Decrypt
	            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

	            return plaintext;
	        },

	        /**
	         * Converts serialized ciphertext to CipherParams,
	         * else assumed CipherParams already and returns ciphertext unchanged.
	         *
	         * @param {CipherParams|string} ciphertext The ciphertext.
	         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
	         *
	         * @return {CipherParams} The unserialized ciphertext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
	         */
	        _parse: function (ciphertext, format) {
	            if (typeof ciphertext == 'string') {
	                return format.parse(ciphertext, this);
	            } else {
	                return ciphertext;
	            }
	        }
	    });

	    /**
	     * Key derivation function namespace.
	     */
	    var C_kdf = C.kdf = {};

	    /**
	     * OpenSSL key derivation function.
	     */
	    var OpenSSLKdf = C_kdf.OpenSSL = {
	        /**
	         * Derives a key and IV from a password.
	         *
	         * @param {string} password The password to derive from.
	         * @param {number} keySize The size in words of the key to generate.
	         * @param {number} ivSize The size in words of the IV to generate.
	         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
	         *
	         * @return {CipherParams} A cipher params object with the key, IV, and salt.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
	         */
	        execute: function (password, keySize, ivSize, salt) {
	            // Generate random salt
	            if (!salt) {
	                salt = WordArray.random(64/8);
	            }

	            // Derive key and IV
	            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

	            // Separate key and IV
	            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
	            key.sigBytes = keySize * 4;

	            // Return params
	            return CipherParams.create({ key: key, iv: iv, salt: salt });
	        }
	    };

	    /**
	     * A serializable cipher wrapper that derives the key from a password,
	     * and returns ciphertext as a serializable cipher params object.
	     */
	    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
	         */
	        cfg: SerializableCipher.cfg.extend({
	            kdf: OpenSSLKdf
	        }),

	        /**
	         * Encrypts a message using a password.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {WordArray|string} message The message to encrypt.
	         * @param {string} password The password.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {CipherParams} A cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
	         */
	        encrypt: function (cipher, message, password, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Derive key and other params
	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

	            // Add IV to config
	            cfg.iv = derivedParams.iv;

	            // Encrypt
	            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

	            // Mix in derived params
	            ciphertext.mixIn(derivedParams);

	            return ciphertext;
	        },

	        /**
	         * Decrypts serialized ciphertext using a password.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	         * @param {string} password The password.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {WordArray} The plaintext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
	         */
	        decrypt: function (cipher, ciphertext, password, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Convert string to CipherParams
	            ciphertext = this._parse(ciphertext, cfg.format);

	            // Derive key and other params
	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

	            // Add IV to config
	            cfg.iv = derivedParams.iv;

	            // Decrypt
	            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

	            return plaintext;
	        }
	    });
	}());


}));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(42);
var isBuffer = __webpack_require__(120);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elliptic = exports;

elliptic.version = __webpack_require__(59).version;
elliptic.utils = __webpack_require__(60);
elliptic.rand = __webpack_require__(61);
elliptic.curve = __webpack_require__(13);
elliptic.curves = __webpack_require__(67);

// Protocols
elliptic.ec = __webpack_require__(75);
elliptic.eddsa = __webpack_require__(79);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(6);
var inherits = __webpack_require__(14);

exports.inherits = inherits;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        var hi = c >> 8;
        var lo = c & 0xff;
        if (hi)
          res.push(hi, lo);
        else
          res.push(lo);
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
exports.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
exports.toHex = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
exports.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
exports.toHex32 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
exports.zero2 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
exports.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
exports.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
exports.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
exports.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
exports.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
exports.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
exports.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
exports.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
exports.sum32_5 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
}
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
}
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
}
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
}
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
}
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.shr64_lo = shr64_lo;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function (module, exports) {
  'use strict';

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    Buffer = __webpack_require__(17).Buffer;
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
    }

    if (base === 16) {
      this._parseHex(number, start);
    } else {
      this._parseBase(number, base, start);
    }

    if (number[0] === '-') {
      this.negative = 1;
    }

    this.strip();

    if (endian !== 'le') return;

    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [ number & 0x3ffffff ];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [ 0 ];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this.strip();
  };

  function parseHex (str, start, end) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r <<= 4;

      // 'a' - 'f'
      if (c >= 49 && c <= 54) {
        r |= c - 49 + 0xa;

      // 'A' - 'F'
      } else if (c >= 17 && c <= 22) {
        r |= c - 17 + 0xa;

      // '0' - '9'
      } else {
        r |= c & 0xf;
      }
    }
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    // Scan 24-bit chunks and add them to the number
    var off = 0;
    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
      w = parseHex(number, i, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
    if (i + 6 !== start) {
      w = parseHex(number, start, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
    }
    this.strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        r += c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        r += c - 17 + 0xa;

      // '0' - '9'
      } else {
        r += c;
      }
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [ 0 ];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype.strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  BN.prototype.inspect = function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  };

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16);
  };

  BN.prototype.toBuffer = function toBuffer (endian, length) {
    assert(typeof Buffer !== 'undefined');
    return this.toArrayLike(Buffer, endian, length);
  };

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    this.strip();
    var littleEndian = endian === 'le';
    var res = new ArrayType(reqLength);

    var b, i;
    var q = this.clone();
    if (!littleEndian) {
      // Assume big-endian
      for (i = 0; i < reqLength - byteLength; i++) {
        res[i] = 0;
      }

      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[reqLength - i - 1] = b;
      }
    } else {
      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[i] = b;
      }

      for (; i < reqLength; i++) {
        res[i] = 0;
      }
    }

    return res;
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this.strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this.strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this.strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this.strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this.strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this.strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out.strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out.strip();
  }

  function jumboMulTo (self, num, out) {
    var fftm = new FFTM();
    return fftm.mulp(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out.strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this.strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this.strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this.strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) < num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this.strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this.strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this.strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q.strip();
    }
    a.strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modn = function modn (num) {
    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return acc;
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    return this.strip();
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this.strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      r.strip();
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
    return a.umod(this.m)._forceRed(this);
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})(typeof module === 'undefined' || module, this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)(module)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(20), __webpack_require__(21));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha1", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var MD5 = C_algo.MD5;

	    /**
	     * This key derivation function is meant to conform with EVP_BytesToKey.
	     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
	     */
	    var EvpKDF = C_algo.EvpKDF = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
	         * @property {number} iterations The number of iterations to perform. Default: 1
	         */
	        cfg: Base.extend({
	            keySize: 128/32,
	            hasher: MD5,
	            iterations: 1
	        }),

	        /**
	         * Initializes a newly created key derivation function.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	         *
	         * @example
	         *
	         *     var kdf = CryptoJS.algo.EvpKDF.create();
	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
	         */
	        init: function (cfg) {
	            this.cfg = this.cfg.extend(cfg);
	        },

	        /**
	         * Derives a key from a password.
	         *
	         * @param {WordArray|string} password The password.
	         * @param {WordArray|string} salt A salt.
	         *
	         * @return {WordArray} The derived key.
	         *
	         * @example
	         *
	         *     var key = kdf.compute(password, salt);
	         */
	        compute: function (password, salt) {
	            // Shortcut
	            var cfg = this.cfg;

	            // Init hasher
	            var hasher = cfg.hasher.create();

	            // Initial values
	            var derivedKey = WordArray.create();

	            // Shortcuts
	            var derivedKeyWords = derivedKey.words;
	            var keySize = cfg.keySize;
	            var iterations = cfg.iterations;

	            // Generate key
	            while (derivedKeyWords.length < keySize) {
	                if (block) {
	                    hasher.update(block);
	                }
	                var block = hasher.update(password).finalize(salt);
	                hasher.reset();

	                // Iterations
	                for (var i = 1; i < iterations; i++) {
	                    block = hasher.finalize(block);
	                    hasher.reset();
	                }

	                derivedKey.concat(block);
	            }
	            derivedKey.sigBytes = keySize * 4;

	            return derivedKey;
	        }
	    });

	    /**
	     * Derives a key from a password.
	     *
	     * @param {WordArray|string} password The password.
	     * @param {WordArray|string} salt A salt.
	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
	     *
	     * @return {WordArray} The derived key.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var key = CryptoJS.EvpKDF(password, salt);
	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
	     */
	    C.EvpKDF = function (password, salt, cfg) {
	        return EvpKDF.create(cfg).compute(password, salt);
	    };
	}());


	return CryptoJS.EvpKDF;

}));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * Base64 encoding strategy.
	     */
	    var Base64 = C_enc.Base64 = {
	        /**
	         * Converts a word array to a Base64 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Base64 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;
	            var map = this._map;

	            // Clamp excess bits
	            wordArray.clamp();

	            // Convert
	            var base64Chars = [];
	            for (var i = 0; i < sigBytes; i += 3) {
	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
	                }
	            }

	            // Add padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                while (base64Chars.length % 4) {
	                    base64Chars.push(paddingChar);
	                }
	            }

	            return base64Chars.join('');
	        },

	        /**
	         * Converts a Base64 string to a word array.
	         *
	         * @param {string} base64Str The Base64 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
	         */
	        parse: function (base64Str) {
	            // Shortcuts
	            var base64StrLength = base64Str.length;
	            var map = this._map;
	            var reverseMap = this._reverseMap;

	            if (!reverseMap) {
	                    reverseMap = this._reverseMap = [];
	                    for (var j = 0; j < map.length; j++) {
	                        reverseMap[map.charCodeAt(j)] = j;
	                    }
	            }

	            // Ignore padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                var paddingIndex = base64Str.indexOf(paddingChar);
	                if (paddingIndex !== -1) {
	                    base64StrLength = paddingIndex;
	                }
	            }

	            // Convert
	            return parseLoop(base64Str, base64StrLength, reverseMap);

	        },

	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	    };

	    function parseLoop(base64Str, base64StrLength, reverseMap) {
	      var words = [];
	      var nBytes = 0;
	      for (var i = 0; i < base64StrLength; i++) {
	          if (i % 4) {
	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
	              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
	              nBytes++;
	          }
	      }
	      return WordArray.create(words, nBytes);
	    }
	}());


	return CryptoJS.enc.Base64;

}));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var T = [];

	    // Compute constants
	    (function () {
	        for (var i = 0; i < 64; i++) {
	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
	        }
	    }());

	    /**
	     * MD5 hash algorithm.
	     */
	    var MD5 = C_algo.MD5 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }

	            // Shortcuts
	            var H = this._hash.words;

	            var M_offset_0  = M[offset + 0];
	            var M_offset_1  = M[offset + 1];
	            var M_offset_2  = M[offset + 2];
	            var M_offset_3  = M[offset + 3];
	            var M_offset_4  = M[offset + 4];
	            var M_offset_5  = M[offset + 5];
	            var M_offset_6  = M[offset + 6];
	            var M_offset_7  = M[offset + 7];
	            var M_offset_8  = M[offset + 8];
	            var M_offset_9  = M[offset + 9];
	            var M_offset_10 = M[offset + 10];
	            var M_offset_11 = M[offset + 11];
	            var M_offset_12 = M[offset + 12];
	            var M_offset_13 = M[offset + 13];
	            var M_offset_14 = M[offset + 14];
	            var M_offset_15 = M[offset + 15];

	            // Working varialbes
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];

	            // Computation
	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
	            var nBitsTotalL = nBitsTotal;
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
	            );
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
	            );

	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                // Shortcut
	                var H_i = H[i];

	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    function FF(a, b, c, d, x, s, t) {
	        var n = a + ((b & c) | (~b & d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function GG(a, b, c, d, x, s, t) {
	        var n = a + ((b & d) | (c & ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function HH(a, b, c, d, x, s, t) {
	        var n = a + (b ^ c ^ d) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function II(a, b, c, d, x, s, t) {
	        var n = a + (c ^ (b | ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.MD5('message');
	     *     var hash = CryptoJS.MD5(wordArray);
	     */
	    C.MD5 = Hasher._createHelper(MD5);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacMD5(message, key);
	     */
	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
	}(Math));


	return CryptoJS.MD5;

}));

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var assert = __webpack_require__(6);

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var BigInteger = __webpack_require__(25)

//addons
__webpack_require__(56)

module.exports = BigInteger

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = exports;

curve.base = __webpack_require__(62);
curve.short = __webpack_require__(63);
curve.mont = __webpack_require__(65);
curve.edwards = __webpack_require__(66);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(29);
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = __webpack_require__(64);
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var X32WordArray = C_lib.WordArray;

	    /**
	     * x64 namespace.
	     */
	    var C_x64 = C.x64 = {};

	    /**
	     * A 64-bit word.
	     */
	    var X64Word = C_x64.Word = Base.extend({
	        /**
	         * Initializes a newly created 64-bit word.
	         *
	         * @param {number} high The high 32 bits.
	         * @param {number} low The low 32 bits.
	         *
	         * @example
	         *
	         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
	         */
	        init: function (high, low) {
	            this.high = high;
	            this.low = low;
	        }

	        /**
	         * Bitwise NOTs this word.
	         *
	         * @return {X64Word} A new x64-Word object after negating.
	         *
	         * @example
	         *
	         *     var negated = x64Word.not();
	         */
	        // not: function () {
	            // var high = ~this.high;
	            // var low = ~this.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ANDs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to AND with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ANDing.
	         *
	         * @example
	         *
	         *     var anded = x64Word.and(anotherX64Word);
	         */
	        // and: function (word) {
	            // var high = this.high & word.high;
	            // var low = this.low & word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to OR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ORing.
	         *
	         * @example
	         *
	         *     var ored = x64Word.or(anotherX64Word);
	         */
	        // or: function (word) {
	            // var high = this.high | word.high;
	            // var low = this.low | word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise XORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to XOR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after XORing.
	         *
	         * @example
	         *
	         *     var xored = x64Word.xor(anotherX64Word);
	         */
	        // xor: function (word) {
	            // var high = this.high ^ word.high;
	            // var low = this.low ^ word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the left.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftL(25);
	         */
	        // shiftL: function (n) {
	            // if (n < 32) {
	                // var high = (this.high << n) | (this.low >>> (32 - n));
	                // var low = this.low << n;
	            // } else {
	                // var high = this.low << (n - 32);
	                // var low = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the right.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftR(7);
	         */
	        // shiftR: function (n) {
	            // if (n < 32) {
	                // var low = (this.low >>> n) | (this.high << (32 - n));
	                // var high = this.high >>> n;
	            // } else {
	                // var low = this.high >>> (n - 32);
	                // var high = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Rotates this word n bits to the left.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotL(25);
	         */
	        // rotL: function (n) {
	            // return this.shiftL(n).or(this.shiftR(64 - n));
	        // },

	        /**
	         * Rotates this word n bits to the right.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotR(7);
	         */
	        // rotR: function (n) {
	            // return this.shiftR(n).or(this.shiftL(64 - n));
	        // },

	        /**
	         * Adds this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to add with this word.
	         *
	         * @return {X64Word} A new x64-Word object after adding.
	         *
	         * @example
	         *
	         *     var added = x64Word.add(anotherX64Word);
	         */
	        // add: function (word) {
	            // var low = (this.low + word.low) | 0;
	            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
	            // var high = (this.high + word.high + carry) | 0;

	            // return X64Word.create(high, low);
	        // }
	    });

	    /**
	     * An array of 64-bit words.
	     *
	     * @property {Array} words The array of CryptoJS.x64.Word objects.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var X64WordArray = C_x64.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create();
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ]);
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ], 10);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 8;
	            }
	        },

	        /**
	         * Converts this 64-bit word array to a 32-bit word array.
	         *
	         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
	         *
	         * @example
	         *
	         *     var x32WordArray = x64WordArray.toX32();
	         */
	        toX32: function () {
	            // Shortcuts
	            var x64Words = this.words;
	            var x64WordsLength = x64Words.length;

	            // Convert
	            var x32Words = [];
	            for (var i = 0; i < x64WordsLength; i++) {
	                var x64Word = x64Words[i];
	                x32Words.push(x64Word.high);
	                x32Words.push(x64Word.low);
	            }

	            return X32WordArray.create(x32Words, this.sigBytes);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {X64WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = x64WordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);

	            // Clone "words" array
	            var words = clone.words = this.words.slice(0);

	            // Clone each X64Word object
	            var wordsLength = words.length;
	            for (var i = 0; i < wordsLength; i++) {
	                words[i] = words[i].clone();
	            }

	            return clone;
	        }
	    });
	}());


	return CryptoJS;

}));

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getAccountsFromWIFKey = exports.getAccountsFromPrivateKey = exports.fetchAccountsFromPublicKeyEncoded = exports.signatureData = exports.getHash = exports.createSignatureScript = exports.getPublicKeyEncoded = exports.getPublicKey = exports.getPrivateKeyFromWIF = exports.generatePrivateKey = exports.generateRandomArray = exports.toAddress = exports.claimTransaction = exports.transferTransaction = exports.verifyPublicKeyEncoded = exports.verifyAddress = exports.addContract = exports.registerTransaction = exports.issueTransaction = exports.getInputData = exports.getTxHash = exports.getWIFFromPrivateKey = undefined;

var _ecurve = __webpack_require__(54);

var _ecurve2 = _interopRequireDefault(_ecurve);

var _bigi = __webpack_require__(12);

var _bigi2 = _interopRequireDefault(_bigi);

var _elliptic = __webpack_require__(3);

var _cryptoJs = __webpack_require__(33);

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _wif = __webpack_require__(36);

var _wif2 = _interopRequireDefault(_wif);

var _utils = __webpack_require__(39);

var _secureRandom = __webpack_require__(108);

var _secureRandom2 = _interopRequireDefault(_secureRandom);

var _buffer = __webpack_require__(17);

var _buffer2 = _interopRequireDefault(_buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';


var base58 = __webpack_require__(38)(BASE58);


// All of this stuff was wrapped in a class before, but really unnecessary as none of these were stateful
// This flat structure should be more interpretable, and we can export them all as a module instead

// TODO: exporting ALL of these, but some of them are probably helpers and don't need to be exported
// TODO: go through and add at least a basic description of everything these methods are doing

var getWIFFromPrivateKey = exports.getWIFFromPrivateKey = function getWIFFromPrivateKey(privateKey) {
	var hexKey = (0, _utils.ab2hexstring)(privateKey);
	return _wif2.default.encode(128, new Buffer(hexKey, 'hex'), true);
};

var getTxHash = exports.getTxHash = function getTxHash($data) {
	var DataHexString = _cryptoJs2.default.enc.Hex.parse($data);
	var DataSha256 = _cryptoJs2.default.SHA256(DataHexString);
	var DataSha256_2 = _cryptoJs2.default.SHA256(DataSha256);

	return DataSha256_2.toString();
};

// TODO: this needs a lot of documentation, also better name!
var getInputData = exports.getInputData = function getInputData($coin, $amount) {
	// sort
	var coin_ordered = $coin['list'];
	for (var i = 0; i < coin_ordered.length - 1; i++) {
		for (var j = 0; j < coin_ordered.length - 1 - i; j++) {
			if (parseFloat(coin_ordered[j].value) < parseFloat(coin_ordered[j + 1].value)) {
				var temp = coin_ordered[j];
				coin_ordered[j] = coin_ordered[j + 1];
				coin_ordered[j + 1] = temp;
			}
		}
	}

	// calc sum
	var sum = 0;
	for (var _i = 0; _i < coin_ordered.length; _i++) {
		sum = sum + parseFloat(coin_ordered[_i].value);
	}

	// if sum < amount then exit;
	var amount = parseFloat($amount);
	if (sum < amount) return -1;

	// find input coins
	var k = 0;
	while (parseFloat(coin_ordered[k].value) <= amount) {
		amount = amount - parseFloat(coin_ordered[k].value);
		if (amount == 0) break;
		k = k + 1;
	}

	/////////////////////////////////////////////////////////////////////////
	// coin[0]- coin[k]
	var data = new Uint8Array(1 + 34 * (k + 1));

	// input num
	var inputNum = (0, _utils.numStoreInMemory)((k + 1).toString(16), 2);
	data.set((0, _utils.hexstring2ab)(inputNum));

	// input coins
	for (var x = 0; x < k + 1; x++) {

		// txid
		var pos = 1 + x * 34;
		data.set((0, _utils.reverseArray)((0, _utils.hexstring2ab)(coin_ordered[x]['txid'])), pos);
		//data.set(hexstring2ab(coin_ordered[x]['txid']), pos);

		// index
		pos = 1 + x * 34 + 32;
		var inputIndex = (0, _utils.numStoreInMemory)(coin_ordered[x]['index'].toString(16), 4);
		//inputIndex = numStoreInMemory(coin_ordered[x]['n'].toString(16), 2);
		data.set((0, _utils.hexstring2ab)(inputIndex), pos);
	}

	/////////////////////////////////////////////////////////////////////////

	// calc coin_amount
	var coin_amount = 0;
	for (var _i2 = 0; _i2 < k + 1; _i2++) {
		coin_amount = coin_amount + parseFloat(coin_ordered[_i2].value);
	}

	/////////////////////////////////////////////////////////////////////////

	return {
		amount: coin_amount,
		data: data
	};
};

// TODO: We many not need to keep this function in the API
// for now, leaving as reference
var issueTransaction = exports.issueTransaction = function issueTransaction($issueAssetID, $issueAmount, $publicKeyEncoded) {
	var signatureScript = createSignatureScript($publicKeyEncoded);
	//console.log( signatureScript.toString('hex') );

	var myProgramHash = getHash(signatureScript);
	//console.log( myProgramHash.toString() );

	////////////////////////////////////////////////////////////////////////
	// data
	var data = "01";

	// version
	data = data + "00";

	// attribute
	data = data + "00";

	// Inputs
	data = data + "00";

	// Outputs len
	data = data + "01";

	// Outputs[0] AssetID
	data = data + $issueAssetID;

	// Outputs[0] Amount
	var num1 = $issueAmount * 100000000;
	var num1str = (0, _utils.numStoreInMemory)(num1.toString(16), 16);
	data = data + num1str;

	// Outputs[0] ProgramHash
	data = data + myProgramHash.toString();

	//console.log(data);

	return data;
};

// TODO: we probably don't need to keep this function in the API, people aren't going to be using the wallet to register new assets
// for now, leaving as reference
var registerTransaction = exports.registerTransaction = function registerTransaction($assetName, $assetAmount, $publicKeyEncoded) {
	var ecparams = _ecurve2.default.getCurveByName('secp256r1');
	var curvePt = _ecurve2.default.Point.decodeFrom(ecparams, new Buffer($publicKeyEncoded, "hex"));
	var curvePtX = curvePt.affineX.toBuffer(32);
	var curvePtY = curvePt.affineY.toBuffer(32);
	var publicKey = _buffer2.default.concat([new Buffer([0x04]), curvePtX, curvePtY]);

	var signatureScript = createSignatureScript($publicKeyEncoded);

	var myProgramHash = getHash(signatureScript);

	// data
	var data = "40";

	// version
	data = data + "00";

	// asset name
	var assetName = (0, _utils.ab2hexstring)((0, _utils.stringToBytes)($assetName));
	var assetNameLen = (assetName.length / 2).toString();
	if (assetNameLen.length == 1) assetNameLen = "0" + assetNameLen;
	data = data + assetNameLen + assetName;

	// asset precision
	data = data + "00";

	// asset type
	data = data + "01";

	// asset recordtype
	data = data + "00";

	// asset amount
	var num1 = $assetAmount * 100000000;
	var num1str = (0, _utils.numStoreInMemory)(num1.toString(16), 16);
	data = data + num1str;

	// publickey
	var publicKeyXStr = curvePtX.toString('hex');
	var publicKeyYStr = curvePtY.toString('hex');

	data = data + "20" + publicKeyXStr + "20" + publicKeyYStr;
	data = data + myProgramHash.toString();
	data = data + "000000";

	return data;
};

// TODO: this is important
// Also, likely want some high level wrapper that combines TransferTransaction, addContract, and signatureData
var addContract = exports.addContract = function addContract($txData, $sign, $publicKeyEncoded) {
	var signatureScript = createSignatureScript($publicKeyEncoded);
	// console.log(signatureScript);
	// sign num
	var data = $txData + "01";
	// sign struct len
	data = data + "41";
	// sign data len
	data = data + "40";
	// sign data
	data = data + $sign;
	// Contract data len
	data = data + "23";
	// script data
	data = data + signatureScript;
	// console.log(data);
	return data;
};

// verify that an ANS address is valid
var verifyAddress = exports.verifyAddress = function verifyAddress($toAddress) {
	var ProgramHash = base58.decode($toAddress);
	var ProgramHexString = _cryptoJs2.default.enc.Hex.parse((0, _utils.ab2hexstring)(ProgramHash.slice(0, 21)));
	var ProgramSha256 = _cryptoJs2.default.SHA256(ProgramHexString);
	var ProgramSha256_2 = _cryptoJs2.default.SHA256(ProgramSha256);
	var ProgramSha256Buffer = (0, _utils.hexstring2ab)(ProgramSha256_2.toString());

	if ((0, _utils.ab2hexstring)(ProgramSha256Buffer.slice(0, 4)) != (0, _utils.ab2hexstring)(ProgramHash.slice(21, 25))) {
		//address verify failed.
		return false;
	}

	return true;
};

// verify that public key is valid
var verifyPublicKeyEncoded = exports.verifyPublicKeyEncoded = function verifyPublicKeyEncoded($publicKeyEncoded) {
	var publicKeyArray = (0, _utils.hexstring2ab)($publicKeyEncoded);
	if (publicKeyArray[0] != 0x02 && publicKeyArray[0] != 0x03) {
		return false;
	}

	var ecparams = _ecurve2.default.getCurveByName('secp256r1');
	var curvePt = _ecurve2.default.Point.decodeFrom(ecparams, new Buffer($publicKeyEncoded, "hex"));
	var curvePtX = curvePt.affineX.toBuffer(32);
	var curvePtY = curvePt.affineY.toBuffer(32);

	// console.log( "publicKeyArray", publicKeyArray );
	// console.log( "curvePtX", curvePtX );
	// console.log( "curvePtY", curvePtY );

	if (publicKeyArray[0] == 0x02 && curvePtY[31] % 2 == 0) {
		return true;
	}

	if (publicKeyArray[0] == 0x03 && curvePtY[31] % 2 == 1) {
		return true;
	}

	return false;
};

// TODO: important, requires significant documentation
// all of these arguments should be documented and made clear, what $coin looks like etc.
// also, remove $ variable names, most likey
var transferTransaction = exports.transferTransaction = function transferTransaction($coin, $publicKeyEncoded, $toAddress, $Amount) {
	var ProgramHash = base58.decode($toAddress);
	var ProgramHexString = _cryptoJs2.default.enc.Hex.parse((0, _utils.ab2hexstring)(ProgramHash.slice(0, 21)));
	var ProgramSha256 = _cryptoJs2.default.SHA256(ProgramHexString);
	var ProgramSha256_2 = _cryptoJs2.default.SHA256(ProgramSha256);
	var ProgramSha256Buffer = (0, _utils.hexstring2ab)(ProgramSha256_2.toString());

	if ((0, _utils.ab2hexstring)(ProgramSha256Buffer.slice(0, 4)) != (0, _utils.ab2hexstring)(ProgramHash.slice(21, 25))) {
		//address verify failed.
		return -1;
	}

	ProgramHash = ProgramHash.slice(1, 21);

	var signatureScript = createSignatureScript($publicKeyEncoded);
	var myProgramHash = getHash(signatureScript);
	// INPUT CONSTRUCT
	var inputData = getInputData($coin, $Amount);
	if (inputData == -1) return null;
	// console.log('wallet inputData', inputData );

	var inputLen = inputData.data.length;
	var inputAmount = inputData.amount;

	// console.log(inputLen, inputAmount, $Amount);
	// Set SignableData Len
	var signableDataLen = 124 + inputLen;
	if (inputAmount == $Amount) {
		signableDataLen = 64 + inputLen;
	}

	// CONSTRUCT
	var data = new Uint8Array(signableDataLen);

	// type
	data.set((0, _utils.hexstring2ab)("80"), 0);

	// version
	data.set((0, _utils.hexstring2ab)("00"), 1);

	// Attributes
	data.set((0, _utils.hexstring2ab)("00"), 2);

	// INPUT
	data.set(inputData.data, 3);

	// OUTPUT
	if (inputAmount == $Amount) {
		// only one output

		// output num
		data.set((0, _utils.hexstring2ab)("01"), inputLen + 3);

		////////////////////////////////////////////////////////////////////
		// OUTPUT - 0

		// output asset
		data.set((0, _utils.reverseArray)((0, _utils.hexstring2ab)($coin['assetid'])), inputLen + 4);
		//data.set(hexstring2ab($coin['assetid']), inputLen + 4);

		// output value
		var num1 = parseInt($Amount * 100000000);
		var num1str = (0, _utils.numStoreInMemory)(num1.toString(16), 16);
		data.set((0, _utils.hexstring2ab)(num1str), inputLen + 36);

		// output ProgramHash
		data.set(ProgramHash, inputLen + 44);

		////////////////////////////////////////////////////////////////////
	} else {

		// output num
		data.set((0, _utils.hexstring2ab)("02"), inputLen + 3);

		////////////////////////////////////////////////////////////////////
		// OUTPUT - 0

		// output asset
		data.set((0, _utils.reverseArray)((0, _utils.hexstring2ab)($coin['assetid'])), inputLen + 4);
		//data.set(hexstring2ab($coin['assetid']), inputLen + 4);

		// output value
		var _num = parseInt($Amount * 100000000);
		var _num1str = (0, _utils.numStoreInMemory)(_num.toString(16), 16);
		data.set((0, _utils.hexstring2ab)(_num1str), inputLen + 36);

		// output ProgramHash
		data.set(ProgramHash, inputLen + 44);

		////////////////////////////////////////////////////////////////////
		// OUTPUT - 1

		// output asset
		data.set((0, _utils.reverseArray)((0, _utils.hexstring2ab)($coin['assetid'])), inputLen + 64);
		//data.set(hexstring2ab($coin['assetid']), inputLen + 64);

		// output value
		var num2 = parseInt(inputAmount * 100000000 - _num);
		var num2str = (0, _utils.numStoreInMemory)(num2.toString(16), 16);
		data.set((0, _utils.hexstring2ab)(num2str), inputLen + 96);

		// output ProgramHash
		data.set((0, _utils.hexstring2ab)(myProgramHash.toString()), inputLen + 104);

		////////////////////////////////////////////////////////////////////

		//console.log( "Signature Data:", ab2hexstring(data) );
	}

	return (0, _utils.ab2hexstring)(data);
};

var claimTransaction = exports.claimTransaction = function claimTransaction(claims, publicKeyEncoded, toAddress, amount) {

	var signatureScript = createSignatureScript(publicKeyEncoded);
	var myProgramHash = getHash(signatureScript);

	// Type = ClaimTransaction
	var data = "02";

	// Version is always 0 in protocol for now
	data = data + "00";

	// Transaction-specific attributs: claims

	// 1) store number of claims (txids)
	var len = claims.length;
	var lenstr = (0, _utils.numStoreInMemory)(len.toString(16), 2);
	data = data + lenstr;

	var total_amount = 0;

	// 2) iterate over claim txids
	for (var k = 0; k < len; k++) {
		// get the txid
		var txid = claims[k]['txid'];
		// add txid to data
		data = data + (0, _utils.ab2hexstring)((0, _utils.reverseArray)((0, _utils.hexstring2ab)(txid)));

		var vout = claims[k]['index'].toString(16);
		data = data + (0, _utils.numStoreInMemory)(vout, 4);
	}

	// Don't need any attributes
	data = data + "00";

	// Don't need any inputs
	data = data + "00";

	// One output for where the claim will be sent
	data = data + "01";

	// First add assetId for GAS
	data = data + (0, _utils.ab2hexstring)((0, _utils.reverseArray)((0, _utils.hexstring2ab)("602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7")));

	// Net add total amount of the claim
	var num1str = (0, _utils.numStoreInMemory)(amount.toString(16), 16);
	data = data + num1str;

	// Finally add program hash
	data = data + myProgramHash.toString();

	//console.log(data);

	return data;
};

var toAddress = exports.toAddress = function toAddress($ProgramHash) {
	var data = new Uint8Array(1 + $ProgramHash.length);
	data.set([23]);
	data.set($ProgramHash, 1);
	//console.log(ab2hexstring(data));

	var ProgramHexString = _cryptoJs2.default.enc.Hex.parse((0, _utils.ab2hexstring)(data));
	var ProgramSha256 = _cryptoJs2.default.SHA256(ProgramHexString);
	var ProgramSha256_2 = _cryptoJs2.default.SHA256(ProgramSha256);
	var ProgramSha256Buffer = (0, _utils.hexstring2ab)(ProgramSha256_2.toString());
	//console.log(ab2hexstring(ProgramSha256Buffer));

	var datas = new Uint8Array(1 + $ProgramHash.length + 4);
	datas.set(data);
	datas.set(ProgramSha256Buffer.slice(0, 4), 21);
	//console.log(ab2hexstring(datas));

	return base58.encode(datas);
};

var generateRandomArray = exports.generateRandomArray = function generateRandomArray($arrayLen) {
	return (0, _secureRandom2.default)($arrayLen);
};

var generatePrivateKey = exports.generatePrivateKey = function generatePrivateKey() {
	return (0, _secureRandom2.default)(32);
};

var getPrivateKeyFromWIF = exports.getPrivateKeyFromWIF = function getPrivateKeyFromWIF($wif) {
	var data = base58.decode($wif);

	if (data.length != 38 || data[0] != 0x80 || data[33] != 0x01) {
		// basic encoding errors
		return -1;
	}

	var dataHexString = _cryptoJs2.default.enc.Hex.parse((0, _utils.ab2hexstring)(data.slice(0, data.length - 4)));
	var dataSha256 = _cryptoJs2.default.SHA256(dataHexString);
	var dataSha256_2 = _cryptoJs2.default.SHA256(dataSha256);
	var dataSha256Buffer = (0, _utils.hexstring2ab)(dataSha256_2.toString());

	if ((0, _utils.ab2hexstring)(dataSha256Buffer.slice(0, 4)) != (0, _utils.ab2hexstring)(data.slice(data.length - 4, data.length))) {
		//wif verify failed.
		return -2;
	}

	return data.slice(1, 33).toString("hex");
};

var getPublicKey = exports.getPublicKey = function getPublicKey($privateKey, $encode) {
	var ecparams = _ecurve2.default.getCurveByName('secp256r1');
	var curvePt = ecparams.G.multiply(_bigi2.default.fromBuffer((0, _utils.hexstring2ab)($privateKey)));
	return curvePt.getEncoded($encode);
};

var getPublicKeyEncoded = exports.getPublicKeyEncoded = function getPublicKeyEncoded($publicKey) {
	var publicKeyArray = (0, _utils.hexstring2ab)($publicKey);
	if (publicKeyArray[64] % 2 == 1) {
		return "03" + (0, _utils.ab2hexstring)(publicKeyArray.slice(1, 33));
	} else {
		return "02" + (0, _utils.ab2hexstring)(publicKeyArray.slice(1, 33));
	}
};

var createSignatureScript = exports.createSignatureScript = function createSignatureScript($publicKeyEncoded) {
	return "21" + $publicKeyEncoded.toString('hex') + "ac";
};

var getHash = exports.getHash = function getHash($SignatureScript) {
	var ProgramHexString = _cryptoJs2.default.enc.Hex.parse($SignatureScript);
	var ProgramSha256 = _cryptoJs2.default.SHA256(ProgramHexString);
	return _cryptoJs2.default.RIPEMD160(ProgramSha256);
};

var signatureData = exports.signatureData = function signatureData($data, $privateKey) {
	var msg = _cryptoJs2.default.enc.Hex.parse($data);
	var msgHash = _cryptoJs2.default.SHA256(msg);
	var msgHashHex = new Buffer(msgHash.toString(), "hex");
	var privateKeyHex = new Buffer($privateKey, "hex");
	// console.log( "msgHash:", msgHashHex.toString('hex'));
	// console.log('buffer', privateKeyHex.toString('hex'));

	var elliptic = new _elliptic.ec('p256');
	var sig = elliptic.sign(msgHashHex, $privateKey, null);
	var signature = {
		signature: Buffer.concat([sig.r.toArrayLike(Buffer, 'be', 32), sig.s.toArrayLike(Buffer, 'be', 32)])
	};
	return signature.signature.toString('hex');
};

var fetchAccountsFromPublicKeyEncoded = exports.fetchAccountsFromPublicKeyEncoded = function fetchAccountsFromPublicKeyEncoded($publicKeyEncoded) {
	if (!verifyPublicKeyEncoded($publicKeyEncoded)) {
		// verify failed.
		return -1;
	}

	var accounts = [];

	var publicKeyHash = getHash($publicKeyEncoded);
	//console.log( publicKeyHash );

	var script = createSignatureScript($publicKeyEncoded);
	//console.log( script );

	var programHash = getHash(script);
	//console.log( programHash );

	var address = toAddress((0, _utils.hexstring2ab)(programHash.toString()));
	//console.log( address );

	accounts[0] = {
		privatekey: '',
		publickeyEncoded: $publicKeyEncoded,
		publickeyHash: publicKeyHash.toString(),
		programHash: programHash.toString(),
		address: address
	};

	return accounts;
};

// TODO: why does this wrap return info in a list? seems unnecessary
// ditto for all the other GetAccounts methods
var getAccountsFromPrivateKey = exports.getAccountsFromPrivateKey = function getAccountsFromPrivateKey($privateKey) {
	if ($privateKey.length != 64) {
		return -1;
	}

	var accounts = [];
	var publicKeyEncoded = getPublicKey($privateKey, true);
	//console.log( publicKeyEncoded );

	var publicKeyHash = getHash(publicKeyEncoded.toString('hex'));
	//console.log( publicKeyHash );

	var script = createSignatureScript(publicKeyEncoded);
	//console.log( script );

	var programHash = getHash(script);
	//console.log( programHash );

	var address = toAddress((0, _utils.hexstring2ab)(programHash.toString()));
	//console.log( address );

	accounts[0] = {
		privatekey: $privateKey,
		publickeyEncoded: publicKeyEncoded.toString('hex'),
		publickeyHash: publicKeyHash.toString(),
		programHash: programHash.toString(),
		address: address
	};

	return accounts;
};

// lookup account data (publicKey, privateKey, address, etc. from WIF)
// returns -1 for basic encoding errors
// returns -2 for WIF verify fail
var getAccountsFromWIFKey = exports.getAccountsFromWIFKey = function getAccountsFromWIFKey($WIFKey) {
	var privateKey = getPrivateKeyFromWIF($WIFKey);
	if (privateKey == -1 || privateKey == -2) {
		return privateKey;
	}

	return getAccountsFromPrivateKey(privateKey);
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var hash = exports;

hash.utils = __webpack_require__(4);
hash.common = __webpack_require__(10);
hash.sha = __webpack_require__(68);
hash.ripemd = __webpack_require__(72);
hash.hmac = __webpack_require__(73);

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-1 hash algorithm.
	     */
	    var SHA1 = C_algo.SHA1 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476,
	                0xc3d2e1f0
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];

	            // Computation
	            for (var i = 0; i < 80; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
	                    W[i] = (n << 1) | (n >>> 31);
	                }

	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
	                if (i < 20) {
	                    t += ((b & c) | (~b & d)) + 0x5a827999;
	                } else if (i < 40) {
	                    t += (b ^ c ^ d) + 0x6ed9eba1;
	                } else if (i < 60) {
	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
	                } else /* if (i < 80) */ {
	                    t += (b ^ c ^ d) - 0x359d3e2a;
	                }

	                e = d;
	                d = c;
	                c = (b << 30) | (b >>> 2);
	                b = a;
	                a = t;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA1('message');
	     *     var hash = CryptoJS.SHA1(wordArray);
	     */
	    C.SHA1 = Hasher._createHelper(SHA1);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA1(message, key);
	     */
	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
	}());


	return CryptoJS.SHA1;

}));

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var C_algo = C.algo;

	    /**
	     * HMAC algorithm.
	     */
	    var HMAC = C_algo.HMAC = Base.extend({
	        /**
	         * Initializes a newly created HMAC.
	         *
	         * @param {Hasher} hasher The hash algorithm to use.
	         * @param {WordArray|string} key The secret key.
	         *
	         * @example
	         *
	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	         */
	        init: function (hasher, key) {
	            // Init hasher
	            hasher = this._hasher = new hasher.init();

	            // Convert string to WordArray, else assume WordArray already
	            if (typeof key == 'string') {
	                key = Utf8.parse(key);
	            }

	            // Shortcuts
	            var hasherBlockSize = hasher.blockSize;
	            var hasherBlockSizeBytes = hasherBlockSize * 4;

	            // Allow arbitrary length keys
	            if (key.sigBytes > hasherBlockSizeBytes) {
	                key = hasher.finalize(key);
	            }

	            // Clamp excess bits
	            key.clamp();

	            // Clone key for inner and outer pads
	            var oKey = this._oKey = key.clone();
	            var iKey = this._iKey = key.clone();

	            // Shortcuts
	            var oKeyWords = oKey.words;
	            var iKeyWords = iKey.words;

	            // XOR keys with pad constants
	            for (var i = 0; i < hasherBlockSize; i++) {
	                oKeyWords[i] ^= 0x5c5c5c5c;
	                iKeyWords[i] ^= 0x36363636;
	            }
	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this HMAC to its initial state.
	         *
	         * @example
	         *
	         *     hmacHasher.reset();
	         */
	        reset: function () {
	            // Shortcut
	            var hasher = this._hasher;

	            // Reset
	            hasher.reset();
	            hasher.update(this._iKey);
	        },

	        /**
	         * Updates this HMAC with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {HMAC} This HMAC instance.
	         *
	         * @example
	         *
	         *     hmacHasher.update('message');
	         *     hmacHasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            this._hasher.update(messageUpdate);

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the HMAC computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The HMAC.
	         *
	         * @example
	         *
	         *     var hmac = hmacHasher.finalize();
	         *     var hmac = hmacHasher.finalize('message');
	         *     var hmac = hmacHasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Shortcut
	            var hasher = this._hasher;

	            // Compute HMAC
	            var innerHash = hasher.finalize(messageUpdate);
	            hasher.reset();
	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

	            return hmac;
	        }
	    });
	}());


}));

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);
var normalizeHeaderName = __webpack_require__(122);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(123);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(128);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(44);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(11)
var BigInteger = __webpack_require__(12)

var THREE = BigInteger.valueOf(3)

function Point (curve, x, y, z) {
  assert.notStrictEqual(z, undefined, 'Missing Z coordinate')

  this.curve = curve
  this.x = x
  this.y = y
  this.z = z
  this._zInv = null

  this.compressed = true
}

Object.defineProperty(Point.prototype, 'zInv', {
  get: function () {
    if (this._zInv === null) {
      this._zInv = this.z.modInverse(this.curve.p)
    }

    return this._zInv
  }
})

Object.defineProperty(Point.prototype, 'affineX', {
  get: function () {
    return this.x.multiply(this.zInv).mod(this.curve.p)
  }
})

Object.defineProperty(Point.prototype, 'affineY', {
  get: function () {
    return this.y.multiply(this.zInv).mod(this.curve.p)
  }
})

Point.fromAffine = function (curve, x, y) {
  return new Point(curve, x, y, BigInteger.ONE)
}

Point.prototype.equals = function (other) {
  if (other === this) return true
  if (this.curve.isInfinity(this)) return this.curve.isInfinity(other)
  if (this.curve.isInfinity(other)) return this.curve.isInfinity(this)

  // u = Y2 * Z1 - Y1 * Z2
  var u = other.y.multiply(this.z).subtract(this.y.multiply(other.z)).mod(this.curve.p)

  if (u.signum() !== 0) return false

  // v = X2 * Z1 - X1 * Z2
  var v = other.x.multiply(this.z).subtract(this.x.multiply(other.z)).mod(this.curve.p)

  return v.signum() === 0
}

Point.prototype.negate = function () {
  var y = this.curve.p.subtract(this.y)

  return new Point(this.curve, this.x, y, this.z)
}

Point.prototype.add = function (b) {
  if (this.curve.isInfinity(this)) return b
  if (this.curve.isInfinity(b)) return this

  var x1 = this.x
  var y1 = this.y
  var x2 = b.x
  var y2 = b.y

  // u = Y2 * Z1 - Y1 * Z2
  var u = y2.multiply(this.z).subtract(y1.multiply(b.z)).mod(this.curve.p)
  // v = X2 * Z1 - X1 * Z2
  var v = x2.multiply(this.z).subtract(x1.multiply(b.z)).mod(this.curve.p)

  if (v.signum() === 0) {
    if (u.signum() === 0) {
      return this.twice() // this == b, so double
    }

    return this.curve.infinity // this = -b, so infinity
  }

  var v2 = v.square()
  var v3 = v2.multiply(v)
  var x1v2 = x1.multiply(v2)
  var zu2 = u.square().multiply(this.z)

  // x3 = v * (z2 * (z1 * u^2 - 2 * x1 * v^2) - v^3)
  var x3 = zu2.subtract(x1v2.shiftLeft(1)).multiply(b.z).subtract(v3).multiply(v).mod(this.curve.p)
  // y3 = z2 * (3 * x1 * u * v^2 - y1 * v^3 - z1 * u^3) + u * v^3
  var y3 = x1v2.multiply(THREE).multiply(u).subtract(y1.multiply(v3)).subtract(zu2.multiply(u)).multiply(b.z).add(u.multiply(v3)).mod(this.curve.p)
  // z3 = v^3 * z1 * z2
  var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.p)

  return new Point(this.curve, x3, y3, z3)
}

Point.prototype.twice = function () {
  if (this.curve.isInfinity(this)) return this
  if (this.y.signum() === 0) return this.curve.infinity

  var x1 = this.x
  var y1 = this.y

  var y1z1 = y1.multiply(this.z).mod(this.curve.p)
  var y1sqz1 = y1z1.multiply(y1).mod(this.curve.p)
  var a = this.curve.a

  // w = 3 * x1^2 + a * z1^2
  var w = x1.square().multiply(THREE)

  if (a.signum() !== 0) {
    w = w.add(this.z.square().multiply(a))
  }

  w = w.mod(this.curve.p)
  // x3 = 2 * y1 * z1 * (w^2 - 8 * x1 * y1^2 * z1)
  var x3 = w.square().subtract(x1.shiftLeft(3).multiply(y1sqz1)).shiftLeft(1).multiply(y1z1).mod(this.curve.p)
  // y3 = 4 * y1^2 * z1 * (3 * w * x1 - 2 * y1^2 * z1) - w^3
  var y3 = w.multiply(THREE).multiply(x1).subtract(y1sqz1.shiftLeft(1)).shiftLeft(2).multiply(y1sqz1).subtract(w.pow(3)).mod(this.curve.p)
  // z3 = 8 * (y1 * z1)^3
  var z3 = y1z1.pow(3).shiftLeft(3).mod(this.curve.p)

  return new Point(this.curve, x3, y3, z3)
}

// Simple NAF (Non-Adjacent Form) multiplication algorithm
// TODO: modularize the multiplication algorithm
Point.prototype.multiply = function (k) {
  if (this.curve.isInfinity(this)) return this
  if (k.signum() === 0) return this.curve.infinity

  var e = k
  var h = e.multiply(THREE)

  var neg = this.negate()
  var R = this

  for (var i = h.bitLength() - 2; i > 0; --i) {
    var hBit = h.testBit(i)
    var eBit = e.testBit(i)

    R = R.twice()

    if (hBit !== eBit) {
      R = R.add(hBit ? this : neg)
    }
  }

  return R
}

// Compute this*j + x*k (simultaneous multiplication)
Point.prototype.multiplyTwo = function (j, x, k) {
  var i = Math.max(j.bitLength(), k.bitLength()) - 1
  var R = this.curve.infinity
  var both = this.add(x)

  while (i >= 0) {
    var jBit = j.testBit(i)
    var kBit = k.testBit(i)

    R = R.twice()

    if (jBit) {
      if (kBit) {
        R = R.add(both)
      } else {
        R = R.add(this)
      }
    } else if (kBit) {
      R = R.add(x)
    }
    --i
  }

  return R
}

Point.prototype.getEncoded = function (compressed) {
  if (compressed == null) compressed = this.compressed
  if (this.curve.isInfinity(this)) return new Buffer('00', 'hex') // Infinity point encoded is simply '00'

  var x = this.affineX
  var y = this.affineY
  var byteLength = this.curve.pLength
  var buffer

  // 0x02/0x03 | X
  if (compressed) {
    buffer = new Buffer(1 + byteLength)
    buffer.writeUInt8(y.isEven() ? 0x02 : 0x03, 0)

  // 0x04 | X | Y
  } else {
    buffer = new Buffer(1 + byteLength + byteLength)
    buffer.writeUInt8(0x04, 0)

    y.toBuffer(byteLength).copy(buffer, 1 + byteLength)
  }

  x.toBuffer(byteLength).copy(buffer, 1)

  return buffer
}

Point.decodeFrom = function (curve, buffer) {
  var type = buffer.readUInt8(0)
  var compressed = (type !== 4)

  var byteLength = Math.floor((curve.p.bitLength() + 7) / 8)
  var x = BigInteger.fromBuffer(buffer.slice(1, 1 + byteLength))

  var Q
  if (compressed) {
    assert.equal(buffer.length, byteLength + 1, 'Invalid sequence length')
    assert(type === 0x02 || type === 0x03, 'Invalid sequence tag')

    var isOdd = (type === 0x03)
    Q = curve.pointFromX(isOdd, x)
  } else {
    assert.equal(buffer.length, 1 + byteLength + byteLength, 'Invalid sequence length')

    var y = BigInteger.fromBuffer(buffer.slice(1 + byteLength))
    Q = Point.fromAffine(curve, x, y)
  }

  Q.compressed = compressed
  return Q
}

Point.prototype.toString = function () {
  if (this.curve.isInfinity(this)) return '(INFINITY)'

  return '(' + this.affineX.toString() + ',' + this.affineY.toString() + ')'
}

module.exports = Point


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// (public) Constructor
function BigInteger(a, b, c) {
  if (!(this instanceof BigInteger))
    return new BigInteger(a, b, c)

  if (a != null) {
    if ("number" == typeof a) this.fromNumber(a, b, c)
    else if (b == null && "string" != typeof a) this.fromString(a, 256)
    else this.fromString(a, b)
  }
}

var proto = BigInteger.prototype

// duck-typed isBigInteger
proto.__bigi = __webpack_require__(55).version
BigInteger.isBigInteger = function (obj, check_ver) {
  return obj && obj.__bigi && (!check_ver || obj.__bigi === proto.__bigi)
}

// Bits per digit
var dbits

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this[i++] + w[j] + c
    c = Math.floor(v / 0x4000000)
    w[j++] = v & 0x3ffffff
  }
  return c
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
  var xl = x & 0x7fff,
    xh = x >> 15
  while (--n >= 0) {
    var l = this[i] & 0x7fff
    var h = this[i++] >> 15
    var m = xh * l + h * xl
    l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff)
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30)
    w[j++] = l & 0x3fffffff
  }
  return c
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
  var xl = x & 0x3fff,
    xh = x >> 14
  while (--n >= 0) {
    var l = this[i] & 0x3fff
    var h = this[i++] >> 14
    var m = xh * l + h * xl
    l = xl * l + ((m & 0x3fff) << 14) + w[j] + c
    c = (l >> 28) + (m >> 14) + xh * h
    w[j++] = l & 0xfffffff
  }
  return c
}

// wtf?
BigInteger.prototype.am = am1
dbits = 26

BigInteger.prototype.DB = dbits
BigInteger.prototype.DM = ((1 << dbits) - 1)
var DV = BigInteger.prototype.DV = (1 << dbits)

var BI_FP = 52
BigInteger.prototype.FV = Math.pow(2, BI_FP)
BigInteger.prototype.F1 = BI_FP - dbits
BigInteger.prototype.F2 = 2 * dbits - BI_FP

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz"
var BI_RC = new Array()
var rr, vv
rr = "0".charCodeAt(0)
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv
rr = "a".charCodeAt(0)
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv
rr = "A".charCodeAt(0)
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv

function int2char(n) {
  return BI_RM.charAt(n)
}

function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)]
  return (c == null) ? -1 : c
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for (var i = this.t - 1; i >= 0; --i) r[i] = this[i]
  r.t = this.t
  r.s = this.s
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1
  this.s = (x < 0) ? -1 : 0
  if (x > 0) this[0] = x
  else if (x < -1) this[0] = x + DV
  else this.t = 0
}

// return bigint initialized to value
function nbv(i) {
  var r = new BigInteger()
  r.fromInt(i)
  return r
}

// (protected) set from string and radix
function bnpFromString(s, b) {
  var self = this

  var k
  if (b == 16) k = 4
  else if (b == 8) k = 3
  else if (b == 256) k = 8; // byte array
  else if (b == 2) k = 1
  else if (b == 32) k = 5
  else if (b == 4) k = 2
  else {
    self.fromRadix(s, b)
    return
  }
  self.t = 0
  self.s = 0
  var i = s.length,
    mi = false,
    sh = 0
  while (--i >= 0) {
    var x = (k == 8) ? s[i] & 0xff : intAt(s, i)
    if (x < 0) {
      if (s.charAt(i) == "-") mi = true
      continue
    }
    mi = false
    if (sh == 0)
      self[self.t++] = x
    else if (sh + k > self.DB) {
      self[self.t - 1] |= (x & ((1 << (self.DB - sh)) - 1)) << sh
      self[self.t++] = (x >> (self.DB - sh))
    } else
      self[self.t - 1] |= x << sh
    sh += k
    if (sh >= self.DB) sh -= self.DB
  }
  if (k == 8 && (s[0] & 0x80) != 0) {
    self.s = -1
    if (sh > 0) self[self.t - 1] |= ((1 << (self.DB - sh)) - 1) << sh
  }
  self.clamp()
  if (mi) BigInteger.ZERO.subTo(self, self)
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s & this.DM
  while (this.t > 0 && this[this.t - 1] == c)--this.t
}

// (public) return string representation in given radix
function bnToString(b) {
  var self = this
  if (self.s < 0) return "-" + self.negate()
    .toString(b)
  var k
  if (b == 16) k = 4
  else if (b == 8) k = 3
  else if (b == 2) k = 1
  else if (b == 32) k = 5
  else if (b == 4) k = 2
  else return self.toRadix(b)
  var km = (1 << k) - 1,
    d, m = false,
    r = "",
    i = self.t
  var p = self.DB - (i * self.DB) % k
  if (i-- > 0) {
    if (p < self.DB && (d = self[i] >> p) > 0) {
      m = true
      r = int2char(d)
    }
    while (i >= 0) {
      if (p < k) {
        d = (self[i] & ((1 << p) - 1)) << (k - p)
        d |= self[--i] >> (p += self.DB - k)
      } else {
        d = (self[i] >> (p -= k)) & km
        if (p <= 0) {
          p += self.DB
          --i
        }
      }
      if (d > 0) m = true
      if (m) r += int2char(d)
    }
  }
  return m ? r : "0"
}

// (public) -this
function bnNegate() {
  var r = new BigInteger()
  BigInteger.ZERO.subTo(this, r)
  return r
}

// (public) |this|
function bnAbs() {
  return (this.s < 0) ? this.negate() : this
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s - a.s
  if (r != 0) return r
  var i = this.t
  r = i - a.t
  if (r != 0) return (this.s < 0) ? -r : r
  while (--i >= 0)
    if ((r = this[i] - a[i]) != 0) return r
  return 0
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1,
    t
  if ((t = x >>> 16) != 0) {
    x = t
    r += 16
  }
  if ((t = x >> 8) != 0) {
    x = t
    r += 8
  }
  if ((t = x >> 4) != 0) {
    x = t
    r += 4
  }
  if ((t = x >> 2) != 0) {
    x = t
    r += 2
  }
  if ((t = x >> 1) != 0) {
    x = t
    r += 1
  }
  return r
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if (this.t <= 0) return 0
  return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM))
}

// (public) return the number of bytes in "this"
function bnByteLength() {
  return this.bitLength() >> 3
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n, r) {
  var i
  for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i]
  for (i = n - 1; i >= 0; --i) r[i] = 0
  r.t = this.t + n
  r.s = this.s
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n, r) {
  for (var i = n; i < this.t; ++i) r[i - n] = this[i]
  r.t = Math.max(this.t - n, 0)
  r.s = this.s
}

// (protected) r = this << n
function bnpLShiftTo(n, r) {
  var self = this
  var bs = n % self.DB
  var cbs = self.DB - bs
  var bm = (1 << cbs) - 1
  var ds = Math.floor(n / self.DB),
    c = (self.s << bs) & self.DM,
    i
  for (i = self.t - 1; i >= 0; --i) {
    r[i + ds + 1] = (self[i] >> cbs) | c
    c = (self[i] & bm) << bs
  }
  for (i = ds - 1; i >= 0; --i) r[i] = 0
  r[ds] = c
  r.t = self.t + ds + 1
  r.s = self.s
  r.clamp()
}

// (protected) r = this >> n
function bnpRShiftTo(n, r) {
  var self = this
  r.s = self.s
  var ds = Math.floor(n / self.DB)
  if (ds >= self.t) {
    r.t = 0
    return
  }
  var bs = n % self.DB
  var cbs = self.DB - bs
  var bm = (1 << bs) - 1
  r[0] = self[ds] >> bs
  for (var i = ds + 1; i < self.t; ++i) {
    r[i - ds - 1] |= (self[i] & bm) << cbs
    r[i - ds] = self[i] >> bs
  }
  if (bs > 0) r[self.t - ds - 1] |= (self.s & bm) << cbs
  r.t = self.t - ds
  r.clamp()
}

// (protected) r = this - a
function bnpSubTo(a, r) {
  var self = this
  var i = 0,
    c = 0,
    m = Math.min(a.t, self.t)
  while (i < m) {
    c += self[i] - a[i]
    r[i++] = c & self.DM
    c >>= self.DB
  }
  if (a.t < self.t) {
    c -= a.s
    while (i < self.t) {
      c += self[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += self.s
  } else {
    c += self.s
    while (i < a.t) {
      c -= a[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c -= a.s
  }
  r.s = (c < 0) ? -1 : 0
  if (c < -1) r[i++] = self.DV + c
  else if (c > 0) r[i++] = c
  r.t = i
  r.clamp()
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a, r) {
  var x = this.abs(),
    y = a.abs()
  var i = x.t
  r.t = i + y.t
  while (--i >= 0) r[i] = 0
  for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t)
  r.s = 0
  r.clamp()
  if (this.s != a.s) BigInteger.ZERO.subTo(r, r)
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs()
  var i = r.t = 2 * x.t
  while (--i >= 0) r[i] = 0
  for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x[i], r, 2 * i, 0, 1)
    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
      r[i + x.t] -= x.DV
      r[i + x.t + 1] = 1
    }
  }
  if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1)
  r.s = 0
  r.clamp()
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m, q, r) {
  var self = this
  var pm = m.abs()
  if (pm.t <= 0) return
  var pt = self.abs()
  if (pt.t < pm.t) {
    if (q != null) q.fromInt(0)
    if (r != null) self.copyTo(r)
    return
  }
  if (r == null) r = new BigInteger()
  var y = new BigInteger(),
    ts = self.s,
    ms = m.s
  var nsh = self.DB - nbits(pm[pm.t - 1]); // normalize modulus
  if (nsh > 0) {
    pm.lShiftTo(nsh, y)
    pt.lShiftTo(nsh, r)
  } else {
    pm.copyTo(y)
    pt.copyTo(r)
  }
  var ys = y.t
  var y0 = y[ys - 1]
  if (y0 == 0) return
  var yt = y0 * (1 << self.F1) + ((ys > 1) ? y[ys - 2] >> self.F2 : 0)
  var d1 = self.FV / yt,
    d2 = (1 << self.F1) / yt,
    e = 1 << self.F2
  var i = r.t,
    j = i - ys,
    t = (q == null) ? new BigInteger() : q
  y.dlShiftTo(j, t)
  if (r.compareTo(t) >= 0) {
    r[r.t++] = 1
    r.subTo(t, r)
  }
  BigInteger.ONE.dlShiftTo(ys, t)
  t.subTo(y, y); // "negative" y so we can replace sub with am later
  while (y.t < ys) y[y.t++] = 0
  while (--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i] == y0) ? self.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2)
    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
      y.dlShiftTo(j, t)
      r.subTo(t, r)
      while (r[i] < --qd) r.subTo(t, r)
    }
  }
  if (q != null) {
    r.drShiftTo(ys, q)
    if (ts != ms) BigInteger.ZERO.subTo(q, q)
  }
  r.t = ys
  r.clamp()
  if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
  if (ts < 0) BigInteger.ZERO.subTo(r, r)
}

// (public) this mod a
function bnMod(a) {
  var r = new BigInteger()
  this.abs()
    .divRemTo(a, null, r)
  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r)
  return r
}

// Modular reduction using "classic" algorithm
function Classic(m) {
  this.m = m
}

function cConvert(x) {
  if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m)
  else return x
}

function cRevert(x) {
  return x
}

function cReduce(x) {
  x.divRemTo(this.m, null, x)
}

function cMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

function cSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

Classic.prototype.convert = cConvert
Classic.prototype.revert = cRevert
Classic.prototype.reduce = cReduce
Classic.prototype.mulTo = cMulTo
Classic.prototype.sqrTo = cSqrTo

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if (this.t < 1) return 0
  var x = this[0]
  if ((x & 1) == 0) return 0
  var y = x & 3; // y == 1/x mod 2^2
  y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
  y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
  y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y > 0) ? this.DV - y : -y
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m
  this.mp = m.invDigit()
  this.mpl = this.mp & 0x7fff
  this.mph = this.mp >> 15
  this.um = (1 << (m.DB - 15)) - 1
  this.mt2 = 2 * m.t
}

// xR mod m
function montConvert(x) {
  var r = new BigInteger()
  x.abs()
    .dlShiftTo(this.m.t, r)
  r.divRemTo(this.m, null, r)
  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r)
  return r
}

// x/R mod m
function montRevert(x) {
  var r = new BigInteger()
  x.copyTo(r)
  this.reduce(r)
  return r
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while (x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0
  for (var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i] & 0x7fff
    var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM
    // use am to combine the multiply-shift-add into one call
    j = i + this.m.t
    x[j] += this.m.am(0, u0, x, i, 0, this.m.t)
    // propagate carry
    while (x[j] >= x.DV) {
      x[j] -= x.DV
      x[++j]++
    }
  }
  x.clamp()
  x.drShiftTo(this.m.t, x)
  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x)
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

Montgomery.prototype.convert = montConvert
Montgomery.prototype.revert = montRevert
Montgomery.prototype.reduce = montReduce
Montgomery.prototype.mulTo = montMulTo
Montgomery.prototype.sqrTo = montSqrTo

// (protected) true iff this is even
function bnpIsEven() {
  return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
}

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e, z) {
  if (e > 0xffffffff || e < 1) return BigInteger.ONE
  var r = new BigInteger(),
    r2 = new BigInteger(),
    g = z.convert(this),
    i = nbits(e) - 1
  g.copyTo(r)
  while (--i >= 0) {
    z.sqrTo(r, r2)
    if ((e & (1 << i)) > 0) z.mulTo(r2, g, r)
    else {
      var t = r
      r = r2
      r2 = t
    }
  }
  return z.revert(r)
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e, m) {
  var z
  if (e < 256 || m.isEven()) z = new Classic(m)
  else z = new Montgomery(m)
  return this.exp(e, z)
}

// protected
proto.copyTo = bnpCopyTo
proto.fromInt = bnpFromInt
proto.fromString = bnpFromString
proto.clamp = bnpClamp
proto.dlShiftTo = bnpDLShiftTo
proto.drShiftTo = bnpDRShiftTo
proto.lShiftTo = bnpLShiftTo
proto.rShiftTo = bnpRShiftTo
proto.subTo = bnpSubTo
proto.multiplyTo = bnpMultiplyTo
proto.squareTo = bnpSquareTo
proto.divRemTo = bnpDivRemTo
proto.invDigit = bnpInvDigit
proto.isEven = bnpIsEven
proto.exp = bnpExp

// public
proto.toString = bnToString
proto.negate = bnNegate
proto.abs = bnAbs
proto.compareTo = bnCompareTo
proto.bitLength = bnBitLength
proto.byteLength = bnByteLength
proto.mod = bnMod
proto.modPowInt = bnModPowInt

// (public)
function bnClone() {
  var r = new BigInteger()
  this.copyTo(r)
  return r
}

// (public) return value as integer
function bnIntValue() {
  if (this.s < 0) {
    if (this.t == 1) return this[0] - this.DV
    else if (this.t == 0) return -1
  } else if (this.t == 1) return this[0]
  else if (this.t == 0) return 0
  // assumes 16 < DB < 32
  return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0]
}

// (public) return value as byte
function bnByteValue() {
  return (this.t == 0) ? this.s : (this[0] << 24) >> 24
}

// (public) return value as short (assumes DB>=16)
function bnShortValue() {
  return (this.t == 0) ? this.s : (this[0] << 16) >> 16
}

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) {
  return Math.floor(Math.LN2 * this.DB / Math.log(r))
}

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if (this.s < 0) return -1
  else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0
  else return 1
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if (b == null) b = 10
  if (this.signum() == 0 || b < 2 || b > 36) return "0"
  var cs = this.chunkSize(b)
  var a = Math.pow(b, cs)
  var d = nbv(a),
    y = new BigInteger(),
    z = new BigInteger(),
    r = ""
  this.divRemTo(d, y, z)
  while (y.signum() > 0) {
    r = (a + z.intValue())
      .toString(b)
      .substr(1) + r
    y.divRemTo(d, y, z)
  }
  return z.intValue()
    .toString(b) + r
}

// (protected) convert from radix string
function bnpFromRadix(s, b) {
  var self = this
  self.fromInt(0)
  if (b == null) b = 10
  var cs = self.chunkSize(b)
  var d = Math.pow(b, cs),
    mi = false,
    j = 0,
    w = 0
  for (var i = 0; i < s.length; ++i) {
    var x = intAt(s, i)
    if (x < 0) {
      if (s.charAt(i) == "-" && self.signum() == 0) mi = true
      continue
    }
    w = b * w + x
    if (++j >= cs) {
      self.dMultiply(d)
      self.dAddOffset(w, 0)
      j = 0
      w = 0
    }
  }
  if (j > 0) {
    self.dMultiply(Math.pow(b, j))
    self.dAddOffset(w, 0)
  }
  if (mi) BigInteger.ZERO.subTo(self, self)
}

// (protected) alternate constructor
function bnpFromNumber(a, b, c) {
  var self = this
  if ("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if (a < 2) self.fromInt(1)
    else {
      self.fromNumber(a, c)
      if (!self.testBit(a - 1)) // force MSB set
        self.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, self)
      if (self.isEven()) self.dAddOffset(1, 0); // force odd
      while (!self.isProbablePrime(b)) {
        self.dAddOffset(2, 0)
        if (self.bitLength() > a) self.subTo(BigInteger.ONE.shiftLeft(a - 1), self)
      }
    }
  } else {
    // new BigInteger(int,RNG)
    var x = new Array(),
      t = a & 7
    x.length = (a >> 3) + 1
    b.nextBytes(x)
    if (t > 0) x[0] &= ((1 << t) - 1)
    else x[0] = 0
    self.fromString(x, 256)
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var self = this
  var i = self.t,
    r = new Array()
  r[0] = self.s
  var p = self.DB - (i * self.DB) % 8,
    d, k = 0
  if (i-- > 0) {
    if (p < self.DB && (d = self[i] >> p) != (self.s & self.DM) >> p)
      r[k++] = d | (self.s << (self.DB - p))
    while (i >= 0) {
      if (p < 8) {
        d = (self[i] & ((1 << p) - 1)) << (8 - p)
        d |= self[--i] >> (p += self.DB - 8)
      } else {
        d = (self[i] >> (p -= 8)) & 0xff
        if (p <= 0) {
          p += self.DB
          --i
        }
      }
      if ((d & 0x80) != 0) d |= -256
      if (k === 0 && (self.s & 0x80) != (d & 0x80))++k
      if (k > 0 || d != self.s) r[k++] = d
    }
  }
  return r
}

function bnEquals(a) {
  return (this.compareTo(a) == 0)
}

function bnMin(a) {
  return (this.compareTo(a) < 0) ? this : a
}

function bnMax(a) {
  return (this.compareTo(a) > 0) ? this : a
}

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a, op, r) {
  var self = this
  var i, f, m = Math.min(a.t, self.t)
  for (i = 0; i < m; ++i) r[i] = op(self[i], a[i])
  if (a.t < self.t) {
    f = a.s & self.DM
    for (i = m; i < self.t; ++i) r[i] = op(self[i], f)
    r.t = self.t
  } else {
    f = self.s & self.DM
    for (i = m; i < a.t; ++i) r[i] = op(f, a[i])
    r.t = a.t
  }
  r.s = op(self.s, a.s)
  r.clamp()
}

// (public) this & a
function op_and(x, y) {
  return x & y
}

function bnAnd(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_and, r)
  return r
}

// (public) this | a
function op_or(x, y) {
  return x | y
}

function bnOr(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_or, r)
  return r
}

// (public) this ^ a
function op_xor(x, y) {
  return x ^ y
}

function bnXor(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_xor, r)
  return r
}

// (public) this & ~a
function op_andnot(x, y) {
  return x & ~y
}

function bnAndNot(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_andnot, r)
  return r
}

// (public) ~this
function bnNot() {
  var r = new BigInteger()
  for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i]
  r.t = this.t
  r.s = ~this.s
  return r
}

// (public) this << n
function bnShiftLeft(n) {
  var r = new BigInteger()
  if (n < 0) this.rShiftTo(-n, r)
  else this.lShiftTo(n, r)
  return r
}

// (public) this >> n
function bnShiftRight(n) {
  var r = new BigInteger()
  if (n < 0) this.lShiftTo(-n, r)
  else this.rShiftTo(n, r)
  return r
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if (x == 0) return -1
  var r = 0
  if ((x & 0xffff) == 0) {
    x >>= 16
    r += 16
  }
  if ((x & 0xff) == 0) {
    x >>= 8
    r += 8
  }
  if ((x & 0xf) == 0) {
    x >>= 4
    r += 4
  }
  if ((x & 3) == 0) {
    x >>= 2
    r += 2
  }
  if ((x & 1) == 0)++r
  return r
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for (var i = 0; i < this.t; ++i)
    if (this[i] != 0) return i * this.DB + lbit(this[i])
  if (this.s < 0) return this.t * this.DB
  return -1
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0
  while (x != 0) {
    x &= x - 1
    ++r
  }
  return r
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0,
    x = this.s & this.DM
  for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x)
  return r
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n / this.DB)
  if (j >= this.t) return (this.s != 0)
  return ((this[j] & (1 << (n % this.DB))) != 0)
}

// (protected) this op (1<<n)
function bnpChangeBit(n, op) {
  var r = BigInteger.ONE.shiftLeft(n)
  this.bitwiseTo(r, op, r)
  return r
}

// (public) this | (1<<n)
function bnSetBit(n) {
  return this.changeBit(n, op_or)
}

// (public) this & ~(1<<n)
function bnClearBit(n) {
  return this.changeBit(n, op_andnot)
}

// (public) this ^ (1<<n)
function bnFlipBit(n) {
  return this.changeBit(n, op_xor)
}

// (protected) r = this + a
function bnpAddTo(a, r) {
  var self = this

  var i = 0,
    c = 0,
    m = Math.min(a.t, self.t)
  while (i < m) {
    c += self[i] + a[i]
    r[i++] = c & self.DM
    c >>= self.DB
  }
  if (a.t < self.t) {
    c += a.s
    while (i < self.t) {
      c += self[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += self.s
  } else {
    c += self.s
    while (i < a.t) {
      c += a[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += a.s
  }
  r.s = (c < 0) ? -1 : 0
  if (c > 0) r[i++] = c
  else if (c < -1) r[i++] = self.DV + c
  r.t = i
  r.clamp()
}

// (public) this + a
function bnAdd(a) {
  var r = new BigInteger()
  this.addTo(a, r)
  return r
}

// (public) this - a
function bnSubtract(a) {
  var r = new BigInteger()
  this.subTo(a, r)
  return r
}

// (public) this * a
function bnMultiply(a) {
  var r = new BigInteger()
  this.multiplyTo(a, r)
  return r
}

// (public) this^2
function bnSquare() {
  var r = new BigInteger()
  this.squareTo(r)
  return r
}

// (public) this / a
function bnDivide(a) {
  var r = new BigInteger()
  this.divRemTo(a, r, null)
  return r
}

// (public) this % a
function bnRemainder(a) {
  var r = new BigInteger()
  this.divRemTo(a, null, r)
  return r
}

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = new BigInteger(),
    r = new BigInteger()
  this.divRemTo(a, q, r)
  return new Array(q, r)
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0, n - 1, this, 0, 0, this.t)
  ++this.t
  this.clamp()
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n, w) {
  if (n == 0) return
  while (this.t <= w) this[this.t++] = 0
  this[w] += n
  while (this[w] >= this.DV) {
    this[w] -= this.DV
    if (++w >= this.t) this[this.t++] = 0
    ++this[w]
  }
}

// A "null" reducer
function NullExp() {}

function nNop(x) {
  return x
}

function nMulTo(x, y, r) {
  x.multiplyTo(y, r)
}

function nSqrTo(x, r) {
  x.squareTo(r)
}

NullExp.prototype.convert = nNop
NullExp.prototype.revert = nNop
NullExp.prototype.mulTo = nMulTo
NullExp.prototype.sqrTo = nSqrTo

// (public) this^e
function bnPow(e) {
  return this.exp(e, new NullExp())
}

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a, n, r) {
  var i = Math.min(this.t + a.t, n)
  r.s = 0; // assumes a,this >= 0
  r.t = i
  while (i > 0) r[--i] = 0
  var j
  for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t)
  for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i)
  r.clamp()
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a, n, r) {
  --n
  var i = r.t = this.t + a.t - n
  r.s = 0; // assumes a,this >= 0
  while (--i >= 0) r[i] = 0
  for (i = Math.max(n - this.t, 0); i < a.t; ++i)
    r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n)
  r.clamp()
  r.drShiftTo(1, r)
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = new BigInteger()
  this.q3 = new BigInteger()
  BigInteger.ONE.dlShiftTo(2 * m.t, this.r2)
  this.mu = this.r2.divide(m)
  this.m = m
}

function barrettConvert(x) {
  if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m)
  else if (x.compareTo(this.m) < 0) return x
  else {
    var r = new BigInteger()
    x.copyTo(r)
    this.reduce(r)
    return r
  }
}

function barrettRevert(x) {
  return x
}

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  var self = this
  x.drShiftTo(self.m.t - 1, self.r2)
  if (x.t > self.m.t + 1) {
    x.t = self.m.t + 1
    x.clamp()
  }
  self.mu.multiplyUpperTo(self.r2, self.m.t + 1, self.q3)
  self.m.multiplyLowerTo(self.q3, self.m.t + 1, self.r2)
  while (x.compareTo(self.r2) < 0) x.dAddOffset(1, self.m.t + 1)
  x.subTo(self.r2, x)
  while (x.compareTo(self.m) >= 0) x.subTo(self.m, x)
}

// r = x^2 mod m; x != r
function barrettSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

// r = x*y mod m; x,y != r
function barrettMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

Barrett.prototype.convert = barrettConvert
Barrett.prototype.revert = barrettRevert
Barrett.prototype.reduce = barrettReduce
Barrett.prototype.mulTo = barrettMulTo
Barrett.prototype.sqrTo = barrettSqrTo

// (public) this^e % m (HAC 14.85)
function bnModPow(e, m) {
  var i = e.bitLength(),
    k, r = nbv(1),
    z
  if (i <= 0) return r
  else if (i < 18) k = 1
  else if (i < 48) k = 3
  else if (i < 144) k = 4
  else if (i < 768) k = 5
  else k = 6
  if (i < 8)
    z = new Classic(m)
  else if (m.isEven())
    z = new Barrett(m)
  else
    z = new Montgomery(m)

  // precomputation
  var g = new Array(),
    n = 3,
    k1 = k - 1,
    km = (1 << k) - 1
  g[1] = z.convert(this)
  if (k > 1) {
    var g2 = new BigInteger()
    z.sqrTo(g[1], g2)
    while (n <= km) {
      g[n] = new BigInteger()
      z.mulTo(g2, g[n - 2], g[n])
      n += 2
    }
  }

  var j = e.t - 1,
    w, is1 = true,
    r2 = new BigInteger(),
    t
  i = nbits(e[j]) - 1
  while (j >= 0) {
    if (i >= k1) w = (e[j] >> (i - k1)) & km
    else {
      w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i)
      if (j > 0) w |= e[j - 1] >> (this.DB + i - k1)
    }

    n = k
    while ((w & 1) == 0) {
      w >>= 1
      --n
    }
    if ((i -= n) < 0) {
      i += this.DB
      --j
    }
    if (is1) { // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r)
      is1 = false
    } else {
      while (n > 1) {
        z.sqrTo(r, r2)
        z.sqrTo(r2, r)
        n -= 2
      }
      if (n > 0) z.sqrTo(r, r2)
      else {
        t = r
        r = r2
        r2 = t
      }
      z.mulTo(r2, g[w], r)
    }

    while (j >= 0 && (e[j] & (1 << i)) == 0) {
      z.sqrTo(r, r2)
      t = r
      r = r2
      r2 = t
      if (--i < 0) {
        i = this.DB - 1
        --j
      }
    }
  }
  return z.revert(r)
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s < 0) ? this.negate() : this.clone()
  var y = (a.s < 0) ? a.negate() : a.clone()
  if (x.compareTo(y) < 0) {
    var t = x
    x = y
    y = t
  }
  var i = x.getLowestSetBit(),
    g = y.getLowestSetBit()
  if (g < 0) return x
  if (i < g) g = i
  if (g > 0) {
    x.rShiftTo(g, x)
    y.rShiftTo(g, y)
  }
  while (x.signum() > 0) {
    if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x)
    if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y)
    if (x.compareTo(y) >= 0) {
      x.subTo(y, x)
      x.rShiftTo(1, x)
    } else {
      y.subTo(x, y)
      y.rShiftTo(1, y)
    }
  }
  if (g > 0) y.lShiftTo(g, y)
  return y
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if (n <= 0) return 0
  var d = this.DV % n,
    r = (this.s < 0) ? n - 1 : 0
  if (this.t > 0)
    if (d == 0) r = this[0] % n
    else
      for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n
  return r
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven()
  if (this.signum() === 0) throw new Error('division by zero')
  if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO
  var u = m.clone(),
    v = this.clone()
  var a = nbv(1),
    b = nbv(0),
    c = nbv(0),
    d = nbv(1)
  while (u.signum() != 0) {
    while (u.isEven()) {
      u.rShiftTo(1, u)
      if (ac) {
        if (!a.isEven() || !b.isEven()) {
          a.addTo(this, a)
          b.subTo(m, b)
        }
        a.rShiftTo(1, a)
      } else if (!b.isEven()) b.subTo(m, b)
      b.rShiftTo(1, b)
    }
    while (v.isEven()) {
      v.rShiftTo(1, v)
      if (ac) {
        if (!c.isEven() || !d.isEven()) {
          c.addTo(this, c)
          d.subTo(m, d)
        }
        c.rShiftTo(1, c)
      } else if (!d.isEven()) d.subTo(m, d)
      d.rShiftTo(1, d)
    }
    if (u.compareTo(v) >= 0) {
      u.subTo(v, u)
      if (ac) a.subTo(c, a)
      b.subTo(d, b)
    } else {
      v.subTo(u, v)
      if (ac) c.subTo(a, c)
      d.subTo(b, d)
    }
  }
  if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO
  while (d.compareTo(m) >= 0) d.subTo(m, d)
  while (d.signum() < 0) d.addTo(m, d)
  return d
}

var lowprimes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
  421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
  509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607,
  613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701,
  709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811,
  821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911,
  919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
]

var lplim = (1 << 26) / lowprimes[lowprimes.length - 1]

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs()
  if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
    for (i = 0; i < lowprimes.length; ++i)
      if (x[0] == lowprimes[i]) return true
    return false
  }
  if (x.isEven()) return false
  i = 1
  while (i < lowprimes.length) {
    var m = lowprimes[i],
      j = i + 1
    while (j < lowprimes.length && m < lplim) m *= lowprimes[j++]
    m = x.modInt(m)
    while (i < j) if (m % lowprimes[i++] == 0) return false
  }
  return x.millerRabin(t)
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE)
  var k = n1.getLowestSetBit()
  if (k <= 0) return false
  var r = n1.shiftRight(k)
  t = (t + 1) >> 1
  if (t > lowprimes.length) t = lowprimes.length
  var a = new BigInteger(null)
  var j, bases = []
  for (var i = 0; i < t; ++i) {
    for (;;) {
      j = lowprimes[Math.floor(Math.random() * lowprimes.length)]
      if (bases.indexOf(j) == -1) break
    }
    bases.push(j)
    a.fromInt(j)
    var y = a.modPow(r, this)
    if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1
      while (j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2, this)
        if (y.compareTo(BigInteger.ONE) == 0) return false
      }
      if (y.compareTo(n1) != 0) return false
    }
  }
  return true
}

// protected
proto.chunkSize = bnpChunkSize
proto.toRadix = bnpToRadix
proto.fromRadix = bnpFromRadix
proto.fromNumber = bnpFromNumber
proto.bitwiseTo = bnpBitwiseTo
proto.changeBit = bnpChangeBit
proto.addTo = bnpAddTo
proto.dMultiply = bnpDMultiply
proto.dAddOffset = bnpDAddOffset
proto.multiplyLowerTo = bnpMultiplyLowerTo
proto.multiplyUpperTo = bnpMultiplyUpperTo
proto.modInt = bnpModInt
proto.millerRabin = bnpMillerRabin

// public
proto.clone = bnClone
proto.intValue = bnIntValue
proto.byteValue = bnByteValue
proto.shortValue = bnShortValue
proto.signum = bnSigNum
proto.toByteArray = bnToByteArray
proto.equals = bnEquals
proto.min = bnMin
proto.max = bnMax
proto.and = bnAnd
proto.or = bnOr
proto.xor = bnXor
proto.andNot = bnAndNot
proto.not = bnNot
proto.shiftLeft = bnShiftLeft
proto.shiftRight = bnShiftRight
proto.getLowestSetBit = bnGetLowestSetBit
proto.bitCount = bnBitCount
proto.testBit = bnTestBit
proto.setBit = bnSetBit
proto.clearBit = bnClearBit
proto.flipBit = bnFlipBit
proto.add = bnAdd
proto.subtract = bnSubtract
proto.multiply = bnMultiply
proto.divide = bnDivide
proto.remainder = bnRemainder
proto.divideAndRemainder = bnDivideAndRemainder
proto.modPow = bnModPow
proto.modInverse = bnModInverse
proto.pow = bnPow
proto.gcd = bnGCD
proto.isProbablePrime = bnIsProbablePrime

// JSBN-specific extension
proto.square = bnSquare

// constants
BigInteger.ZERO = nbv(0)
BigInteger.ONE = nbv(1)
BigInteger.valueOf = nbv

module.exports = BigInteger


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(11)
var BigInteger = __webpack_require__(12)

var Point = __webpack_require__(24)

function Curve (p, a, b, Gx, Gy, n, h) {
  this.p = p
  this.a = a
  this.b = b
  this.G = Point.fromAffine(this, Gx, Gy)
  this.n = n
  this.h = h

  this.infinity = new Point(this, null, null, BigInteger.ZERO)

  // result caching
  this.pOverFour = p.add(BigInteger.ONE).shiftRight(2)

  // determine size of p in bytes
  this.pLength = Math.floor((this.p.bitLength() + 7) / 8)
}

Curve.prototype.pointFromX = function (isOdd, x) {
  var alpha = x.pow(3).add(this.a.multiply(x)).add(this.b).mod(this.p)
  var beta = alpha.modPow(this.pOverFour, this.p) // XXX: not compatible with all curves

  var y = beta
  if (beta.isEven() ^ !isOdd) {
    y = this.p.subtract(y) // -y % p
  }

  return Point.fromAffine(this, x, y)
}

Curve.prototype.isInfinity = function (Q) {
  if (Q === this.infinity) return true

  return Q.z.signum() === 0 && Q.y.signum() !== 0
}

Curve.prototype.isOnCurve = function (Q) {
  if (this.isInfinity(Q)) return true

  var x = Q.affineX
  var y = Q.affineY
  var a = this.a
  var b = this.b
  var p = this.p

  // Check that xQ and yQ are integers in the interval [0, p - 1]
  if (x.signum() < 0 || x.compareTo(p) >= 0) return false
  if (y.signum() < 0 || y.compareTo(p) >= 0) return false

  // and check that y^2 = x^3 + ax + b (mod p)
  var lhs = y.square().mod(p)
  var rhs = x.pow(3).add(a.multiply(x)).add(b).mod(p)
  return lhs.equals(rhs)
}

/**
 * Validate an elliptic curve point.
 *
 * See SEC 1, section 3.2.2.1: Elliptic Curve Public Key Validation Primitive
 */
Curve.prototype.validate = function (Q) {
  // Check Q != O
  assert(!this.isInfinity(Q), 'Point is at infinity')
  assert(this.isOnCurve(Q), 'Point is not on the curve')

  // Check nQ = O (where Q is a scalar multiple of G)
  var nQ = Q.multiply(this.n)
  assert(this.isInfinity(nQ), 'Point is not a scalar multiple of G')

  return true
}

module.exports = Curve


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = exports;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg !== 'string') {
    for (var i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
    return res;
  }
  if (enc === 'hex') {
    msg = msg.replace(/[^a-z0-9]+/ig, '');
    if (msg.length % 2 !== 0)
      msg = '0' + msg;
    for (var i = 0; i < msg.length; i += 2)
      res.push(parseInt(msg[i] + msg[i + 1], 16));
  } else {
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      var hi = c >> 8;
      var lo = c & 0xff;
      if (hi)
        res.push(hi, lo);
      else
        res.push(lo);
    }
  }
  return res;
}
utils.toArray = toArray;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
utils.zero2 = zero2;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

utils.encode = function encode(arr, enc) {
  if (enc === 'hex')
    return toHex(arr);
  else
    return arr;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var rotr32 = utils.rotr32;

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}
exports.ft_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}
exports.ch32 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
exports.maj32 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
exports.p32 = p32;

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}
exports.s0_256 = s0_256;

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}
exports.s1_256 = s1_256;

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}
exports.g0_256 = g0_256;

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}
exports.g1_256 = g1_256;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var common = __webpack_require__(10);
var shaCommon = __webpack_require__(30);
var assert = __webpack_require__(6);

var sum32 = utils.sum32;
var sum32_4 = utils.sum32_4;
var sum32_5 = utils.sum32_5;
var ch32 = shaCommon.ch32;
var maj32 = shaCommon.maj32;
var s0_256 = shaCommon.s0_256;
var s1_256 = shaCommon.s1_256;
var g0_256 = shaCommon.g0_256;
var g1_256 = shaCommon.g1_256;

var BlockHash = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
module.exports = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  assert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
    var T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var common = __webpack_require__(10);
var assert = __webpack_require__(6);

var rotr64_hi = utils.rotr64_hi;
var rotr64_lo = utils.rotr64_lo;
var shr64_hi = utils.shr64_hi;
var shr64_lo = utils.shr64_lo;
var sum64 = utils.sum64;
var sum64_hi = utils.sum64_hi;
var sum64_lo = utils.sum64_lo;
var sum64_4_hi = utils.sum64_4_hi;
var sum64_4_lo = utils.sum64_4_lo;
var sum64_5_hi = utils.sum64_5_hi;
var sum64_5_lo = utils.sum64_5_lo;

var BlockHash = common.BlockHash;

var sha512_K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function SHA512() {
  if (!(this instanceof SHA512))
    return new SHA512();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xf3bcc908,
    0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b,
    0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1,
    0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b,
    0x5be0cd19, 0x137e2179 ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash);
module.exports = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;

  // 32 x 32bit words
  for (var i = 0; i < 32; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
    var c1_hi = W[i - 14];  // i - 7
    var c1_lo = W[i - 13];
    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
    var c3_hi = W[i - 32];  // i - 16
    var c3_lo = W[i - 31];

    W[i] = sum64_4_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function _update(msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W;

  var ah = this.h[0];
  var al = this.h[1];
  var bh = this.h[2];
  var bl = this.h[3];
  var ch = this.h[4];
  var cl = this.h[5];
  var dh = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh = this.h[10];
  var fl = this.h[11];
  var gh = this.h[12];
  var gl = this.h[13];
  var hh = this.h[14];
  var hl = this.h[15];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
    var c3_hi = this.k[i];
    var c3_lo = this.k[i + 1];
    var c4_hi = W[i];
    var c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);
    var T1_lo = sum64_5_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);

    c0_hi = s0_512_hi(ah, al);
    c0_lo = s0_512_lo(ah, al);
    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi(dh, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64(this.h, 0, ah, al);
  sum64(this.h, 2, bh, bl);
  sum64(this.h, 4, ch, cl);
  sum64(this.h, 6, dh, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh, fl);
  sum64(this.h, 12, gh, gl);
  sum64(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function ch64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ ((~xh) & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ ((~xl) & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 28);
  var c1_hi = rotr64_hi(xl, xh, 2);  // 34
  var c2_hi = rotr64_hi(xl, xh, 7);  // 39

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 28);
  var c1_lo = rotr64_lo(xl, xh, 2);  // 34
  var c2_lo = rotr64_lo(xl, xh, 7);  // 39

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 14);
  var c1_hi = rotr64_hi(xh, xl, 18);
  var c2_hi = rotr64_hi(xl, xh, 9);  // 41

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 14);
  var c1_lo = rotr64_lo(xh, xl, 18);
  var c2_lo = rotr64_lo(xl, xh, 9);  // 41

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 1);
  var c1_hi = rotr64_hi(xh, xl, 8);
  var c2_hi = shr64_hi(xh, xl, 7);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 1);
  var c1_lo = rotr64_lo(xh, xl, 8);
  var c2_lo = shr64_lo(xh, xl, 7);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 19);
  var c1_hi = rotr64_hi(xl, xh, 29);  // 61
  var c2_hi = shr64_hi(xh, xl, 6);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 19);
  var c1_lo = rotr64_lo(xl, xh, 29);  // 61
  var c2_lo = shr64_lo(xh, xl, 6);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(15), __webpack_require__(82), __webpack_require__(83), __webpack_require__(8), __webpack_require__(9), __webpack_require__(20), __webpack_require__(34), __webpack_require__(84), __webpack_require__(35), __webpack_require__(85), __webpack_require__(86), __webpack_require__(87), __webpack_require__(21), __webpack_require__(88), __webpack_require__(7), __webpack_require__(1), __webpack_require__(89), __webpack_require__(90), __webpack_require__(91), __webpack_require__(92), __webpack_require__(93), __webpack_require__(94), __webpack_require__(95), __webpack_require__(96), __webpack_require__(97), __webpack_require__(98), __webpack_require__(99), __webpack_require__(100), __webpack_require__(101), __webpack_require__(102), __webpack_require__(103), __webpack_require__(104));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy"], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS;

}));

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Initialization and round constants tables
	    var H = [];
	    var K = [];

	    // Compute constants
	    (function () {
	        function isPrime(n) {
	            var sqrtN = Math.sqrt(n);
	            for (var factor = 2; factor <= sqrtN; factor++) {
	                if (!(n % factor)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        function getFractionalBits(n) {
	            return ((n - (n | 0)) * 0x100000000) | 0;
	        }

	        var n = 2;
	        var nPrime = 0;
	        while (nPrime < 64) {
	            if (isPrime(n)) {
	                if (nPrime < 8) {
	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
	                }
	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

	                nPrime++;
	            }

	            n++;
	        }
	    }());

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-256 hash algorithm.
	     */
	    var SHA256 = C_algo.SHA256 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init(H.slice(0));
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];
	            var f = H[5];
	            var g = H[6];
	            var h = H[7];

	            // Computation
	            for (var i = 0; i < 64; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var gamma0x = W[i - 15];
	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
	                                   (gamma0x >>> 3);

	                    var gamma1x = W[i - 2];
	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
	                                   (gamma1x >>> 10);

	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
	                }

	                var ch  = (e & f) ^ (~e & g);
	                var maj = (a & b) ^ (a & c) ^ (b & c);

	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

	                var t1 = h + sigma1 + ch + K[i] + W[i];
	                var t2 = sigma0 + maj;

	                h = g;
	                g = f;
	                f = e;
	                e = (d + t1) | 0;
	                d = c;
	                c = b;
	                b = a;
	                a = (t1 + t2) | 0;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	            H[5] = (H[5] + f) | 0;
	            H[6] = (H[6] + g) | 0;
	            H[7] = (H[7] + h) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA256('message');
	     *     var hash = CryptoJS.SHA256(wordArray);
	     */
	    C.SHA256 = Hasher._createHelper(SHA256);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA256(message, key);
	     */
	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
	}(Math));


	return CryptoJS.SHA256;

}));

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(15));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var X64WordArray = C_x64.WordArray;
	    var C_algo = C.algo;

	    function X64Word_create() {
	        return X64Word.create.apply(X64Word, arguments);
	    }

	    // Constants
	    var K = [
	        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
	        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
	        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
	        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
	        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
	        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
	        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
	        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
	        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
	        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
	        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
	        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
	        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
	        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
	        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
	        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
	        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
	        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
	        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
	        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
	        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
	        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
	        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
	        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
	        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
	        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
	        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
	        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
	        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
	        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
	        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
	        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
	        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
	        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
	        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
	        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
	        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
	        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
	        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
	        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
	    ];

	    // Reusable objects
	    var W = [];
	    (function () {
	        for (var i = 0; i < 80; i++) {
	            W[i] = X64Word_create();
	        }
	    }());

	    /**
	     * SHA-512 hash algorithm.
	     */
	    var SHA512 = C_algo.SHA512 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new X64WordArray.init([
	                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
	                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
	                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
	                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var H = this._hash.words;

	            var H0 = H[0];
	            var H1 = H[1];
	            var H2 = H[2];
	            var H3 = H[3];
	            var H4 = H[4];
	            var H5 = H[5];
	            var H6 = H[6];
	            var H7 = H[7];

	            var H0h = H0.high;
	            var H0l = H0.low;
	            var H1h = H1.high;
	            var H1l = H1.low;
	            var H2h = H2.high;
	            var H2l = H2.low;
	            var H3h = H3.high;
	            var H3l = H3.low;
	            var H4h = H4.high;
	            var H4l = H4.low;
	            var H5h = H5.high;
	            var H5l = H5.low;
	            var H6h = H6.high;
	            var H6l = H6.low;
	            var H7h = H7.high;
	            var H7l = H7.low;

	            // Working variables
	            var ah = H0h;
	            var al = H0l;
	            var bh = H1h;
	            var bl = H1l;
	            var ch = H2h;
	            var cl = H2l;
	            var dh = H3h;
	            var dl = H3l;
	            var eh = H4h;
	            var el = H4l;
	            var fh = H5h;
	            var fl = H5l;
	            var gh = H6h;
	            var gl = H6l;
	            var hh = H7h;
	            var hl = H7l;

	            // Rounds
	            for (var i = 0; i < 80; i++) {
	                // Shortcut
	                var Wi = W[i];

	                // Extend message
	                if (i < 16) {
	                    var Wih = Wi.high = M[offset + i * 2]     | 0;
	                    var Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
	                } else {
	                    // Gamma0
	                    var gamma0x  = W[i - 15];
	                    var gamma0xh = gamma0x.high;
	                    var gamma0xl = gamma0x.low;
	                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
	                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

	                    // Gamma1
	                    var gamma1x  = W[i - 2];
	                    var gamma1xh = gamma1x.high;
	                    var gamma1xl = gamma1x.low;
	                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
	                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

	                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	                    var Wi7  = W[i - 7];
	                    var Wi7h = Wi7.high;
	                    var Wi7l = Wi7.low;

	                    var Wi16  = W[i - 16];
	                    var Wi16h = Wi16.high;
	                    var Wi16l = Wi16.low;

	                    var Wil = gamma0l + Wi7l;
	                    var Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
	                    var Wil = Wil + gamma1l;
	                    var Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
	                    var Wil = Wil + Wi16l;
	                    var Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

	                    Wi.high = Wih;
	                    Wi.low  = Wil;
	                }

	                var chh  = (eh & fh) ^ (~eh & gh);
	                var chl  = (el & fl) ^ (~el & gl);
	                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
	                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

	                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
	                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
	                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
	                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

	                // t1 = h + sigma1 + ch + K[i] + W[i]
	                var Ki  = K[i];
	                var Kih = Ki.high;
	                var Kil = Ki.low;

	                var t1l = hl + sigma1l;
	                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
	                var t1l = t1l + chl;
	                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
	                var t1l = t1l + Kil;
	                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
	                var t1l = t1l + Wil;
	                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

	                // t2 = sigma0 + maj
	                var t2l = sigma0l + majl;
	                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

	                // Update working variables
	                hh = gh;
	                hl = gl;
	                gh = fh;
	                gl = fl;
	                fh = eh;
	                fl = el;
	                el = (dl + t1l) | 0;
	                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
	                dh = ch;
	                dl = cl;
	                ch = bh;
	                cl = bl;
	                bh = ah;
	                bl = al;
	                al = (t1l + t2l) | 0;
	                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
	            }

	            // Intermediate hash value
	            H0l = H0.low  = (H0l + al);
	            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
	            H1l = H1.low  = (H1l + bl);
	            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
	            H2l = H2.low  = (H2l + cl);
	            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
	            H3l = H3.low  = (H3l + dl);
	            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
	            H4l = H4.low  = (H4l + el);
	            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
	            H5l = H5.low  = (H5l + fl);
	            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
	            H6l = H6.low  = (H6l + gl);
	            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
	            H7l = H7.low  = (H7l + hl);
	            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Convert hash to 32-bit word array before returning
	            var hash = this._hash.toX32();

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        },

	        blockSize: 1024/32
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA512('message');
	     *     var hash = CryptoJS.SHA512(wordArray);
	     */
	    C.SHA512 = Hasher._createHelper(SHA512);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA512(message, key);
	     */
	    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
	}());


	return CryptoJS.SHA512;

}));

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var bs58check = __webpack_require__(37)

function decodeRaw (buffer, version) {
  // check version only if defined
  if (version !== undefined && buffer[0] !== version) throw new Error('Invalid network version')

  // uncompressed
  if (buffer.length === 33) {
    return {
      version: buffer[0],
      privateKey: buffer.slice(1, 33),
      compressed: false
    }
  }

  // invalid length
  if (buffer.length !== 34) throw new Error('Invalid WIF length')

  // invalid compression flag
  if (buffer[33] !== 0x01) throw new Error('Invalid compression flag')

  return {
    version: buffer[0],
    privateKey: buffer.slice(1, 33),
    compressed: true
  }
}

function encodeRaw (version, privateKey, compressed) {
  var result = new Buffer(compressed ? 34 : 33)

  result.writeUInt8(version, 0)
  privateKey.copy(result, 1)

  if (compressed) {
    result[33] = 0x01
  }

  return result
}

function decode (string, version) {
  return decodeRaw(bs58check.decode(string), version)
}

function encode (version, privateKey, compressed) {
  if (typeof version === 'number') return bs58check.encode(encodeRaw(version, privateKey, compressed))

  return bs58check.encode(
    encodeRaw(
      version.version,
      version.privateKey,
      version.compressed
    )
  )
}

module.exports = {
  decode: decode,
  decodeRaw: decodeRaw,
  encode: encode,
  encodeRaw: encodeRaw
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base58 = __webpack_require__(105)
var createHash = __webpack_require__(107)

// SHA256(SHA256(buffer))
function sha256x2 (buffer) {
  var tmp = createHash('sha256').update(buffer).digest()
  return createHash('sha256').update(tmp).digest()
}

// Encode a buffer as a base58-check encoded string
function encode (payload) {
  var checksum = sha256x2(payload)

  return base58.encode(Buffer.concat([
    payload,
    checksum
  ], payload.length + 4))
}

function decodeRaw (buffer) {
  var payload = buffer.slice(0, -4)
  var checksum = buffer.slice(-4)
  var newChecksum = sha256x2(payload)

  if (checksum[0] ^ newChecksum[0] |
      checksum[1] ^ newChecksum[1] |
      checksum[2] ^ newChecksum[2] |
      checksum[3] ^ newChecksum[3]) return

  return payload
}

// Decode a base58-check encoded string to a buffer, no result if checksum is wrong
function decodeUnsafe (string) {
  var buffer = base58.decodeUnsafe(string)
  if (!buffer) return

  return decodeRaw(buffer)
}

function decode (string) {
  var buffer = base58.decode(string)
  var payload = decodeRaw(buffer)
  if (!payload) throw new Error('Invalid checksum')
  return payload
}

module.exports = {
  encode: encode,
  decode: decode,
  decodeUnsafe: decodeUnsafe
}


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

var Buffer = __webpack_require__(106).Buffer

module.exports = function base (ALPHABET) {
  var ALPHABET_MAP = {}
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (var z = 0; z < ALPHABET.length; z++) {
    var x = ALPHABET.charAt(z)

    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
    ALPHABET_MAP[x] = z
  }

  function encode (source) {
    if (source.length === 0) return ''

    var digits = [0]
    for (var i = 0; i < source.length; ++i) {
      for (var j = 0, carry = source[i]; j < digits.length; ++j) {
        carry += digits[j] << 8
        digits[j] = carry % BASE
        carry = (carry / BASE) | 0
      }

      while (carry > 0) {
        digits.push(carry % BASE)
        carry = (carry / BASE) | 0
      }
    }

    var string = ''

    // deal with leading zeros
    for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) string += ALPHABET[0]
    // convert digits to a string
    for (var q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]]

    return string
  }

  function decodeUnsafe (string) {
    if (string.length === 0) return Buffer.allocUnsafe(0)

    var bytes = [0]
    for (var i = 0; i < string.length; i++) {
      var value = ALPHABET_MAP[string[i]]
      if (value === undefined) return

      for (var j = 0, carry = value; j < bytes.length; ++j) {
        carry += bytes[j] * BASE
        bytes[j] = carry & 0xff
        carry >>= 8
      }

      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    // deal with leading zeros
    for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
      bytes.push(0)
    }

    return Buffer.from(bytes.reverse())
  }

  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) return buffer

    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ab2str = function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

var str2ab = function str2ab(str) {
  var bufView = new Uint8Array(str.length);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
};

var hexstring2ab = function hexstring2ab(str) {
  var result = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }

  return result;
};

var ab2hexstring = function ab2hexstring(arr) {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i].toString(16);
    str = str.length == 0 ? "00" : str.length == 1 ? "0" + str : str;
    result += str;
  }
  return result;
};

var hexXor = function hexXor(str1, str2) {
  console.log(str1, str2);
  if (str1.length !== str2.length) throw new Error();
  if (str1.length % 2 !== 0) throw new Error();
  var result = [];
  for (var _i = 0; _i < str1.length; _i += 2) {
    var num1 = parseInt(str1.substr(_i, 2), 16);
    var num2 = parseInt(str2.substr(_i, 2), 16);
    result.push(num1 ^ num2);
  }
  return ab2hexstring(result);
};

var reverseArray = function reverseArray(arr) {
  var result = new Uint8Array(arr.length);
  for (var i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i];
  }

  return result;
};

var numStoreInMemory = function numStoreInMemory(num, length) {
  for (var i = num.length; i < length; i++) {
    num = '0' + num;
  }
  var data = reverseArray(new Buffer(num, "HEX"));

  return ab2hexstring(data);
};

var stringToBytes = function stringToBytes(str) {
  var utf8 = unescape(encodeURIComponent(str));

  var arr = [];
  for (var i = 0; i < utf8.length; i++) {
    arr.push(utf8.charCodeAt(i));
  }

  return arr;
};

var getTransferTxData = function getTransferTxData(txData) {
  var ba = new Buffer(txData, "hex");
  var Transaction = function Transaction() {
    undefined.type = 0;
    undefined.version = 0;
    undefined.attributes = "";
    undefined.inputs = [];
    undefined.outputs = [];
  };

  var tx = new Transaction();

  // Transfer Type
  if (ba[0] != 0x80) return;
  tx.type = ba[0];

  // Version
  tx.version = ba[1];

  // Attributes
  var k = 2;
  var len = ba[k];
  for (i = 0; i < len; i++) {
    k = k + 1;
  }

  // Inputs
  k = k + 1;
  len = ba[k];
  for (i = 0; i < len; i++) {
    tx.inputs.push({
      txid: ba.slice(k + 1, k + 33),
      index: ba.slice(k + 33, k + 35)
    });
    //console.log( "txid:", tx.inputs[i].txid );
    //console.log( "index:", tx.inputs[i].index );
    k = k + 34;
  }

  // Outputs
  k = k + 1;
  len = ba[k];
  for (i = 0; i < len; i++) {
    tx.outputs.push({
      assetid: ba.slice(k + 1, k + 33),
      value: ba.slice(k + 33, k + 41),
      scripthash: ba.slice(k + 41, k + 61)
    });
    //console.log( "outputs.assetid:", tx.outputs[i].assetid );
    //console.log( "outputs.value:", tx.outputs[i].value );
    //console.log( "outputs.scripthash:", tx.outputs[i].scripthash );
    k = k + 60;
  }

  return tx;
};

exports.ab2str = ab2str;
exports.str2ab = str2ab;
exports.hexstring2ab = hexstring2ab;
exports.ab2hexstring = ab2hexstring;
exports.reverseArray = reverseArray;
exports.numStoreInMemory = numStoreInMemory;
exports.stringToBytes = stringToBytes;
exports.hexXor = hexXor;

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = cleanInputArguments;

function cleanInputArguments(password, salt, options, callback) {
	return {
		password: cleanString(password),
		salt: cleanString(salt),
		options: cleanOptions(options),
		callback: cleanCallback(arguments[arguments.length - 1])
	};
}

function cleanString(input) {
	if (typeof input == 'function') return Buffer('', 'utf8');
	if (input instanceof Buffer) return input;
	if (typeof input == 'string') return new Buffer(input, 'utf8');
	return new Buffer(String(input || ''), 'utf8');
}

function cleanOptions(options) {
	//console.log('cleanOptions ', options, typeof options);
	options = (options !== null && typeof options === 'object') ? options : {}

	return {
		maxmem: checkMaxmem(options.maxmem) || (32 * 1024 * 1024),
		cost:  checkN(options.cost) || Math.pow(2,14),
		blockSize:  checkNumber(options.blockSize) || 8,
		parallel:  checkNumber(options.parallel) || 1,
		size:  checkLength(options.size) || 64
	};
}

function cleanCallback(callback) {
	if (typeof callback === 'function') return callback;
	return null;
}

function checkMaxmem(mem) {
	var mb = 1024 * 1024;
	if (typeof mem !== 'number') return null;
	for (var m = 4; m <= 2048; m = m * 2) {
		var checkVal = m * mb;
		if (checkVal > mem) return null;
		if (checkVal == mem) return checkVal;
	}
	return null;
}

function checkN(input) {
	//console.log('checkN ',input);
	if (typeof input !== 'number') return null;
	for (var m = 8; m <= 64; m++) {
		var checkVal = Math.pow(2,m);
		//console.log('checkVal ',input);
		if (checkVal > input) return null;
		if (checkVal == input) return checkVal;
	}
	return null;
}


function checkNumber(input) {
	if (typeof input !== 'number') return null;
	input = Math.round(input);
	if (input < 1) return null;
	if (input > 256) return null;
	return input;
}

function checkLength(input) {
	if (typeof input !== 'number') return null;
	input = Math.round(input);
	if (input < 1) return null;
	if (input > 2048) return null;
	return input;
}

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(23);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var url = __webpack_require__(49);
var assert = __webpack_require__(11);
var http = __webpack_require__(46);
var https = __webpack_require__(47);
var Writable = __webpack_require__(129).Writable;
var debug = __webpack_require__(130)('follow-redirects');

var nativeProtocols = {'http:': http, 'https:': https};
var schemes = {};
var exports = module.exports = {
	maxRedirects: 21
};
// RFC7231§4.2.1: Of the request methods defined by this specification,
// the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
var safeMethods = {GET: true, HEAD: true, OPTIONS: true, TRACE: true};

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
['abort', 'aborted', 'error', 'socket'].forEach(function (event) {
	eventHandlers[event] = function (arg) {
		this._redirectable.emit(event, arg);
	};
});

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
	// Initialize the request
	Writable.call(this);
	this._options = options;
	this._redirectCount = 0;
	this._bufferedWrites = [];

	// Attach a callback if passed
	if (responseCallback) {
		this.on('response', responseCallback);
	}

	// React to responses of native requests
	var self = this;
	this._onNativeResponse = function (response) {
		self._processResponse(response);
	};

	// Complete the URL object when necessary
	if (!options.pathname && options.path) {
		var searchPos = options.path.indexOf('?');
		if (searchPos < 0) {
			options.pathname = options.path;
		} else {
			options.pathname = options.path.substring(0, searchPos);
			options.search = options.path.substring(searchPos);
		}
	}

	// Perform the first request
	this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
	// If specified, use the agent corresponding to the protocol
	// (HTTP and HTTPS use different types of agents)
	var protocol = this._options.protocol;
	if (this._options.agents) {
		this._options.agent = this._options.agents[schemes[protocol]];
	}

	// Create the native request
	var nativeProtocol = nativeProtocols[protocol];
	var request = this._currentRequest =
				nativeProtocol.request(this._options, this._onNativeResponse);
	this._currentUrl = url.format(this._options);

	// Set up event handlers
	request._redirectable = this;
	for (var event in eventHandlers) {
		/* istanbul ignore else */
		if (event) {
			request.on(event, eventHandlers[event]);
		}
	}

	// End a redirected request
	// (The first request must be ended explicitly with RedirectableRequest#end)
	if (this._isRedirect) {
		// If the request doesn't have en entity, end directly.
		var bufferedWrites = this._bufferedWrites;
		if (bufferedWrites.length === 0) {
			request.end();
		// Otherwise, write the request entity and end afterwards.
		} else {
			var i = 0;
			(function writeNext() {
				if (i < bufferedWrites.length) {
					var bufferedWrite = bufferedWrites[i++];
					request.write(bufferedWrite.data, bufferedWrite.encoding, writeNext);
				} else {
					request.end();
				}
			})();
		}
	}
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
	// RFC7231§6.4: The 3xx (Redirection) class of status code indicates
	// that further action needs to be taken by the user agent in order to
	// fulfill the request. If a Location header field is provided,
	// the user agent MAY automatically redirect its request to the URI
	// referenced by the Location field value,
	// even if the specific status code is not understood.
	var location = response.headers.location;
	if (location && this._options.followRedirects !== false &&
			response.statusCode >= 300 && response.statusCode < 400) {
		// RFC7231§6.4: A client SHOULD detect and intervene
		// in cyclical redirections (i.e., "infinite" redirection loops).
		if (++this._redirectCount > this._options.maxRedirects) {
			return this.emit('error', new Error('Max redirects exceeded.'));
		}

		// RFC7231§6.4: Automatic redirection needs to done with
		// care for methods not known to be safe […],
		// since the user might not wish to redirect an unsafe request.
		// RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
		// that the target resource resides temporarily under a different URI
		// and the user agent MUST NOT change the request method
		// if it performs an automatic redirection to that URI.
		var header;
		var headers = this._options.headers;
		if (response.statusCode !== 307 && !(this._options.method in safeMethods)) {
			this._options.method = 'GET';
			// Drop a possible entity and headers related to it
			this._bufferedWrites = [];
			for (header in headers) {
				if (/^content-/i.test(header)) {
					delete headers[header];
				}
			}
		}

		// Drop the Host header, as the redirect might lead to a different host
		if (!this._isRedirect) {
			for (header in headers) {
				if (/^host$/i.test(header)) {
					delete headers[header];
				}
			}
		}

		// Perform the redirected request
		var redirectUrl = url.resolve(this._currentUrl, location);
		debug('redirecting to', redirectUrl);
		Object.assign(this._options, url.parse(redirectUrl));
		this._isRedirect = true;
		this._performRequest();
	} else {
		// The response is not a redirect; return it as-is
		response.responseUrl = this._currentUrl;
		this.emit('response', response);

		// Clean up
		delete this._options;
		delete this._bufferedWrites;
	}
};

// Aborts the current native request
RedirectableRequest.prototype.abort = function () {
	this._currentRequest.abort();
};

// Flushes the headers of the current native request
RedirectableRequest.prototype.flushHeaders = function () {
	this._currentRequest.flushHeaders();
};

// Sets the noDelay option of the current native request
RedirectableRequest.prototype.setNoDelay = function (noDelay) {
	this._currentRequest.setNoDelay(noDelay);
};

// Sets the socketKeepAlive option of the current native request
RedirectableRequest.prototype.setSocketKeepAlive = function (enable, initialDelay) {
	this._currentRequest.setSocketKeepAlive(enable, initialDelay);
};

// Sets the timeout option of the current native request
RedirectableRequest.prototype.setTimeout = function (timeout, callback) {
	this._currentRequest.setTimeout(timeout, callback);
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
	this._currentRequest.write(data, encoding, callback);
	this._bufferedWrites.push({data: data, encoding: encoding});
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
	this._currentRequest.end(data, encoding, callback);
	if (data) {
		this._bufferedWrites.push({data: data, encoding: encoding});
	}
};

// Export a redirecting wrapper for each native protocol
Object.keys(nativeProtocols).forEach(function (protocol) {
	var scheme = schemes[protocol] = protocol.substr(0, protocol.length - 1);
	var nativeProtocol = nativeProtocols[protocol];
	var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

	// Executes an HTTP request, following redirects
	wrappedProtocol.request = function (options, callback) {
		if (typeof options === 'string') {
			options = url.parse(options);
			options.maxRedirects = exports.maxRedirects;
		} else {
			options = Object.assign({
				maxRedirects: exports.maxRedirects,
				protocol: protocol
			}, options);
		}
		assert.equal(options.protocol, protocol, 'protocol mismatch');
		debug('options', options);

		return new RedirectableRequest(options, callback);
	};

	// Executes a GET request, following redirects
	wrappedProtocol.get = function (options, callback) {
		var request = wrappedProtocol.request(options, callback);
		request.end();
		return request;
	};
});


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(132);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doSendAsset = exports.getWalletDBHeight = exports.getTransactionHistory = exports.getMarketPriceUSD = exports.getBalance = exports.doClaimAllGas = exports.getClaimAmounts = exports.getRPCEndpoint = exports.getAPIEndpoint = exports.allAssetIds = exports.gasId = exports.neoId = undefined;

var _wallet = __webpack_require__(16);

Object.keys(_wallet).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _wallet[key];
    }
  });
});

var _nep = __webpack_require__(109);

Object.keys(_nep).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _nep[key];
    }
  });
});

var _axios = __webpack_require__(118);

var _axios2 = _interopRequireDefault(_axios);

var _wallet2 = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// hard-code asset ids for NEO and GAS
var neoId = exports.neoId = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
var gasId = exports.gasId = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
var allAssetIds = exports.allAssetIds = [neoId, gasId];

// switch between APIs for MainNet and TestNet
var getAPIEndpoint = exports.getAPIEndpoint = function getAPIEndpoint(net) {
  if (net === "MainNet") {
    return "http://api.wallet.cityofzion.io";
  } else {
    return "http://testnet-api.wallet.cityofzion.io";
  }
};

// return the best performing (highest block + fastest) node RPC
var getRPCEndpoint = exports.getRPCEndpoint = function getRPCEndpoint(net) {
  var apiEndpoint = getAPIEndpoint(net);
  return _axios2.default.get(apiEndpoint + '/v1/network/best_node').then(function (response) {
    return response.data.node;
  });
};

// wrapper for querying node RPC
var queryRPC = function queryRPC(net, method, params) {
  var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  var jsonRequest = _axios2.default.create({
    headers: { "Content-Type": "application/json" }
  });
  var jsonRpcData = { "jsonrpc": "2.0", "method": method, "params": params, "id": id };
  return getRPCEndpoint(net).then(function (rpcEndpoint) {
    return jsonRequest.post(rpcEndpoint, jsonRpcData).then(function (response) {
      return response.data;
    });
  });
};

// get amounts of available (spent) and unavailable claims
var getClaimAmounts = exports.getClaimAmounts = function getClaimAmounts(net, address) {
  var apiEndpoint = getAPIEndpoint(net);
  return _axios2.default.get(apiEndpoint + '/v1/address/claims/' + address).then(function (res) {
    return { available: parseInt(res.data.total_claim), unavailable: parseInt(res.data.total_unspent_claim) };
  });
};

// do a claim transaction on all available (spent) gas
var doClaimAllGas = exports.doClaimAllGas = function doClaimAllGas(net, fromWif) {
  var apiEndpoint = getAPIEndpoint(net);
  var account = (0, _wallet2.getAccountsFromWIFKey)(fromWif)[0];
  // TODO: when fully working replace this with mainnet/testnet switch
  return _axios2.default.get(apiEndpoint + "/v1/address/claims/" + account.address).then(function (response) {
    var claims = response.data["claims"];
    var total_claim = response.data["total_claim"];
    var txData = (0, _wallet2.claimTransaction)(claims, account.publickeyEncoded, account.address, total_claim);
    var sign = (0, _wallet2.signatureData)(txData, account.privatekey);
    var txRawData = (0, _wallet2.addContract)(txData, sign, account.publickeyEncoded);
    return queryRPC(net, "sendrawtransaction", [txRawData], 2);
  });
};

// get Neo and Gas balance for an account
var getBalance = exports.getBalance = function getBalance(net, address) {
  var apiEndpoint = getAPIEndpoint(net);
  return _axios2.default.get(apiEndpoint + '/v1/address/balance/' + address).then(function (res) {
    var neo = res.data.NEO.balance;
    var gas = res.data.GAS.balance;
    return { Neo: neo, Gas: gas, unspent: { Neo: res.data.NEO.unspent, Gas: res.data.GAS.unspent } };
  });
};

/**
 * @function
 * @description
 * Hit the coinmarketcap api ticket to fetch the latest USD to NEO price
 *
 * @param {number} amount - The current NEO amount in wallet
 * @return {string} - The converted NEO to USD fiat amount
 */
var getMarketPriceUSD = exports.getMarketPriceUSD = function getMarketPriceUSD(amount) {
  return _axios2.default.get('https://api.coinmarketcap.com/v1/ticker/NEO/?convert=USD').then(function (response) {
    var lastUSDNEO = Number(response.data[0].price_usd);
    return '$' + (lastUSDNEO * amount).toFixed(2).toString();
  });
};

// get transaction history for an account
var getTransactionHistory = exports.getTransactionHistory = function getTransactionHistory(net, address) {
  var apiEndpoint = getAPIEndpoint(net);
  return _axios2.default.get(apiEndpoint + '/v1/address/history/' + address).then(function (response) {
    return response.data.history;
  });
};

// get the current height of the light wallet DB
var getWalletDBHeight = exports.getWalletDBHeight = function getWalletDBHeight(net) {
  var apiEndpoint = getAPIEndpoint(net);
  return _axios2.default.get(apiEndpoint + '/v1/block/height').then(function (response) {
    return parseInt(response.data.block_height);
  });
};

// send an asset to an address
var doSendAsset = exports.doSendAsset = function doSendAsset(net, toAddress, fromWif, assetType, amount) {
  var assetId = void 0,
      assetName = void 0,
      assetSymbol = void 0;
  if (assetType === "Neo") {
    assetId = neoId;
  } else {
    assetId = gasId;
  }
  var fromAccount = (0, _wallet2.getAccountsFromWIFKey)(fromWif)[0];
  return getBalance(net, fromAccount.address).then(function (response) {
    var coinsData = {
      "assetid": assetId,
      "list": response.unspent[assetType],
      "balance": response[assetType],
      "name": assetType
    };
    var txData = (0, _wallet2.transferTransaction)(coinsData, fromAccount.publickeyEncoded, toAddress, amount);
    var sign = (0, _wallet2.signatureData)(txData, fromAccount.privatekey);
    var txRawData = (0, _wallet2.addContract)(txData, sign, fromAccount.publickeyEncoded);
    return queryRPC(net, "sendrawtransaction", [txRawData], 4);
  });
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var Point = __webpack_require__(24)
var Curve = __webpack_require__(26)

var getCurveByName = __webpack_require__(57)

module.exports = {
  Curve: Curve,
  Point: Point,
  getCurveByName: getCurveByName
}


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = {"_args":[[{"raw":"bigi@^1.4.2","scope":null,"escapedName":"bigi","name":"bigi","rawSpec":"^1.4.2","spec":">=1.4.2 <2.0.0","type":"range"},"/Users/ethanfast/Desktop/Code/NEO/neo-wallet-js"]],"_from":"bigi@>=1.4.2 <2.0.0","_id":"bigi@1.4.2","_inCache":true,"_location":"/bigi","_nodeVersion":"6.1.0","_npmOperationalInternal":{"host":"packages-12-west.internal.npmjs.com","tmp":"tmp/bigi-1.4.2.tgz_1469584192413_0.6801238611806184"},"_npmUser":{"name":"jprichardson","email":"jprichardson@gmail.com"},"_npmVersion":"3.8.6","_phantomChildren":{},"_requested":{"raw":"bigi@^1.4.2","scope":null,"escapedName":"bigi","name":"bigi","rawSpec":"^1.4.2","spec":">=1.4.2 <2.0.0","type":"range"},"_requiredBy":["/","/ecdsa","/ecurve"],"_resolved":"https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz","_shasum":"9c665a95f88b8b08fc05cfd731f561859d725825","_shrinkwrap":null,"_spec":"bigi@^1.4.2","_where":"/Users/ethanfast/Desktop/Code/NEO/neo-wallet-js","bugs":{"url":"https://github.com/cryptocoinjs/bigi/issues"},"dependencies":{},"description":"Big integers.","devDependencies":{"coveralls":"^2.11.2","istanbul":"^0.3.5","jshint":"^2.5.1","mocha":"^2.1.0","mochify":"^2.1.0"},"directories":{},"dist":{"shasum":"9c665a95f88b8b08fc05cfd731f561859d725825","tarball":"https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz"},"gitHead":"c25308081c896ff84702303722bf5ecd8b3f78e3","homepage":"https://github.com/cryptocoinjs/bigi#readme","keywords":["cryptography","math","bitcoin","arbitrary","precision","arithmetic","big","integer","int","number","biginteger","bigint","bignumber","decimal","float"],"main":"./lib/index.js","maintainers":[{"name":"midnightlightning","email":"boydb@midnightdesign.ws"},{"name":"sidazhang","email":"sidazhang89@gmail.com"},{"name":"nadav","email":"npm@shesek.info"},{"name":"jprichardson","email":"jprichardson@gmail.com"}],"name":"bigi","optionalDependencies":{},"readme":"ERROR: No README data found!","repository":{"url":"git+https://github.com/cryptocoinjs/bigi.git","type":"git"},"scripts":{"browser-test":"mochify --wd -R spec","coverage":"istanbul cover ./node_modules/.bin/_mocha -- --reporter list test/*.js","coveralls":"npm run-script coverage && node ./node_modules/.bin/coveralls < coverage/lcov.info","jshint":"jshint --config jshint.json lib/*.js ; true","test":"_mocha -- test/*.js","unit":"mocha"},"testling":{"files":"test/*.js","harness":"mocha","browsers":["ie/9..latest","firefox/latest","chrome/latest","safari/6.0..latest","iphone/6.0..latest","android-browser/4.2..latest"]},"version":"1.4.2"}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// FIXME: Kind of a weird way to throw exceptions, consider removing
var assert = __webpack_require__(11)
var BigInteger = __webpack_require__(25)

/**
 * Turns a byte array into a big integer.
 *
 * This function will interpret a byte array as a big integer in big
 * endian notation.
 */
BigInteger.fromByteArrayUnsigned = function(byteArray) {
  // BigInteger expects a DER integer conformant byte array
  if (byteArray[0] & 0x80) {
    return new BigInteger([0].concat(byteArray))
  }

  return new BigInteger(byteArray)
}

/**
 * Returns a byte array representation of the big integer.
 *
 * This returns the absolute of the contained value in big endian
 * form. A value of zero results in an empty array.
 */
BigInteger.prototype.toByteArrayUnsigned = function() {
  var byteArray = this.toByteArray()
  return byteArray[0] === 0 ? byteArray.slice(1) : byteArray
}

BigInteger.fromDERInteger = function(byteArray) {
  return new BigInteger(byteArray)
}

/*
 * Converts BigInteger to a DER integer representation.
 *
 * The format for this value uses the most significant bit as a sign
 * bit.  If the most significant bit is already set and the integer is
 * positive, a 0x00 is prepended.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0xff
 *    127 =>     0x7f
 *   -127 =>     0x81
 *    128 =>   0x0080
 *   -128 =>     0x80
 *    255 =>   0x00ff
 *   -255 =>   0xff01
 *  16300 =>   0x3fac
 * -16300 =>   0xc054
 *  62300 => 0x00f35c
 * -62300 => 0xff0ca4
*/
BigInteger.prototype.toDERInteger = BigInteger.prototype.toByteArray

BigInteger.fromBuffer = function(buffer) {
  // BigInteger expects a DER integer conformant byte array
  if (buffer[0] & 0x80) {
    var byteArray = Array.prototype.slice.call(buffer)

    return new BigInteger([0].concat(byteArray))
  }

  return new BigInteger(buffer)
}

BigInteger.fromHex = function(hex) {
  if (hex === '') return BigInteger.ZERO

  assert.equal(hex, hex.match(/^[A-Fa-f0-9]+/), 'Invalid hex string')
  assert.equal(hex.length % 2, 0, 'Incomplete hex')
  return new BigInteger(hex, 16)
}

BigInteger.prototype.toBuffer = function(size) {
  var byteArray = this.toByteArrayUnsigned()
  var zeros = []

  var padding = size - byteArray.length
  while (zeros.length < padding) zeros.push(0)

  return new Buffer(zeros.concat(byteArray))
}

BigInteger.prototype.toHex = function(size) {
  return this.toBuffer(size).toString('hex')
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var BigInteger = __webpack_require__(12)

var curves = __webpack_require__(58)
var Curve = __webpack_require__(26)

function getCurveByName (name) {
  var curve = curves[name]
  if (!curve) return null

  var p = new BigInteger(curve.p, 16)
  var a = new BigInteger(curve.a, 16)
  var b = new BigInteger(curve.b, 16)
  var n = new BigInteger(curve.n, 16)
  var h = new BigInteger(curve.h, 16)
  var Gx = new BigInteger(curve.Gx, 16)
  var Gy = new BigInteger(curve.Gy, 16)

  return new Curve(p, a, b, Gx, Gy, n, h)
}

module.exports = getCurveByName


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = {"secp128r1":{"p":"fffffffdffffffffffffffffffffffff","a":"fffffffdfffffffffffffffffffffffc","b":"e87579c11079f43dd824993c2cee5ed3","n":"fffffffe0000000075a30d1b9038a115","h":"01","Gx":"161ff7528b899b2d0c28607ca52c5b86","Gy":"cf5ac8395bafeb13c02da292dded7a83"},"secp160k1":{"p":"fffffffffffffffffffffffffffffffeffffac73","a":"00","b":"07","n":"0100000000000000000001b8fa16dfab9aca16b6b3","h":"01","Gx":"3b4c382ce37aa192a4019e763036f4f5dd4d7ebb","Gy":"938cf935318fdced6bc28286531733c3f03c4fee"},"secp160r1":{"p":"ffffffffffffffffffffffffffffffff7fffffff","a":"ffffffffffffffffffffffffffffffff7ffffffc","b":"1c97befc54bd7a8b65acf89f81d4d4adc565fa45","n":"0100000000000000000001f4c8f927aed3ca752257","h":"01","Gx":"4a96b5688ef573284664698968c38bb913cbfc82","Gy":"23a628553168947d59dcc912042351377ac5fb32"},"secp192k1":{"p":"fffffffffffffffffffffffffffffffffffffffeffffee37","a":"00","b":"03","n":"fffffffffffffffffffffffe26f2fc170f69466a74defd8d","h":"01","Gx":"db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d","Gy":"9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"},"secp192r1":{"p":"fffffffffffffffffffffffffffffffeffffffffffffffff","a":"fffffffffffffffffffffffffffffffefffffffffffffffc","b":"64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1","n":"ffffffffffffffffffffffff99def836146bc9b1b4d22831","h":"01","Gx":"188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012","Gy":"07192b95ffc8da78631011ed6b24cdd573f977a11e794811"},"secp256k1":{"p":"fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f","a":"00","b":"07","n":"fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141","h":"01","Gx":"79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798","Gy":"483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"},"secp256r1":{"p":"ffffffff00000001000000000000000000000000ffffffffffffffffffffffff","a":"ffffffff00000001000000000000000000000000fffffffffffffffffffffffc","b":"5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b","n":"ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551","h":"01","Gx":"6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296","Gy":"4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"}}

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = {"_args":[[{"raw":"elliptic@^6.4.0","scope":null,"escapedName":"elliptic","name":"elliptic","rawSpec":"^6.4.0","spec":">=6.4.0 <7.0.0","type":"range"},"/Users/ethanfast/Desktop/Code/NEO/neo-wallet-js"]],"_from":"elliptic@>=6.4.0 <7.0.0","_id":"elliptic@6.4.0","_inCache":true,"_location":"/elliptic","_nodeVersion":"7.0.0","_npmOperationalInternal":{"host":"packages-18-east.internal.npmjs.com","tmp":"tmp/elliptic-6.4.0.tgz_1487798866428_0.30510620190761983"},"_npmUser":{"name":"indutny","email":"fedor@indutny.com"},"_npmVersion":"3.10.8","_phantomChildren":{},"_requested":{"raw":"elliptic@^6.4.0","scope":null,"escapedName":"elliptic","name":"elliptic","rawSpec":"^6.4.0","spec":">=6.4.0 <7.0.0","type":"range"},"_requiredBy":["/","/browserify-sign","/create-ecdh","/secp256k1"],"_resolved":"https://registry.npmjs.org/elliptic/-/elliptic-6.4.0.tgz","_shasum":"cac9af8762c85836187003c8dfe193e5e2eae5df","_shrinkwrap":null,"_spec":"elliptic@^6.4.0","_where":"/Users/ethanfast/Desktop/Code/NEO/neo-wallet-js","author":{"name":"Fedor Indutny","email":"fedor@indutny.com"},"bugs":{"url":"https://github.com/indutny/elliptic/issues"},"dependencies":{"bn.js":"^4.4.0","brorand":"^1.0.1","hash.js":"^1.0.0","hmac-drbg":"^1.0.0","inherits":"^2.0.1","minimalistic-assert":"^1.0.0","minimalistic-crypto-utils":"^1.0.0"},"description":"EC cryptography","devDependencies":{"brfs":"^1.4.3","coveralls":"^2.11.3","grunt":"^0.4.5","grunt-browserify":"^5.0.0","grunt-cli":"^1.2.0","grunt-contrib-connect":"^1.0.0","grunt-contrib-copy":"^1.0.0","grunt-contrib-uglify":"^1.0.1","grunt-mocha-istanbul":"^3.0.1","grunt-saucelabs":"^8.6.2","istanbul":"^0.4.2","jscs":"^2.9.0","jshint":"^2.6.0","mocha":"^2.1.0"},"directories":{},"dist":{"shasum":"cac9af8762c85836187003c8dfe193e5e2eae5df","tarball":"https://registry.npmjs.org/elliptic/-/elliptic-6.4.0.tgz"},"files":["lib"],"gitHead":"6b0d2b76caae91471649c8e21f0b1d3ba0f96090","homepage":"https://github.com/indutny/elliptic","keywords":["EC","Elliptic","curve","Cryptography"],"license":"MIT","main":"lib/elliptic.js","maintainers":[{"name":"indutny","email":"fedor@indutny.com"}],"name":"elliptic","optionalDependencies":{},"readme":"ERROR: No README data found!","repository":{"type":"git","url":"git+ssh://git@github.com/indutny/elliptic.git"},"scripts":{"jscs":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","jshint":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","lint":"npm run jscs && npm run jshint","test":"npm run lint && npm run unit","unit":"istanbul test _mocha --reporter=spec test/index.js","version":"grunt dist && git add dist/"},"version":"6.4.0"}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = exports;
var BN = __webpack_require__(5);
var minAssert = __webpack_require__(6);
var minUtils = __webpack_require__(28);

utils.assert = minAssert;
utils.toArray = minUtils.toArray;
utils.zero2 = minUtils.zero2;
utils.toHex = minUtils.toHex;
utils.encode = minUtils.encode;

// Represent num in a w-NAF form
function getNAF(num, w) {
  var naf = [];
  var ws = 1 << (w + 1);
  var k = num.clone();
  while (k.cmpn(1) >= 0) {
    var z;
    if (k.isOdd()) {
      var mod = k.andln(ws - 1);
      if (mod > (ws >> 1) - 1)
        z = (ws >> 1) - mod;
      else
        z = mod;
      k.isubn(z);
    } else {
      z = 0;
    }
    naf.push(z);

    // Optimization, shift by word if possible
    var shift = (k.cmpn(0) !== 0 && k.andln(ws - 1) === 0) ? (w + 1) : 1;
    for (var i = 1; i < shift; i++)
      naf.push(0);
    k.iushrn(shift);
  }

  return naf;
}
utils.getNAF = getNAF;

// Represent k1, k2 in a Joint Sparse Form
function getJSF(k1, k2) {
  var jsf = [
    [],
    []
  ];

  k1 = k1.clone();
  k2 = k2.clone();
  var d1 = 0;
  var d2 = 0;
  while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {

    // First phase
    var m14 = (k1.andln(3) + d1) & 3;
    var m24 = (k2.andln(3) + d2) & 3;
    if (m14 === 3)
      m14 = -1;
    if (m24 === 3)
      m24 = -1;
    var u1;
    if ((m14 & 1) === 0) {
      u1 = 0;
    } else {
      var m8 = (k1.andln(7) + d1) & 7;
      if ((m8 === 3 || m8 === 5) && m24 === 2)
        u1 = -m14;
      else
        u1 = m14;
    }
    jsf[0].push(u1);

    var u2;
    if ((m24 & 1) === 0) {
      u2 = 0;
    } else {
      var m8 = (k2.andln(7) + d2) & 7;
      if ((m8 === 3 || m8 === 5) && m14 === 2)
        u2 = -m24;
      else
        u2 = m24;
    }
    jsf[1].push(u2);

    // Second phase
    if (2 * d1 === u1 + 1)
      d1 = 1 - d1;
    if (2 * d2 === u2 + 1)
      d2 = 1 - d2;
    k1.iushrn(1);
    k2.iushrn(1);
  }

  return jsf;
}
utils.getJSF = getJSF;

function cachedProperty(obj, name, computer) {
  var key = '_' + name;
  obj.prototype[name] = function cachedProperty() {
    return this[key] !== undefined ? this[key] :
           this[key] = computer.call(this);
  };
}
utils.cachedProperty = cachedProperty;

function parseBytes(bytes) {
  return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
                                     bytes;
}
utils.parseBytes = parseBytes;

function intFromLE(bytes) {
  return new BN(bytes, 'hex', 'le');
}
utils.intFromLE = intFromLE;



/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var r;

module.exports = function rand(len) {
  if (!r)
    r = new Rand(null);

  return r.generate(len);
};

function Rand(rand) {
  this.rand = rand;
}
module.exports.Rand = Rand;

Rand.prototype.generate = function generate(len) {
  return this._rand(len);
};

// Emulate crypto API using randy
Rand.prototype._rand = function _rand(n) {
  if (this.rand.getBytes)
    return this.rand.getBytes(n);

  var res = new Uint8Array(n);
  for (var i = 0; i < res.length; i++)
    res[i] = this.rand.getByte();
  return res;
};

if (typeof self === 'object') {
  if (self.crypto && self.crypto.getRandomValues) {
    // Modern browsers
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.crypto.getRandomValues(arr);
      return arr;
    };
  } else if (self.msCrypto && self.msCrypto.getRandomValues) {
    // IE
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.msCrypto.getRandomValues(arr);
      return arr;
    };

  // Safari's WebWorkers do not have `crypto`
  } else if (typeof window === 'object') {
    // Old junk
    Rand.prototype._rand = function() {
      throw new Error('Not implemented yet');
    };
  }
} else {
  // Node.js or Web worker with no crypto support
  try {
    var crypto = __webpack_require__(18);
    if (typeof crypto.randomBytes !== 'function')
      throw new Error('Not supported');

    Rand.prototype._rand = function _rand(n) {
      return crypto.randomBytes(n);
    };
  } catch (e) {
  }
}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(5);
var elliptic = __webpack_require__(3);
var utils = elliptic.utils;
var getNAF = utils.getNAF;
var getJSF = utils.getJSF;
var assert = utils.assert;

function BaseCurve(type, conf) {
  this.type = type;
  this.p = new BN(conf.p, 16);

  // Use Montgomery, when there is no fast reduction for the prime
  this.red = conf.prime ? BN.red(conf.prime) : BN.mont(this.p);

  // Useful for many curves
  this.zero = new BN(0).toRed(this.red);
  this.one = new BN(1).toRed(this.red);
  this.two = new BN(2).toRed(this.red);

  // Curve configuration, optional
  this.n = conf.n && new BN(conf.n, 16);
  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

  // Temporary arrays
  this._wnafT1 = new Array(4);
  this._wnafT2 = new Array(4);
  this._wnafT3 = new Array(4);
  this._wnafT4 = new Array(4);

  // Generalized Greg Maxwell's trick
  var adjustCount = this.n && this.p.div(this.n);
  if (!adjustCount || adjustCount.cmpn(100) > 0) {
    this.redN = null;
  } else {
    this._maxwellTrick = true;
    this.redN = this.n.toRed(this.red);
  }
}
module.exports = BaseCurve;

BaseCurve.prototype.point = function point() {
  throw new Error('Not implemented');
};

BaseCurve.prototype.validate = function validate() {
  throw new Error('Not implemented');
};

BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
  assert(p.precomputed);
  var doubles = p._getDoubles();

  var naf = getNAF(k, 1);
  var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
  I /= 3;

  // Translate into more windowed form
  var repr = [];
  for (var j = 0; j < naf.length; j += doubles.step) {
    var nafW = 0;
    for (var k = j + doubles.step - 1; k >= j; k--)
      nafW = (nafW << 1) + naf[k];
    repr.push(nafW);
  }

  var a = this.jpoint(null, null, null);
  var b = this.jpoint(null, null, null);
  for (var i = I; i > 0; i--) {
    for (var j = 0; j < repr.length; j++) {
      var nafW = repr[j];
      if (nafW === i)
        b = b.mixedAdd(doubles.points[j]);
      else if (nafW === -i)
        b = b.mixedAdd(doubles.points[j].neg());
    }
    a = a.add(b);
  }
  return a.toP();
};

BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
  var w = 4;

  // Precompute window
  var nafPoints = p._getNAFPoints(w);
  w = nafPoints.wnd;
  var wnd = nafPoints.points;

  // Get NAF form
  var naf = getNAF(k, w);

  // Add `this`*(N+1) for every w-NAF index
  var acc = this.jpoint(null, null, null);
  for (var i = naf.length - 1; i >= 0; i--) {
    // Count zeroes
    for (var k = 0; i >= 0 && naf[i] === 0; i--)
      k++;
    if (i >= 0)
      k++;
    acc = acc.dblp(k);

    if (i < 0)
      break;
    var z = naf[i];
    assert(z !== 0);
    if (p.type === 'affine') {
      // J +- P
      if (z > 0)
        acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
      else
        acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
    } else {
      // J +- J
      if (z > 0)
        acc = acc.add(wnd[(z - 1) >> 1]);
      else
        acc = acc.add(wnd[(-z - 1) >> 1].neg());
    }
  }
  return p.type === 'affine' ? acc.toP() : acc;
};

BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
                                                       points,
                                                       coeffs,
                                                       len,
                                                       jacobianResult) {
  var wndWidth = this._wnafT1;
  var wnd = this._wnafT2;
  var naf = this._wnafT3;

  // Fill all arrays
  var max = 0;
  for (var i = 0; i < len; i++) {
    var p = points[i];
    var nafPoints = p._getNAFPoints(defW);
    wndWidth[i] = nafPoints.wnd;
    wnd[i] = nafPoints.points;
  }

  // Comb small window NAFs
  for (var i = len - 1; i >= 1; i -= 2) {
    var a = i - 1;
    var b = i;
    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
      naf[a] = getNAF(coeffs[a], wndWidth[a]);
      naf[b] = getNAF(coeffs[b], wndWidth[b]);
      max = Math.max(naf[a].length, max);
      max = Math.max(naf[b].length, max);
      continue;
    }

    var comb = [
      points[a], /* 1 */
      null, /* 3 */
      null, /* 5 */
      points[b] /* 7 */
    ];

    // Try to avoid Projective points, if possible
    if (points[a].y.cmp(points[b].y) === 0) {
      comb[1] = points[a].add(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].add(points[b].neg());
    } else {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    }

    var index = [
      -3, /* -1 -1 */
      -1, /* -1 0 */
      -5, /* -1 1 */
      -7, /* 0 -1 */
      0, /* 0 0 */
      7, /* 0 1 */
      5, /* 1 -1 */
      1, /* 1 0 */
      3  /* 1 1 */
    ];

    var jsf = getJSF(coeffs[a], coeffs[b]);
    max = Math.max(jsf[0].length, max);
    naf[a] = new Array(max);
    naf[b] = new Array(max);
    for (var j = 0; j < max; j++) {
      var ja = jsf[0][j] | 0;
      var jb = jsf[1][j] | 0;

      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
      naf[b][j] = 0;
      wnd[a] = comb;
    }
  }

  var acc = this.jpoint(null, null, null);
  var tmp = this._wnafT4;
  for (var i = max; i >= 0; i--) {
    var k = 0;

    while (i >= 0) {
      var zero = true;
      for (var j = 0; j < len; j++) {
        tmp[j] = naf[j][i] | 0;
        if (tmp[j] !== 0)
          zero = false;
      }
      if (!zero)
        break;
      k++;
      i--;
    }
    if (i >= 0)
      k++;
    acc = acc.dblp(k);
    if (i < 0)
      break;

    for (var j = 0; j < len; j++) {
      var z = tmp[j];
      var p;
      if (z === 0)
        continue;
      else if (z > 0)
        p = wnd[j][(z - 1) >> 1];
      else if (z < 0)
        p = wnd[j][(-z - 1) >> 1].neg();

      if (p.type === 'affine')
        acc = acc.mixedAdd(p);
      else
        acc = acc.add(p);
    }
  }
  // Zeroify references
  for (var i = 0; i < len; i++)
    wnd[i] = null;

  if (jacobianResult)
    return acc;
  else
    return acc.toP();
};

function BasePoint(curve, type) {
  this.curve = curve;
  this.type = type;
  this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;

BasePoint.prototype.eq = function eq(/*other*/) {
  throw new Error('Not implemented');
};

BasePoint.prototype.validate = function validate() {
  return this.curve.validate(this);
};

BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  bytes = utils.toArray(bytes, enc);

  var len = this.p.byteLength();

  // uncompressed, hybrid-odd, hybrid-even
  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
      bytes.length - 1 === 2 * len) {
    if (bytes[0] === 0x06)
      assert(bytes[bytes.length - 1] % 2 === 0);
    else if (bytes[0] === 0x07)
      assert(bytes[bytes.length - 1] % 2 === 1);

    var res =  this.point(bytes.slice(1, 1 + len),
                          bytes.slice(1 + len, 1 + 2 * len));

    return res;
  } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
              bytes.length - 1 === len) {
    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
  }
  throw new Error('Unknown point format');
};

BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
  return this.encode(enc, true);
};

BasePoint.prototype._encode = function _encode(compact) {
  var len = this.curve.p.byteLength();
  var x = this.getX().toArray('be', len);

  if (compact)
    return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

  return [ 0x04 ].concat(x, this.getY().toArray('be', len)) ;
};

BasePoint.prototype.encode = function encode(enc, compact) {
  return utils.encode(this._encode(compact), enc);
};

BasePoint.prototype.precompute = function precompute(power) {
  if (this.precomputed)
    return this;

  var precomputed = {
    doubles: null,
    naf: null,
    beta: null
  };
  precomputed.naf = this._getNAFPoints(8);
  precomputed.doubles = this._getDoubles(4, power);
  precomputed.beta = this._getBeta();
  this.precomputed = precomputed;

  return this;
};

BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
  if (!this.precomputed)
    return false;

  var doubles = this.precomputed.doubles;
  if (!doubles)
    return false;

  return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
};

BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;

  var doubles = [ this ];
  var acc = this;
  for (var i = 0; i < power; i += step) {
    for (var j = 0; j < step; j++)
      acc = acc.dbl();
    doubles.push(acc);
  }
  return {
    step: step,
    points: doubles
  };
};

BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;

  var res = [ this ];
  var max = (1 << wnd) - 1;
  var dbl = max === 1 ? null : this.dbl();
  for (var i = 1; i < max; i++)
    res[i] = res[i - 1].add(dbl);
  return {
    wnd: wnd,
    points: res
  };
};

BasePoint.prototype._getBeta = function _getBeta() {
  return null;
};

BasePoint.prototype.dblp = function dblp(k) {
  var r = this;
  for (var i = 0; i < k; i++)
    r = r.dbl();
  return r;
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(13);
var elliptic = __webpack_require__(3);
var BN = __webpack_require__(5);
var inherits = __webpack_require__(14);
var Base = curve.base;

var assert = elliptic.utils.assert;

function ShortCurve(conf) {
  Base.call(this, 'short', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.tinv = this.two.redInvm();

  this.zeroA = this.a.fromRed().cmpn(0) === 0;
  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

  // If the curve is endomorphic, precalculate beta and lambda
  this.endo = this._getEndomorphism(conf);
  this._endoWnafT1 = new Array(4);
  this._endoWnafT2 = new Array(4);
}
inherits(ShortCurve, Base);
module.exports = ShortCurve;

ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
  // No efficient endomorphism
  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
    return;

  // Compute beta and lambda, that lambda * P = (beta * Px; Py)
  var beta;
  var lambda;
  if (conf.beta) {
    beta = new BN(conf.beta, 16).toRed(this.red);
  } else {
    var betas = this._getEndoRoots(this.p);
    // Choose the smallest beta
    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
    beta = beta.toRed(this.red);
  }
  if (conf.lambda) {
    lambda = new BN(conf.lambda, 16);
  } else {
    // Choose the lambda that is matching selected beta
    var lambdas = this._getEndoRoots(this.n);
    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
      lambda = lambdas[0];
    } else {
      lambda = lambdas[1];
      assert(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
    }
  }

  // Get basis vectors, used for balanced length-two representation
  var basis;
  if (conf.basis) {
    basis = conf.basis.map(function(vec) {
      return {
        a: new BN(vec.a, 16),
        b: new BN(vec.b, 16)
      };
    });
  } else {
    basis = this._getEndoBasis(lambda);
  }

  return {
    beta: beta,
    lambda: lambda,
    basis: basis
  };
};

ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
  // Find roots of for x^2 + x + 1 in F
  // Root = (-1 +- Sqrt(-3)) / 2
  //
  var red = num === this.p ? this.red : BN.mont(num);
  var tinv = new BN(2).toRed(red).redInvm();
  var ntinv = tinv.redNeg();

  var s = new BN(3).toRed(red).redNeg().redSqrt().redMul(tinv);

  var l1 = ntinv.redAdd(s).fromRed();
  var l2 = ntinv.redSub(s).fromRed();
  return [ l1, l2 ];
};

ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
  // aprxSqrt >= sqrt(this.n)
  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

  // 3.74
  // Run EGCD, until r(L + 1) < aprxSqrt
  var u = lambda;
  var v = this.n.clone();
  var x1 = new BN(1);
  var y1 = new BN(0);
  var x2 = new BN(0);
  var y2 = new BN(1);

  // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
  var a0;
  var b0;
  // First vector
  var a1;
  var b1;
  // Second vector
  var a2;
  var b2;

  var prevR;
  var i = 0;
  var r;
  var x;
  while (u.cmpn(0) !== 0) {
    var q = v.div(u);
    r = v.sub(q.mul(u));
    x = x2.sub(q.mul(x1));
    var y = y2.sub(q.mul(y1));

    if (!a1 && r.cmp(aprxSqrt) < 0) {
      a0 = prevR.neg();
      b0 = x1;
      a1 = r.neg();
      b1 = x;
    } else if (a1 && ++i === 2) {
      break;
    }
    prevR = r;

    v = u;
    u = r;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
  a2 = r.neg();
  b2 = x;

  var len1 = a1.sqr().add(b1.sqr());
  var len2 = a2.sqr().add(b2.sqr());
  if (len2.cmp(len1) >= 0) {
    a2 = a0;
    b2 = b0;
  }

  // Normalize signs
  if (a1.negative) {
    a1 = a1.neg();
    b1 = b1.neg();
  }
  if (a2.negative) {
    a2 = a2.neg();
    b2 = b2.neg();
  }

  return [
    { a: a1, b: b1 },
    { a: a2, b: b2 }
  ];
};

ShortCurve.prototype._endoSplit = function _endoSplit(k) {
  var basis = this.endo.basis;
  var v1 = basis[0];
  var v2 = basis[1];

  var c1 = v2.b.mul(k).divRound(this.n);
  var c2 = v1.b.neg().mul(k).divRound(this.n);

  var p1 = c1.mul(v1.a);
  var p2 = c2.mul(v2.a);
  var q1 = c1.mul(v1.b);
  var q2 = c2.mul(v2.b);

  // Calculate answer
  var k1 = k.sub(p1).sub(p2);
  var k2 = q1.add(q2).neg();
  return { k1: k1, k2: k2 };
};

ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new BN(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  // XXX Is there any way to tell if the number is odd without converting it
  // to non-red form?
  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

ShortCurve.prototype.validate = function validate(point) {
  if (point.inf)
    return true;

  var x = point.x;
  var y = point.y;

  var ax = this.a.redMul(x);
  var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
  return y.redSqr().redISub(rhs).cmpn(0) === 0;
};

ShortCurve.prototype._endoWnafMulAdd =
    function _endoWnafMulAdd(points, coeffs, jacobianResult) {
  var npoints = this._endoWnafT1;
  var ncoeffs = this._endoWnafT2;
  for (var i = 0; i < points.length; i++) {
    var split = this._endoSplit(coeffs[i]);
    var p = points[i];
    var beta = p._getBeta();

    if (split.k1.negative) {
      split.k1.ineg();
      p = p.neg(true);
    }
    if (split.k2.negative) {
      split.k2.ineg();
      beta = beta.neg(true);
    }

    npoints[i * 2] = p;
    npoints[i * 2 + 1] = beta;
    ncoeffs[i * 2] = split.k1;
    ncoeffs[i * 2 + 1] = split.k2;
  }
  var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

  // Clean-up references to points and coefficients
  for (var j = 0; j < i * 2; j++) {
    npoints[j] = null;
    ncoeffs[j] = null;
  }
  return res;
};

function Point(curve, x, y, isRed) {
  Base.BasePoint.call(this, curve, 'affine');
  if (x === null && y === null) {
    this.x = null;
    this.y = null;
    this.inf = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    // Force redgomery representation when loading from JSON
    if (isRed) {
      this.x.forceRed(this.curve.red);
      this.y.forceRed(this.curve.red);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    this.inf = false;
  }
}
inherits(Point, Base.BasePoint);

ShortCurve.prototype.point = function point(x, y, isRed) {
  return new Point(this, x, y, isRed);
};

ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
  return Point.fromJSON(this, obj, red);
};

Point.prototype._getBeta = function _getBeta() {
  if (!this.curve.endo)
    return;

  var pre = this.precomputed;
  if (pre && pre.beta)
    return pre.beta;

  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
  if (pre) {
    var curve = this.curve;
    var endoMul = function(p) {
      return curve.point(p.x.redMul(curve.endo.beta), p.y);
    };
    pre.beta = beta;
    beta.precomputed = {
      beta: null,
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(endoMul)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(endoMul)
      }
    };
  }
  return beta;
};

Point.prototype.toJSON = function toJSON() {
  if (!this.precomputed)
    return [ this.x, this.y ];

  return [ this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1)
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1)
    }
  } ];
};

Point.fromJSON = function fromJSON(curve, obj, red) {
  if (typeof obj === 'string')
    obj = JSON.parse(obj);
  var res = curve.point(obj[0], obj[1], red);
  if (!obj[2])
    return res;

  function obj2point(obj) {
    return curve.point(obj[0], obj[1], red);
  }

  var pre = obj[2];
  res.precomputed = {
    beta: null,
    doubles: pre.doubles && {
      step: pre.doubles.step,
      points: [ res ].concat(pre.doubles.points.map(obj2point))
    },
    naf: pre.naf && {
      wnd: pre.naf.wnd,
      points: [ res ].concat(pre.naf.points.map(obj2point))
    }
  };
  return res;
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  return this.inf;
};

Point.prototype.add = function add(p) {
  // O + P = P
  if (this.inf)
    return p;

  // P + O = P
  if (p.inf)
    return this;

  // P + P = 2P
  if (this.eq(p))
    return this.dbl();

  // P + (-P) = O
  if (this.neg().eq(p))
    return this.curve.point(null, null);

  // P + Q = O
  if (this.x.cmp(p.x) === 0)
    return this.curve.point(null, null);

  var c = this.y.redSub(p.y);
  if (c.cmpn(0) !== 0)
    c = c.redMul(this.x.redSub(p.x).redInvm());
  var nx = c.redSqr().redISub(this.x).redISub(p.x);
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.dbl = function dbl() {
  if (this.inf)
    return this;

  // 2P = O
  var ys1 = this.y.redAdd(this.y);
  if (ys1.cmpn(0) === 0)
    return this.curve.point(null, null);

  var a = this.curve.a;

  var x2 = this.x.redSqr();
  var dyinv = ys1.redInvm();
  var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

  var nx = c.redSqr().redISub(this.x.redAdd(this.x));
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.getX = function getX() {
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  return this.y.fromRed();
};

Point.prototype.mul = function mul(k) {
  k = new BN(k, 16);

  if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else if (this.curve.endo)
    return this.curve._endoWnafMulAdd([ this ], [ k ]);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs, true);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};

Point.prototype.eq = function eq(p) {
  return this === p ||
         this.inf === p.inf &&
             (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
};

Point.prototype.neg = function neg(_precompute) {
  if (this.inf)
    return this;

  var res = this.curve.point(this.x, this.y.redNeg());
  if (_precompute && this.precomputed) {
    var pre = this.precomputed;
    var negate = function(p) {
      return p.neg();
    };
    res.precomputed = {
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(negate)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(negate)
      }
    };
  }
  return res;
};

Point.prototype.toJ = function toJ() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);

  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
  return res;
};

function JPoint(curve, x, y, z) {
  Base.BasePoint.call(this, curve, 'jacobian');
  if (x === null && y === null && z === null) {
    this.x = this.curve.one;
    this.y = this.curve.one;
    this.z = new BN(0);
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = new BN(z, 16);
  }
  if (!this.x.red)
    this.x = this.x.toRed(this.curve.red);
  if (!this.y.red)
    this.y = this.y.toRed(this.curve.red);
  if (!this.z.red)
    this.z = this.z.toRed(this.curve.red);

  this.zOne = this.z === this.curve.one;
}
inherits(JPoint, Base.BasePoint);

ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
  return new JPoint(this, x, y, z);
};

JPoint.prototype.toP = function toP() {
  if (this.isInfinity())
    return this.curve.point(null, null);

  var zinv = this.z.redInvm();
  var zinv2 = zinv.redSqr();
  var ax = this.x.redMul(zinv2);
  var ay = this.y.redMul(zinv2).redMul(zinv);

  return this.curve.point(ax, ay);
};

JPoint.prototype.neg = function neg() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};

JPoint.prototype.add = function add(p) {
  // O + P = P
  if (this.isInfinity())
    return p;

  // P + O = P
  if (p.isInfinity())
    return this;

  // 12M + 4S + 7A
  var pz2 = p.z.redSqr();
  var z2 = this.z.redSqr();
  var u1 = this.x.redMul(pz2);
  var u2 = p.x.redMul(z2);
  var s1 = this.y.redMul(pz2.redMul(p.z));
  var s2 = p.y.redMul(z2.redMul(this.z));

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(p.z).redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mixedAdd = function mixedAdd(p) {
  // O + P = P
  if (this.isInfinity())
    return p.toJ();

  // P + O = P
  if (p.isInfinity())
    return this;

  // 8M + 3S + 7A
  var z2 = this.z.redSqr();
  var u1 = this.x;
  var u2 = p.x.redMul(z2);
  var s1 = this.y;
  var s2 = p.y.redMul(z2).redMul(this.z);

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.dblp = function dblp(pow) {
  if (pow === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!pow)
    return this.dbl();

  if (this.curve.zeroA || this.curve.threeA) {
    var r = this;
    for (var i = 0; i < pow; i++)
      r = r.dbl();
    return r;
  }

  // 1M + 2S + 1A + N * (4S + 5M + 8A)
  // N = 1 => 6M + 6S + 9A
  var a = this.curve.a;
  var tinv = this.curve.tinv;

  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  // Reuse results
  var jyd = jy.redAdd(jy);
  for (var i = 0; i < pow; i++) {
    var jx2 = jx.redSqr();
    var jyd2 = jyd.redSqr();
    var jyd4 = jyd2.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

    var t1 = jx.redMul(jyd2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var dny = c.redMul(t2);
    dny = dny.redIAdd(dny).redISub(jyd4);
    var nz = jyd.redMul(jz);
    if (i + 1 < pow)
      jz4 = jz4.redMul(jyd4);

    jx = nx;
    jz = nz;
    jyd = dny;
  }

  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};

JPoint.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  if (this.curve.zeroA)
    return this._zeroDbl();
  else if (this.curve.threeA)
    return this._threeDbl();
  else
    return this._dbl();
};

JPoint.prototype._zeroDbl = function _zeroDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 14A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a; a = 0
    var m = xx.redAdd(xx).redIAdd(xx);
    // T = M ^ 2 - 2*S
    var t = m.redSqr().redISub(s).redISub(s);

    // 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);

    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2*Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-dbl-2009-l
    // 2M + 5S + 13A

    // A = X1^2
    var a = this.x.redSqr();
    // B = Y1^2
    var b = this.y.redSqr();
    // C = B^2
    var c = b.redSqr();
    // D = 2 * ((X1 + B)^2 - A - C)
    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
    d = d.redIAdd(d);
    // E = 3 * A
    var e = a.redAdd(a).redIAdd(a);
    // F = E^2
    var f = e.redSqr();

    // 8 * C
    var c8 = c.redIAdd(c);
    c8 = c8.redIAdd(c8);
    c8 = c8.redIAdd(c8);

    // X3 = F - 2 * D
    nx = f.redISub(d).redISub(d);
    // Y3 = E * (D - X3) - 8 * C
    ny = e.redMul(d.redISub(nx)).redISub(c8);
    // Z3 = 2 * Y1 * Z1
    nz = this.y.redMul(this.z);
    nz = nz.redIAdd(nz);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._threeDbl = function _threeDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 15A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a
    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
    // T = M^2 - 2 * S
    var t = m.redSqr().redISub(s).redISub(s);
    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2 * Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
    // 3M + 5S

    // delta = Z1^2
    var delta = this.z.redSqr();
    // gamma = Y1^2
    var gamma = this.y.redSqr();
    // beta = X1 * gamma
    var beta = this.x.redMul(gamma);
    // alpha = 3 * (X1 - delta) * (X1 + delta)
    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
    alpha = alpha.redAdd(alpha).redIAdd(alpha);
    // X3 = alpha^2 - 8 * beta
    var beta4 = beta.redIAdd(beta);
    beta4 = beta4.redIAdd(beta4);
    var beta8 = beta4.redAdd(beta4);
    nx = alpha.redSqr().redISub(beta8);
    // Z3 = (Y1 + Z1)^2 - gamma - delta
    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
    // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
    var ggamma8 = gamma.redSqr();
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._dbl = function _dbl() {
  var a = this.curve.a;

  // 4M + 6S + 10A
  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  var jx2 = jx.redSqr();
  var jy2 = jy.redSqr();

  var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

  var jxd4 = jx.redAdd(jx);
  jxd4 = jxd4.redIAdd(jxd4);
  var t1 = jxd4.redMul(jy2);
  var nx = c.redSqr().redISub(t1.redAdd(t1));
  var t2 = t1.redISub(nx);

  var jyd8 = jy2.redSqr();
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  var ny = c.redMul(t2).redISub(jyd8);
  var nz = jy.redAdd(jy).redMul(jz);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.trpl = function trpl() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);

  // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
  // 5M + 10S + ...

  // XX = X1^2
  var xx = this.x.redSqr();
  // YY = Y1^2
  var yy = this.y.redSqr();
  // ZZ = Z1^2
  var zz = this.z.redSqr();
  // YYYY = YY^2
  var yyyy = yy.redSqr();
  // M = 3 * XX + a * ZZ2; a = 0
  var m = xx.redAdd(xx).redIAdd(xx);
  // MM = M^2
  var mm = m.redSqr();
  // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
  e = e.redIAdd(e);
  e = e.redAdd(e).redIAdd(e);
  e = e.redISub(mm);
  // EE = E^2
  var ee = e.redSqr();
  // T = 16*YYYY
  var t = yyyy.redIAdd(yyyy);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  // U = (M + E)^2 - MM - EE - T
  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
  // X3 = 4 * (X1 * EE - 4 * YY * U)
  var yyu4 = yy.redMul(u);
  yyu4 = yyu4.redIAdd(yyu4);
  yyu4 = yyu4.redIAdd(yyu4);
  var nx = this.x.redMul(ee).redISub(yyu4);
  nx = nx.redIAdd(nx);
  nx = nx.redIAdd(nx);
  // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  // Z3 = (Z1 + E)^2 - ZZ - EE
  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mul = function mul(k, kbase) {
  k = new BN(k, kbase);

  return this.curve._wnafMul(this, k);
};

JPoint.prototype.eq = function eq(p) {
  if (p.type === 'affine')
    return this.eq(p.toJ());

  if (this === p)
    return true;

  // x1 * z2^2 == x2 * z1^2
  var z2 = this.z.redSqr();
  var pz2 = p.z.redSqr();
  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
    return false;

  // y1 * z2^3 == y2 * z1^3
  var z3 = z2.redMul(this.z);
  var pz3 = pz2.redMul(p.z);
  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
};

JPoint.prototype.eqXToP = function eqXToP(x) {
  var zs = this.z.redSqr();
  var rx = x.toRed(this.curve.red).redMul(zs);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(zs);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
  return false;
};

JPoint.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC JPoint Infinity>';
  return '<EC JPoint x: ' + this.x.toString(16, 2) +
      ' y: ' + this.y.toString(16, 2) +
      ' z: ' + this.z.toString(16, 2) + '>';
};

JPoint.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(13);
var BN = __webpack_require__(5);
var inherits = __webpack_require__(14);
var Base = curve.base;

var elliptic = __webpack_require__(3);
var utils = elliptic.utils;

function MontCurve(conf) {
  Base.call(this, 'mont', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.i4 = new BN(4).toRed(this.red).redInvm();
  this.two = new BN(2).toRed(this.red);
  this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
inherits(MontCurve, Base);
module.exports = MontCurve;

MontCurve.prototype.validate = function validate(point) {
  var x = point.normalize().x;
  var x2 = x.redSqr();
  var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
  var y = rhs.redSqrt();

  return y.redSqr().cmp(rhs) === 0;
};

function Point(curve, x, z) {
  Base.BasePoint.call(this, curve, 'projective');
  if (x === null && z === null) {
    this.x = this.curve.one;
    this.z = this.curve.zero;
  } else {
    this.x = new BN(x, 16);
    this.z = new BN(z, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
  }
}
inherits(Point, Base.BasePoint);

MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  return this.point(utils.toArray(bytes, enc), 1);
};

MontCurve.prototype.point = function point(x, z) {
  return new Point(this, x, z);
};

MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
  return Point.fromJSON(this, obj);
};

Point.prototype.precompute = function precompute() {
  // No-op
};

Point.prototype._encode = function _encode() {
  return this.getX().toArray('be', this.curve.p.byteLength());
};

Point.fromJSON = function fromJSON(curve, obj) {
  return new Point(curve, obj[0], obj[1] || curve.one);
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};

Point.prototype.dbl = function dbl() {
  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
  // 2M + 2S + 4A

  // A = X1 + Z1
  var a = this.x.redAdd(this.z);
  // AA = A^2
  var aa = a.redSqr();
  // B = X1 - Z1
  var b = this.x.redSub(this.z);
  // BB = B^2
  var bb = b.redSqr();
  // C = AA - BB
  var c = aa.redSub(bb);
  // X3 = AA * BB
  var nx = aa.redMul(bb);
  // Z3 = C * (BB + A24 * C)
  var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
  return this.curve.point(nx, nz);
};

Point.prototype.add = function add() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.diffAdd = function diffAdd(p, diff) {
  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
  // 4M + 2S + 6A

  // A = X2 + Z2
  var a = this.x.redAdd(this.z);
  // B = X2 - Z2
  var b = this.x.redSub(this.z);
  // C = X3 + Z3
  var c = p.x.redAdd(p.z);
  // D = X3 - Z3
  var d = p.x.redSub(p.z);
  // DA = D * A
  var da = d.redMul(a);
  // CB = C * B
  var cb = c.redMul(b);
  // X5 = Z1 * (DA + CB)^2
  var nx = diff.z.redMul(da.redAdd(cb).redSqr());
  // Z5 = X1 * (DA - CB)^2
  var nz = diff.x.redMul(da.redISub(cb).redSqr());
  return this.curve.point(nx, nz);
};

Point.prototype.mul = function mul(k) {
  var t = k.clone();
  var a = this; // (N / 2) * Q + Q
  var b = this.curve.point(null, null); // (N / 2) * Q
  var c = this; // Q

  for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
    bits.push(t.andln(1));

  for (var i = bits.length - 1; i >= 0; i--) {
    if (bits[i] === 0) {
      // N * Q + Q = ((N / 2) * Q + Q)) + (N / 2) * Q
      a = a.diffAdd(b, c);
      // N * Q = 2 * ((N / 2) * Q + Q))
      b = b.dbl();
    } else {
      // N * Q = ((N / 2) * Q + Q) + ((N / 2) * Q)
      b = a.diffAdd(b, c);
      // N * Q + Q = 2 * ((N / 2) * Q + Q)
      a = a.dbl();
    }
  }
  return b;
};

Point.prototype.mulAdd = function mulAdd() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.jumlAdd = function jumlAdd() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.eq = function eq(other) {
  return this.getX().cmp(other.getX()) === 0;
};

Point.prototype.normalize = function normalize() {
  this.x = this.x.redMul(this.z.redInvm());
  this.z = this.curve.one;
  return this;
};

Point.prototype.getX = function getX() {
  // Normalize coordinates
  this.normalize();

  return this.x.fromRed();
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(13);
var elliptic = __webpack_require__(3);
var BN = __webpack_require__(5);
var inherits = __webpack_require__(14);
var Base = curve.base;

var assert = elliptic.utils.assert;

function EdwardsCurve(conf) {
  // NOTE: Important as we are creating point in Base.call()
  this.twisted = (conf.a | 0) !== 1;
  this.mOneA = this.twisted && (conf.a | 0) === -1;
  this.extended = this.mOneA;

  Base.call(this, 'edwards', conf);

  this.a = new BN(conf.a, 16).umod(this.red.m);
  this.a = this.a.toRed(this.red);
  this.c = new BN(conf.c, 16).toRed(this.red);
  this.c2 = this.c.redSqr();
  this.d = new BN(conf.d, 16).toRed(this.red);
  this.dd = this.d.redAdd(this.d);

  assert(!this.twisted || this.c.fromRed().cmpn(1) === 0);
  this.oneC = (conf.c | 0) === 1;
}
inherits(EdwardsCurve, Base);
module.exports = EdwardsCurve;

EdwardsCurve.prototype._mulA = function _mulA(num) {
  if (this.mOneA)
    return num.redNeg();
  else
    return this.a.redMul(num);
};

EdwardsCurve.prototype._mulC = function _mulC(num) {
  if (this.oneC)
    return num;
  else
    return this.c.redMul(num);
};

// Just for compatibility with Short curve
EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
  return this.point(x, y, z, t);
};

EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new BN(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var x2 = x.redSqr();
  var rhs = this.c2.redSub(this.a.redMul(x2));
  var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));

  var y2 = rhs.redMul(lhs.redInvm());
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
  y = new BN(y, 16);
  if (!y.red)
    y = y.toRed(this.red);

  // x^2 = (y^2 - 1) / (d y^2 + 1)
  var y2 = y.redSqr();
  var lhs = y2.redSub(this.one);
  var rhs = y2.redMul(this.d).redAdd(this.one);
  var x2 = lhs.redMul(rhs.redInvm());

  if (x2.cmp(this.zero) === 0) {
    if (odd)
      throw new Error('invalid point');
    else
      return this.point(this.zero, y);
  }

  var x = x2.redSqrt();
  if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  if (x.isOdd() !== odd)
    x = x.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.validate = function validate(point) {
  if (point.isInfinity())
    return true;

  // Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)
  point.normalize();

  var x2 = point.x.redSqr();
  var y2 = point.y.redSqr();
  var lhs = x2.redMul(this.a).redAdd(y2);
  var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));

  return lhs.cmp(rhs) === 0;
};

function Point(curve, x, y, z, t) {
  Base.BasePoint.call(this, curve, 'projective');
  if (x === null && y === null && z === null) {
    this.x = this.curve.zero;
    this.y = this.curve.one;
    this.z = this.curve.one;
    this.t = this.curve.zero;
    this.zOne = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = z ? new BN(z, 16) : this.curve.one;
    this.t = t && new BN(t, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
    if (this.t && !this.t.red)
      this.t = this.t.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;

    // Use extended coordinates
    if (this.curve.extended && !this.t) {
      this.t = this.x.redMul(this.y);
      if (!this.zOne)
        this.t = this.t.redMul(this.z.redInvm());
    }
  }
}
inherits(Point, Base.BasePoint);

EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
  return Point.fromJSON(this, obj);
};

EdwardsCurve.prototype.point = function point(x, y, z, t) {
  return new Point(this, x, y, z, t);
};

Point.fromJSON = function fromJSON(curve, obj) {
  return new Point(curve, obj[0], obj[1], obj[2]);
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.x.cmpn(0) === 0 &&
         this.y.cmp(this.z) === 0;
};

Point.prototype._extDbl = function _extDbl() {
  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
  //     #doubling-dbl-2008-hwcd
  // 4M + 4S

  // A = X1^2
  var a = this.x.redSqr();
  // B = Y1^2
  var b = this.y.redSqr();
  // C = 2 * Z1^2
  var c = this.z.redSqr();
  c = c.redIAdd(c);
  // D = a * A
  var d = this.curve._mulA(a);
  // E = (X1 + Y1)^2 - A - B
  var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
  // G = D + B
  var g = d.redAdd(b);
  // F = G - C
  var f = g.redSub(c);
  // H = D - B
  var h = d.redSub(b);
  // X3 = E * F
  var nx = e.redMul(f);
  // Y3 = G * H
  var ny = g.redMul(h);
  // T3 = E * H
  var nt = e.redMul(h);
  // Z3 = F * G
  var nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point.prototype._projDbl = function _projDbl() {
  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
  //     #doubling-dbl-2008-bbjlp
  //     #doubling-dbl-2007-bl
  // and others
  // Generally 3M + 4S or 2M + 4S

  // B = (X1 + Y1)^2
  var b = this.x.redAdd(this.y).redSqr();
  // C = X1^2
  var c = this.x.redSqr();
  // D = Y1^2
  var d = this.y.redSqr();

  var nx;
  var ny;
  var nz;
  if (this.curve.twisted) {
    // E = a * C
    var e = this.curve._mulA(c);
    // F = E + D
    var f = e.redAdd(d);
    if (this.zOne) {
      // X3 = (B - C - D) * (F - 2)
      nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
      // Y3 = F * (E - D)
      ny = f.redMul(e.redSub(d));
      // Z3 = F^2 - 2 * F
      nz = f.redSqr().redSub(f).redSub(f);
    } else {
      // H = Z1^2
      var h = this.z.redSqr();
      // J = F - 2 * H
      var j = f.redSub(h).redISub(h);
      // X3 = (B-C-D)*J
      nx = b.redSub(c).redISub(d).redMul(j);
      // Y3 = F * (E - D)
      ny = f.redMul(e.redSub(d));
      // Z3 = F * J
      nz = f.redMul(j);
    }
  } else {
    // E = C + D
    var e = c.redAdd(d);
    // H = (c * Z1)^2
    var h = this.curve._mulC(this.c.redMul(this.z)).redSqr();
    // J = E - 2 * H
    var j = e.redSub(h).redSub(h);
    // X3 = c * (B - E) * J
    nx = this.curve._mulC(b.redISub(e)).redMul(j);
    // Y3 = c * E * (C - D)
    ny = this.curve._mulC(e).redMul(c.redISub(d));
    // Z3 = E * J
    nz = e.redMul(j);
  }
  return this.curve.point(nx, ny, nz);
};

Point.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  // Double in extended coordinates
  if (this.curve.extended)
    return this._extDbl();
  else
    return this._projDbl();
};

Point.prototype._extAdd = function _extAdd(p) {
  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
  //     #addition-add-2008-hwcd-3
  // 8M

  // A = (Y1 - X1) * (Y2 - X2)
  var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
  // B = (Y1 + X1) * (Y2 + X2)
  var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
  // C = T1 * k * T2
  var c = this.t.redMul(this.curve.dd).redMul(p.t);
  // D = Z1 * 2 * Z2
  var d = this.z.redMul(p.z.redAdd(p.z));
  // E = B - A
  var e = b.redSub(a);
  // F = D - C
  var f = d.redSub(c);
  // G = D + C
  var g = d.redAdd(c);
  // H = B + A
  var h = b.redAdd(a);
  // X3 = E * F
  var nx = e.redMul(f);
  // Y3 = G * H
  var ny = g.redMul(h);
  // T3 = E * H
  var nt = e.redMul(h);
  // Z3 = F * G
  var nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point.prototype._projAdd = function _projAdd(p) {
  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
  //     #addition-add-2008-bbjlp
  //     #addition-add-2007-bl
  // 10M + 1S

  // A = Z1 * Z2
  var a = this.z.redMul(p.z);
  // B = A^2
  var b = a.redSqr();
  // C = X1 * X2
  var c = this.x.redMul(p.x);
  // D = Y1 * Y2
  var d = this.y.redMul(p.y);
  // E = d * C * D
  var e = this.curve.d.redMul(c).redMul(d);
  // F = B - E
  var f = b.redSub(e);
  // G = B + E
  var g = b.redAdd(e);
  // X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)
  var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
  var nx = a.redMul(f).redMul(tmp);
  var ny;
  var nz;
  if (this.curve.twisted) {
    // Y3 = A * G * (D - a * C)
    ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
    // Z3 = F * G
    nz = f.redMul(g);
  } else {
    // Y3 = A * G * (D - C)
    ny = a.redMul(g).redMul(d.redSub(c));
    // Z3 = c * F * G
    nz = this.curve._mulC(f).redMul(g);
  }
  return this.curve.point(nx, ny, nz);
};

Point.prototype.add = function add(p) {
  if (this.isInfinity())
    return p;
  if (p.isInfinity())
    return this;

  if (this.curve.extended)
    return this._extAdd(p);
  else
    return this._projAdd(p);
};

Point.prototype.mul = function mul(k) {
  if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, false);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, true);
};

Point.prototype.normalize = function normalize() {
  if (this.zOne)
    return this;

  // Normalize coordinates
  var zi = this.z.redInvm();
  this.x = this.x.redMul(zi);
  this.y = this.y.redMul(zi);
  if (this.t)
    this.t = this.t.redMul(zi);
  this.z = this.curve.one;
  this.zOne = true;
  return this;
};

Point.prototype.neg = function neg() {
  return this.curve.point(this.x.redNeg(),
                          this.y,
                          this.z,
                          this.t && this.t.redNeg());
};

Point.prototype.getX = function getX() {
  this.normalize();
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  this.normalize();
  return this.y.fromRed();
};

Point.prototype.eq = function eq(other) {
  return this === other ||
         this.getX().cmp(other.getX()) === 0 &&
         this.getY().cmp(other.getY()) === 0;
};

Point.prototype.eqXToP = function eqXToP(x) {
  var rx = x.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(this.z);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
  return false;
};

// Compatibility with BaseCurve
Point.prototype.toP = Point.prototype.normalize;
Point.prototype.mixedAdd = Point.prototype.add;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curves = exports;

var hash = __webpack_require__(19);
var elliptic = __webpack_require__(3);

var assert = elliptic.utils.assert;

function PresetCurve(options) {
  if (options.type === 'short')
    this.curve = new elliptic.curve.short(options);
  else if (options.type === 'edwards')
    this.curve = new elliptic.curve.edwards(options);
  else
    this.curve = new elliptic.curve.mont(options);
  this.g = this.curve.g;
  this.n = this.curve.n;
  this.hash = options.hash;

  assert(this.g.validate(), 'Invalid curve');
  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
}
curves.PresetCurve = PresetCurve;

function defineCurve(name, options) {
  Object.defineProperty(curves, name, {
    configurable: true,
    enumerable: true,
    get: function() {
      var curve = new PresetCurve(options);
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        value: curve
      });
      return curve;
    }
  });
}

defineCurve('p192', {
  type: 'short',
  prime: 'p192',
  p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
  b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
  n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
  hash: hash.sha256,
  gRed: false,
  g: [
    '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
    '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811'
  ]
});

defineCurve('p224', {
  type: 'short',
  prime: 'p224',
  p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
  b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
  n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
  hash: hash.sha256,
  gRed: false,
  g: [
    'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
    'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34'
  ]
});

defineCurve('p256', {
  type: 'short',
  prime: null,
  p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
  a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
  b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
  n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
  hash: hash.sha256,
  gRed: false,
  g: [
    '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5'
  ]
});

defineCurve('p384', {
  type: 'short',
  prime: null,
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 ffffffff',
  a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 fffffffc',
  b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
     '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
  n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
     'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
  hash: hash.sha384,
  gRed: false,
  g: [
    'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
    '5502f25d bf55296c 3a545e38 72760ab7',
    '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f'
  ]
});

defineCurve('p521', {
  type: 'short',
  prime: null,
  p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff',
  a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff fffffffc',
  b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
     '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
     '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
  n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
     'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
  hash: hash.sha512,
  gRed: false,
  g: [
    '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
    '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
    'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
    '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
    '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
    '3fad0761 353c7086 a272c240 88be9476 9fd16650'
  ]
});

defineCurve('curve25519', {
  type: 'mont',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '76d06',
  b: '1',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash.sha256,
  gRed: false,
  g: [
    '9'
  ]
});

defineCurve('ed25519', {
  type: 'edwards',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '-1',
  c: '1',
  // -121665 * (121666^(-1)) (mod P)
  d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash.sha256,
  gRed: false,
  g: [
    '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

    // 4/5
    '6666666666666666666666666666666666666666666666666666666666666658'
  ]
});

var pre;
try {
  pre = __webpack_require__(74);
} catch (e) {
  pre = undefined;
}

defineCurve('secp256k1', {
  type: 'short',
  prime: 'k256',
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
  a: '0',
  b: '7',
  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
  h: '1',
  hash: hash.sha256,

  // Precomputed endomorphism
  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
  basis: [
    {
      a: '3086d221a7d46bcde86c90e49284eb15',
      b: '-e4437ed6010e88286f547fa90abfe4c3'
    },
    {
      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
      b: '3086d221a7d46bcde86c90e49284eb15'
    }
  ],

  gRed: false,
  g: [
    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
    pre
  ]
});


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.sha1 = __webpack_require__(69);
exports.sha224 = __webpack_require__(70);
exports.sha256 = __webpack_require__(31);
exports.sha384 = __webpack_require__(71);
exports.sha512 = __webpack_require__(32);


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var common = __webpack_require__(10);
var shaCommon = __webpack_require__(30);

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_5 = utils.sum32_5;
var ft_1 = shaCommon.ft_1;
var BlockHash = common.BlockHash;

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash.call(this);
  this.h = [
    0x67452301, 0xefcdab89, 0x98badcfe,
    0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
module.exports = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var SHA256 = __webpack_require__(31);

function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();

  SHA256.call(this);
  this.h = [
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
}
utils.inherits(SHA224, SHA256);
module.exports = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function digest(enc) {
  // Just truncate output
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 7), 'big');
  else
    return utils.split32(this.h.slice(0, 7), 'big');
};



/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);

var SHA512 = __webpack_require__(32);

function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();

  SHA512.call(this);
  this.h = [
    0xcbbb9d5d, 0xc1059ed8,
    0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17,
    0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31,
    0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7,
    0x47b5481d, 0xbefa4fa4 ];
}
utils.inherits(SHA384, SHA512);
module.exports = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 12), 'big');
  else
    return utils.split32(this.h.slice(0, 12), 'big');
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var common = __webpack_require__(10);

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_3 = utils.sum32_3;
var sum32_4 = utils.sum32_4;
var BlockHash = common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();

  BlockHash.call(this);

  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash);
exports.ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function update(msg, start) {
  var A = this.h[0];
  var B = this.h[1];
  var C = this.h[2];
  var D = this.h[3];
  var E = this.h[4];
  var Ah = A;
  var Bh = B;
  var Ch = C;
  var Dh = D;
  var Eh = E;
  for (var j = 0; j < 80; j++) {
    var T = sum32(
      rotl32(
        sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
        s[j]),
      E);
    A = E;
    E = D;
    D = rotl32(C, 10);
    C = B;
    B = T;
    T = sum32(
      rotl32(
        sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
        sh[j]),
      Eh);
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3(this.h[1], C, Dh);
  this.h[1] = sum32_3(this.h[2], D, Eh);
  this.h[2] = sum32_3(this.h[3], E, Ah);
  this.h[3] = sum32_3(this.h[4], A, Bh);
  this.h[4] = sum32_3(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'little');
  else
    return utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  if (j <= 15)
    return x ^ y ^ z;
  else if (j <= 31)
    return (x & y) | ((~x) & z);
  else if (j <= 47)
    return (x | (~y)) ^ z;
  else if (j <= 63)
    return (x & z) | (y & (~z));
  else
    return x ^ (y | (~z));
}

function K(j) {
  if (j <= 15)
    return 0x00000000;
  else if (j <= 31)
    return 0x5a827999;
  else if (j <= 47)
    return 0x6ed9eba1;
  else if (j <= 63)
    return 0x8f1bbcdc;
  else
    return 0xa953fd4e;
}

function Kh(j) {
  if (j <= 15)
    return 0x50a28be6;
  else if (j <= 31)
    return 0x5c4dd124;
  else if (j <= 47)
    return 0x6d703ef3;
  else if (j <= 63)
    return 0x7a6d76e9;
  else
    return 0x00000000;
}

var r = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var assert = __webpack_require__(6);

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
module.exports = Hmac;

Hmac.prototype._init = function init(key) {
  // Shorten key, if needed
  if (key.length > this.blockSize)
    key = new this.Hash().update(key).digest();
  assert(key.length <= this.blockSize);

  // Add padding to key
  for (var i = key.length; i < this.blockSize; i++)
    key.push(0);

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  // 0x36 ^ 0x5c = 0x6a
  for (i = 0; i < key.length; i++)
    key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function update(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function digest(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = {
  doubles: {
    step: 4,
    points: [
      [
        'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
        'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821'
      ],
      [
        '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
        '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf'
      ],
      [
        '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
        'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695'
      ],
      [
        '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
        '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9'
      ],
      [
        '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
        '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36'
      ],
      [
        '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
        '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f'
      ],
      [
        'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
        '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999'
      ],
      [
        '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
        'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09'
      ],
      [
        'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
        '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d'
      ],
      [
        'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
        'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088'
      ],
      [
        'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
        '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d'
      ],
      [
        '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
        '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8'
      ],
      [
        '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
        '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a'
      ],
      [
        '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
        '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453'
      ],
      [
        '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
        '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160'
      ],
      [
        '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
        '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0'
      ],
      [
        '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
        '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6'
      ],
      [
        '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
        '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589'
      ],
      [
        '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
        'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17'
      ],
      [
        'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
        '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda'
      ],
      [
        'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
        '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd'
      ],
      [
        '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
        '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2'
      ],
      [
        '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
        '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6'
      ],
      [
        'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
        '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f'
      ],
      [
        '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
        'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01'
      ],
      [
        'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
        '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3'
      ],
      [
        'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
        'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f'
      ],
      [
        'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
        '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7'
      ],
      [
        'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
        'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78'
      ],
      [
        'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
        '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1'
      ],
      [
        '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
        'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150'
      ],
      [
        '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
        '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'
      ],
      [
        'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
        '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc'
      ],
      [
        '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
        'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b'
      ],
      [
        'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
        '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51'
      ],
      [
        'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
        '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45'
      ],
      [
        'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
        'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120'
      ],
      [
        '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
        '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84'
      ],
      [
        '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
        '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d'
      ],
      [
        '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
        'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d'
      ],
      [
        '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
        '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8'
      ],
      [
        'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
        '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8'
      ],
      [
        '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
        '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac'
      ],
      [
        '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
        'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f'
      ],
      [
        '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
        '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962'
      ],
      [
        'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
        '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907'
      ],
      [
        '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
        'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec'
      ],
      [
        'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
        'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d'
      ],
      [
        'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
        '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414'
      ],
      [
        '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
        'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd'
      ],
      [
        '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
        'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0'
      ],
      [
        'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
        '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811'
      ],
      [
        'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
        '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1'
      ],
      [
        'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
        '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c'
      ],
      [
        '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
        'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73'
      ],
      [
        '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
        '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd'
      ],
      [
        'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
        'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405'
      ],
      [
        '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
        'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589'
      ],
      [
        '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
        '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e'
      ],
      [
        '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
        '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27'
      ],
      [
        'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
        'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1'
      ],
      [
        '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
        '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482'
      ],
      [
        '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
        '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945'
      ],
      [
        'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
        '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573'
      ],
      [
        'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
        'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82'
      ]
    ]
  },
  naf: {
    wnd: 7,
    points: [
      [
        'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
        '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672'
      ],
      [
        '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
        'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6'
      ],
      [
        '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
        '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'
      ],
      [
        'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
        'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37'
      ],
      [
        '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
        'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b'
      ],
      [
        'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
        'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81'
      ],
      [
        'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
        '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58'
      ],
      [
        'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
        '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77'
      ],
      [
        '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
        '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a'
      ],
      [
        '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
        '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c'
      ],
      [
        '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
        '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67'
      ],
      [
        '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
        '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402'
      ],
      [
        'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
        'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55'
      ],
      [
        'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
        '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482'
      ],
      [
        '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
        'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82'
      ],
      [
        '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
        'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396'
      ],
      [
        '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
        '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49'
      ],
      [
        '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
        '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf'
      ],
      [
        '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
        '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a'
      ],
      [
        '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
        'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7'
      ],
      [
        'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
        'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933'
      ],
      [
        '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
        '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a'
      ],
      [
        '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
        '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6'
      ],
      [
        'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
        'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37'
      ],
      [
        '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
        '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e'
      ],
      [
        'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
        'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6'
      ],
      [
        'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
        'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476'
      ],
      [
        '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
        '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40'
      ],
      [
        '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
        '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61'
      ],
      [
        '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
        '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683'
      ],
      [
        'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
        '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5'
      ],
      [
        '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
        '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b'
      ],
      [
        'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
        '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417'
      ],
      [
        '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
        'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868'
      ],
      [
        '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
        'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a'
      ],
      [
        'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
        'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6'
      ],
      [
        '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
        '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996'
      ],
      [
        '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
        'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e'
      ],
      [
        'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
        'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d'
      ],
      [
        '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
        '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2'
      ],
      [
        '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
        'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e'
      ],
      [
        '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
        '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437'
      ],
      [
        '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
        'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311'
      ],
      [
        'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
        '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4'
      ],
      [
        '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
        '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575'
      ],
      [
        '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
        'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d'
      ],
      [
        '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
        'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d'
      ],
      [
        'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
        'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629'
      ],
      [
        'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
        'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06'
      ],
      [
        '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
        '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374'
      ],
      [
        '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
        '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee'
      ],
      [
        'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
        '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1'
      ],
      [
        'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
        'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b'
      ],
      [
        '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
        '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661'
      ],
      [
        '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
        '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6'
      ],
      [
        'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
        '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e'
      ],
      [
        '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
        '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d'
      ],
      [
        'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
        'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc'
      ],
      [
        '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
        'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4'
      ],
      [
        '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
        '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c'
      ],
      [
        'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
        '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b'
      ],
      [
        'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
        '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913'
      ],
      [
        '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
        '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154'
      ],
      [
        '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
        '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865'
      ],
      [
        '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
        'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc'
      ],
      [
        '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
        'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224'
      ],
      [
        '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
        '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e'
      ],
      [
        '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
        '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6'
      ],
      [
        '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
        '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511'
      ],
      [
        '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
        'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b'
      ],
      [
        'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
        'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2'
      ],
      [
        '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
        'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c'
      ],
      [
        'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
        '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3'
      ],
      [
        'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
        '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d'
      ],
      [
        'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
        '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700'
      ],
      [
        'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
        '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4'
      ],
      [
        '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
        'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196'
      ],
      [
        '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
        '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4'
      ],
      [
        '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
        'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257'
      ],
      [
        'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
        'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13'
      ],
      [
        'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
        '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096'
      ],
      [
        'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
        'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38'
      ],
      [
        'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
        '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f'
      ],
      [
        '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
        '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448'
      ],
      [
        'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
        '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a'
      ],
      [
        'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
        '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4'
      ],
      [
        '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
        '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437'
      ],
      [
        '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
        'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7'
      ],
      [
        'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
        '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d'
      ],
      [
        'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
        '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a'
      ],
      [
        'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
        '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54'
      ],
      [
        '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
        '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77'
      ],
      [
        'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
        'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517'
      ],
      [
        '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
        'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10'
      ],
      [
        'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
        'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125'
      ],
      [
        'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
        '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e'
      ],
      [
        '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
        'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1'
      ],
      [
        'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
        '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2'
      ],
      [
        'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
        '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423'
      ],
      [
        'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
        '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8'
      ],
      [
        '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
        'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758'
      ],
      [
        '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
        'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375'
      ],
      [
        'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
        '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d'
      ],
      [
        '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
        'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec'
      ],
      [
        '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
        '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0'
      ],
      [
        '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
        'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c'
      ],
      [
        'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
        'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4'
      ],
      [
        '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
        'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f'
      ],
      [
        '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
        '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649'
      ],
      [
        '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
        'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826'
      ],
      [
        '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
        '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5'
      ],
      [
        'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
        'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87'
      ],
      [
        '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
        '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b'
      ],
      [
        'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
        '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc'
      ],
      [
        '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
        '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c'
      ],
      [
        'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
        'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f'
      ],
      [
        'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
        '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a'
      ],
      [
        'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
        'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46'
      ],
      [
        '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
        'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f'
      ],
      [
        '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
        '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03'
      ],
      [
        '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
        'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08'
      ],
      [
        '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
        '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8'
      ],
      [
        '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
        '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373'
      ],
      [
        '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
        'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3'
      ],
      [
        '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
        '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8'
      ],
      [
        '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
        '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1'
      ],
      [
        '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
        '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9'
      ]
    ]
  }
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(5);
var HmacDRBG = __webpack_require__(76);
var elliptic = __webpack_require__(3);
var utils = elliptic.utils;
var assert = utils.assert;

var KeyPair = __webpack_require__(77);
var Signature = __webpack_require__(78);

function EC(options) {
  if (!(this instanceof EC))
    return new EC(options);

  // Shortcut `elliptic.ec(curve-name)`
  if (typeof options === 'string') {
    assert(elliptic.curves.hasOwnProperty(options), 'Unknown curve ' + options);

    options = elliptic.curves[options];
  }

  // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
  if (options instanceof elliptic.curves.PresetCurve)
    options = { curve: options };

  this.curve = options.curve.curve;
  this.n = this.curve.n;
  this.nh = this.n.ushrn(1);
  this.g = this.curve.g;

  // Point on curve
  this.g = options.curve.g;
  this.g.precompute(options.curve.n.bitLength() + 1);

  // Hash for function for DRBG
  this.hash = options.hash || options.curve.hash;
}
module.exports = EC;

EC.prototype.keyPair = function keyPair(options) {
  return new KeyPair(this, options);
};

EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
  return KeyPair.fromPrivate(this, priv, enc);
};

EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
  return KeyPair.fromPublic(this, pub, enc);
};

EC.prototype.genKeyPair = function genKeyPair(options) {
  if (!options)
    options = {};

  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: this.hash,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
    entropy: options.entropy || elliptic.rand(this.hash.hmacStrength),
    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
    nonce: this.n.toArray()
  });

  var bytes = this.n.byteLength();
  var ns2 = this.n.sub(new BN(2));
  do {
    var priv = new BN(drbg.generate(bytes));
    if (priv.cmp(ns2) > 0)
      continue;

    priv.iaddn(1);
    return this.keyFromPrivate(priv);
  } while (true);
};

EC.prototype._truncateToN = function truncateToN(msg, truncOnly) {
  var delta = msg.byteLength() * 8 - this.n.bitLength();
  if (delta > 0)
    msg = msg.ushrn(delta);
  if (!truncOnly && msg.cmp(this.n) >= 0)
    return msg.sub(this.n);
  else
    return msg;
};

EC.prototype.sign = function sign(msg, key, enc, options) {
  if (typeof enc === 'object') {
    options = enc;
    enc = null;
  }
  if (!options)
    options = {};

  key = this.keyFromPrivate(key, enc);
  msg = this._truncateToN(new BN(msg, 16));

  // Zero-extend key to provide enough entropy
  var bytes = this.n.byteLength();
  var bkey = key.getPrivate().toArray('be', bytes);

  // Zero-extend nonce to have the same byte size as N
  var nonce = msg.toArray('be', bytes);

  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: this.hash,
    entropy: bkey,
    nonce: nonce,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8'
  });

  // Number of bytes to generate
  var ns1 = this.n.sub(new BN(1));

  for (var iter = 0; true; iter++) {
    var k = options.k ?
        options.k(iter) :
        new BN(drbg.generate(this.n.byteLength()));
    k = this._truncateToN(k, true);
    if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
      continue;

    var kp = this.g.mul(k);
    if (kp.isInfinity())
      continue;

    var kpX = kp.getX();
    var r = kpX.umod(this.n);
    if (r.cmpn(0) === 0)
      continue;

    var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
    s = s.umod(this.n);
    if (s.cmpn(0) === 0)
      continue;

    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
                        (kpX.cmp(r) !== 0 ? 2 : 0);

    // Use complement of `s`, if it is > `n / 2`
    if (options.canonical && s.cmp(this.nh) > 0) {
      s = this.n.sub(s);
      recoveryParam ^= 1;
    }

    return new Signature({ r: r, s: s, recoveryParam: recoveryParam });
  }
};

EC.prototype.verify = function verify(msg, signature, key, enc) {
  msg = this._truncateToN(new BN(msg, 16));
  key = this.keyFromPublic(key, enc);
  signature = new Signature(signature, 'hex');

  // Perform primitive values validation
  var r = signature.r;
  var s = signature.s;
  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
    return false;
  if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
    return false;

  // Validate signature
  var sinv = s.invm(this.n);
  var u1 = sinv.mul(msg).umod(this.n);
  var u2 = sinv.mul(r).umod(this.n);

  if (!this.curve._maxwellTrick) {
    var p = this.g.mulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity())
      return false;

    return p.getX().umod(this.n).cmp(r) === 0;
  }

  // NOTE: Greg Maxwell's trick, inspired by:
  // https://git.io/vad3K

  var p = this.g.jmulAdd(u1, key.getPublic(), u2);
  if (p.isInfinity())
    return false;

  // Compare `p.x` of Jacobian point with `r`,
  // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
  // inverse of `p.z^2`
  return p.eqXToP(r);
};

EC.prototype.recoverPubKey = function(msg, signature, j, enc) {
  assert((3 & j) === j, 'The recovery param is more than two bits');
  signature = new Signature(signature, enc);

  var n = this.n;
  var e = new BN(msg);
  var r = signature.r;
  var s = signature.s;

  // A set LSB signifies that the y-coordinate is odd
  var isYOdd = j & 1;
  var isSecondKey = j >> 1;
  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
    throw new Error('Unable to find sencond key candinate');

  // 1.1. Let x = r + jn.
  if (isSecondKey)
    r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
  else
    r = this.curve.pointFromX(r, isYOdd);

  var rInv = signature.r.invm(n);
  var s1 = n.sub(e).mul(rInv).umod(n);
  var s2 = s.mul(rInv).umod(n);

  // 1.6.1 Compute Q = r^-1 (sR -  eG)
  //               Q = r^-1 (sR + -eG)
  return this.g.mulAdd(s1, r, s2);
};

EC.prototype.getKeyRecoveryParam = function(e, signature, Q, enc) {
  signature = new Signature(signature, enc);
  if (signature.recoveryParam !== null)
    return signature.recoveryParam;

  for (var i = 0; i < 4; i++) {
    var Qprime;
    try {
      Qprime = this.recoverPubKey(e, signature, i);
    } catch (e) {
      continue;
    }

    if (Qprime.eq(Q))
      return i;
  }
  throw new Error('Unable to find valid recovery factor');
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hash = __webpack_require__(19);
var utils = __webpack_require__(28);
var assert = __webpack_require__(6);

function HmacDRBG(options) {
  if (!(this instanceof HmacDRBG))
    return new HmacDRBG(options);
  this.hash = options.hash;
  this.predResist = !!options.predResist;

  this.outLen = this.hash.outSize;
  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

  this._reseed = null;
  this.reseedInterval = null;
  this.K = null;
  this.V = null;

  var entropy = utils.toArray(options.entropy, options.entropyEnc || 'hex');
  var nonce = utils.toArray(options.nonce, options.nonceEnc || 'hex');
  var pers = utils.toArray(options.pers, options.persEnc || 'hex');
  assert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
  this._init(entropy, nonce, pers);
}
module.exports = HmacDRBG;

HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
  var seed = entropy.concat(nonce).concat(pers);

  this.K = new Array(this.outLen / 8);
  this.V = new Array(this.outLen / 8);
  for (var i = 0; i < this.V.length; i++) {
    this.K[i] = 0x00;
    this.V[i] = 0x01;
  }

  this._update(seed);
  this._reseed = 1;
  this.reseedInterval = 0x1000000000000;  // 2^48
};

HmacDRBG.prototype._hmac = function hmac() {
  return new hash.hmac(this.hash, this.K);
};

HmacDRBG.prototype._update = function update(seed) {
  var kmac = this._hmac()
                 .update(this.V)
                 .update([ 0x00 ]);
  if (seed)
    kmac = kmac.update(seed);
  this.K = kmac.digest();
  this.V = this._hmac().update(this.V).digest();
  if (!seed)
    return;

  this.K = this._hmac()
               .update(this.V)
               .update([ 0x01 ])
               .update(seed)
               .digest();
  this.V = this._hmac().update(this.V).digest();
};

HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
  // Optional entropy enc
  if (typeof entropyEnc !== 'string') {
    addEnc = add;
    add = entropyEnc;
    entropyEnc = null;
  }

  entropy = utils.toArray(entropy, entropyEnc);
  add = utils.toArray(add, addEnc);

  assert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

  this._update(entropy.concat(add || []));
  this._reseed = 1;
};

HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
  if (this._reseed > this.reseedInterval)
    throw new Error('Reseed is required');

  // Optional encoding
  if (typeof enc !== 'string') {
    addEnc = add;
    add = enc;
    enc = null;
  }

  // Optional additional data
  if (add) {
    add = utils.toArray(add, addEnc || 'hex');
    this._update(add);
  }

  var temp = [];
  while (temp.length < len) {
    this.V = this._hmac().update(this.V).digest();
    temp = temp.concat(this.V);
  }

  var res = temp.slice(0, len);
  this._update(add);
  this._reseed++;
  return utils.encode(res, enc);
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(5);
var elliptic = __webpack_require__(3);
var utils = elliptic.utils;
var assert = utils.assert;

function KeyPair(ec, options) {
  this.ec = ec;
  this.priv = null;
  this.pub = null;

  // KeyPair(ec, { priv: ..., pub: ... })
  if (options.priv)
    this._importPrivate(options.priv, options.privEnc);
  if (options.pub)
    this._importPublic(options.pub, options.pubEnc);
}
module.exports = KeyPair;

KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
  if (pub instanceof KeyPair)
    return pub;

  return new KeyPair(ec, {
    pub: pub,
    pubEnc: enc
  });
};

KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
  if (priv instanceof KeyPair)
    return priv;

  return new KeyPair(ec, {
    priv: priv,
    privEnc: enc
  });
};

KeyPair.prototype.validate = function validate() {
  var pub = this.getPublic();

  if (pub.isInfinity())
    return { result: false, reason: 'Invalid public key' };
  if (!pub.validate())
    return { result: false, reason: 'Public key is not a point' };
  if (!pub.mul(this.ec.curve.n).isInfinity())
    return { result: false, reason: 'Public key * N != O' };

  return { result: true, reason: null };
};

KeyPair.prototype.getPublic = function getPublic(compact, enc) {
  // compact is optional argument
  if (typeof compact === 'string') {
    enc = compact;
    compact = null;
  }

  if (!this.pub)
    this.pub = this.ec.g.mul(this.priv);

  if (!enc)
    return this.pub;

  return this.pub.encode(enc, compact);
};

KeyPair.prototype.getPrivate = function getPrivate(enc) {
  if (enc === 'hex')
    return this.priv.toString(16, 2);
  else
    return this.priv;
};

KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
  this.priv = new BN(key, enc || 16);

  // Ensure that the priv won't be bigger than n, otherwise we may fail
  // in fixed multiplication method
  this.priv = this.priv.umod(this.ec.curve.n);
};

KeyPair.prototype._importPublic = function _importPublic(key, enc) {
  if (key.x || key.y) {
    // Montgomery points only have an `x` coordinate.
    // Weierstrass/Edwards points on the other hand have both `x` and
    // `y` coordinates.
    if (this.ec.curve.type === 'mont') {
      assert(key.x, 'Need x coordinate');
    } else if (this.ec.curve.type === 'short' ||
               this.ec.curve.type === 'edwards') {
      assert(key.x && key.y, 'Need both x and y coordinate');
    }
    this.pub = this.ec.curve.point(key.x, key.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(key, enc);
};

// ECDH
KeyPair.prototype.derive = function derive(pub) {
  return pub.mul(this.priv).getX();
};

// ECDSA
KeyPair.prototype.sign = function sign(msg, enc, options) {
  return this.ec.sign(msg, this, enc, options);
};

KeyPair.prototype.verify = function verify(msg, signature) {
  return this.ec.verify(msg, signature, this);
};

KeyPair.prototype.inspect = function inspect() {
  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(5);

var elliptic = __webpack_require__(3);
var utils = elliptic.utils;
var assert = utils.assert;

function Signature(options, enc) {
  if (options instanceof Signature)
    return options;

  if (this._importDER(options, enc))
    return;

  assert(options.r && options.s, 'Signature without r or s');
  this.r = new BN(options.r, 16);
  this.s = new BN(options.s, 16);
  if (options.recoveryParam === undefined)
    this.recoveryParam = null;
  else
    this.recoveryParam = options.recoveryParam;
}
module.exports = Signature;

function Position() {
  this.place = 0;
}

function getLength(buf, p) {
  var initial = buf[p.place++];
  if (!(initial & 0x80)) {
    return initial;
  }
  var octetLen = initial & 0xf;
  var val = 0;
  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
    val <<= 8;
    val |= buf[off];
  }
  p.place = off;
  return val;
}

function rmPadding(buf) {
  var i = 0;
  var len = buf.length - 1;
  while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
    i++;
  }
  if (i === 0) {
    return buf;
  }
  return buf.slice(i);
}

Signature.prototype._importDER = function _importDER(data, enc) {
  data = utils.toArray(data, enc);
  var p = new Position();
  if (data[p.place++] !== 0x30) {
    return false;
  }
  var len = getLength(data, p);
  if ((len + p.place) !== data.length) {
    return false;
  }
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var rlen = getLength(data, p);
  var r = data.slice(p.place, rlen + p.place);
  p.place += rlen;
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var slen = getLength(data, p);
  if (data.length !== slen + p.place) {
    return false;
  }
  var s = data.slice(p.place, slen + p.place);
  if (r[0] === 0 && (r[1] & 0x80)) {
    r = r.slice(1);
  }
  if (s[0] === 0 && (s[1] & 0x80)) {
    s = s.slice(1);
  }

  this.r = new BN(r);
  this.s = new BN(s);
  this.recoveryParam = null;

  return true;
};

function constructLength(arr, len) {
  if (len < 0x80) {
    arr.push(len);
    return;
  }
  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
  arr.push(octets | 0x80);
  while (--octets) {
    arr.push((len >>> (octets << 3)) & 0xff);
  }
  arr.push(len);
}

Signature.prototype.toDER = function toDER(enc) {
  var r = this.r.toArray();
  var s = this.s.toArray();

  // Pad values
  if (r[0] & 0x80)
    r = [ 0 ].concat(r);
  // Pad values
  if (s[0] & 0x80)
    s = [ 0 ].concat(s);

  r = rmPadding(r);
  s = rmPadding(s);

  while (!s[0] && !(s[1] & 0x80)) {
    s = s.slice(1);
  }
  var arr = [ 0x02 ];
  constructLength(arr, r.length);
  arr = arr.concat(r);
  arr.push(0x02);
  constructLength(arr, s.length);
  var backHalf = arr.concat(s);
  var res = [ 0x30 ];
  constructLength(res, backHalf.length);
  res = res.concat(backHalf);
  return utils.encode(res, enc);
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hash = __webpack_require__(19);
var elliptic = __webpack_require__(3);
var utils = elliptic.utils;
var assert = utils.assert;
var parseBytes = utils.parseBytes;
var KeyPair = __webpack_require__(80);
var Signature = __webpack_require__(81);

function EDDSA(curve) {
  assert(curve === 'ed25519', 'only tested with ed25519 so far');

  if (!(this instanceof EDDSA))
    return new EDDSA(curve);

  var curve = elliptic.curves[curve].curve;
  this.curve = curve;
  this.g = curve.g;
  this.g.precompute(curve.n.bitLength() + 1);

  this.pointClass = curve.point().constructor;
  this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
  this.hash = hash.sha512;
}

module.exports = EDDSA;

/**
* @param {Array|String} message - message bytes
* @param {Array|String|KeyPair} secret - secret bytes or a keypair
* @returns {Signature} - signature
*/
EDDSA.prototype.sign = function sign(message, secret) {
  message = parseBytes(message);
  var key = this.keyFromSecret(secret);
  var r = this.hashInt(key.messagePrefix(), message);
  var R = this.g.mul(r);
  var Rencoded = this.encodePoint(R);
  var s_ = this.hashInt(Rencoded, key.pubBytes(), message)
               .mul(key.priv());
  var S = r.add(s_).umod(this.curve.n);
  return this.makeSignature({ R: R, S: S, Rencoded: Rencoded });
};

/**
* @param {Array} message - message bytes
* @param {Array|String|Signature} sig - sig bytes
* @param {Array|String|Point|KeyPair} pub - public key
* @returns {Boolean} - true if public key matches sig of message
*/
EDDSA.prototype.verify = function verify(message, sig, pub) {
  message = parseBytes(message);
  sig = this.makeSignature(sig);
  var key = this.keyFromPublic(pub);
  var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
  var SG = this.g.mul(sig.S());
  var RplusAh = sig.R().add(key.pub().mul(h));
  return RplusAh.eq(SG);
};

EDDSA.prototype.hashInt = function hashInt() {
  var hash = this.hash();
  for (var i = 0; i < arguments.length; i++)
    hash.update(arguments[i]);
  return utils.intFromLE(hash.digest()).umod(this.curve.n);
};

EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
  return KeyPair.fromPublic(this, pub);
};

EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
  return KeyPair.fromSecret(this, secret);
};

EDDSA.prototype.makeSignature = function makeSignature(sig) {
  if (sig instanceof Signature)
    return sig;
  return new Signature(this, sig);
};

/**
* * https://tools.ietf.org/html/draft-josefsson-eddsa-ed25519-03#section-5.2
*
* EDDSA defines methods for encoding and decoding points and integers. These are
* helper convenience methods, that pass along to utility functions implied
* parameters.
*
*/
EDDSA.prototype.encodePoint = function encodePoint(point) {
  var enc = point.getY().toArray('le', this.encodingLength);
  enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
  return enc;
};

EDDSA.prototype.decodePoint = function decodePoint(bytes) {
  bytes = utils.parseBytes(bytes);

  var lastIx = bytes.length - 1;
  var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
  var xIsOdd = (bytes[lastIx] & 0x80) !== 0;

  var y = utils.intFromLE(normed);
  return this.curve.pointFromY(y, xIsOdd);
};

EDDSA.prototype.encodeInt = function encodeInt(num) {
  return num.toArray('le', this.encodingLength);
};

EDDSA.prototype.decodeInt = function decodeInt(bytes) {
  return utils.intFromLE(bytes);
};

EDDSA.prototype.isPoint = function isPoint(val) {
  return val instanceof this.pointClass;
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elliptic = __webpack_require__(3);
var utils = elliptic.utils;
var assert = utils.assert;
var parseBytes = utils.parseBytes;
var cachedProperty = utils.cachedProperty;

/**
* @param {EDDSA} eddsa - instance
* @param {Object} params - public/private key parameters
*
* @param {Array<Byte>} [params.secret] - secret seed bytes
* @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
* @param {Array<Byte>} [params.pub] - public key point encoded as bytes
*
*/
function KeyPair(eddsa, params) {
  this.eddsa = eddsa;
  this._secret = parseBytes(params.secret);
  if (eddsa.isPoint(params.pub))
    this._pub = params.pub;
  else
    this._pubBytes = parseBytes(params.pub);
}

KeyPair.fromPublic = function fromPublic(eddsa, pub) {
  if (pub instanceof KeyPair)
    return pub;
  return new KeyPair(eddsa, { pub: pub });
};

KeyPair.fromSecret = function fromSecret(eddsa, secret) {
  if (secret instanceof KeyPair)
    return secret;
  return new KeyPair(eddsa, { secret: secret });
};

KeyPair.prototype.secret = function secret() {
  return this._secret;
};

cachedProperty(KeyPair, 'pubBytes', function pubBytes() {
  return this.eddsa.encodePoint(this.pub());
});

cachedProperty(KeyPair, 'pub', function pub() {
  if (this._pubBytes)
    return this.eddsa.decodePoint(this._pubBytes);
  return this.eddsa.g.mul(this.priv());
});

cachedProperty(KeyPair, 'privBytes', function privBytes() {
  var eddsa = this.eddsa;
  var hash = this.hash();
  var lastIx = eddsa.encodingLength - 1;

  var a = hash.slice(0, eddsa.encodingLength);
  a[0] &= 248;
  a[lastIx] &= 127;
  a[lastIx] |= 64;

  return a;
});

cachedProperty(KeyPair, 'priv', function priv() {
  return this.eddsa.decodeInt(this.privBytes());
});

cachedProperty(KeyPair, 'hash', function hash() {
  return this.eddsa.hash().update(this.secret()).digest();
});

cachedProperty(KeyPair, 'messagePrefix', function messagePrefix() {
  return this.hash().slice(this.eddsa.encodingLength);
});

KeyPair.prototype.sign = function sign(message) {
  assert(this._secret, 'KeyPair can only verify');
  return this.eddsa.sign(message, this);
};

KeyPair.prototype.verify = function verify(message, sig) {
  return this.eddsa.verify(message, sig, this);
};

KeyPair.prototype.getSecret = function getSecret(enc) {
  assert(this._secret, 'KeyPair is public only');
  return utils.encode(this.secret(), enc);
};

KeyPair.prototype.getPublic = function getPublic(enc) {
  return utils.encode(this.pubBytes(), enc);
};

module.exports = KeyPair;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(5);
var elliptic = __webpack_require__(3);
var utils = elliptic.utils;
var assert = utils.assert;
var cachedProperty = utils.cachedProperty;
var parseBytes = utils.parseBytes;

/**
* @param {EDDSA} eddsa - eddsa instance
* @param {Array<Bytes>|Object} sig -
* @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
* @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
* @param {Array<Bytes>} [sig.Rencoded] - R point encoded
* @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
*/
function Signature(eddsa, sig) {
  this.eddsa = eddsa;

  if (typeof sig !== 'object')
    sig = parseBytes(sig);

  if (Array.isArray(sig)) {
    sig = {
      R: sig.slice(0, eddsa.encodingLength),
      S: sig.slice(eddsa.encodingLength)
    };
  }

  assert(sig.R && sig.S, 'Signature without R or S');

  if (eddsa.isPoint(sig.R))
    this._R = sig.R;
  if (sig.S instanceof BN)
    this._S = sig.S;

  this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
  this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
}

cachedProperty(Signature, 'S', function S() {
  return this.eddsa.decodeInt(this.Sencoded());
});

cachedProperty(Signature, 'R', function R() {
  return this.eddsa.decodePoint(this.Rencoded());
});

cachedProperty(Signature, 'Rencoded', function Rencoded() {
  return this.eddsa.encodePoint(this.R());
});

cachedProperty(Signature, 'Sencoded', function Sencoded() {
  return this.eddsa.encodeInt(this.S());
});

Signature.prototype.toBytes = function toBytes() {
  return this.Rencoded().concat(this.Sencoded());
};

Signature.prototype.toHex = function toHex() {
  return utils.encode(this.toBytes(), 'hex').toUpperCase();
};

module.exports = Signature;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Check if typed arrays are supported
	    if (typeof ArrayBuffer != 'function') {
	        return;
	    }

	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;

	    // Reference original init
	    var superInit = WordArray.init;

	    // Augment WordArray.init to handle typed arrays
	    var subInit = WordArray.init = function (typedArray) {
	        // Convert buffers to uint8
	        if (typedArray instanceof ArrayBuffer) {
	            typedArray = new Uint8Array(typedArray);
	        }

	        // Convert other array views to uint8
	        if (
	            typedArray instanceof Int8Array ||
	            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
	            typedArray instanceof Int16Array ||
	            typedArray instanceof Uint16Array ||
	            typedArray instanceof Int32Array ||
	            typedArray instanceof Uint32Array ||
	            typedArray instanceof Float32Array ||
	            typedArray instanceof Float64Array
	        ) {
	            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
	        }

	        // Handle Uint8Array
	        if (typedArray instanceof Uint8Array) {
	            // Shortcut
	            var typedArrayByteLength = typedArray.byteLength;

	            // Extract bytes
	            var words = [];
	            for (var i = 0; i < typedArrayByteLength; i++) {
	                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
	            }

	            // Initialize this word array
	            superInit.call(this, words, typedArrayByteLength);
	        } else {
	            // Else call normal init
	            superInit.apply(this, arguments);
	        }
	    };

	    subInit.prototype = WordArray;
	}());


	return CryptoJS.lib.WordArray;

}));

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * UTF-16 BE encoding strategy.
	     */
	    var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
	        /**
	         * Converts a word array to a UTF-16 BE string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-16 BE string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var utf16Chars = [];
	            for (var i = 0; i < sigBytes; i += 2) {
	                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
	                utf16Chars.push(String.fromCharCode(codePoint));
	            }

	            return utf16Chars.join('');
	        },

	        /**
	         * Converts a UTF-16 BE string to a word array.
	         *
	         * @param {string} utf16Str The UTF-16 BE string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
	         */
	        parse: function (utf16Str) {
	            // Shortcut
	            var utf16StrLength = utf16Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < utf16StrLength; i++) {
	                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
	            }

	            return WordArray.create(words, utf16StrLength * 2);
	        }
	    };

	    /**
	     * UTF-16 LE encoding strategy.
	     */
	    C_enc.Utf16LE = {
	        /**
	         * Converts a word array to a UTF-16 LE string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-16 LE string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var utf16Chars = [];
	            for (var i = 0; i < sigBytes; i += 2) {
	                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
	                utf16Chars.push(String.fromCharCode(codePoint));
	            }

	            return utf16Chars.join('');
	        },

	        /**
	         * Converts a UTF-16 LE string to a word array.
	         *
	         * @param {string} utf16Str The UTF-16 LE string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
	         */
	        parse: function (utf16Str) {
	            // Shortcut
	            var utf16StrLength = utf16Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < utf16StrLength; i++) {
	                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
	            }

	            return WordArray.create(words, utf16StrLength * 2);
	        }
	    };

	    function swapEndian(word) {
	        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
	    }
	}());


	return CryptoJS.enc.Utf16;

}));

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(34));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha256"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var SHA256 = C_algo.SHA256;

	    /**
	     * SHA-224 hash algorithm.
	     */
	    var SHA224 = C_algo.SHA224 = SHA256.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
	                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
	            ]);
	        },

	        _doFinalize: function () {
	            var hash = SHA256._doFinalize.call(this);

	            hash.sigBytes -= 4;

	            return hash;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA224('message');
	     *     var hash = CryptoJS.SHA224(wordArray);
	     */
	    C.SHA224 = SHA256._createHelper(SHA224);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA224(message, key);
	     */
	    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
	}());


	return CryptoJS.SHA224;

}));

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(15), __webpack_require__(35));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core", "./sha512"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var X64WordArray = C_x64.WordArray;
	    var C_algo = C.algo;
	    var SHA512 = C_algo.SHA512;

	    /**
	     * SHA-384 hash algorithm.
	     */
	    var SHA384 = C_algo.SHA384 = SHA512.extend({
	        _doReset: function () {
	            this._hash = new X64WordArray.init([
	                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
	                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
	                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
	                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
	            ]);
	        },

	        _doFinalize: function () {
	            var hash = SHA512._doFinalize.call(this);

	            hash.sigBytes -= 16;

	            return hash;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA384('message');
	     *     var hash = CryptoJS.SHA384(wordArray);
	     */
	    C.SHA384 = SHA512._createHelper(SHA384);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA384(message, key);
	     */
	    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
	}());


	return CryptoJS.SHA384;

}));

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(15));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var C_algo = C.algo;

	    // Constants tables
	    var RHO_OFFSETS = [];
	    var PI_INDEXES  = [];
	    var ROUND_CONSTANTS = [];

	    // Compute Constants
	    (function () {
	        // Compute rho offset constants
	        var x = 1, y = 0;
	        for (var t = 0; t < 24; t++) {
	            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

	            var newX = y % 5;
	            var newY = (2 * x + 3 * y) % 5;
	            x = newX;
	            y = newY;
	        }

	        // Compute pi index constants
	        for (var x = 0; x < 5; x++) {
	            for (var y = 0; y < 5; y++) {
	                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
	            }
	        }

	        // Compute round constants
	        var LFSR = 0x01;
	        for (var i = 0; i < 24; i++) {
	            var roundConstantMsw = 0;
	            var roundConstantLsw = 0;

	            for (var j = 0; j < 7; j++) {
	                if (LFSR & 0x01) {
	                    var bitPosition = (1 << j) - 1;
	                    if (bitPosition < 32) {
	                        roundConstantLsw ^= 1 << bitPosition;
	                    } else /* if (bitPosition >= 32) */ {
	                        roundConstantMsw ^= 1 << (bitPosition - 32);
	                    }
	                }

	                // Compute next LFSR
	                if (LFSR & 0x80) {
	                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
	                    LFSR = (LFSR << 1) ^ 0x71;
	                } else {
	                    LFSR <<= 1;
	                }
	            }

	            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
	        }
	    }());

	    // Reusable objects for temporary values
	    var T = [];
	    (function () {
	        for (var i = 0; i < 25; i++) {
	            T[i] = X64Word.create();
	        }
	    }());

	    /**
	     * SHA-3 hash algorithm.
	     */
	    var SHA3 = C_algo.SHA3 = Hasher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} outputLength
	         *   The desired number of bits in the output hash.
	         *   Only values permitted are: 224, 256, 384, 512.
	         *   Default: 512
	         */
	        cfg: Hasher.cfg.extend({
	            outputLength: 512
	        }),

	        _doReset: function () {
	            var state = this._state = []
	            for (var i = 0; i < 25; i++) {
	                state[i] = new X64Word.init();
	            }

	            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var state = this._state;
	            var nBlockSizeLanes = this.blockSize / 2;

	            // Absorb
	            for (var i = 0; i < nBlockSizeLanes; i++) {
	                // Shortcuts
	                var M2i  = M[offset + 2 * i];
	                var M2i1 = M[offset + 2 * i + 1];

	                // Swap endian
	                M2i = (
	                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
	                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
	                );
	                M2i1 = (
	                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
	                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
	                );

	                // Absorb message into state
	                var lane = state[i];
	                lane.high ^= M2i1;
	                lane.low  ^= M2i;
	            }

	            // Rounds
	            for (var round = 0; round < 24; round++) {
	                // Theta
	                for (var x = 0; x < 5; x++) {
	                    // Mix column lanes
	                    var tMsw = 0, tLsw = 0;
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        tMsw ^= lane.high;
	                        tLsw ^= lane.low;
	                    }

	                    // Temporary values
	                    var Tx = T[x];
	                    Tx.high = tMsw;
	                    Tx.low  = tLsw;
	                }
	                for (var x = 0; x < 5; x++) {
	                    // Shortcuts
	                    var Tx4 = T[(x + 4) % 5];
	                    var Tx1 = T[(x + 1) % 5];
	                    var Tx1Msw = Tx1.high;
	                    var Tx1Lsw = Tx1.low;

	                    // Mix surrounding columns
	                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
	                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        lane.high ^= tMsw;
	                        lane.low  ^= tLsw;
	                    }
	                }

	                // Rho Pi
	                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
	                    // Shortcuts
	                    var lane = state[laneIndex];
	                    var laneMsw = lane.high;
	                    var laneLsw = lane.low;
	                    var rhoOffset = RHO_OFFSETS[laneIndex];

	                    // Rotate lanes
	                    if (rhoOffset < 32) {
	                        var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
	                        var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
	                    } else /* if (rhoOffset >= 32) */ {
	                        var tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
	                        var tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
	                    }

	                    // Transpose lanes
	                    var TPiLane = T[PI_INDEXES[laneIndex]];
	                    TPiLane.high = tMsw;
	                    TPiLane.low  = tLsw;
	                }

	                // Rho pi at x = y = 0
	                var T0 = T[0];
	                var state0 = state[0];
	                T0.high = state0.high;
	                T0.low  = state0.low;

	                // Chi
	                for (var x = 0; x < 5; x++) {
	                    for (var y = 0; y < 5; y++) {
	                        // Shortcuts
	                        var laneIndex = x + 5 * y;
	                        var lane = state[laneIndex];
	                        var TLane = T[laneIndex];
	                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
	                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

	                        // Mix rows
	                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
	                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
	                    }
	                }

	                // Iota
	                var lane = state[0];
	                var roundConstant = ROUND_CONSTANTS[round];
	                lane.high ^= roundConstant.high;
	                lane.low  ^= roundConstant.low;;
	            }
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;
	            var blockSizeBits = this.blockSize * 32;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
	            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var state = this._state;
	            var outputLengthBytes = this.cfg.outputLength / 8;
	            var outputLengthLanes = outputLengthBytes / 8;

	            // Squeeze
	            var hashWords = [];
	            for (var i = 0; i < outputLengthLanes; i++) {
	                // Shortcuts
	                var lane = state[i];
	                var laneMsw = lane.high;
	                var laneLsw = lane.low;

	                // Swap endian
	                laneMsw = (
	                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
	                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
	                );
	                laneLsw = (
	                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
	                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
	                );

	                // Squeeze state to retrieve hash
	                hashWords.push(laneLsw);
	                hashWords.push(laneMsw);
	            }

	            // Return final computed hash
	            return new WordArray.init(hashWords, outputLengthBytes);
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);

	            var state = clone._state = this._state.slice(0);
	            for (var i = 0; i < 25; i++) {
	                state[i] = state[i].clone();
	            }

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA3('message');
	     *     var hash = CryptoJS.SHA3(wordArray);
	     */
	    C.SHA3 = Hasher._createHelper(SHA3);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA3(message, key);
	     */
	    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
	}(Math));


	return CryptoJS.SHA3;

}));

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var _zl = WordArray.create([
	        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
	    var _zr = WordArray.create([
	        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
	    var _sl = WordArray.create([
	         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
	    var _sr = WordArray.create([
	        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

	    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
	    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

	    /**
	     * RIPEMD160 hash algorithm.
	     */
	    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
	        _doReset: function () {
	            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
	        },

	        _doProcessBlock: function (M, offset) {

	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                // Swap
	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }
	            // Shortcut
	            var H  = this._hash.words;
	            var hl = _hl.words;
	            var hr = _hr.words;
	            var zl = _zl.words;
	            var zr = _zr.words;
	            var sl = _sl.words;
	            var sr = _sr.words;

	            // Working variables
	            var al, bl, cl, dl, el;
	            var ar, br, cr, dr, er;

	            ar = al = H[0];
	            br = bl = H[1];
	            cr = cl = H[2];
	            dr = dl = H[3];
	            er = el = H[4];
	            // Computation
	            var t;
	            for (var i = 0; i < 80; i += 1) {
	                t = (al +  M[offset+zl[i]])|0;
	                if (i<16){
		            t +=  f1(bl,cl,dl) + hl[0];
	                } else if (i<32) {
		            t +=  f2(bl,cl,dl) + hl[1];
	                } else if (i<48) {
		            t +=  f3(bl,cl,dl) + hl[2];
	                } else if (i<64) {
		            t +=  f4(bl,cl,dl) + hl[3];
	                } else {// if (i<80) {
		            t +=  f5(bl,cl,dl) + hl[4];
	                }
	                t = t|0;
	                t =  rotl(t,sl[i]);
	                t = (t+el)|0;
	                al = el;
	                el = dl;
	                dl = rotl(cl, 10);
	                cl = bl;
	                bl = t;

	                t = (ar + M[offset+zr[i]])|0;
	                if (i<16){
		            t +=  f5(br,cr,dr) + hr[0];
	                } else if (i<32) {
		            t +=  f4(br,cr,dr) + hr[1];
	                } else if (i<48) {
		            t +=  f3(br,cr,dr) + hr[2];
	                } else if (i<64) {
		            t +=  f2(br,cr,dr) + hr[3];
	                } else {// if (i<80) {
		            t +=  f1(br,cr,dr) + hr[4];
	                }
	                t = t|0;
	                t =  rotl(t,sr[i]) ;
	                t = (t+er)|0;
	                ar = er;
	                er = dr;
	                dr = rotl(cr, 10);
	                cr = br;
	                br = t;
	            }
	            // Intermediate hash value
	            t    = (H[1] + cl + dr)|0;
	            H[1] = (H[2] + dl + er)|0;
	            H[2] = (H[3] + el + ar)|0;
	            H[3] = (H[4] + al + br)|0;
	            H[4] = (H[0] + bl + cr)|0;
	            H[0] =  t;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
	            );
	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 5; i++) {
	                // Shortcut
	                var H_i = H[i];

	                // Swap
	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });


	    function f1(x, y, z) {
	        return ((x) ^ (y) ^ (z));

	    }

	    function f2(x, y, z) {
	        return (((x)&(y)) | ((~x)&(z)));
	    }

	    function f3(x, y, z) {
	        return (((x) | (~(y))) ^ (z));
	    }

	    function f4(x, y, z) {
	        return (((x) & (z)) | ((y)&(~(z))));
	    }

	    function f5(x, y, z) {
	        return ((x) ^ ((y) |(~(z))));

	    }

	    function rotl(x,n) {
	        return (x<<n) | (x>>>(32-n));
	    }


	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.RIPEMD160('message');
	     *     var hash = CryptoJS.RIPEMD160(wordArray);
	     */
	    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
	     */
	    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
	}(Math));


	return CryptoJS.RIPEMD160;

}));

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(20), __webpack_require__(21));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha1", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var SHA1 = C_algo.SHA1;
	    var HMAC = C_algo.HMAC;

	    /**
	     * Password-Based Key Derivation Function 2 algorithm.
	     */
	    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	         * @property {Hasher} hasher The hasher to use. Default: SHA1
	         * @property {number} iterations The number of iterations to perform. Default: 1
	         */
	        cfg: Base.extend({
	            keySize: 128/32,
	            hasher: SHA1,
	            iterations: 1
	        }),

	        /**
	         * Initializes a newly created key derivation function.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	         *
	         * @example
	         *
	         *     var kdf = CryptoJS.algo.PBKDF2.create();
	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
	         */
	        init: function (cfg) {
	            this.cfg = this.cfg.extend(cfg);
	        },

	        /**
	         * Computes the Password-Based Key Derivation Function 2.
	         *
	         * @param {WordArray|string} password The password.
	         * @param {WordArray|string} salt A salt.
	         *
	         * @return {WordArray} The derived key.
	         *
	         * @example
	         *
	         *     var key = kdf.compute(password, salt);
	         */
	        compute: function (password, salt) {
	            // Shortcut
	            var cfg = this.cfg;

	            // Init HMAC
	            var hmac = HMAC.create(cfg.hasher, password);

	            // Initial values
	            var derivedKey = WordArray.create();
	            var blockIndex = WordArray.create([0x00000001]);

	            // Shortcuts
	            var derivedKeyWords = derivedKey.words;
	            var blockIndexWords = blockIndex.words;
	            var keySize = cfg.keySize;
	            var iterations = cfg.iterations;

	            // Generate key
	            while (derivedKeyWords.length < keySize) {
	                var block = hmac.update(salt).finalize(blockIndex);
	                hmac.reset();

	                // Shortcuts
	                var blockWords = block.words;
	                var blockWordsLength = blockWords.length;

	                // Iterations
	                var intermediate = block;
	                for (var i = 1; i < iterations; i++) {
	                    intermediate = hmac.finalize(intermediate);
	                    hmac.reset();

	                    // Shortcut
	                    var intermediateWords = intermediate.words;

	                    // XOR intermediate with block
	                    for (var j = 0; j < blockWordsLength; j++) {
	                        blockWords[j] ^= intermediateWords[j];
	                    }
	                }

	                derivedKey.concat(block);
	                blockIndexWords[0]++;
	            }
	            derivedKey.sigBytes = keySize * 4;

	            return derivedKey;
	        }
	    });

	    /**
	     * Computes the Password-Based Key Derivation Function 2.
	     *
	     * @param {WordArray|string} password The password.
	     * @param {WordArray|string} salt A salt.
	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
	     *
	     * @return {WordArray} The derived key.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var key = CryptoJS.PBKDF2(password, salt);
	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
	     */
	    C.PBKDF2 = function (password, salt, cfg) {
	        return PBKDF2.create(cfg).compute(password, salt);
	    };
	}());


	return CryptoJS.PBKDF2;

}));

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Cipher Feedback block mode.
	 */
	CryptoJS.mode.CFB = (function () {
	    var CFB = CryptoJS.lib.BlockCipherMode.extend();

	    CFB.Encryptor = CFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher;
	            var blockSize = cipher.blockSize;

	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

	            // Remember this block to use with next block
	            this._prevBlock = words.slice(offset, offset + blockSize);
	        }
	    });

	    CFB.Decryptor = CFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher;
	            var blockSize = cipher.blockSize;

	            // Remember this block to use with next block
	            var thisBlock = words.slice(offset, offset + blockSize);

	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

	            // This block becomes the previous block
	            this._prevBlock = thisBlock;
	        }
	    });

	    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
	        // Shortcut
	        var iv = this._iv;

	        // Generate keystream
	        if (iv) {
	            var keystream = iv.slice(0);

	            // Remove IV for subsequent blocks
	            this._iv = undefined;
	        } else {
	            var keystream = this._prevBlock;
	        }
	        cipher.encryptBlock(keystream, 0);

	        // Encrypt
	        for (var i = 0; i < blockSize; i++) {
	            words[offset + i] ^= keystream[i];
	        }
	    }

	    return CFB;
	}());


	return CryptoJS.mode.CFB;

}));

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Counter block mode.
	 */
	CryptoJS.mode.CTR = (function () {
	    var CTR = CryptoJS.lib.BlockCipherMode.extend();

	    var Encryptor = CTR.Encryptor = CTR.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var counter = this._counter;

	            // Generate keystream
	            if (iv) {
	                counter = this._counter = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }
	            var keystream = counter.slice(0);
	            cipher.encryptBlock(keystream, 0);

	            // Increment counter
	            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    CTR.Decryptor = Encryptor;

	    return CTR;
	}());


	return CryptoJS.mode.CTR;

}));

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/** @preserve
	 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
	 * derived from CryptoJS.mode.CTR
	 * Jan Hruby jhruby.web@gmail.com
	 */
	CryptoJS.mode.CTRGladman = (function () {
	    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

		function incWord(word)
		{
			if (((word >> 24) & 0xff) === 0xff) { //overflow
			var b1 = (word >> 16)&0xff;
			var b2 = (word >> 8)&0xff;
			var b3 = word & 0xff;

			if (b1 === 0xff) // overflow b1
			{
			b1 = 0;
			if (b2 === 0xff)
			{
				b2 = 0;
				if (b3 === 0xff)
				{
					b3 = 0;
				}
				else
				{
					++b3;
				}
			}
			else
			{
				++b2;
			}
			}
			else
			{
			++b1;
			}

			word = 0;
			word += (b1 << 16);
			word += (b2 << 8);
			word += b3;
			}
			else
			{
			word += (0x01 << 24);
			}
			return word;
		}

		function incCounter(counter)
		{
			if ((counter[0] = incWord(counter[0])) === 0)
			{
				// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
				counter[1] = incWord(counter[1]);
			}
			return counter;
		}

	    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var counter = this._counter;

	            // Generate keystream
	            if (iv) {
	                counter = this._counter = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }

				incCounter(counter);

				var keystream = counter.slice(0);
	            cipher.encryptBlock(keystream, 0);

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    CTRGladman.Decryptor = Encryptor;

	    return CTRGladman;
	}());




	return CryptoJS.mode.CTRGladman;

}));

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Output Feedback block mode.
	 */
	CryptoJS.mode.OFB = (function () {
	    var OFB = CryptoJS.lib.BlockCipherMode.extend();

	    var Encryptor = OFB.Encryptor = OFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var keystream = this._keystream;

	            // Generate keystream
	            if (iv) {
	                keystream = this._keystream = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }
	            cipher.encryptBlock(keystream, 0);

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    OFB.Decryptor = Encryptor;

	    return OFB;
	}());


	return CryptoJS.mode.OFB;

}));

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Electronic Codebook block mode.
	 */
	CryptoJS.mode.ECB = (function () {
	    var ECB = CryptoJS.lib.BlockCipherMode.extend();

	    ECB.Encryptor = ECB.extend({
	        processBlock: function (words, offset) {
	            this._cipher.encryptBlock(words, offset);
	        }
	    });

	    ECB.Decryptor = ECB.extend({
	        processBlock: function (words, offset) {
	            this._cipher.decryptBlock(words, offset);
	        }
	    });

	    return ECB;
	}());


	return CryptoJS.mode.ECB;

}));

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * ANSI X.923 padding strategy.
	 */
	CryptoJS.pad.AnsiX923 = {
	    pad: function (data, blockSize) {
	        // Shortcuts
	        var dataSigBytes = data.sigBytes;
	        var blockSizeBytes = blockSize * 4;

	        // Count padding bytes
	        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

	        // Compute last byte position
	        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

	        // Pad
	        data.clamp();
	        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
	        data.sigBytes += nPaddingBytes;
	    },

	    unpad: function (data) {
	        // Get number of padding bytes from last byte
	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	        // Remove padding
	        data.sigBytes -= nPaddingBytes;
	    }
	};


	return CryptoJS.pad.Ansix923;

}));

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * ISO 10126 padding strategy.
	 */
	CryptoJS.pad.Iso10126 = {
	    pad: function (data, blockSize) {
	        // Shortcut
	        var blockSizeBytes = blockSize * 4;

	        // Count padding bytes
	        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

	        // Pad
	        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
	             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
	    },

	    unpad: function (data) {
	        // Get number of padding bytes from last byte
	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	        // Remove padding
	        data.sigBytes -= nPaddingBytes;
	    }
	};


	return CryptoJS.pad.Iso10126;

}));

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * ISO/IEC 9797-1 Padding Method 2.
	 */
	CryptoJS.pad.Iso97971 = {
	    pad: function (data, blockSize) {
	        // Add 0x80 byte
	        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

	        // Zero pad the rest
	        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
	    },

	    unpad: function (data) {
	        // Remove zero padding
	        CryptoJS.pad.ZeroPadding.unpad(data);

	        // Remove one more byte -- the 0x80 byte
	        data.sigBytes--;
	    }
	};


	return CryptoJS.pad.Iso97971;

}));

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Zero padding strategy.
	 */
	CryptoJS.pad.ZeroPadding = {
	    pad: function (data, blockSize) {
	        // Shortcut
	        var blockSizeBytes = blockSize * 4;

	        // Pad
	        data.clamp();
	        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
	    },

	    unpad: function (data) {
	        // Shortcut
	        var dataWords = data.words;

	        // Unpad
	        var i = data.sigBytes - 1;
	        while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
	            i--;
	        }
	        data.sigBytes = i + 1;
	    }
	};


	return CryptoJS.pad.ZeroPadding;

}));

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * A noop padding strategy.
	 */
	CryptoJS.pad.NoPadding = {
	    pad: function () {
	    },

	    unpad: function () {
	    }
	};


	return CryptoJS.pad.NoPadding;

}));

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var CipherParams = C_lib.CipherParams;
	    var C_enc = C.enc;
	    var Hex = C_enc.Hex;
	    var C_format = C.format;

	    var HexFormatter = C_format.Hex = {
	        /**
	         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
	         *
	         * @param {CipherParams} cipherParams The cipher params object.
	         *
	         * @return {string} The hexadecimally encoded string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
	         */
	        stringify: function (cipherParams) {
	            return cipherParams.ciphertext.toString(Hex);
	        },

	        /**
	         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
	         *
	         * @param {string} input The hexadecimally encoded string.
	         *
	         * @return {CipherParams} The cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
	         */
	        parse: function (input) {
	            var ciphertext = Hex.parse(input);
	            return CipherParams.create({ ciphertext: ciphertext });
	        }
	    };
	}());


	return CryptoJS.format.Hex;

}));

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(8), __webpack_require__(9), __webpack_require__(7), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    // Lookup tables
	    var SBOX = [];
	    var INV_SBOX = [];
	    var SUB_MIX_0 = [];
	    var SUB_MIX_1 = [];
	    var SUB_MIX_2 = [];
	    var SUB_MIX_3 = [];
	    var INV_SUB_MIX_0 = [];
	    var INV_SUB_MIX_1 = [];
	    var INV_SUB_MIX_2 = [];
	    var INV_SUB_MIX_3 = [];

	    // Compute lookup tables
	    (function () {
	        // Compute double table
	        var d = [];
	        for (var i = 0; i < 256; i++) {
	            if (i < 128) {
	                d[i] = i << 1;
	            } else {
	                d[i] = (i << 1) ^ 0x11b;
	            }
	        }

	        // Walk GF(2^8)
	        var x = 0;
	        var xi = 0;
	        for (var i = 0; i < 256; i++) {
	            // Compute sbox
	            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
	            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
	            SBOX[x] = sx;
	            INV_SBOX[sx] = x;

	            // Compute multiplication
	            var x2 = d[x];
	            var x4 = d[x2];
	            var x8 = d[x4];

	            // Compute sub bytes, mix columns tables
	            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
	            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
	            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
	            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
	            SUB_MIX_3[x] = t;

	            // Compute inv sub bytes, inv mix columns tables
	            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
	            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
	            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
	            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
	            INV_SUB_MIX_3[sx] = t;

	            // Compute next counter
	            if (!x) {
	                x = xi = 1;
	            } else {
	                x = x2 ^ d[d[d[x8 ^ x2]]];
	                xi ^= d[d[xi]];
	            }
	        }
	    }());

	    // Precomputed Rcon lookup
	    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

	    /**
	     * AES block cipher algorithm.
	     */
	    var AES = C_algo.AES = BlockCipher.extend({
	        _doReset: function () {
	            // Skip reset of nRounds has been set before and key did not change
	            if (this._nRounds && this._keyPriorReset === this._key) {
	                return;
	            }

	            // Shortcuts
	            var key = this._keyPriorReset = this._key;
	            var keyWords = key.words;
	            var keySize = key.sigBytes / 4;

	            // Compute number of rounds
	            var nRounds = this._nRounds = keySize + 6;

	            // Compute number of key schedule rows
	            var ksRows = (nRounds + 1) * 4;

	            // Compute key schedule
	            var keySchedule = this._keySchedule = [];
	            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
	                if (ksRow < keySize) {
	                    keySchedule[ksRow] = keyWords[ksRow];
	                } else {
	                    var t = keySchedule[ksRow - 1];

	                    if (!(ksRow % keySize)) {
	                        // Rot word
	                        t = (t << 8) | (t >>> 24);

	                        // Sub word
	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

	                        // Mix Rcon
	                        t ^= RCON[(ksRow / keySize) | 0] << 24;
	                    } else if (keySize > 6 && ksRow % keySize == 4) {
	                        // Sub word
	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
	                    }

	                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
	                }
	            }

	            // Compute inv key schedule
	            var invKeySchedule = this._invKeySchedule = [];
	            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
	                var ksRow = ksRows - invKsRow;

	                if (invKsRow % 4) {
	                    var t = keySchedule[ksRow];
	                } else {
	                    var t = keySchedule[ksRow - 4];
	                }

	                if (invKsRow < 4 || ksRow <= 4) {
	                    invKeySchedule[invKsRow] = t;
	                } else {
	                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
	                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
	                }
	            }
	        },

	        encryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
	        },

	        decryptBlock: function (M, offset) {
	            // Swap 2nd and 4th rows
	            var t = M[offset + 1];
	            M[offset + 1] = M[offset + 3];
	            M[offset + 3] = t;

	            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

	            // Inv swap 2nd and 4th rows
	            var t = M[offset + 1];
	            M[offset + 1] = M[offset + 3];
	            M[offset + 3] = t;
	        },

	        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
	            // Shortcut
	            var nRounds = this._nRounds;

	            // Get input, add round key
	            var s0 = M[offset]     ^ keySchedule[0];
	            var s1 = M[offset + 1] ^ keySchedule[1];
	            var s2 = M[offset + 2] ^ keySchedule[2];
	            var s3 = M[offset + 3] ^ keySchedule[3];

	            // Key schedule row counter
	            var ksRow = 4;

	            // Rounds
	            for (var round = 1; round < nRounds; round++) {
	                // Shift rows, sub bytes, mix columns, add round key
	                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
	                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
	                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
	                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

	                // Update state
	                s0 = t0;
	                s1 = t1;
	                s2 = t2;
	                s3 = t3;
	            }

	            // Shift rows, sub bytes, add round key
	            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
	            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
	            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
	            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

	            // Set output
	            M[offset]     = t0;
	            M[offset + 1] = t1;
	            M[offset + 2] = t2;
	            M[offset + 3] = t3;
	        },

	        keySize: 256/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
	     */
	    C.AES = BlockCipher._createHelper(AES);
	}());


	return CryptoJS.AES;

}));

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(8), __webpack_require__(9), __webpack_require__(7), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    // Permuted Choice 1 constants
	    var PC1 = [
	        57, 49, 41, 33, 25, 17, 9,  1,
	        58, 50, 42, 34, 26, 18, 10, 2,
	        59, 51, 43, 35, 27, 19, 11, 3,
	        60, 52, 44, 36, 63, 55, 47, 39,
	        31, 23, 15, 7,  62, 54, 46, 38,
	        30, 22, 14, 6,  61, 53, 45, 37,
	        29, 21, 13, 5,  28, 20, 12, 4
	    ];

	    // Permuted Choice 2 constants
	    var PC2 = [
	        14, 17, 11, 24, 1,  5,
	        3,  28, 15, 6,  21, 10,
	        23, 19, 12, 4,  26, 8,
	        16, 7,  27, 20, 13, 2,
	        41, 52, 31, 37, 47, 55,
	        30, 40, 51, 45, 33, 48,
	        44, 49, 39, 56, 34, 53,
	        46, 42, 50, 36, 29, 32
	    ];

	    // Cumulative bit shift constants
	    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

	    // SBOXes and round permutation constants
	    var SBOX_P = [
	        {
	            0x0: 0x808200,
	            0x10000000: 0x8000,
	            0x20000000: 0x808002,
	            0x30000000: 0x2,
	            0x40000000: 0x200,
	            0x50000000: 0x808202,
	            0x60000000: 0x800202,
	            0x70000000: 0x800000,
	            0x80000000: 0x202,
	            0x90000000: 0x800200,
	            0xa0000000: 0x8200,
	            0xb0000000: 0x808000,
	            0xc0000000: 0x8002,
	            0xd0000000: 0x800002,
	            0xe0000000: 0x0,
	            0xf0000000: 0x8202,
	            0x8000000: 0x0,
	            0x18000000: 0x808202,
	            0x28000000: 0x8202,
	            0x38000000: 0x8000,
	            0x48000000: 0x808200,
	            0x58000000: 0x200,
	            0x68000000: 0x808002,
	            0x78000000: 0x2,
	            0x88000000: 0x800200,
	            0x98000000: 0x8200,
	            0xa8000000: 0x808000,
	            0xb8000000: 0x800202,
	            0xc8000000: 0x800002,
	            0xd8000000: 0x8002,
	            0xe8000000: 0x202,
	            0xf8000000: 0x800000,
	            0x1: 0x8000,
	            0x10000001: 0x2,
	            0x20000001: 0x808200,
	            0x30000001: 0x800000,
	            0x40000001: 0x808002,
	            0x50000001: 0x8200,
	            0x60000001: 0x200,
	            0x70000001: 0x800202,
	            0x80000001: 0x808202,
	            0x90000001: 0x808000,
	            0xa0000001: 0x800002,
	            0xb0000001: 0x8202,
	            0xc0000001: 0x202,
	            0xd0000001: 0x800200,
	            0xe0000001: 0x8002,
	            0xf0000001: 0x0,
	            0x8000001: 0x808202,
	            0x18000001: 0x808000,
	            0x28000001: 0x800000,
	            0x38000001: 0x200,
	            0x48000001: 0x8000,
	            0x58000001: 0x800002,
	            0x68000001: 0x2,
	            0x78000001: 0x8202,
	            0x88000001: 0x8002,
	            0x98000001: 0x800202,
	            0xa8000001: 0x202,
	            0xb8000001: 0x808200,
	            0xc8000001: 0x800200,
	            0xd8000001: 0x0,
	            0xe8000001: 0x8200,
	            0xf8000001: 0x808002
	        },
	        {
	            0x0: 0x40084010,
	            0x1000000: 0x4000,
	            0x2000000: 0x80000,
	            0x3000000: 0x40080010,
	            0x4000000: 0x40000010,
	            0x5000000: 0x40084000,
	            0x6000000: 0x40004000,
	            0x7000000: 0x10,
	            0x8000000: 0x84000,
	            0x9000000: 0x40004010,
	            0xa000000: 0x40000000,
	            0xb000000: 0x84010,
	            0xc000000: 0x80010,
	            0xd000000: 0x0,
	            0xe000000: 0x4010,
	            0xf000000: 0x40080000,
	            0x800000: 0x40004000,
	            0x1800000: 0x84010,
	            0x2800000: 0x10,
	            0x3800000: 0x40004010,
	            0x4800000: 0x40084010,
	            0x5800000: 0x40000000,
	            0x6800000: 0x80000,
	            0x7800000: 0x40080010,
	            0x8800000: 0x80010,
	            0x9800000: 0x0,
	            0xa800000: 0x4000,
	            0xb800000: 0x40080000,
	            0xc800000: 0x40000010,
	            0xd800000: 0x84000,
	            0xe800000: 0x40084000,
	            0xf800000: 0x4010,
	            0x10000000: 0x0,
	            0x11000000: 0x40080010,
	            0x12000000: 0x40004010,
	            0x13000000: 0x40084000,
	            0x14000000: 0x40080000,
	            0x15000000: 0x10,
	            0x16000000: 0x84010,
	            0x17000000: 0x4000,
	            0x18000000: 0x4010,
	            0x19000000: 0x80000,
	            0x1a000000: 0x80010,
	            0x1b000000: 0x40000010,
	            0x1c000000: 0x84000,
	            0x1d000000: 0x40004000,
	            0x1e000000: 0x40000000,
	            0x1f000000: 0x40084010,
	            0x10800000: 0x84010,
	            0x11800000: 0x80000,
	            0x12800000: 0x40080000,
	            0x13800000: 0x4000,
	            0x14800000: 0x40004000,
	            0x15800000: 0x40084010,
	            0x16800000: 0x10,
	            0x17800000: 0x40000000,
	            0x18800000: 0x40084000,
	            0x19800000: 0x40000010,
	            0x1a800000: 0x40004010,
	            0x1b800000: 0x80010,
	            0x1c800000: 0x0,
	            0x1d800000: 0x4010,
	            0x1e800000: 0x40080010,
	            0x1f800000: 0x84000
	        },
	        {
	            0x0: 0x104,
	            0x100000: 0x0,
	            0x200000: 0x4000100,
	            0x300000: 0x10104,
	            0x400000: 0x10004,
	            0x500000: 0x4000004,
	            0x600000: 0x4010104,
	            0x700000: 0x4010000,
	            0x800000: 0x4000000,
	            0x900000: 0x4010100,
	            0xa00000: 0x10100,
	            0xb00000: 0x4010004,
	            0xc00000: 0x4000104,
	            0xd00000: 0x10000,
	            0xe00000: 0x4,
	            0xf00000: 0x100,
	            0x80000: 0x4010100,
	            0x180000: 0x4010004,
	            0x280000: 0x0,
	            0x380000: 0x4000100,
	            0x480000: 0x4000004,
	            0x580000: 0x10000,
	            0x680000: 0x10004,
	            0x780000: 0x104,
	            0x880000: 0x4,
	            0x980000: 0x100,
	            0xa80000: 0x4010000,
	            0xb80000: 0x10104,
	            0xc80000: 0x10100,
	            0xd80000: 0x4000104,
	            0xe80000: 0x4010104,
	            0xf80000: 0x4000000,
	            0x1000000: 0x4010100,
	            0x1100000: 0x10004,
	            0x1200000: 0x10000,
	            0x1300000: 0x4000100,
	            0x1400000: 0x100,
	            0x1500000: 0x4010104,
	            0x1600000: 0x4000004,
	            0x1700000: 0x0,
	            0x1800000: 0x4000104,
	            0x1900000: 0x4000000,
	            0x1a00000: 0x4,
	            0x1b00000: 0x10100,
	            0x1c00000: 0x4010000,
	            0x1d00000: 0x104,
	            0x1e00000: 0x10104,
	            0x1f00000: 0x4010004,
	            0x1080000: 0x4000000,
	            0x1180000: 0x104,
	            0x1280000: 0x4010100,
	            0x1380000: 0x0,
	            0x1480000: 0x10004,
	            0x1580000: 0x4000100,
	            0x1680000: 0x100,
	            0x1780000: 0x4010004,
	            0x1880000: 0x10000,
	            0x1980000: 0x4010104,
	            0x1a80000: 0x10104,
	            0x1b80000: 0x4000004,
	            0x1c80000: 0x4000104,
	            0x1d80000: 0x4010000,
	            0x1e80000: 0x4,
	            0x1f80000: 0x10100
	        },
	        {
	            0x0: 0x80401000,
	            0x10000: 0x80001040,
	            0x20000: 0x401040,
	            0x30000: 0x80400000,
	            0x40000: 0x0,
	            0x50000: 0x401000,
	            0x60000: 0x80000040,
	            0x70000: 0x400040,
	            0x80000: 0x80000000,
	            0x90000: 0x400000,
	            0xa0000: 0x40,
	            0xb0000: 0x80001000,
	            0xc0000: 0x80400040,
	            0xd0000: 0x1040,
	            0xe0000: 0x1000,
	            0xf0000: 0x80401040,
	            0x8000: 0x80001040,
	            0x18000: 0x40,
	            0x28000: 0x80400040,
	            0x38000: 0x80001000,
	            0x48000: 0x401000,
	            0x58000: 0x80401040,
	            0x68000: 0x0,
	            0x78000: 0x80400000,
	            0x88000: 0x1000,
	            0x98000: 0x80401000,
	            0xa8000: 0x400000,
	            0xb8000: 0x1040,
	            0xc8000: 0x80000000,
	            0xd8000: 0x400040,
	            0xe8000: 0x401040,
	            0xf8000: 0x80000040,
	            0x100000: 0x400040,
	            0x110000: 0x401000,
	            0x120000: 0x80000040,
	            0x130000: 0x0,
	            0x140000: 0x1040,
	            0x150000: 0x80400040,
	            0x160000: 0x80401000,
	            0x170000: 0x80001040,
	            0x180000: 0x80401040,
	            0x190000: 0x80000000,
	            0x1a0000: 0x80400000,
	            0x1b0000: 0x401040,
	            0x1c0000: 0x80001000,
	            0x1d0000: 0x400000,
	            0x1e0000: 0x40,
	            0x1f0000: 0x1000,
	            0x108000: 0x80400000,
	            0x118000: 0x80401040,
	            0x128000: 0x0,
	            0x138000: 0x401000,
	            0x148000: 0x400040,
	            0x158000: 0x80000000,
	            0x168000: 0x80001040,
	            0x178000: 0x40,
	            0x188000: 0x80000040,
	            0x198000: 0x1000,
	            0x1a8000: 0x80001000,
	            0x1b8000: 0x80400040,
	            0x1c8000: 0x1040,
	            0x1d8000: 0x80401000,
	            0x1e8000: 0x400000,
	            0x1f8000: 0x401040
	        },
	        {
	            0x0: 0x80,
	            0x1000: 0x1040000,
	            0x2000: 0x40000,
	            0x3000: 0x20000000,
	            0x4000: 0x20040080,
	            0x5000: 0x1000080,
	            0x6000: 0x21000080,
	            0x7000: 0x40080,
	            0x8000: 0x1000000,
	            0x9000: 0x20040000,
	            0xa000: 0x20000080,
	            0xb000: 0x21040080,
	            0xc000: 0x21040000,
	            0xd000: 0x0,
	            0xe000: 0x1040080,
	            0xf000: 0x21000000,
	            0x800: 0x1040080,
	            0x1800: 0x21000080,
	            0x2800: 0x80,
	            0x3800: 0x1040000,
	            0x4800: 0x40000,
	            0x5800: 0x20040080,
	            0x6800: 0x21040000,
	            0x7800: 0x20000000,
	            0x8800: 0x20040000,
	            0x9800: 0x0,
	            0xa800: 0x21040080,
	            0xb800: 0x1000080,
	            0xc800: 0x20000080,
	            0xd800: 0x21000000,
	            0xe800: 0x1000000,
	            0xf800: 0x40080,
	            0x10000: 0x40000,
	            0x11000: 0x80,
	            0x12000: 0x20000000,
	            0x13000: 0x21000080,
	            0x14000: 0x1000080,
	            0x15000: 0x21040000,
	            0x16000: 0x20040080,
	            0x17000: 0x1000000,
	            0x18000: 0x21040080,
	            0x19000: 0x21000000,
	            0x1a000: 0x1040000,
	            0x1b000: 0x20040000,
	            0x1c000: 0x40080,
	            0x1d000: 0x20000080,
	            0x1e000: 0x0,
	            0x1f000: 0x1040080,
	            0x10800: 0x21000080,
	            0x11800: 0x1000000,
	            0x12800: 0x1040000,
	            0x13800: 0x20040080,
	            0x14800: 0x20000000,
	            0x15800: 0x1040080,
	            0x16800: 0x80,
	            0x17800: 0x21040000,
	            0x18800: 0x40080,
	            0x19800: 0x21040080,
	            0x1a800: 0x0,
	            0x1b800: 0x21000000,
	            0x1c800: 0x1000080,
	            0x1d800: 0x40000,
	            0x1e800: 0x20040000,
	            0x1f800: 0x20000080
	        },
	        {
	            0x0: 0x10000008,
	            0x100: 0x2000,
	            0x200: 0x10200000,
	            0x300: 0x10202008,
	            0x400: 0x10002000,
	            0x500: 0x200000,
	            0x600: 0x200008,
	            0x700: 0x10000000,
	            0x800: 0x0,
	            0x900: 0x10002008,
	            0xa00: 0x202000,
	            0xb00: 0x8,
	            0xc00: 0x10200008,
	            0xd00: 0x202008,
	            0xe00: 0x2008,
	            0xf00: 0x10202000,
	            0x80: 0x10200000,
	            0x180: 0x10202008,
	            0x280: 0x8,
	            0x380: 0x200000,
	            0x480: 0x202008,
	            0x580: 0x10000008,
	            0x680: 0x10002000,
	            0x780: 0x2008,
	            0x880: 0x200008,
	            0x980: 0x2000,
	            0xa80: 0x10002008,
	            0xb80: 0x10200008,
	            0xc80: 0x0,
	            0xd80: 0x10202000,
	            0xe80: 0x202000,
	            0xf80: 0x10000000,
	            0x1000: 0x10002000,
	            0x1100: 0x10200008,
	            0x1200: 0x10202008,
	            0x1300: 0x2008,
	            0x1400: 0x200000,
	            0x1500: 0x10000000,
	            0x1600: 0x10000008,
	            0x1700: 0x202000,
	            0x1800: 0x202008,
	            0x1900: 0x0,
	            0x1a00: 0x8,
	            0x1b00: 0x10200000,
	            0x1c00: 0x2000,
	            0x1d00: 0x10002008,
	            0x1e00: 0x10202000,
	            0x1f00: 0x200008,
	            0x1080: 0x8,
	            0x1180: 0x202000,
	            0x1280: 0x200000,
	            0x1380: 0x10000008,
	            0x1480: 0x10002000,
	            0x1580: 0x2008,
	            0x1680: 0x10202008,
	            0x1780: 0x10200000,
	            0x1880: 0x10202000,
	            0x1980: 0x10200008,
	            0x1a80: 0x2000,
	            0x1b80: 0x202008,
	            0x1c80: 0x200008,
	            0x1d80: 0x0,
	            0x1e80: 0x10000000,
	            0x1f80: 0x10002008
	        },
	        {
	            0x0: 0x100000,
	            0x10: 0x2000401,
	            0x20: 0x400,
	            0x30: 0x100401,
	            0x40: 0x2100401,
	            0x50: 0x0,
	            0x60: 0x1,
	            0x70: 0x2100001,
	            0x80: 0x2000400,
	            0x90: 0x100001,
	            0xa0: 0x2000001,
	            0xb0: 0x2100400,
	            0xc0: 0x2100000,
	            0xd0: 0x401,
	            0xe0: 0x100400,
	            0xf0: 0x2000000,
	            0x8: 0x2100001,
	            0x18: 0x0,
	            0x28: 0x2000401,
	            0x38: 0x2100400,
	            0x48: 0x100000,
	            0x58: 0x2000001,
	            0x68: 0x2000000,
	            0x78: 0x401,
	            0x88: 0x100401,
	            0x98: 0x2000400,
	            0xa8: 0x2100000,
	            0xb8: 0x100001,
	            0xc8: 0x400,
	            0xd8: 0x2100401,
	            0xe8: 0x1,
	            0xf8: 0x100400,
	            0x100: 0x2000000,
	            0x110: 0x100000,
	            0x120: 0x2000401,
	            0x130: 0x2100001,
	            0x140: 0x100001,
	            0x150: 0x2000400,
	            0x160: 0x2100400,
	            0x170: 0x100401,
	            0x180: 0x401,
	            0x190: 0x2100401,
	            0x1a0: 0x100400,
	            0x1b0: 0x1,
	            0x1c0: 0x0,
	            0x1d0: 0x2100000,
	            0x1e0: 0x2000001,
	            0x1f0: 0x400,
	            0x108: 0x100400,
	            0x118: 0x2000401,
	            0x128: 0x2100001,
	            0x138: 0x1,
	            0x148: 0x2000000,
	            0x158: 0x100000,
	            0x168: 0x401,
	            0x178: 0x2100400,
	            0x188: 0x2000001,
	            0x198: 0x2100000,
	            0x1a8: 0x0,
	            0x1b8: 0x2100401,
	            0x1c8: 0x100401,
	            0x1d8: 0x400,
	            0x1e8: 0x2000400,
	            0x1f8: 0x100001
	        },
	        {
	            0x0: 0x8000820,
	            0x1: 0x20000,
	            0x2: 0x8000000,
	            0x3: 0x20,
	            0x4: 0x20020,
	            0x5: 0x8020820,
	            0x6: 0x8020800,
	            0x7: 0x800,
	            0x8: 0x8020000,
	            0x9: 0x8000800,
	            0xa: 0x20800,
	            0xb: 0x8020020,
	            0xc: 0x820,
	            0xd: 0x0,
	            0xe: 0x8000020,
	            0xf: 0x20820,
	            0x80000000: 0x800,
	            0x80000001: 0x8020820,
	            0x80000002: 0x8000820,
	            0x80000003: 0x8000000,
	            0x80000004: 0x8020000,
	            0x80000005: 0x20800,
	            0x80000006: 0x20820,
	            0x80000007: 0x20,
	            0x80000008: 0x8000020,
	            0x80000009: 0x820,
	            0x8000000a: 0x20020,
	            0x8000000b: 0x8020800,
	            0x8000000c: 0x0,
	            0x8000000d: 0x8020020,
	            0x8000000e: 0x8000800,
	            0x8000000f: 0x20000,
	            0x10: 0x20820,
	            0x11: 0x8020800,
	            0x12: 0x20,
	            0x13: 0x800,
	            0x14: 0x8000800,
	            0x15: 0x8000020,
	            0x16: 0x8020020,
	            0x17: 0x20000,
	            0x18: 0x0,
	            0x19: 0x20020,
	            0x1a: 0x8020000,
	            0x1b: 0x8000820,
	            0x1c: 0x8020820,
	            0x1d: 0x20800,
	            0x1e: 0x820,
	            0x1f: 0x8000000,
	            0x80000010: 0x20000,
	            0x80000011: 0x800,
	            0x80000012: 0x8020020,
	            0x80000013: 0x20820,
	            0x80000014: 0x20,
	            0x80000015: 0x8020000,
	            0x80000016: 0x8000000,
	            0x80000017: 0x8000820,
	            0x80000018: 0x8020820,
	            0x80000019: 0x8000020,
	            0x8000001a: 0x8000800,
	            0x8000001b: 0x0,
	            0x8000001c: 0x20800,
	            0x8000001d: 0x820,
	            0x8000001e: 0x20020,
	            0x8000001f: 0x8020800
	        }
	    ];

	    // Masks that select the SBOX input
	    var SBOX_MASK = [
	        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
	        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
	    ];

	    /**
	     * DES block cipher algorithm.
	     */
	    var DES = C_algo.DES = BlockCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;

	            // Select 56 bits according to PC1
	            var keyBits = [];
	            for (var i = 0; i < 56; i++) {
	                var keyBitPos = PC1[i] - 1;
	                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
	            }

	            // Assemble 16 subkeys
	            var subKeys = this._subKeys = [];
	            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
	                // Create subkey
	                var subKey = subKeys[nSubKey] = [];

	                // Shortcut
	                var bitShift = BIT_SHIFTS[nSubKey];

	                // Select 48 bits according to PC2
	                for (var i = 0; i < 24; i++) {
	                    // Select from the left 28 key bits
	                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

	                    // Select from the right 28 key bits
	                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
	                }

	                // Since each subkey is applied to an expanded 32-bit input,
	                // the subkey can be broken into 8 values scaled to 32-bits,
	                // which allows the key to be used without expansion
	                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
	                for (var i = 1; i < 7; i++) {
	                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
	                }
	                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
	            }

	            // Compute inverse subkeys
	            var invSubKeys = this._invSubKeys = [];
	            for (var i = 0; i < 16; i++) {
	                invSubKeys[i] = subKeys[15 - i];
	            }
	        },

	        encryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._subKeys);
	        },

	        decryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._invSubKeys);
	        },

	        _doCryptBlock: function (M, offset, subKeys) {
	            // Get input
	            this._lBlock = M[offset];
	            this._rBlock = M[offset + 1];

	            // Initial permutation
	            exchangeLR.call(this, 4,  0x0f0f0f0f);
	            exchangeLR.call(this, 16, 0x0000ffff);
	            exchangeRL.call(this, 2,  0x33333333);
	            exchangeRL.call(this, 8,  0x00ff00ff);
	            exchangeLR.call(this, 1,  0x55555555);

	            // Rounds
	            for (var round = 0; round < 16; round++) {
	                // Shortcuts
	                var subKey = subKeys[round];
	                var lBlock = this._lBlock;
	                var rBlock = this._rBlock;

	                // Feistel function
	                var f = 0;
	                for (var i = 0; i < 8; i++) {
	                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
	                }
	                this._lBlock = rBlock;
	                this._rBlock = lBlock ^ f;
	            }

	            // Undo swap from last round
	            var t = this._lBlock;
	            this._lBlock = this._rBlock;
	            this._rBlock = t;

	            // Final permutation
	            exchangeLR.call(this, 1,  0x55555555);
	            exchangeRL.call(this, 8,  0x00ff00ff);
	            exchangeRL.call(this, 2,  0x33333333);
	            exchangeLR.call(this, 16, 0x0000ffff);
	            exchangeLR.call(this, 4,  0x0f0f0f0f);

	            // Set output
	            M[offset] = this._lBlock;
	            M[offset + 1] = this._rBlock;
	        },

	        keySize: 64/32,

	        ivSize: 64/32,

	        blockSize: 64/32
	    });

	    // Swap bits across the left and right words
	    function exchangeLR(offset, mask) {
	        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
	        this._rBlock ^= t;
	        this._lBlock ^= t << offset;
	    }

	    function exchangeRL(offset, mask) {
	        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
	        this._lBlock ^= t;
	        this._rBlock ^= t << offset;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
	     */
	    C.DES = BlockCipher._createHelper(DES);

	    /**
	     * Triple-DES block cipher algorithm.
	     */
	    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;

	            // Create DES instances
	            this._des1 = DES.createEncryptor(WordArray.create(keyWords.slice(0, 2)));
	            this._des2 = DES.createEncryptor(WordArray.create(keyWords.slice(2, 4)));
	            this._des3 = DES.createEncryptor(WordArray.create(keyWords.slice(4, 6)));
	        },

	        encryptBlock: function (M, offset) {
	            this._des1.encryptBlock(M, offset);
	            this._des2.decryptBlock(M, offset);
	            this._des3.encryptBlock(M, offset);
	        },

	        decryptBlock: function (M, offset) {
	            this._des3.decryptBlock(M, offset);
	            this._des2.encryptBlock(M, offset);
	            this._des1.decryptBlock(M, offset);
	        },

	        keySize: 192/32,

	        ivSize: 64/32,

	        blockSize: 64/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
	     */
	    C.TripleDES = BlockCipher._createHelper(TripleDES);
	}());


	return CryptoJS.TripleDES;

}));

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(8), __webpack_require__(9), __webpack_require__(7), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    /**
	     * RC4 stream cipher algorithm.
	     */
	    var RC4 = C_algo.RC4 = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;
	            var keySigBytes = key.sigBytes;

	            // Init sbox
	            var S = this._S = [];
	            for (var i = 0; i < 256; i++) {
	                S[i] = i;
	            }

	            // Key setup
	            for (var i = 0, j = 0; i < 256; i++) {
	                var keyByteIndex = i % keySigBytes;
	                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

	                j = (j + S[i] + keyByte) % 256;

	                // Swap
	                var t = S[i];
	                S[i] = S[j];
	                S[j] = t;
	            }

	            // Counters
	            this._i = this._j = 0;
	        },

	        _doProcessBlock: function (M, offset) {
	            M[offset] ^= generateKeystreamWord.call(this);
	        },

	        keySize: 256/32,

	        ivSize: 0
	    });

	    function generateKeystreamWord() {
	        // Shortcuts
	        var S = this._S;
	        var i = this._i;
	        var j = this._j;

	        // Generate keystream word
	        var keystreamWord = 0;
	        for (var n = 0; n < 4; n++) {
	            i = (i + 1) % 256;
	            j = (j + S[i]) % 256;

	            // Swap
	            var t = S[i];
	            S[i] = S[j];
	            S[j] = t;

	            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
	        }

	        // Update counters
	        this._i = i;
	        this._j = j;

	        return keystreamWord;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
	     */
	    C.RC4 = StreamCipher._createHelper(RC4);

	    /**
	     * Modified RC4 stream cipher algorithm.
	     */
	    var RC4Drop = C_algo.RC4Drop = RC4.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} drop The number of keystream words to drop. Default 192
	         */
	        cfg: RC4.cfg.extend({
	            drop: 192
	        }),

	        _doReset: function () {
	            RC4._doReset.call(this);

	            // Drop
	            for (var i = this.cfg.drop; i > 0; i--) {
	                generateKeystreamWord.call(this);
	            }
	        }
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
	     */
	    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
	}());


	return CryptoJS.RC4;

}));

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(8), __webpack_require__(9), __webpack_require__(7), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    // Reusable objects
	    var S  = [];
	    var C_ = [];
	    var G  = [];

	    /**
	     * Rabbit stream cipher algorithm
	     */
	    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var K = this._key.words;
	            var iv = this.cfg.iv;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
	                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
	            }

	            // Generate initial state values
	            var X = this._X = [
	                K[0], (K[3] << 16) | (K[2] >>> 16),
	                K[1], (K[0] << 16) | (K[3] >>> 16),
	                K[2], (K[1] << 16) | (K[0] >>> 16),
	                K[3], (K[2] << 16) | (K[1] >>> 16)
	            ];

	            // Generate initial counter values
	            var C = this._C = [
	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
	            ];

	            // Carry bit
	            this._b = 0;

	            // Iterate the system four times
	            for (var i = 0; i < 4; i++) {
	                nextState.call(this);
	            }

	            // Modify the counters
	            for (var i = 0; i < 8; i++) {
	                C[i] ^= X[(i + 4) & 7];
	            }

	            // IV setup
	            if (iv) {
	                // Shortcuts
	                var IV = iv.words;
	                var IV_0 = IV[0];
	                var IV_1 = IV[1];

	                // Generate four subvectors
	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

	                // Modify counter values
	                C[0] ^= i0;
	                C[1] ^= i1;
	                C[2] ^= i2;
	                C[3] ^= i3;
	                C[4] ^= i0;
	                C[5] ^= i1;
	                C[6] ^= i2;
	                C[7] ^= i3;

	                // Iterate the system four times
	                for (var i = 0; i < 4; i++) {
	                    nextState.call(this);
	                }
	            }
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var X = this._X;

	            // Iterate the system
	            nextState.call(this);

	            // Generate four keystream words
	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

	            for (var i = 0; i < 4; i++) {
	                // Swap endian
	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

	                // Encrypt
	                M[offset + i] ^= S[i];
	            }
	        },

	        blockSize: 128/32,

	        ivSize: 64/32
	    });

	    function nextState() {
	        // Shortcuts
	        var X = this._X;
	        var C = this._C;

	        // Save old counter values
	        for (var i = 0; i < 8; i++) {
	            C_[i] = C[i];
	        }

	        // Calculate new counter values
	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

	        // Calculate the g-values
	        for (var i = 0; i < 8; i++) {
	            var gx = X[i] + C[i];

	            // Construct high and low argument for squaring
	            var ga = gx & 0xffff;
	            var gb = gx >>> 16;

	            // Calculate high and low result of squaring
	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

	            // High XOR low
	            G[i] = gh ^ gl;
	        }

	        // Calculate new state values
	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
	     */
	    C.Rabbit = StreamCipher._createHelper(Rabbit);
	}());


	return CryptoJS.Rabbit;

}));

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(0), __webpack_require__(8), __webpack_require__(9), __webpack_require__(7), __webpack_require__(1));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    // Reusable objects
	    var S  = [];
	    var C_ = [];
	    var G  = [];

	    /**
	     * Rabbit stream cipher algorithm.
	     *
	     * This is a legacy version that neglected to convert the key to little-endian.
	     * This error doesn't affect the cipher's security,
	     * but it does affect its compatibility with other implementations.
	     */
	    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var K = this._key.words;
	            var iv = this.cfg.iv;

	            // Generate initial state values
	            var X = this._X = [
	                K[0], (K[3] << 16) | (K[2] >>> 16),
	                K[1], (K[0] << 16) | (K[3] >>> 16),
	                K[2], (K[1] << 16) | (K[0] >>> 16),
	                K[3], (K[2] << 16) | (K[1] >>> 16)
	            ];

	            // Generate initial counter values
	            var C = this._C = [
	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
	            ];

	            // Carry bit
	            this._b = 0;

	            // Iterate the system four times
	            for (var i = 0; i < 4; i++) {
	                nextState.call(this);
	            }

	            // Modify the counters
	            for (var i = 0; i < 8; i++) {
	                C[i] ^= X[(i + 4) & 7];
	            }

	            // IV setup
	            if (iv) {
	                // Shortcuts
	                var IV = iv.words;
	                var IV_0 = IV[0];
	                var IV_1 = IV[1];

	                // Generate four subvectors
	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

	                // Modify counter values
	                C[0] ^= i0;
	                C[1] ^= i1;
	                C[2] ^= i2;
	                C[3] ^= i3;
	                C[4] ^= i0;
	                C[5] ^= i1;
	                C[6] ^= i2;
	                C[7] ^= i3;

	                // Iterate the system four times
	                for (var i = 0; i < 4; i++) {
	                    nextState.call(this);
	                }
	            }
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var X = this._X;

	            // Iterate the system
	            nextState.call(this);

	            // Generate four keystream words
	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

	            for (var i = 0; i < 4; i++) {
	                // Swap endian
	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

	                // Encrypt
	                M[offset + i] ^= S[i];
	            }
	        },

	        blockSize: 128/32,

	        ivSize: 64/32
	    });

	    function nextState() {
	        // Shortcuts
	        var X = this._X;
	        var C = this._C;

	        // Save old counter values
	        for (var i = 0; i < 8; i++) {
	            C_[i] = C[i];
	        }

	        // Calculate new counter values
	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

	        // Calculate the g-values
	        for (var i = 0; i < 8; i++) {
	            var gx = X[i] + C[i];

	            // Construct high and low argument for squaring
	            var ga = gx & 0xffff;
	            var gb = gx >>> 16;

	            // Calculate high and low result of squaring
	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

	            // High XOR low
	            G[i] = gh ^ gl;
	        }

	        // Calculate new state values
	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
	     */
	    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
	}());


	return CryptoJS.RabbitLegacy;

}));

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var basex = __webpack_require__(38)
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

module.exports = basex(ALPHABET)


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(17)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(18).createHash


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(globals){
'use strict'

//*** UMD BEGIN
if (true) { //require.js / AMD
  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
    return secureRandom
  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
} else if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = secureRandom
} else { //script / browser
  globals.secureRandom = secureRandom
}
//*** UMD END

//options.type is the only valid option
function secureRandom(count, options) {
  options = options || {type: 'Array'}
  //we check for process.pid to prevent browserify from tricking us
  if (typeof process != 'undefined' && typeof process.pid == 'number') {
    return nodeRandom(count, options)
  } else {
    var crypto = window.crypto || window.msCrypto
    if (!crypto) throw new Error("Your browser does not support window.crypto.")
    return browserRandom(count, options)
  }
}

function nodeRandom(count, options) {
  var crypto = __webpack_require__(18)
  var buf = crypto.randomBytes(count)

  switch (options.type) {
    case 'Array':
      return [].slice.call(buf)
    case 'Buffer':
      return buf
    case 'Uint8Array':
      var arr = new Uint8Array(count)
      for (var i = 0; i < count; ++i) { arr[i] = buf.readUInt8(i) }
      return arr
    default:
      throw new Error(options.type + " is unsupported.")
  }
}

function browserRandom(count, options) {
  var nativeArr = new Uint8Array(count)
  var crypto = window.crypto || window.msCrypto
  crypto.getRandomValues(nativeArr)

  switch (options.type) {
    case 'Array':
      return [].slice.call(nativeArr)
    case 'Buffer':
      try { var b = new Buffer(1) } catch(e) { throw new Error('Buffer not supported in this environment. Use Node.js or Browserify for browser support.')}
      return new Buffer(nativeArr)
    case 'Uint8Array':
      return nativeArr
    default:
      throw new Error(options.type + " is unsupported.")
  }
}

secureRandom.randomArray = function(byteCount) {
  return secureRandom(byteCount, {type: 'Array'})
}

secureRandom.randomUint8Array = function(byteCount) {
  return secureRandom(byteCount, {type: 'Uint8Array'})
}

secureRandom.randomBuffer = function(byteCount) {
  return secureRandom(byteCount, {type: 'Buffer'})
}


}(this);


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrypt_wif = exports.encrypt_wif = exports.generateEncryptedWif = undefined;

var _bs58check = __webpack_require__(37);

var _bs58check2 = _interopRequireDefault(_bs58check);

var _wif = __webpack_require__(36);

var _wif2 = _interopRequireDefault(_wif);

var _cryptoJs = __webpack_require__(33);

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _jsScrypt = __webpack_require__(110);

var _jsScrypt2 = _interopRequireDefault(_jsScrypt);

var _wallet = __webpack_require__(16);

var _utils = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NEP_HEADER = "0142"; // this code draws heavily from functions written originally by snowypowers

var NEP_FLAG = "e0";

// specified by nep2, same as bip38
var scrypt_options = {
  cost: 16384,
  blockSize: 8,
  parallel: 8,
  size: 64
};

// generate new encrypted wif given passphrase
// (returns a promise)
var generateEncryptedWif = exports.generateEncryptedWif = function generateEncryptedWif(passphrase) {
  var newPrivateKey = (0, _wallet.generatePrivateKey)();
  var newWif = (0, _wallet.getWIFFromPrivateKey)(newPrivateKey);
  return encrypt_wif(newWif, passphrase).then(function (encWif) {
    var loadAccount = (0, _wallet.getAccountsFromWIFKey)(newWif);
    return {
      wif: newWif,
      address: loadAccount[0].address,
      encryptedWif: encWif,
      passphrase: passphrase
    };
  });
};

// encrypt wif using keyphrase under nep2 standard
// returns encrypted wif
var encrypt = function encrypt(wifKey, keyphrase, progressCallback) {
  var address = (0, _wallet.getAccountsFromWIFKey)(wifKey)[0].address;
  var privateKey = (0, _wallet.getAccountsFromWIFKey)(wifKey)[0].privatekey;
  // SHA Salt (use the first 4 bytes)
  var addressHash = (0, _cryptoJs.SHA256)((0, _cryptoJs.SHA256)(_cryptoJs.enc.Latin1.parse(address))).toString().slice(0, 8);
  // Scrypt
  var derived = _jsScrypt2.default.hashSync(Buffer.from(keyphrase, 'utf8'), Buffer.from(addressHash, 'hex'), scrypt_options, progressCallback).toString('hex');
  var derived1 = derived.slice(0, 64);
  var derived2 = derived.slice(64);
  //AES Encrypt
  var xor = (0, _utils.hexXor)(privateKey, derived1);
  var encrypted = _cryptoJs.AES.encrypt(_cryptoJs.enc.Hex.parse(xor), _cryptoJs.enc.Hex.parse(derived2), { mode: _cryptoJs2.default.mode.ECB, padding: _cryptoJs2.default.pad.NoPadding });
  //Construct
  var assembled = NEP_HEADER + NEP_FLAG + addressHash + encrypted.ciphertext.toString();
  return _bs58check2.default.encode(Buffer.from(assembled, 'hex'));
};

// decrypt encrypted wif using keyphrase under nep2 standard
// returns wif
var decrypt = function decrypt(encryptedKey, keyphrase, progressCallback) {
  var assembled = (0, _utils.ab2hexstring)(_bs58check2.default.decode(encryptedKey));
  var addressHash = assembled.substr(6, 8);
  var encrypted = assembled.substr(-64);
  var derived = _jsScrypt2.default.hashSync(Buffer.from(keyphrase, 'utf8'), Buffer.from(addressHash, 'hex'), scrypt_options, progressCallback).toString('hex');
  var derived1 = derived.slice(0, 64);
  var derived2 = derived.slice(64);
  var ciphertext = { ciphertext: _cryptoJs.enc.Hex.parse(encrypted), salt: "" };
  var decrypted = _cryptoJs.AES.decrypt(ciphertext, _cryptoJs.enc.Hex.parse(derived2), { mode: _cryptoJs2.default.mode.ECB, padding: _cryptoJs2.default.pad.NoPadding });
  var privateKey = (0, _utils.hexXor)(decrypted.toString(), derived1);
  var address = (0, _wallet.getAccountsFromPrivateKey)(privateKey)[0].address;
  var newAddressHash = (0, _cryptoJs.SHA256)((0, _cryptoJs.SHA256)(_cryptoJs.enc.Latin1.parse(address))).toString().slice(0, 8);
  if (addressHash !== newAddressHash) throw new Error("Wrong Password!");
  return (0, _wallet.getWIFFromPrivateKey)(Buffer.from(privateKey, 'hex'));
};

// helpers to wrap synchronous functions in promises

var encrypt_wif = exports.encrypt_wif = function encrypt_wif(wif, passphrase) {
  return new Promise(function (success, reject) {
    success(encrypt(wif, passphrase));
  });
};

var decrypt_wif = exports.decrypt_wif = function decrypt_wif(encrypted_wif, passphrase) {
  return new Promise(function (success, reject) {
    success(decrypt(encrypted_wif, passphrase));
  });
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	hash: __webpack_require__(111),
	hashSync: __webpack_require__(115)
}

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var argScrubber = __webpack_require__(40);
var fork = __webpack_require__(112).fork;
var gp = __webpack_require__(113);
var cpu_count = __webpack_require__(114).cpus().length;

//let there be up to cpu_count - 1 workers
var max_workers = cpu_count - 1;
var pool = pool = new gp.Pool({
	name: 'scrypt-worker'
	,create: function(callback) {
		var worker = fork(__dirname + '/scrypt-async-worker.js');
		worker.controlledExit = false;
		worker.on('exit',function(){
			if (!worker.controlledExit) {
				setImmediate(pool.destroy.bind(pool,worker));
			}
		});
		callback(worker);
	}
	,destroy: function(worker) {
		//console.log('destroy-worker')
		try {
			//disconnect RPC channel
			worker.controlledExit = true;
			worker.disconnect(); 
		} catch(err) {}
	}
	,max: Math.max(2, cpu_count-1)
	,min:0
	,idleTimeoutMillis: 15000 //15 seconds
	,log:false
});

module.exports = function scryptAsync(password, salt, options, callback) {
	var args = argScrubber.apply(null,arguments);
	var cb = args.callback || function(){}; //local ref to callback
	
	delete args.callback; //don't pass to child
	args.password = args.password.toString('base64');
	args.salt = args.salt.toString('base64');

	var start = new Date();

	pool.acquire(function(err,worker){
		//console.log("got worker");

		if (err) {
			pool.release(worker);
			return cb(err);
		}

		worker.once('message', function(response) {
			var end = new Date();
			//console.log("processed", end - start);
			//console.log("got message from worker: " + response);

			pool.release(worker); //done with child process
			if (response.error) cb(response.error); //return error
			cb(null, new Buffer(response.data, 'base64')); //return data
		});

		worker.send(args);
	});
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 112 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 113 */
/***/ (function(module, exports) {

var PriorityQueue = function(size) {
  var me = {}, slots, i, total = null;

  // initialize arrays to hold queue elements
  size = Math.max(+size | 0, 1);
  slots = [];
  for (i = 0; i < size; i += 1) {
    slots.push([]);
  }

  //  Public methods
  me.size = function () {
    var i;
    if (total === null) {
      total = 0;
      for (i = 0; i < size; i += 1) {
        total += slots[i].length;
      }
    }
    return total;
  };

  me.enqueue = function (obj, priority) {
    var priorityOrig;

    // Convert to integer with a default value of 0.
    priority = priority && + priority | 0 || 0;

    // Clear cache for total.
    total = null;
    if (priority) {
      priorityOrig = priority;
      if (priority < 0 || priority >= size) {
        priority = (size - 1);
        // put obj at the end of the line
        console.error("invalid priority: " + priorityOrig + " must be between 0 and " + priority);
      }
    }

    slots[priority].push(obj);
  };

  me.dequeue = function (callback) {
    var obj = null, i, sl = slots.length;

    // Clear cache for total.
    total = null;
    for (i = 0; i < sl; i += 1) {
      if (slots[i].length) {
        obj = slots[i].shift();
        break;
      }
    }
    return obj;
  };

  return me;
};

/**
 * Generate an Object pool with a specified `factory`.
 *
 * @param {Object} factory
 *   Factory to be used for generating and destorying the items.
 * @param {String} factory.name
 *   Name of the factory. Serves only logging purposes.
 * @param {Function} factory.create
 *   Should create the item to be acquired,
 *   and call it's first callback argument with the generated item as it's argument.
 * @param {Function} factory.destroy
 *   Should gently close any resources that the item is using.
 *   Called before the items is destroyed.
 * @param {Function} factory.validate
 *   Should return true if connection is still valid and false
 *   If it should be removed from pool. Called before item is
 *   acquired from pool.
 * @param {Number} factory.max
 *   Maximum number of items that can exist at the same time.  Default: 1.
 *   Any further acquire requests will be pushed to the waiting list.
 * @param {Number} factory.min
 *   Minimum number of items in pool (including in-use). Default: 0.
 *   When the pool is created, or a resource destroyed, this minimum will
 *   be checked. If the pool resource count is below the minimum, a new
 *   resource will be created and added to the pool.
 * @param {Number} factory.idleTimeoutMillis
 *   Delay in milliseconds after the idle items in the pool will be destroyed.
 *   And idle item is that is not acquired yet. Waiting items doesn't count here.
 * @param {Number} factory.reapIntervalMillis
 *   Cleanup is scheduled in every `factory.reapIntervalMillis` milliseconds.
 * @param {Boolean|Function} factory.log
 *   Whether the pool should log activity. If function is specified,
 *   that will be used instead. The function expects the arguments msg, loglevel
 * @param {Number} factory.priorityRange
 *   The range from 1 to be treated as a valid priority
 * @param {RefreshIdle} factory.refreshIdle
 *   Should idle resources be destroyed and recreated every idleTimeoutMillis? Default: true.
 * @returns {Object} An Object pool that works with the supplied `factory`.
 */
exports.Pool = function (factory) {
  var me = {},

      idleTimeoutMillis = factory.idleTimeoutMillis || 30000,
      reapInterval = factory.reapIntervalMillis || 1000,
      refreshIdle = ('refreshIdle' in factory) ? factory.refreshIdle : true,
      availableObjects = [],
      waitingClients = new PriorityQueue(factory.priorityRange || 1),
      count = 0,
      removeIdleScheduled = false,
      removeIdleTimer = null,
      draining = false,

      // Prepare a logger function.
      log = factory.log ?
        (function (str, level) {
           if (typeof factory.log === 'function') {
             factory.log(str, level);
           }
           else {
             console.log(level.toUpperCase() + " pool " + factory.name + " - " + str);
           }
         }
        ) :
        function () {};

  factory.validate = factory.validate || function() { return true; };
        
  factory.max = parseInt(factory.max, 10);
  factory.min = parseInt(factory.min, 10);
  
  factory.max = Math.max(isNaN(factory.max) ? 1 : factory.max, 1);
  factory.min = Math.min(isNaN(factory.min) ? 0 : factory.min, factory.max-1);
  
  ///////////////

  /**
   * Request the client to be destroyed. The factory's destroy handler
   * will also be called.
   *
   * This should be called within an acquire() block as an alternative to release().
   *
   * @param {Object} obj
   *   The acquired item to be destoyed.
   */
  me.destroy = function(obj) {
    count -= 1;
    availableObjects = availableObjects.filter(function(objWithTimeout) {
              return (objWithTimeout.obj !== obj);
    });
    factory.destroy(obj);
    
    ensureMinimum();
  };

  /**
   * Checks and removes the available (idle) clients that have timed out.
   */
  function removeIdle() {
    var toRemove = [],
        now = new Date().getTime(),
        i,
        al, tr,
        timeout;

    removeIdleScheduled = false;

    // Go through the available (idle) items,
    // check if they have timed out
    for (i = 0, al = availableObjects.length; i < al && (refreshIdle || (count - factory.min > toRemove.length)); i += 1) {
      timeout = availableObjects[i].timeout;
      if (now >= timeout) {
        // Client timed out, so destroy it.
        log("removeIdle() destroying obj - now:" + now + " timeout:" + timeout, 'verbose');
        toRemove.push(availableObjects[i].obj);
      } 
    }

    for (i = 0, tr = toRemove.length; i < tr; i += 1) {
      me.destroy(toRemove[i]);
    }

    // Replace the available items with the ones to keep.
    al = availableObjects.length;

    if (al > 0) {
      log("availableObjects.length=" + al, 'verbose');
      scheduleRemoveIdle();
    } else {
      log("removeIdle() all objects removed", 'verbose');
    }
  }


  /**
   * Schedule removal of idle items in the pool.
   *
   * More schedules cannot run concurrently.
   */
  function scheduleRemoveIdle() {
    if (!removeIdleScheduled) {
      removeIdleScheduled = true;
      removeIdleTimer = setTimeout(removeIdle, reapInterval);
    }
  }

  /**
   * Handle callbacks with either the [obj] or [err, obj] arguments in an
   * adaptive manner. Uses the `cb.length` property to determine the number
   * of arguments expected by `cb`.
   */
  function adjustCallback(cb, err, obj) {
    if (!cb) return;
    if (cb.length <= 1) {
      cb(obj);
    } else {
      cb(err, obj);
    }
  }

  /**
   * Try to get a new client to work, and clean up pool unused (idle) items.
   *
   *  - If there are available clients waiting, shift the first one out (LIFO),
   *    and call its callback.
   *  - If there are no waiting clients, try to create one if it won't exceed
   *    the maximum number of clients.
   *  - If creating a new client would exceed the maximum, add the client to
   *    the wait list.
   */
  function dispense() {
    var obj = null,
        objWithTimeout = null,
        err = null,
        clientCb = null,
        waitingCount = waitingClients.size();
        
    log("dispense() clients=" + waitingCount + " available=" + availableObjects.length, 'info');
    if (waitingCount > 0) {
      while (availableObjects.length > 0) {
        log("dispense() - reusing obj", 'verbose');
        objWithTimeout = availableObjects[0];
        if (!factory.validate(objWithTimeout.obj)) {
          me.destroy(objWithTimeout.obj);
          continue;
        }
        availableObjects.shift();
        clientCb = waitingClients.dequeue();
        return clientCb(err, objWithTimeout.obj);
      }
      if (count < factory.max) {
        createResource();
      }
    }
  }
  
  function createResource() {
    count += 1;
    log("createResource() - creating obj - count=" + count + " min=" + factory.min + " max=" + factory.max, 'verbose');
    factory.create(function () {
      var err, obj;
      var clientCb = waitingClients.dequeue();
      if (arguments.length > 1) {
        err = arguments[0];
        obj = arguments[1];
      } else {
        err = (arguments[0] instanceof Error) ? arguments[0] : null;
        obj = (arguments[0] instanceof Error) ? null : arguments[0];
      }
      if (err) {
        count -= 1;
        if (clientCb) {
          clientCb(err, obj);
        }
        process.nextTick(function(){
          dispense();
        });
      } else {
        if (clientCb) {
          clientCb(err, obj);
        } else {
          me.release(obj);
        }
      }
    });
  }
  
  function ensureMinimum() {
    var i, diff;
    if (!draining && (count < factory.min)) {
      diff = factory.min - count;
      for (i = 0; i < diff; i++) {
        createResource();
      }
    }
  }

  /**
   * Request a new client. The callback will be called,
   * when a new client will be availabe, passing the client to it.
   *
   * @param {Function} callback
   *   Callback function to be called after the acquire is successful.
   *   The function will receive the acquired item as the first parameter.
   *
   * @param {Number} priority
   *   Optional.  Integer between 0 and (priorityRange - 1).  Specifies the priority
   *   of the caller if there are no available resources.  Lower numbers mean higher
   *   priority.
   *
   * @returns {Object} `true` if the pool is not fully utilized, `false` otherwise.
   */
  me.acquire = function (callback, priority) {
    if (draining) {
      throw new Error("pool is draining and cannot accept work");
    }
    waitingClients.enqueue(callback, priority);
    dispense();
    return (count < factory.max);
  };

  me.borrow = function (callback, priority) {
    log("borrow() is deprecated. use acquire() instead", 'warn');
    me.acquire(callback, priority);
  };

  /**
   * Return the client to the pool, in case it is no longer required.
   *
   * @param {Object} obj
   *   The acquired object to be put back to the pool.
   */
  me.release = function (obj) {
	// check to see if this object has already been released (i.e., is back in the pool of availableObjects)
    if (availableObjects.some(function(objWithTimeout) { return (objWithTimeout.obj === obj); })) {
      log("release called twice for the same resource: " + (new Error().stack), 'error');
      return;
    }
    //log("return to pool");
    var objWithTimeout = { obj: obj, timeout: (new Date().getTime() + idleTimeoutMillis) };
    availableObjects.push(objWithTimeout);
    log("timeout: " + objWithTimeout.timeout, 'verbose');
    dispense();
    scheduleRemoveIdle();
  };

  me.returnToPool = function (obj) {
    log("returnToPool() is deprecated. use release() instead", 'warn');
    me.release(obj);
  };

  /**
   * Disallow any new requests and let the request backlog dissapate.
   *
   * @param {Function} callback
   *   Optional. Callback invoked when all work is done and all clients have been
   *   released.
   */
  me.drain = function(callback) {
    log("draining", 'info');

    // disable the ability to put more work on the queue.
    draining = true;

    var check = function() {
      if (waitingClients.size() > 0) {
        // wait until all client requests have been satisfied.
        setTimeout(check, 100);
      } else if (availableObjects.length != count) {
        // wait until all objects have been released.
        setTimeout(check, 100);
      } else {
        if (callback) {
          callback();
        }
      }
    };
    check();
  };

  /**
   * Forcibly destroys all clients regardless of timeout.  Intended to be
   * invoked as part of a drain.  Does not prevent the creation of new
   * clients as a result of subsequent calls to acquire.
   *
   * Note that if factory.min > 0, the pool will destroy all idle resources
   * in the pool, but replace them with newly created resources up to the
   * specified factory.min value.  If this is not desired, set factory.min
   * to zero before calling destroyAllNow()
   *
   * @param {Function} callback
   *   Optional. Callback invoked after all existing clients are destroyed.
   */
  me.destroyAllNow = function(callback) {
    log("force destroying all objects", 'info');
    var willDie = availableObjects;
    availableObjects = [];
    var obj = willDie.shift();
    while (obj !== null && obj !== undefined) {
      me.destroy(obj.obj);
      obj = willDie.shift();
    }
    removeIdleScheduled = false;
    clearTimeout(removeIdleTimer);
    if (callback) {
      callback();
    }
  };

  /**
   * Decorates a function to use a acquired client from the object pool when called.
   *
   * @param {Function} decorated
   *   The decorated function, accepting a client as the first argument and 
   *   (optionally) a callback as the final argument.
   *
   * @param {Number} priority
   *   Optional.  Integer between 0 and (priorityRange - 1).  Specifies the priority
   *   of the caller if there are no available resources.  Lower numbers mean higher
   *   priority.
   */
  me.pooled = function(decorated, priority) {
    return function() {
      var callerArgs = arguments;
      var callerCallback = callerArgs[callerArgs.length - 1];
      var callerHasCallback = typeof callerCallback === 'function';
      me.acquire(function(err, client) {
        if(err) {
          if(callerHasCallback) {
            callerCallback(err);
          }
          return;
        }

        var args = [client].concat(Array.prototype.slice.call(callerArgs, 0, callerHasCallback ? -1 : undefined));
        args.push(function() {
          me.release(client);
          if(callerHasCallback) {
            callerCallback.apply(null, arguments);
          }
        });
        
        decorated.apply(null, args);
      }, priority);
    };
  };

  me.getPoolSize = function() {
    return count;
  };

  me.getName = function() {
    return factory.name;
  };

  me.availableObjectsCount = function() {
    return availableObjects.length;
  };

  me.waitingClientsCount = function() {
    return waitingClients.size();
  };


  // create initial resources (if factory.min > 0)
  ensureMinimum();

  return me;
};


/***/ }),
/* 114 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var scrypt_module_factory = __webpack_require__(116);
var argScrubber = __webpack_require__(40);

module.exports = function(password, salt, options) {
	var args = argScrubber.apply(null,arguments);
	var sm = scrypt_module_factory(args.options.maxmem);
	var pass = Array.prototype.slice.apply(args.password);
	var salt = Array.prototype.slice.apply(args.salt);
	var hash = sm.crypto_scrypt(pass, salt, args.options.cost, args.options.blockSize, args.options.parallel, args.options.size);

	var ret = new Buffer(hash.length);
	for (var i=0; i<hash.length; i++) ret[i] = hash[i];
	return ret;
}


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname, module) {//adapted from https://github.com/tonyg/js-scrypt/blob/master/browser/scrypt.js
module.exports = (function (requested_total_memory) {
    var Module = {TOTAL_MEMORY: (requested_total_memory || 33554432)};
    var scrypt_raw = Module;
function g(a) {
  throw a;
}
var k = void 0, l = !0, m = null, p = !1;
function aa() {
  return function() {
  }
}
var q, s;
s || (s = eval("(function() { try { return Module || {} } catch(e) { return {} } })()"));
var ba = {}, t;
for(t in s) {
  s.hasOwnProperty(t) && (ba[t] = s[t])
}
var ca = "object" === typeof process && "function" === "function", da = "object" === typeof window, ea = "function" === typeof importScripts, fa = !da && !ca && !ea;
if(ca) {
  s.print = function(a) {
    process.stdout.write(a + "\n")
  };
  s.printErr = function(a) {
    process.stderr.write(a + "\n")
  };
  var ga = __webpack_require__(41), ha = __webpack_require__(117);
  s.read = function(a, b) {
    var a = ha.normalize(a), c = ga.readFileSync(a);
    !c && a != ha.resolve(a) && (a = path.join(__dirname, "..", "src", a), c = ga.readFileSync(a));
    c && !b && (c = c.toString());
    return c
  };
  s.readBinary = function(a) {
    return s.read(a, l)
  };
  s.load = function(a) {
    ia(read(a))
  };
  s.arguments = process.argv.slice(2);
  module.ee = s
}else {
  fa ? (s.print = print, "undefined" != typeof printErr && (s.printErr = printErr), s.read = read, s.readBinary = function(a) {
    return read(a, "binary")
  }, "undefined" != typeof scriptArgs ? s.arguments = scriptArgs : "undefined" != typeof arguments && (s.arguments = arguments), this.Module = s) : da || ea ? (s.read = function(a) {
    var b = new XMLHttpRequest;
    b.open("GET", a, p);
    b.send(m);
    return b.responseText
  }, "undefined" != typeof arguments && (s.arguments = arguments), da ? (s.print = function(a) {
    console.log(a)
  }, s.printErr = function(a) {
    console.log(a)
  }, this.Module = s) : ea && (s.print = aa(), s.load = importScripts)) : g("Unknown runtime environment. Where are we?")
}
function ia(a) {
  eval.call(m, a)
}
"undefined" == !s.load && s.read && (s.load = function(a) {
  ia(s.read(a))
});
s.print || (s.print = aa());
s.printErr || (s.printErr = s.print);
s.arguments || (s.arguments = []);
s.print = s.print;
s.P = s.printErr;
s.preRun = [];
s.postRun = [];
for(t in ba) {
  ba.hasOwnProperty(t) && (s[t] = ba[t])
}
function ja() {
  return u
}
function ka(a) {
  u = a
}
function la(a) {
  if(1 == ma) {
    return 1
  }
  var b = {"%i1":1, "%i8":1, "%i16":2, "%i32":4, "%i64":8, "%float":4, "%double":8}["%" + a];
  b || ("*" == a.charAt(a.length - 1) ? b = ma : "i" == a[0] && (a = parseInt(a.substr(1)), w(0 == a % 8), b = a / 8));
  return b
}
function na(a, b, c) {
  c && c.length ? (c.splice || (c = Array.prototype.slice.call(c)), c.splice(0, 0, b), s["dynCall_" + a].apply(m, c)) : s["dynCall_" + a].call(m, b)
}
var oa;
function pa() {
  var a = [], b = 0;
  this.oa = function(c) {
    c &= 255;
    b && (a.push(c), b--);
    if(0 == a.length) {
      if(128 > c) {
        return String.fromCharCode(c)
      }
      a.push(c);
      b = 191 < c && 224 > c ? 1 : 2;
      return""
    }
    if(0 < b) {
      return""
    }
    var c = a[0], d = a[1], e = a[2], c = 191 < c && 224 > c ? String.fromCharCode((c & 31) << 6 | d & 63) : String.fromCharCode((c & 15) << 12 | (d & 63) << 6 | e & 63);
    a.length = 0;
    return c
  };
  this.yb = function(a) {
    for(var a = unescape(encodeURIComponent(a)), b = [], e = 0;e < a.length;e++) {
      b.push(a.charCodeAt(e))
    }
    return b
  }
}
function qa(a) {
  var b = u;
  u = u + a | 0;
  u = u + 7 >> 3 << 3;
  return b
}
function ra(a) {
  var b = sa;
  sa = sa + a | 0;
  sa = sa + 7 >> 3 << 3;
  return b
}
function ua(a) {
  var b = z;
  z = z + a | 0;
  z = z + 7 >> 3 << 3;
  z >= va && wa("Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, or (2) set Module.TOTAL_MEMORY before the program runs.");
  return b
}
function xa(a, b) {
  return Math.ceil(a / (b ? b : 8)) * (b ? b : 8)
}
var ma = 4, ya = {}, za = p, Aa;
function w(a, b) {
  a || wa("Assertion failed: " + b)
}
s.ccall = function(a, b, c, d) {
  return Ba(Ca(a), b, c, d)
};
function Ca(a) {
  try {
    var b = s["_" + a];
    b || (b = eval("_" + a))
  }catch(c) {
  }
  w(b, "Cannot call unknown function " + a + " (perhaps LLVM optimizations or closure removed it?)");
  return b
}
function Ba(a, b, c, d) {
  function e(a, b) {
    if("string" == b) {
      if(a === m || a === k || 0 === a) {
        return 0
      }
      f || (f = ja());
      var c = qa(a.length + 1);
      Da(a, c);
      return c
    }
    return"array" == b ? (f || (f = ja()), c = qa(a.length), Ea(a, c), c) : a
  }
  var f = 0, h = 0, d = d ? d.map(function(a) {
    return e(a, c[h++])
  }) : [];
  a = a.apply(m, d);
  "string" == b ? b = Fa(a) : (w("array" != b), b = a);
  f && ka(f);
  return b
}
s.cwrap = function(a, b, c) {
  var d = Ca(a);
  return function() {
    return Ba(d, b, c, Array.prototype.slice.call(arguments))
  }
};
function Ga(a, b, c) {
  c = c || "i8";
  "*" === c.charAt(c.length - 1) && (c = "i32");
  switch(c) {
    case "i1":
      A[a] = b;
      break;
    case "i8":
      A[a] = b;
      break;
    case "i16":
      Ha[a >> 1] = b;
      break;
    case "i32":
      B[a >> 2] = b;
      break;
    case "i64":
      Aa = [b >>> 0, (Math.min(+Math.floor(b / 4294967296), 4294967295) | 0) >>> 0];
      B[a >> 2] = Aa[0];
      B[a + 4 >> 2] = Aa[1];
      break;
    case "float":
      Ia[a >> 2] = b;
      break;
    case "double":
      Ja[a >> 3] = b;
      break;
    default:
      wa("invalid type for setValue: " + c)
  }
}
s.setValue = Ga;
s.getValue = function(a, b) {
  b = b || "i8";
  "*" === b.charAt(b.length - 1) && (b = "i32");
  switch(b) {
    case "i1":
      return A[a];
    case "i8":
      return A[a];
    case "i16":
      return Ha[a >> 1];
    case "i32":
      return B[a >> 2];
    case "i64":
      return B[a >> 2];
    case "float":
      return Ia[a >> 2];
    case "double":
      return Ja[a >> 3];
    default:
      wa("invalid type for setValue: " + b)
  }
  return m
};
var Ka = 0, La = 1, E = 2, Na = 4;
s.ALLOC_NORMAL = Ka;
s.ALLOC_STACK = La;
s.ALLOC_STATIC = E;
s.ALLOC_DYNAMIC = 3;
s.ALLOC_NONE = Na;
function F(a, b, c, d) {
  var e, f;
  "number" === typeof a ? (e = l, f = a) : (e = p, f = a.length);
  var h = "string" === typeof b ? b : m, c = c == Na ? d : [Oa, qa, ra, ua][c === k ? E : c](Math.max(f, h ? 1 : b.length));
  if(e) {
    d = c;
    w(0 == (c & 3));
    for(a = c + (f & -4);d < a;d += 4) {
      B[d >> 2] = 0
    }
    for(a = c + f;d < a;) {
      A[d++ | 0] = 0
    }
    return c
  }
  if("i8" === h) {
    return a.subarray || a.slice ? G.set(a, c) : G.set(new Uint8Array(a), c), c
  }
  for(var d = 0, i, j;d < f;) {
    var n = a[d];
    "function" === typeof n && (n = ya.fe(n));
    e = h || b[d];
    0 === e ? d++ : ("i64" == e && (e = "i32"), Ga(c + d, n, e), j !== e && (i = la(e), j = e), d += i)
  }
  return c
}
s.allocate = F;
function Fa(a, b) {
  for(var c = p, d, e = 0;;) {
    d = G[a + e | 0];
    if(128 <= d) {
      c = l
    }else {
      if(0 == d && !b) {
        break
      }
    }
    e++;
    if(b && e == b) {
      break
    }
  }
  b || (b = e);
  var f = "";
  if(!c) {
    for(;0 < b;) {
      d = String.fromCharCode.apply(String, G.subarray(a, a + Math.min(b, 1024))), f = f ? f + d : d, a += 1024, b -= 1024
    }
    return f
  }
  c = new pa;
  for(e = 0;e < b;e++) {
    d = G[a + e | 0], f += c.oa(d)
  }
  return f
}
s.Pointer_stringify = Fa;
var A, G, Ha, Pa, B, Qa, Ia, Ja, Ra = 0, sa = 0, Sa = 0, u = 0, Ta = 0, Ua = 0, z = 0, va = s.TOTAL_MEMORY || 33554432;
w(!!Int32Array && !!Float64Array && !!(new Int32Array(1)).subarray && !!(new Int32Array(1)).set, "Cannot fallback to non-typed array case: Code is too specialized");
var I = new ArrayBuffer(va);
A = new Int8Array(I);
Ha = new Int16Array(I);
B = new Int32Array(I);
G = new Uint8Array(I);
Pa = new Uint16Array(I);
Qa = new Uint32Array(I);
Ia = new Float32Array(I);
Ja = new Float64Array(I);
B[0] = 255;
w(255 === G[0] && 0 === G[3], "Typed arrays 2 must be run on a little-endian system");
s.HEAP = k;
s.HEAP8 = A;
s.HEAP16 = Ha;
s.HEAP32 = B;
s.HEAPU8 = G;
s.HEAPU16 = Pa;
s.HEAPU32 = Qa;
s.HEAPF32 = Ia;
s.HEAPF64 = Ja;
function Va(a) {
  for(;0 < a.length;) {
    var b = a.shift();
    if("function" == typeof b) {
      b()
    }else {
      var c = b.V;
      "number" === typeof c ? b.ha === k ? na("v", c) : na("vi", c, [b.ha]) : c(b.ha === k ? m : b.ha)
    }
  }
}
var Wa = [], Xa = [], Ya = [], Za = [], $a = [], ab = p;
function bb(a) {
  Wa.unshift(a)
}
s.addOnPreRun = s.Vd = bb;
s.addOnInit = s.Sd = function(a) {
  Xa.unshift(a)
};
s.addOnPreMain = s.Ud = function(a) {
  Ya.unshift(a)
};
s.addOnExit = s.Rd = function(a) {
  Za.unshift(a)
};
function cb(a) {
  $a.unshift(a)
}
s.addOnPostRun = s.Td = cb;
function J(a, b, c) {
  a = (new pa).yb(a);
  c && (a.length = c);
  b || a.push(0);
  return a
}
s.intArrayFromString = J;
s.intArrayToString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    var d = a[c];
    255 < d && (d &= 255);
    b.push(String.fromCharCode(d))
  }
  return b.join("")
};
function Da(a, b, c) {
  a = J(a, c);
  for(c = 0;c < a.length;) {
    A[b + c | 0] = a[c], c += 1
  }
}
s.writeStringToMemory = Da;
function Ea(a, b) {
  for(var c = 0;c < a.length;c++) {
    A[b + c | 0] = a[c]
  }
}
s.writeArrayToMemory = Ea;
function db(a, b) {
  return 0 <= a ? a : 32 >= b ? 2 * Math.abs(1 << b - 1) + a : Math.pow(2, b) + a
}
function eb(a, b) {
  if(0 >= a) {
    return a
  }
  var c = 32 >= b ? Math.abs(1 << b - 1) : Math.pow(2, b - 1);
  if(a >= c && (32 >= b || a > c)) {
    a = -2 * c + a
  }
  return a
}
Math.imul || (Math.imul = function(a, b) {
  var c = a & 65535, d = b & 65535;
  return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16) | 0
});
Math.ie = Math.imul;
var L = 0, fb = {}, gb = p, hb = m;
function ib(a) {
  L++;
  s.monitorRunDependencies && s.monitorRunDependencies(L);
  a ? (w(!fb[a]), fb[a] = 1) : s.P("warning: run dependency added without ID")
}
s.addRunDependency = ib;
function jb(a) {
  L--;
  s.monitorRunDependencies && s.monitorRunDependencies(L);
  a ? (w(fb[a]), delete fb[a]) : s.P("warning: run dependency removed without ID");
  0 == L && (hb !== m && (clearInterval(hb), hb = m), !gb && kb && lb())
}
s.removeRunDependency = jb;
s.preloadedImages = {};
s.preloadedAudios = {};
Ra = 8;
sa = Ra + 1312;
Xa.push({V:function() {
  mb()
}});
var nb, ob, pb;
nb = nb = F([0, 0, 0, 0, 0, 0, 0, 0], "i8", E);
ob = ob = F([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", E);
pb = pb = F([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", E);
F([111, 112, 116, 105, 111, 110, 32, 114, 101, 113, 117, 105, 114, 101, 115, 32, 97, 110, 32, 97, 114, 103, 117, 109, 101, 110, 116, 32, 45, 45, 32, 37, 115, 0, 0, 0, 0, 0, 0, 0, 111, 112, 116, 105, 111, 110, 32, 114, 101, 113, 117, 105, 114, 101, 115, 32, 97, 110, 32, 97, 114, 103, 117, 109, 101, 110, 116, 32, 45, 45, 32, 37, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 64, 0, 0, 0, 0, 0, 0, 89, 64, 0, 0, 0, 0, 0, 136, 195, 64, 0, 0, 0, 0, 132, 215, 151, 65, 0, 128, 224, 55, 121, 195, 65, 67, 
23, 110, 5, 181, 181, 184, 147, 70, 245, 249, 63, 233, 3, 79, 56, 77, 50, 29, 48, 249, 72, 119, 130, 90, 60, 191, 115, 127, 221, 79, 21, 117, 56, 3, 0, 0, 0, 0, 0, 0, 63, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 111, 112, 116, 105, 111, 110, 32, 100, 111, 101, 115, 110, 39, 116, 32, 116, 97, 107, 101, 32, 97, 110, 32, 97, 114, 103, 117, 109, 101, 110, 116, 32, 45, 45, 32, 37, 46, 42, 115, 0, 117, 110, 107, 
110, 111, 119, 110, 32, 111, 112, 116, 105, 111, 110, 32, 45, 45, 32, 37, 115, 0, 0, 0, 0, 117, 110, 107, 110, 111, 119, 110, 32, 111, 112, 116, 105, 111, 110, 32, 45, 45, 32, 37, 99, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 97, 109, 98, 105, 103, 117, 111, 117, 115, 32, 111, 112, 116, 105, 111, 110, 32, 45, 45, 32, 37, 46, 42, 115, 0, 0, 0, 0, 0, 0, 0, 0, 37, 115, 58, 32, 0, 0, 0, 0, 80, 79, 83, 73, 88, 76, 89, 95, 67, 79, 82, 82, 69, 67, 84, 0, 115, 116, 100, 58, 58, 98, 97, 100, 95, 97, 108, 
108, 111, 99, 0, 0, 37, 115, 58, 32, 0, 0, 0, 0, 37, 115, 10, 0, 0, 0, 0, 0, 37, 115, 10, 0, 0, 0, 0, 0, 105, 110, 32, 117, 115, 101, 32, 98, 121, 116, 101, 115, 32, 32, 32, 32, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0, 0, 0, 0, 0, 0, 0, 37, 115, 58, 32, 0, 0, 0, 0, 37, 115, 58, 32, 0, 0, 0, 0, 98, 97, 100, 95, 97, 114, 114, 97, 121, 95, 110, 101, 119, 95, 108, 101, 110, 103, 116, 104, 0, 0, 0, 0, 58, 32, 0, 0, 0, 0, 0, 0, 58, 32, 0, 0, 0, 0, 0, 0, 115, 121, 115, 116, 101, 109, 32, 98, 121, 116, 101, 
115, 32, 32, 32, 32, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0, 0, 0, 0, 0, 0, 0, 109, 97, 120, 32, 115, 121, 115, 116, 101, 109, 32, 98, 121, 116, 101, 115, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 176, 2, 0, 0, 6, 0, 0, 0, 10, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 2, 0, 0, 6, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 116, 57, 101, 120, 99, 101, 112, 116, 105, 111, 110, 0, 0, 0, 0, 83, 116, 57, 98, 97, 
100, 95, 97, 108, 108, 111, 99, 0, 0, 0, 0, 83, 116, 50, 48, 98, 97, 100, 95, 97, 114, 114, 97, 121, 95, 110, 101, 119, 95, 108, 101, 110, 103, 116, 104, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 104, 2, 0, 0, 0, 0, 0, 0, 120, 2, 0, 0, 168, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136, 2, 0, 0, 176, 2, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
"i8", Na, 8);
var qb = xa(F(12, "i8", E), 8);
w(0 == qb % 8);
var rb = 0;
function M(a) {
  return B[rb >> 2] = a
}
s._memcpy = sb;
s._memset = tb;
var N = {L:1, ca:2, Bd:3, sc:4, I:5, za:6, Jb:7, Sc:8, $:9, Zb:10, ua:11, Ld:11, $a:12, Ya:13, kc:14, ed:15, Wb:16, va:17, Md:18, wa:19, gd:20, aa:21, A:22, Mc:23, Za:24, ld:25, Id:26, lc:27, ad:28, da:29, yd:30, Fc:31, rd:32, hc:33, ab:34, Wc:35, pc:36, $b:37, vc:38, wc:39, xc:40, Ec:41, Jd:42, Qc:43, uc:44, ec:45, Tc:46, Pb:50, Sb:51, Nd:52, Oc:53, Tb:54, Ub:55, fc:56, Vb:57, cd:60, Rc:61, Fd:62, bd:63, Xc:64, Yc:65, xd:66, Uc:67, Mb:68, Cd:69, ac:70, td:71, Hc:74, yc:75, ic:76, Rb:77, mc:79, md:80, 
Qb:81, wd:82, zc:83, Ac:84, Dc:85, Cc:86, Bc:87, dd:88, Nc:89, ya:90, Ic:91, ba:92, nd:95, qd:96, dc:104, Pc:105, Nb:106, vd:107, jd:108, Zc:109, zd:110, cc:111, Kb:112, bc:113, Lc:114, Jc:115, Gd:116, nc:117, oc:118, rc:119, Ob:120, gc:121, Gc:122, ud:123, Ad:124, Lb:125, Kc:126, tc:127, fd:128, Hd:129, sd:130, Kd:131, jc:132, Dd:133, kd:134, Vc:135, $c:136, Yb:137, qc:138, od:139, Xb:140, hd:141, pd:142, Ed:143}, ub = {"0":"Success", 1:"Not super-user", 2:"No such file or directory", 3:"No such process", 
4:"Interrupted system call", 5:"I/O error", 6:"No such device or address", 7:"Arg list too long", 8:"Exec format error", 9:"Bad file number", 10:"No children", 11:"No more processes", 12:"Not enough core", 13:"Permission denied", 14:"Bad address", 15:"Block device required", 16:"Mount device busy", 17:"File exists", 18:"Cross-device link", 19:"No such device", 20:"Not a directory", 21:"Is a directory", 22:"Invalid argument", 23:"Too many open files in system", 24:"Too many open files", 25:"Not a typewriter", 
26:"Text file busy", 27:"File too large", 28:"No space left on device", 29:"Illegal seek", 30:"Read only file system", 31:"Too many links", 32:"Broken pipe", 33:"Math arg out of domain of func", 34:"Math result not representable", 35:"No message of desired type", 36:"Identifier removed", 37:"Channel number out of range", 38:"Level 2 not synchronized", 39:"Level 3 halted", 40:"Level 3 reset", 41:"Link number out of range", 42:"Protocol driver not attached", 43:"No CSI structure available", 44:"Level 2 halted", 
45:"Deadlock condition", 46:"No record locks available", 50:"Invalid exchange", 51:"Invalid request descriptor", 52:"Exchange full", 53:"No anode", 54:"Invalid request code", 55:"Invalid slot", 56:"File locking deadlock error", 57:"Bad font file fmt", 60:"Device not a stream", 61:"No data (for no delay io)", 62:"Timer expired", 63:"Out of streams resources", 64:"Machine is not on the network", 65:"Package not installed", 66:"The object is remote", 67:"The link has been severed", 68:"Advertise error", 
69:"Srmount error", 70:"Communication error on send", 71:"Protocol error", 74:"Multihop attempted", 75:"Inode is remote (not really error)", 76:"Cross mount point (not really error)", 77:"Trying to read unreadable message", 79:"Inappropriate file type or format", 80:"Given log. name not unique", 81:"f.d. invalid for this operation", 82:"Remote address changed", 83:"Can\t access a needed shared lib", 84:"Accessing a corrupted shared lib", 85:".lib section in a.out corrupted", 86:"Attempting to link in too many libs", 
87:"Attempting to exec a shared library", 88:"Function not implemented", 89:"No more files", 90:"Directory not empty", 91:"File or path name too long", 92:"Too many symbolic links", 95:"Operation not supported on transport endpoint", 96:"Protocol family not supported", 104:"Connection reset by peer", 105:"No buffer space available", 106:"Address family not supported by protocol family", 107:"Protocol wrong type for socket", 108:"Socket operation on non-socket", 109:"Protocol not available", 110:"Can't send after socket shutdown", 
111:"Connection refused", 112:"Address already in use", 113:"Connection aborted", 114:"Network is unreachable", 115:"Network interface is not configured", 116:"Connection timed out", 117:"Host is down", 118:"Host is unreachable", 119:"Connection already in progress", 120:"Socket already connected", 121:"Destination address required", 122:"Message too long", 123:"Unknown protocol", 124:"Socket type not supported", 125:"Address not available", 126:"ENETRESET", 127:"Socket is already connected", 128:"Socket is not connected", 
129:"TOOMANYREFS", 130:"EPROCLIM", 131:"EUSERS", 132:"EDQUOT", 133:"ESTALE", 134:"Not supported", 135:"No medium (in tape drive)", 136:"No such host or network path", 137:"Filename exists with different case", 138:"EILSEQ", 139:"Value too large for defined data type", 140:"Operation canceled", 141:"State not recoverable", 142:"Previous owner died", 143:"Streams pipe error"};
function vb(a, b, c) {
  var d = O(a, {parent:l}).d, a = "/" === a ? "/" : wb(a)[2], e = xb(d, a);
  e && g(new Q(e));
  d.l.Ta || g(new Q(N.L));
  return d.l.Ta(d, a, b, c)
}
function yb(a, b) {
  b = b & 4095 | 32768;
  return vb(a, b, 0)
}
function zb(a, b) {
  b = b & 1023 | 16384;
  return vb(a, b, 0)
}
function Ab(a, b, c) {
  return vb(a, b | 8192, c)
}
function Bb(a, b) {
  var c = O(b, {parent:l}).d, d = "/" === b ? "/" : wb(b)[2], e = xb(c, d);
  e && g(new Q(e));
  c.l.Wa || g(new Q(N.L));
  return c.l.Wa(c, d, a)
}
function Cb(a, b) {
  var c;
  c = "string" === typeof a ? O(a, {N:l}).d : a;
  c.l.Y || g(new Q(N.L));
  c.l.Y(c, {mode:b & 4095 | c.mode & -4096, timestamp:Date.now()})
}
function Db(a, b) {
  var c, a = Eb(a), d;
  "string" === typeof b ? (d = Fb[b], "undefined" === typeof d && g(Error("Unknown file open mode: " + b))) : d = b;
  b = d;
  c = b & 512 ? c & 4095 | 32768 : 0;
  var e;
  try {
    var f = O(a, {N:!(b & 65536)});
    e = f.d;
    a = f.path
  }catch(h) {
  }
  b & 512 && (e ? b & 2048 && g(new Q(N.va)) : e = vb(a, c, 0));
  e || g(new Q(N.ca));
  8192 === (e.mode & 61440) && (b &= -1025);
  e ? 40960 === (e.mode & 61440) ? c = N.ba : 16384 === (e.mode & 61440) && (0 !== (b & 3) || b & 1024) ? c = N.aa : (c = ["r", "w", "rw"][b & 3], b & 1024 && (c += "w"), c = Gb(e, c)) : c = N.ca;
  c && g(new Q(c));
  b & 1024 && (c = e, c = "string" === typeof c ? O(c, {N:l}).d : c, c.l.Y || g(new Q(N.L)), 16384 === (c.mode & 61440) && g(new Q(N.aa)), 32768 !== (c.mode & 61440) && g(new Q(N.A)), (f = Gb(c, "w")) && g(new Q(f)), c.l.Y(c, {size:0, timestamp:Date.now()}));
  var i = {path:a, d:e, M:b, seekable:l, position:0, e:e.e, Gb:[], error:p}, j;
  a: {
    e = k || 4096;
    for(c = k || 1;c <= e;c++) {
      if(!R[c]) {
        j = c;
        break a
      }
    }
    g(new Q(N.Za))
  }
  i.s = j;
  Object.defineProperty(i, "object", {get:function() {
    return i.d
  }, set:function(a) {
    i.d = a
  }});
  Object.defineProperty(i, "isRead", {get:function() {
    return 1 !== (i.M & 3)
  }});
  Object.defineProperty(i, "isWrite", {get:function() {
    return 0 !== (i.M & 3)
  }});
  Object.defineProperty(i, "isAppend", {get:function() {
    return i.M & 8
  }});
  R[j] = i;
  i.e.open && i.e.open(i);
  return i
}
function Hb(a) {
  try {
    a.e.close && a.e.close(a)
  }catch(b) {
    g(b)
  }finally {
    R[a.s] = m
  }
}
function Ib(a, b, c, d, e) {
  (0 > d || 0 > e) && g(new Q(N.A));
  0 === (a.M & 3) && g(new Q(N.$));
  16384 === (a.d.mode & 61440) && g(new Q(N.aa));
  a.e.write || g(new Q(N.A));
  var f = l;
  "undefined" === typeof e ? (e = a.position, f = p) : a.seekable || g(new Q(N.da));
  a.M & 8 && ((!a.seekable || !a.e.na) && g(new Q(N.da)), a.e.na(a, 0, 2));
  b = a.e.write(a, b, c, d, e);
  f || (a.position += b);
  return b
}
function wb(a) {
  return/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1)
}
function Jb(a, b) {
  for(var c = 0, d = a.length - 1;0 <= d;d--) {
    var e = a[d];
    "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--)
  }
  if(b) {
    for(;c--;c) {
      a.unshift("..")
    }
  }
  return a
}
function Eb(a) {
  var b = "/" === a.charAt(0), c = "/" === a.substr(-1), a = Jb(a.split("/").filter(function(a) {
    return!!a
  }), !b).join("/");
  !a && !b && (a = ".");
  a && c && (a += "/");
  return(b ? "/" : "") + a
}
function S() {
  var a = Array.prototype.slice.call(arguments, 0);
  return Eb(a.filter(function(a) {
    "string" !== typeof a && g(new TypeError("Arguments to path.join must be strings"));
    return a
  }).join("/"))
}
function Kb() {
  for(var a = "", b = p, c = arguments.length - 1;-1 <= c && !b;c--) {
    var d = 0 <= c ? arguments[c] : "/";
    "string" !== typeof d && g(new TypeError("Arguments to path.resolve must be strings"));
    d && (a = d + "/" + a, b = "/" === d.charAt(0))
  }
  a = Jb(a.split("/").filter(function(a) {
    return!!a
  }), !b).join("/");
  return(b ? "/" : "") + a || "."
}
var Lb = [];
function Mb(a, b) {
  Lb[a] = {input:[], H:[], O:b};
  Nb[a] = {e:Ob}
}
var Ob = {open:function(a) {
  Pb || (Pb = new pa);
  var b = Lb[a.d.X];
  b || g(new Q(N.wa));
  a.q = b;
  a.seekable = p
}, close:function(a) {
  a.q.H.length && a.q.O.W(a.q, 10)
}, Q:function(a, b, c, d) {
  (!a.q || !a.q.O.Na) && g(new Q(N.za));
  for(var e = 0, f = 0;f < d;f++) {
    var h;
    try {
      h = a.q.O.Na(a.q)
    }catch(i) {
      g(new Q(N.I))
    }
    h === k && 0 === e && g(new Q(N.ua));
    if(h === m || h === k) {
      break
    }
    e++;
    b[c + f] = h
  }
  e && (a.d.timestamp = Date.now());
  return e
}, write:function(a, b, c, d) {
  (!a.q || !a.q.O.W) && g(new Q(N.za));
  for(var e = 0;e < d;e++) {
    try {
      a.q.O.W(a.q, b[c + e])
    }catch(f) {
      g(new Q(N.I))
    }
  }
  d && (a.d.timestamp = Date.now());
  return e
}}, Pb, T = {z:function() {
  return T.ka(m, "/", 16895, 0)
}, ka:function(a, b, c, d) {
  (24576 === (c & 61440) || 4096 === (c & 61440)) && g(new Q(N.L));
  c = Qb(a, b, c, d);
  c.l = T.l;
  16384 === (c.mode & 61440) ? (c.e = T.e, c.g = {}) : 32768 === (c.mode & 61440) ? (c.e = T.e, c.g = []) : 40960 === (c.mode & 61440) ? c.e = T.e : 8192 === (c.mode & 61440) && (c.e = Rb);
  c.timestamp = Date.now();
  a && (a.g[b] = c);
  return c
}, l:{ge:function(a) {
  var b = {};
  b.ce = 8192 === (a.mode & 61440) ? a.id : 1;
  b.je = a.id;
  b.mode = a.mode;
  b.pe = 1;
  b.uid = 0;
  b.he = 0;
  b.X = a.X;
  b.size = 16384 === (a.mode & 61440) ? 4096 : 32768 === (a.mode & 61440) ? a.g.length : 40960 === (a.mode & 61440) ? a.link.length : 0;
  b.Yd = new Date(a.timestamp);
  b.oe = new Date(a.timestamp);
  b.ae = new Date(a.timestamp);
  b.ib = 4096;
  b.Zd = Math.ceil(b.size / b.ib);
  return b
}, Y:function(a, b) {
  b.mode !== k && (a.mode = b.mode);
  b.timestamp !== k && (a.timestamp = b.timestamp);
  if(b.size !== k) {
    var c = a.g;
    if(b.size < c.length) {
      c.length = b.size
    }else {
      for(;b.size > c.length;) {
        c.push(0)
      }
    }
  }
}, tb:function() {
  g(new Q(N.ca))
}, Ta:function(a, b, c, d) {
  return T.ka(a, b, c, d)
}, rename:function(a, b, c) {
  if(16384 === (a.mode & 61440)) {
    var d;
    try {
      d = Sb(b, c)
    }catch(e) {
    }
    if(d) {
      for(var f in d.g) {
        g(new Q(N.ya))
      }
    }
  }
  delete a.parent.g[a.name];
  a.name = c;
  b.g[c] = a
}, ze:function(a, b) {
  delete a.g[b]
}, ve:function(a, b) {
  var c = Sb(a, b), d;
  for(d in c.g) {
    g(new Q(N.ya))
  }
  delete a.g[b]
}, Wa:function(a, b, c) {
  a = T.ka(a, b, 41471, 0);
  a.link = c;
  return a
}, Va:function(a) {
  40960 !== (a.mode & 61440) && g(new Q(N.A));
  return a.link
}}, e:{open:function(a) {
  if(16384 === (a.d.mode & 61440)) {
    var b = [".", ".."], c;
    for(c in a.d.g) {
      a.d.g.hasOwnProperty(c) && b.push(c)
    }
    a.lb = b
  }
}, Q:function(a, b, c, d, e) {
  a = a.d.g;
  d = Math.min(a.length - e, d);
  if(a.subarray) {
    b.set(a.subarray(e, e + d), c)
  }else {
    for(var f = 0;f < d;f++) {
      b[c + f] = a[e + f]
    }
  }
  return d
}, write:function(a, b, c, d, e) {
  for(var f = a.d.g;f.length < e;) {
    f.push(0)
  }
  for(var h = 0;h < d;h++) {
    f[e + h] = b[c + h]
  }
  a.d.timestamp = Date.now();
  return d
}, na:function(a, b, c) {
  1 === c ? b += a.position : 2 === c && 32768 === (a.d.mode & 61440) && (b += a.d.g.length);
  0 > b && g(new Q(N.A));
  a.Gb = [];
  return a.position = b
}, ue:function(a) {
  return a.lb
}, Wd:function(a, b, c) {
  a = a.d.g;
  for(b += c;b > a.length;) {
    a.push(0)
  }
}, ne:function(a, b, c, d, e, f, h) {
  32768 !== (a.d.mode & 61440) && g(new Q(N.wa));
  a = a.d.g;
  if(h & 2) {
    if(0 < e || e + d < a.length) {
      a = a.subarray ? a.subarray(e, e + d) : Array.prototype.slice.call(a, e, e + d)
    }
    e = l;
    (d = Oa(d)) || g(new Q(N.$a));
    b.set(a, d)
  }else {
    w(a.buffer === b || a.buffer === b.buffer), e = p, d = a.byteOffset
  }
  return{te:d, Xd:e}
}}}, Tb = F(1, "i32*", E), Ub = F(1, "i32*", E);
nb = F(1, "i32*", E);
var Vb = m, Nb = [m], R = [m], Wb = 1, Xb = [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 
, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ], Yb = l;
function Q(a) {
  this.mb = a;
  for(var b in N) {
    if(N[b] === a) {
      this.code = b;
      break
    }
  }
  this.message = ub[a]
}
function Zb(a) {
  a instanceof Q || g(a + " : " + Error().stack);
  M(a.mb)
}
function $b(a, b) {
  for(var c = 0, d = 0;d < b.length;d++) {
    c = (c << 5) - c + b.charCodeAt(d) | 0
  }
  return(a + c) % Xb.length
}
function Sb(a, b) {
  var c = Gb(a, "x");
  c && g(new Q(c));
  for(c = Xb[$b(a.id, b)];c;c = c.wb) {
    if(c.parent.id === a.id && c.name === b) {
      return c
    }
  }
  return a.l.tb(a, b)
}
function Qb(a, b, c, d) {
  var e = {id:Wb++, name:b, mode:c, l:{}, e:{}, X:d, parent:m, z:m};
  a || (a = e);
  e.parent = a;
  e.z = a.z;
  Object.defineProperty(e, "read", {get:function() {
    return 365 === (e.mode & 365)
  }, set:function(a) {
    a ? e.mode |= 365 : e.mode &= -366
  }});
  Object.defineProperty(e, "write", {get:function() {
    return 146 === (e.mode & 146)
  }, set:function(a) {
    a ? e.mode |= 146 : e.mode &= -147
  }});
  a = $b(e.parent.id, e.name);
  e.wb = Xb[a];
  return Xb[a] = e
}
function O(a, b) {
  a = Kb("/", a);
  b = b || {pa:0};
  8 < b.pa && g(new Q(N.ba));
  for(var c = Jb(a.split("/").filter(function(a) {
    return!!a
  }), p), d = Vb, e = "/", f = 0;f < c.length;f++) {
    var h = f === c.length - 1;
    if(h && b.parent) {
      break
    }
    d = Sb(d, c[f]);
    e = S(e, c[f]);
    d.ub && (d = d.z.root);
    if(!h || b.N) {
      for(h = 0;40960 === (d.mode & 61440);) {
        d = O(e, {N:p}).d;
        d.l.Va || g(new Q(N.A));
        var d = d.l.Va(d), i = Kb;
        var j = wb(e), e = j[0], j = j[1];
        !e && !j ? e = "." : (j && (j = j.substr(0, j.length - 1)), e += j);
        e = i(e, d);
        d = O(e, {pa:b.pa}).d;
        40 < h++ && g(new Q(N.ba))
      }
    }
  }
  return{path:e, d:d}
}
function ac(a) {
  for(var b;;) {
    if(a === a.parent) {
      return b ? S(a.z.Ua, b) : a.z.Ua
    }
    b = b ? S(a.name, b) : a.name;
    a = a.parent
  }
}
var Fb = {r:0, rs:8192, "r+":2, w:1537, wx:3585, xw:3585, "w+":1538, "wx+":3586, "xw+":3586, a:521, ax:2569, xa:2569, "a+":522, "ax+":2570, "xa+":2570};
function Gb(a, b) {
  return Yb ? 0 : -1 !== b.indexOf("r") && !(a.mode & 292) || -1 !== b.indexOf("w") && !(a.mode & 146) || -1 !== b.indexOf("x") && !(a.mode & 73) ? N.Ya : 0
}
function xb(a, b) {
  try {
    return Sb(a, b), N.va
  }catch(c) {
  }
  return Gb(a, "wx")
}
var Rb = {open:function(a) {
  a.e = Nb[a.d.X].e;
  a.e.open && a.e.open(a)
}, na:function() {
  g(new Q(N.da))
}}, bc;
function cc(a, b) {
  var c = 0;
  a && (c |= 365);
  b && (c |= 146);
  return c
}
function dc(a, b, c, d, e) {
  a = S("string" === typeof a ? a : ac(a), b);
  d = cc(d, e);
  e = yb(a, d);
  if(c) {
    if("string" === typeof c) {
      for(var b = Array(c.length), f = 0, h = c.length;f < h;++f) {
        b[f] = c.charCodeAt(f)
      }
      c = b
    }
    Cb(a, d | 146);
    b = Db(a, "w");
    Ib(b, c, 0, c.length, 0);
    Hb(b);
    Cb(a, d)
  }
  return e
}
function ec(a, b, c, d) {
  a = S("string" === typeof a ? a : ac(a), b);
  ec.Sa || (ec.Sa = 64);
  b = ec.Sa++ << 8 | 0;
  Nb[b] = {e:{open:function(a) {
    a.seekable = p
  }, close:function() {
    d && (d.buffer && d.buffer.length) && d(10)
  }, Q:function(a, b, d, i) {
    for(var j = 0, n = 0;n < i;n++) {
      var y;
      try {
        y = c()
      }catch(v) {
        g(new Q(N.I))
      }
      y === k && 0 === j && g(new Q(N.ua));
      if(y === m || y === k) {
        break
      }
      j++;
      b[d + n] = y
    }
    j && (a.d.timestamp = Date.now());
    return j
  }, write:function(a, b, c, i) {
    for(var j = 0;j < i;j++) {
      try {
        d(b[c + j])
      }catch(n) {
        g(new Q(N.I))
      }
    }
    i && (a.d.timestamp = Date.now());
    return j
  }}};
  return Ab(a, c && d ? 511 : c ? 219 : 365, b)
}
function fc(a, b, c) {
  a = R[a];
  if(!a) {
    return-1
  }
  a.sender(G.subarray(b, b + c));
  return c
}
function gc(a, b, c) {
  var d = R[a];
  if(!d) {
    return M(N.$), -1
  }
  if(d && "socket" in d) {
    return fc(a, b, c)
  }
  try {
    return Ib(d, A, b, c)
  }catch(e) {
    return Zb(e), -1
  }
}
function hc(a, b, c, d) {
  c *= b;
  if(0 == c) {
    return 0
  }
  a = gc(d, a, c);
  if(-1 == a) {
    if(b = R[d]) {
      b.error = l
    }
    return 0
  }
  return Math.floor(a / b)
}
s._strlen = ic;
function jc(a) {
  return 0 > a || 0 === a && -Infinity === 1 / a
}
function kc(a, b) {
  function c(a) {
    var c;
    "double" === a ? c = Ja[b + e >> 3] : "i64" == a ? (c = [B[b + e >> 2], B[b + (e + 8) >> 2]], e += 8) : (a = "i32", c = B[b + e >> 2]);
    e += Math.max(Math.max(la(a), ma), 8);
    return c
  }
  for(var d = a, e = 0, f = [], h, i;;) {
    var j = d;
    h = A[d];
    if(0 === h) {
      break
    }
    i = A[d + 1 | 0];
    if(37 == h) {
      var n = p, y = p, v = p, C = p;
      a:for(;;) {
        switch(i) {
          case 43:
            n = l;
            break;
          case 45:
            y = l;
            break;
          case 35:
            v = l;
            break;
          case 48:
            if(C) {
              break a
            }else {
              C = l;
              break
            }
          ;
          default:
            break a
        }
        d++;
        i = A[d + 1 | 0]
      }
      var D = 0;
      if(42 == i) {
        D = c("i32"), d++, i = A[d + 1 | 0]
      }else {
        for(;48 <= i && 57 >= i;) {
          D = 10 * D + (i - 48), d++, i = A[d + 1 | 0]
        }
      }
      var K = p;
      if(46 == i) {
        var H = 0, K = l;
        d++;
        i = A[d + 1 | 0];
        if(42 == i) {
          H = c("i32"), d++
        }else {
          for(;;) {
            i = A[d + 1 | 0];
            if(48 > i || 57 < i) {
              break
            }
            H = 10 * H + (i - 48);
            d++
          }
        }
        i = A[d + 1 | 0]
      }else {
        H = 6
      }
      var x;
      switch(String.fromCharCode(i)) {
        case "h":
          i = A[d + 2 | 0];
          104 == i ? (d++, x = 1) : x = 2;
          break;
        case "l":
          i = A[d + 2 | 0];
          108 == i ? (d++, x = 8) : x = 4;
          break;
        case "L":
        ;
        case "q":
        ;
        case "j":
          x = 8;
          break;
        case "z":
        ;
        case "t":
        ;
        case "I":
          x = 4;
          break;
        default:
          x = m
      }
      x && d++;
      i = A[d + 1 | 0];
      switch(String.fromCharCode(i)) {
        case "d":
        ;
        case "i":
        ;
        case "u":
        ;
        case "o":
        ;
        case "x":
        ;
        case "X":
        ;
        case "p":
          j = 100 == i || 105 == i;
          x = x || 4;
          var P = h = c("i" + 8 * x), r;
          8 == x && (h = 117 == i ? +(h[0] >>> 0) + 4294967296 * +(h[1] >>> 0) : +(h[0] >>> 0) + 4294967296 * +(h[1] | 0));
          4 >= x && (h = (j ? eb : db)(h & Math.pow(256, x) - 1, 8 * x));
          var ta = Math.abs(h), j = "";
          if(100 == i || 105 == i) {
            r = 8 == x && lc ? lc.stringify(P[0], P[1], m) : eb(h, 8 * x).toString(10)
          }else {
            if(117 == i) {
              r = 8 == x && lc ? lc.stringify(P[0], P[1], l) : db(h, 8 * x).toString(10), h = Math.abs(h)
            }else {
              if(111 == i) {
                r = (v ? "0" : "") + ta.toString(8)
              }else {
                if(120 == i || 88 == i) {
                  j = v && 0 != h ? "0x" : "";
                  if(8 == x && lc) {
                    if(P[1]) {
                      r = (P[1] >>> 0).toString(16);
                      for(v = (P[0] >>> 0).toString(16);8 > v.length;) {
                        v = "0" + v
                      }
                      r += v
                    }else {
                      r = (P[0] >>> 0).toString(16)
                    }
                  }else {
                    if(0 > h) {
                      h = -h;
                      r = (ta - 1).toString(16);
                      P = [];
                      for(v = 0;v < r.length;v++) {
                        P.push((15 - parseInt(r[v], 16)).toString(16))
                      }
                      for(r = P.join("");r.length < 2 * x;) {
                        r = "f" + r
                      }
                    }else {
                      r = ta.toString(16)
                    }
                  }
                  88 == i && (j = j.toUpperCase(), r = r.toUpperCase())
                }else {
                  112 == i && (0 === ta ? r = "(nil)" : (j = "0x", r = ta.toString(16)))
                }
              }
            }
          }
          if(K) {
            for(;r.length < H;) {
              r = "0" + r
            }
          }
          for(n && (j = 0 > h ? "-" + j : "+" + j);j.length + r.length < D;) {
            y ? r += " " : C ? r = "0" + r : j = " " + j
          }
          r = j + r;
          r.split("").forEach(function(a) {
            f.push(a.charCodeAt(0))
          });
          break;
        case "f":
        ;
        case "F":
        ;
        case "e":
        ;
        case "E":
        ;
        case "g":
        ;
        case "G":
          h = c("double");
          if(isNaN(h)) {
            r = "nan", C = p
          }else {
            if(isFinite(h)) {
              K = p;
              x = Math.min(H, 20);
              if(103 == i || 71 == i) {
                K = l, H = H || 1, x = parseInt(h.toExponential(x).split("e")[1], 10), H > x && -4 <= x ? (i = (103 == i ? "f" : "F").charCodeAt(0), H -= x + 1) : (i = (103 == i ? "e" : "E").charCodeAt(0), H--), x = Math.min(H, 20)
              }
              if(101 == i || 69 == i) {
                r = h.toExponential(x), /[eE][-+]\d$/.test(r) && (r = r.slice(0, -1) + "0" + r.slice(-1))
              }else {
                if(102 == i || 70 == i) {
                  r = h.toFixed(x), 0 === h && jc(h) && (r = "-" + r)
                }
              }
              j = r.split("e");
              if(K && !v) {
                for(;1 < j[0].length && -1 != j[0].indexOf(".") && ("0" == j[0].slice(-1) || "." == j[0].slice(-1));) {
                  j[0] = j[0].slice(0, -1)
                }
              }else {
                for(v && -1 == r.indexOf(".") && (j[0] += ".");H > x++;) {
                  j[0] += "0"
                }
              }
              r = j[0] + (1 < j.length ? "e" + j[1] : "");
              69 == i && (r = r.toUpperCase());
              n && 0 <= h && (r = "+" + r)
            }else {
              r = (0 > h ? "-" : "") + "inf", C = p
            }
          }
          for(;r.length < D;) {
            r = y ? r + " " : C && ("-" == r[0] || "+" == r[0]) ? r[0] + "0" + r.slice(1) : (C ? "0" : " ") + r
          }
          97 > i && (r = r.toUpperCase());
          r.split("").forEach(function(a) {
            f.push(a.charCodeAt(0))
          });
          break;
        case "s":
          C = (n = c("i8*")) ? ic(n) : 6;
          K && (C = Math.min(C, H));
          if(!y) {
            for(;C < D--;) {
              f.push(32)
            }
          }
          if(n) {
            for(v = 0;v < C;v++) {
              f.push(G[n++ | 0])
            }
          }else {
            f = f.concat(J("(null)".substr(0, C), l))
          }
          if(y) {
            for(;C < D--;) {
              f.push(32)
            }
          }
          break;
        case "c":
          for(y && f.push(c("i8"));0 < --D;) {
            f.push(32)
          }
          y || f.push(c("i8"));
          break;
        case "n":
          y = c("i32*");
          B[y >> 2] = f.length;
          break;
        case "%":
          f.push(h);
          break;
        default:
          for(v = j;v < d + 2;v++) {
            f.push(A[v])
          }
      }
      d += 2
    }else {
      f.push(h), d += 1
    }
  }
  return f
}
function mc(a, b, c) {
  c = kc(b, c);
  b = ja();
  a = hc(F(c, "i8", La), 1, c.length, a);
  ka(b);
  return a
}
function nc(a) {
  nc.ia || (z = z + 4095 >> 12 << 12, nc.ia = l, w(ua), nc.hb = ua, ua = function() {
    wa("cannot dynamically allocate, sbrk now has control")
  });
  var b = z;
  0 != a && nc.hb(a);
  return b
}
function U() {
  return B[U.m >> 2]
}
function oc() {
  return!!oc.ta
}
function pc(a) {
  var b = p;
  try {
    a == __ZTIi && (b = l)
  }catch(c) {
  }
  try {
    a == __ZTIj && (b = l)
  }catch(d) {
  }
  try {
    a == __ZTIl && (b = l)
  }catch(e) {
  }
  try {
    a == __ZTIm && (b = l)
  }catch(f) {
  }
  try {
    a == __ZTIx && (b = l)
  }catch(h) {
  }
  try {
    a == __ZTIy && (b = l)
  }catch(i) {
  }
  try {
    a == __ZTIf && (b = l)
  }catch(j) {
  }
  try {
    a == __ZTId && (b = l)
  }catch(n) {
  }
  try {
    a == __ZTIe && (b = l)
  }catch(y) {
  }
  try {
    a == __ZTIc && (b = l)
  }catch(v) {
  }
  try {
    a == __ZTIa && (b = l)
  }catch(C) {
  }
  try {
    a == __ZTIh && (b = l)
  }catch(D) {
  }
  try {
    a == __ZTIs && (b = l)
  }catch(K) {
  }
  try {
    a == __ZTIt && (b = l)
  }catch(H) {
  }
  return b
}
function qc(a, b, c) {
  if(0 == c) {
    return p
  }
  if(0 == b || b == a) {
    return l
  }
  switch(pc(b) ? b : B[B[b >> 2] - 8 >> 2]) {
    case 0:
      return 0 == B[B[a >> 2] - 8 >> 2] ? qc(B[a + 8 >> 2], B[b + 8 >> 2], c) : p;
    case 1:
      return p;
    case 2:
      return qc(a, B[b + 8 >> 2], c);
    default:
      return p
  }
}
function rc(a, b, c) {
  if(!rc.sb) {
    try {
      B[__ZTVN10__cxxabiv119__pointer_type_infoE >> 2] = 0
    }catch(d) {
    }
    try {
      B[pb >> 2] = 1
    }catch(e) {
    }
    try {
      B[ob >> 2] = 2
    }catch(f) {
    }
    rc.sb = l
  }
  B[U.m >> 2] = a;
  B[U.m + 4 >> 2] = b;
  B[U.m + 8 >> 2] = c;
  "uncaught_exception" in oc ? oc.ta++ : oc.ta = 1;
  g(a + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.")
}
function sc(a) {
  try {
    return tc(a)
  }catch(b) {
  }
}
function uc() {
  if(uc.Bb) {
    uc.Bb = p
  }else {
    V.setThrew(0);
    B[U.m + 4 >> 2] = 0;
    var a = B[U.m >> 2], b = B[U.m + 8 >> 2];
    b && (na("vi", b, [a]), B[U.m + 8 >> 2] = 0);
    a && (sc(a), B[U.m >> 2] = 0)
  }
}
var vc = F(1, "i32*", E);
function wc(a) {
  var b, c;
  wc.ia ? (c = B[vc >> 2], b = B[c >> 2]) : (wc.ia = l, W.USER = "root", W.PATH = "/", W.PWD = "/", W.HOME = "/home/emscripten", W.LANG = "en_US.UTF-8", W._ = "./this.program", b = F(1024, "i8", E), c = F(256, "i8*", E), B[c >> 2] = b, B[vc >> 2] = c);
  var d = [], e = 0, f;
  for(f in a) {
    if("string" === typeof a[f]) {
      var h = f + "=" + a[f];
      d.push(h);
      e += h.length
    }
  }
  1024 < e && g(Error("Environment size exceeded TOTAL_ENV_SIZE!"));
  for(a = 0;a < d.length;a++) {
    h = d[a];
    for(e = 0;e < h.length;e++) {
      A[b + e | 0] = h.charCodeAt(e)
    }
    A[b + e | 0] = 0;
    B[c + 4 * a >> 2] = b;
    b += h.length + 1
  }
  B[c + 4 * d.length >> 2] = 0
}
var W = {};
function xc(a) {
  if(0 === a) {
    return 0
  }
  a = Fa(a);
  if(!W.hasOwnProperty(a)) {
    return 0
  }
  xc.J && tc(xc.J);
  xc.J = F(J(W[a]), "i8", Ka);
  return xc.J
}
function yc(a, b, c) {
  if(a in ub) {
    if(ub[a].length > c - 1) {
      return M(N.ab)
    }
    a = ub[a];
    for(c = 0;c < a.length;c++) {
      A[b + c | 0] = a.charCodeAt(c)
    }
    return A[b + c | 0] = 0
  }
  return M(N.A)
}
function zc(a) {
  zc.buffer || (zc.buffer = Oa(256));
  yc(a, zc.buffer, 256);
  return zc.buffer
}
function Ac(a) {
  s.exit(a)
}
function Bc(a, b) {
  var c = db(a & 255);
  A[Bc.J | 0] = c;
  if(-1 == gc(b, Bc.J, 1)) {
    if(c = R[b]) {
      c.error = l
    }
    return-1
  }
  return c
}
var Cc = p, Dc = p, Ec = p, Fc = p, Gc = k, Hc = k;
function Ic(a) {
  return{jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", bmp:"image/bmp", ogg:"audio/ogg", wav:"audio/wav", mp3:"audio/mpeg"}[a.substr(a.lastIndexOf(".") + 1)]
}
var Jc = [];
function Kc() {
  var a = s.canvas;
  Jc.forEach(function(b) {
    b(a.width, a.height)
  })
}
function Lc() {
  var a = s.canvas;
  this.Ib = a.width;
  this.Hb = a.height;
  a.width = screen.width;
  a.height = screen.height;
  "undefined" != typeof SDL && (a = Qa[SDL.screen + 0 * ma >> 2], B[SDL.screen + 0 * ma >> 2] = a | 8388608);
  Kc()
}
function Mc() {
  var a = s.canvas;
  a.width = this.Ib;
  a.height = this.Hb;
  "undefined" != typeof SDL && (a = Qa[SDL.screen + 0 * ma >> 2], B[SDL.screen + 0 * ma >> 2] = a & -8388609);
  Kc()
}
var Nc, Oc, Pc, Qc, rb = ra(4);
B[rb >> 2] = 0;
var Vb = Qb(m, "/", 16895, 0), Rc = T, Sc = {type:Rc, se:{}, Ua:"/", root:m}, Tc;
Tc = O("/", {N:p});
var Uc = Rc.z(Sc);
Uc.z = Sc;
Sc.root = Uc;
Tc && (Tc.d.z = Sc, Tc.d.ub = l, Vb = Sc.root);
zb("/tmp", 511);
zb("/dev", 511);
Nb[259] = {e:{Q:function() {
  return 0
}, write:function() {
  return 0
}}};
Ab("/dev/null", 438, 259);
Mb(1280, {Na:function(a) {
  if(!a.input.length) {
    var b = m;
    if(ca) {
      if(process.Eb.be) {
        return
      }
      b = process.Eb.Q()
    }else {
      "undefined" != typeof window && "function" == typeof window.prompt ? (b = window.prompt("Input: "), b !== m && (b += "\n")) : "function" == typeof readline && (b = readline(), b !== m && (b += "\n"))
    }
    if(!b) {
      return m
    }
    a.input = J(b, l)
  }
  return a.input.shift()
}, W:function(a, b) {
  b === m || 10 === b ? (s.print(a.H.join("")), a.H = []) : a.H.push(Pb.oa(b))
}});
Mb(1536, {W:function(a, b) {
  b === m || 10 === b ? (s.printErr(a.H.join("")), a.H = []) : a.H.push(Pb.oa(b))
}});
Ab("/dev/tty", 438, 1280);
Ab("/dev/tty1", 438, 1536);
zb("/dev/shm", 511);
zb("/dev/shm/tmp", 511);
Xa.unshift({V:function() {
  if(!s.noFSInit && !bc) {
    w(!bc, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
    bc = l;
    s.stdin = s.stdin;
    s.stdout = s.stdout;
    s.stderr = s.stderr;
    s.stdin ? ec("/dev", "stdin", s.stdin) : Bb("/dev/tty", "/dev/stdin");
    s.stdout ? ec("/dev", "stdout", m, s.stdout) : Bb("/dev/tty", "/dev/stdout");
    s.stderr ? ec("/dev", "stderr", m, s.stderr) : Bb("/dev/tty1", "/dev/stderr");
    var a = Db("/dev/stdin", "r");
    B[Tb >> 2] = a.s;
    w(1 === a.s, "invalid handle for stdin (" + a.s + ")");
    a = Db("/dev/stdout", "w");
    B[Ub >> 2] = a.s;
    w(2 === a.s, "invalid handle for stdout (" + a.s + ")");
    a = Db("/dev/stderr", "w");
    B[nb >> 2] = a.s;
    w(3 === a.s, "invalid handle for stderr (" + a.s + ")")
  }
}});
Ya.push({V:function() {
  Yb = p
}});
Za.push({V:function() {
  bc = p;
  for(var a = 0;a < R.length;a++) {
    var b = R[a];
    b && Hb(b)
  }
}});
s.FS_createFolder = function(a, b, c, d) {
  a = S("string" === typeof a ? a : ac(a), b);
  return zb(a, cc(c, d))
};
s.FS_createPath = function(a, b) {
  for(var a = "string" === typeof a ? a : ac(a), c = b.split("/").reverse();c.length;) {
    var d = c.pop();
    if(d) {
      var e = S(a, d);
      try {
        zb(e, 511)
      }catch(f) {
      }
      a = e
    }
  }
  return e
};
s.FS_createDataFile = dc;
s.FS_createPreloadedFile = function(a, b, c, d, e, f, h, i) {
  function j() {
    Ec = document.pointerLockElement === v || document.mozPointerLockElement === v || document.webkitPointerLockElement === v
  }
  function n(c) {
    function j(c) {
      i || dc(a, b, c, d, e);
      f && f();
      jb("cp " + C)
    }
    var n = p;
    s.preloadPlugins.forEach(function(a) {
      !n && a.canHandle(C) && (a.handle(c, C, j, function() {
        h && h();
        jb("cp " + C)
      }), n = l)
    });
    n || j(c)
  }
  s.preloadPlugins || (s.preloadPlugins = []);
  if(!Nc && !ea) {
    Nc = l;
    try {
      new Blob, Oc = l
    }catch(y) {
      Oc = p, console.log("warning: no blob constructor, cannot create blobs with mimetypes")
    }
    Pc = "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : !Oc ? console.log("warning: no BlobBuilder") : m;
    Qc = "undefined" != typeof window ? window.URL ? window.URL : window.webkitURL : console.log("warning: cannot create object URLs");
    s.preloadPlugins.push({canHandle:function(a) {
      return!s.re && /\.(jpg|jpeg|png|bmp)$/i.test(a)
    }, handle:function(a, b, c, d) {
      var e = m;
      if(Oc) {
        try {
          e = new Blob([a], {type:Ic(b)}), e.size !== a.length && (e = new Blob([(new Uint8Array(a)).buffer], {type:Ic(b)}))
        }catch(f) {
          var h = "Blob constructor present but fails: " + f + "; falling back to blob builder";
          oa || (oa = {});
          oa[h] || (oa[h] = 1, s.P(h))
        }
      }
      e || (e = new Pc, e.append((new Uint8Array(a)).buffer), e = e.getBlob());
      var i = Qc.createObjectURL(e), j = new Image;
      j.onload = function() {
        w(j.complete, "Image " + b + " could not be decoded");
        var d = document.createElement("canvas");
        d.width = j.width;
        d.height = j.height;
        d.getContext("2d").drawImage(j, 0, 0);
        s.preloadedImages[b] = d;
        Qc.revokeObjectURL(i);
        c && c(a)
      };
      j.onerror = function() {
        console.log("Image " + i + " could not be decoded");
        d && d()
      };
      j.src = i
    }});
    s.preloadPlugins.push({canHandle:function(a) {
      return!s.qe && a.substr(-4) in {".ogg":1, ".wav":1, ".mp3":1}
    }, handle:function(a, b, c, d) {
      function e(d) {
        h || (h = l, s.preloadedAudios[b] = d, c && c(a))
      }
      function f() {
        h || (h = l, s.preloadedAudios[b] = new Audio, d && d())
      }
      var h = p;
      if(Oc) {
        try {
          var i = new Blob([a], {type:Ic(b)})
        }catch(j) {
          return f()
        }
        var i = Qc.createObjectURL(i), n = new Audio;
        n.addEventListener("canplaythrough", function() {
          e(n)
        }, p);
        n.onerror = function() {
          if(!h) {
            console.log("warning: browser could not fully decode audio " + b + ", trying slower base64 approach");
            for(var c = "", d = 0, f = 0, i = 0;i < a.length;i++) {
              d = d << 8 | a[i];
              for(f += 8;6 <= f;) {
                var j = d >> f - 6 & 63, f = f - 6, c = c + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[j]
              }
            }
            2 == f ? (c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(d & 3) << 4], c += "==") : 4 == f && (c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(d & 15) << 2], c += "=");
            n.src = "data:audio/x-" + b.substr(-3) + ";base64," + c;
            e(n)
          }
        };
        n.src = i;
        setTimeout(function() {
          za || e(n)
        }, 1E4)
      }else {
        return f()
      }
    }});
    var v = s.canvas;
    v.qa = v.requestPointerLock || v.mozRequestPointerLock || v.webkitRequestPointerLock;
    v.La = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || aa();
    v.La = v.La.bind(document);
    document.addEventListener("pointerlockchange", j, p);
    document.addEventListener("mozpointerlockchange", j, p);
    document.addEventListener("webkitpointerlockchange", j, p);
    s.elementPointerLock && v.addEventListener("click", function(a) {
      !Ec && v.qa && (v.qa(), a.preventDefault())
    }, p)
  }
  var C, D = S.apply(m, [a, b]);
  "/" == D[0] && (D = D.substr(1));
  C = D;
  ib("cp " + C);
  if("string" == typeof c) {
    var K = h, H = function() {
      K ? K() : g('Loading data file "' + c + '" failed.')
    }, x = new XMLHttpRequest;
    x.open("GET", c, l);
    x.responseType = "arraybuffer";
    x.onload = function() {
      if(200 == x.status || 0 == x.status && x.response) {
        var a = x.response;
        w(a, 'Loading data file "' + c + '" failed (no arrayBuffer).');
        a = new Uint8Array(a);
        n(a);
        jb("al " + c)
      }else {
        H()
      }
    };
    x.onerror = H;
    x.send(m);
    ib("al " + c)
  }else {
    n(c)
  }
};
s.FS_createLazyFile = function(a, b, c, d, e) {
  var f, h;
  "undefined" !== typeof XMLHttpRequest ? (ea || g("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc"), f = function() {
    this.ma = p;
    this.T = []
  }, f.prototype.get = function(a) {
    if(!(a > this.length - 1 || 0 > a)) {
      var b = a % this.S;
      return this.pb(Math.floor(a / this.S))[b]
    }
  }, f.prototype.Cb = function(a) {
    this.pb = a
  }, f.prototype.Fa = function() {
    var a = new XMLHttpRequest;
    a.open("HEAD", c, p);
    a.send(m);
    200 <= a.status && 300 > a.status || 304 === a.status || g(Error("Couldn't load " + c + ". Status: " + a.status));
    var b = Number(a.getResponseHeader("Content-length")), d, e = 1048576;
    if(!((d = a.getResponseHeader("Accept-Ranges")) && "bytes" === d)) {
      e = b
    }
    var f = this;
    f.Cb(function(a) {
      var d = a * e, h = (a + 1) * e - 1, h = Math.min(h, b - 1);
      if("undefined" === typeof f.T[a]) {
        var i = f.T;
        d > h && g(Error("invalid range (" + d + ", " + h + ") or no bytes requested!"));
        h > b - 1 && g(Error("only " + b + " bytes available! programmer error!"));
        var j = new XMLHttpRequest;
        j.open("GET", c, p);
        b !== e && j.setRequestHeader("Range", "bytes=" + d + "-" + h);
        "undefined" != typeof Uint8Array && (j.responseType = "arraybuffer");
        j.overrideMimeType && j.overrideMimeType("text/plain; charset=x-user-defined");
        j.send(m);
        200 <= j.status && 300 > j.status || 304 === j.status || g(Error("Couldn't load " + c + ". Status: " + j.status));
        d = j.response !== k ? new Uint8Array(j.response || []) : J(j.responseText || "", l);
        i[a] = d
      }
      "undefined" === typeof f.T[a] && g(Error("doXHR failed!"));
      return f.T[a]
    });
    this.gb = b;
    this.fb = e;
    this.ma = l
  }, f = new f, Object.defineProperty(f, "length", {get:function() {
    this.ma || this.Fa();
    return this.gb
  }}), Object.defineProperty(f, "chunkSize", {get:function() {
    this.ma || this.Fa();
    return this.fb
  }}), h = k) : (h = c, f = k);
  var i, a = S("string" === typeof a ? a : ac(a), b);
  i = yb(a, cc(d, e));
  f ? i.g = f : h && (i.g = m, i.url = h);
  var j = {};
  Object.keys(i.e).forEach(function(a) {
    var b = i.e[a];
    j[a] = function() {
      var a;
      if(i.ke || i.le || i.link || i.g) {
        a = l
      }else {
        a = l;
        "undefined" !== typeof XMLHttpRequest && g(Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."));
        if(s.read) {
          try {
            i.g = J(s.read(i.url), l)
          }catch(c) {
            a = p
          }
        }else {
          g(Error("Cannot load without read() or XMLHttpRequest."))
        }
        a || M(N.I)
      }
      a || g(new Q(N.I));
      return b.apply(m, arguments)
    }
  });
  j.Q = function(a, b, c, d, e) {
    a = a.d.g;
    d = Math.min(a.length - e, d);
    if(a.slice) {
      for(var f = 0;f < d;f++) {
        b[c + f] = a[e + f]
      }
    }else {
      for(f = 0;f < d;f++) {
        b[c + f] = a.get(e + f)
      }
    }
    return d
  };
  i.e = j;
  return i
};
s.FS_createLink = function(a, b, c) {
  a = S("string" === typeof a ? a : ac(a), b);
  return Bb(c, a)
};
s.FS_createDevice = ec;
U.m = F(12, "void*", E);
wc(W);
Bc.J = F([0], "i8", E);
s.requestFullScreen = function(a, b) {
  function c() {
    Dc = p;
    (document.webkitFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.fullScreenElement || document.fullscreenElement) === d ? (d.Ga = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen, d.Ga = d.Ga.bind(document), Gc && d.qa(), Dc = l, Hc && Lc()) : Hc && Mc();
    if(s.onFullScreen) {
      s.onFullScreen(Dc)
    }
  }
  Gc = a;
  Hc = b;
  "undefined" === typeof Gc && (Gc = l);
  "undefined" === typeof Hc && (Hc = p);
  var d = s.canvas;
  Fc || (Fc = l, document.addEventListener("fullscreenchange", c, p), document.addEventListener("mozfullscreenchange", c, p), document.addEventListener("webkitfullscreenchange", c, p));
  d.Ab = d.requestFullScreen || d.mozRequestFullScreen || (d.webkitRequestFullScreen ? function() {
    d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
  } : m);
  d.Ab()
};
s.requestAnimationFrame = function(a) {
  window.requestAnimationFrame || (window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || window.setTimeout);
  window.requestAnimationFrame(a)
};
s.pauseMainLoop = aa();
s.resumeMainLoop = function() {
  Cc && (Cc = p, m())
};
s.getUserMedia = function() {
  window.Ma || (window.Ma = navigator.getUserMedia || navigator.mozGetUserMedia);
  window.Ma(k)
};
Sa = u = xa(sa);
Ta = Sa + 5242880;
Ua = z = xa(Ta);
w(Ua < va);
var Vc = F([8, 7, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", 3), Wc = F([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 
2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 
0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", 3), Xc = Math.min;
var V = (function(global,env,buffer) {
// EMSCRIPTEN_START_ASM
 "use asm";
 var a = new global.Int8Array(buffer);
 var b = new global.Int16Array(buffer);
 var c = new global.Int32Array(buffer);
 var d = new global.Uint8Array(buffer);
 var e = new global.Uint16Array(buffer);
 var f = new global.Uint32Array(buffer);
 var g = new global.Float32Array(buffer);
 var h = new global.Float64Array(buffer);
 var i = env.STACKTOP | 0;
 var j = env.STACK_MAX | 0;
 var k = env.tempDoublePtr | 0;
 var l = env.ABORT | 0;
 var m = env.cttz_i8 | 0;
 var n = env.ctlz_i8 | 0;
 var o = env._stderr | 0;
 var p = env.__ZTVN10__cxxabiv120__si_class_type_infoE | 0;
 var q = env.__ZTVN10__cxxabiv117__class_type_infoE | 0;
 var r = env.___progname | 0;
 var s = +env.NaN;
 var t = +env.Infinity;
 var u = 0;
 var v = 0;
 var w = 0;
 var x = 0;
 var y = 0, z = 0, A = 0, B = 0, C = 0.0, D = 0, E = 0, F = 0, G = 0.0;
 var H = 0;
 var I = 0;
 var J = 0;
 var K = 0;
 var L = 0;
 var M = 0;
 var N = 0;
 var O = 0;
 var P = 0;
 var Q = 0;
 var R = global.Math.floor;
 var S = global.Math.abs;
 var T = global.Math.sqrt;
 var U = global.Math.pow;
 var V = global.Math.cos;
 var W = global.Math.sin;
 var X = global.Math.tan;
 var Y = global.Math.acos;
 var Z = global.Math.asin;
 var _ = global.Math.atan;
 var $ = global.Math.atan2;
 var aa = global.Math.exp;
 var ab = global.Math.log;
 var ac = global.Math.ceil;
 var ad = global.Math.imul;
 var ae = env.abort;
 var af = env.assert;
 var ag = env.asmPrintInt;
 var ah = env.asmPrintFloat;
 var ai = env.min;
 var aj = env.invoke_vi;
 var ak = env.invoke_vii;
 var al = env.invoke_ii;
 var am = env.invoke_viii;
 var an = env.invoke_v;
 var ao = env.invoke_iii;
 var ap = env._strncmp;
 var aq = env._llvm_va_end;
 var ar = env._sysconf;
 var as = env.___cxa_throw;
 var at = env._strerror;
 var au = env._abort;
 var av = env._fprintf;
 var aw = env._llvm_eh_exception;
 var ax = env.___cxa_free_exception;
 var ay = env._fflush;
 var az = env.___buildEnvironment;
 var aA = env.__reallyNegative;
 var aB = env._strchr;
 var aC = env._fputc;
 var aD = env.___setErrNo;
 var aE = env._fwrite;
 var aF = env._send;
 var aG = env._write;
 var aH = env._exit;
 var aI = env.___cxa_find_matching_catch;
 var aJ = env.___cxa_allocate_exception;
 var aK = env._isspace;
 var aL = env.__formatString;
 var aM = env.___resumeException;
 var aN = env._llvm_uadd_with_overflow_i32;
 var aO = env.___cxa_does_inherit;
 var aP = env._getenv;
 var aQ = env._vfprintf;
 var aR = env.___cxa_begin_catch;
 var aS = env.__ZSt18uncaught_exceptionv;
 var aT = env._pwrite;
 var aU = env.___cxa_call_unexpected;
 var aV = env._sbrk;
 var aW = env._strerror_r;
 var aX = env.___errno_location;
 var aY = env.___gxx_personality_v0;
 var aZ = env.___cxa_is_number_type;
 var a_ = env._time;
 var a$ = env.__exit;
 var a0 = env.___cxa_end_catch;
// EMSCRIPTEN_START_FUNCS
function a7(a) {
 a = a | 0;
 var b = 0;
 b = i;
 i = i + a | 0;
 i = i + 7 >> 3 << 3;
 return b | 0;
}
function a8() {
 return i | 0;
}
function a9(a) {
 a = a | 0;
 i = a;
}
function ba(a, b) {
 a = a | 0;
 b = b | 0;
 if ((u | 0) == 0) {
  u = a;
  v = b;
 }
}
function bb(b) {
 b = b | 0;
 a[k] = a[b];
 a[k + 1 | 0] = a[b + 1 | 0];
 a[k + 2 | 0] = a[b + 2 | 0];
 a[k + 3 | 0] = a[b + 3 | 0];
}
function bc(b) {
 b = b | 0;
 a[k] = a[b];
 a[k + 1 | 0] = a[b + 1 | 0];
 a[k + 2 | 0] = a[b + 2 | 0];
 a[k + 3 | 0] = a[b + 3 | 0];
 a[k + 4 | 0] = a[b + 4 | 0];
 a[k + 5 | 0] = a[b + 5 | 0];
 a[k + 6 | 0] = a[b + 6 | 0];
 a[k + 7 | 0] = a[b + 7 | 0];
}
function bd(a) {
 a = a | 0;
 H = a;
}
function be(a) {
 a = a | 0;
 I = a;
}
function bf(a) {
 a = a | 0;
 J = a;
}
function bg(a) {
 a = a | 0;
 K = a;
}
function bh(a) {
 a = a | 0;
 L = a;
}
function bi(a) {
 a = a | 0;
 M = a;
}
function bj(a) {
 a = a | 0;
 N = a;
}
function bk(a) {
 a = a | 0;
 O = a;
}
function bl(a) {
 a = a | 0;
 P = a;
}
function bm(a) {
 a = a | 0;
 Q = a;
}
function bn() {
 c[170] = q + 8;
 c[172] = p + 8;
 c[176] = p + 8;
}
function bo(b, c, d) {
 b = b | 0;
 c = c | 0;
 d = d | 0;
 var e = 0;
 if ((d | 0) == 0) {
  return;
 } else {
  e = 0;
 }
 do {
  a[b + e | 0] = a[c + e | 0] | 0;
  e = e + 1 | 0;
 } while (e >>> 0 < d >>> 0);
 return;
}
function bp(b, c, d) {
 b = b | 0;
 c = c | 0;
 d = d | 0;
 var e = 0, f = 0;
 if ((d | 0) == 0) {
  return;
 } else {
  e = 0;
 }
 do {
  f = b + e | 0;
  a[f] = a[f] ^ a[c + e | 0];
  e = e + 1 | 0;
 } while (e >>> 0 < d >>> 0);
 return;
}
function bq(a) {
 a = a | 0;
 var b = 0, c = 0, e = 0, f = 0;
 b = d[a + 1 | 0] | 0;
 c = d[a + 2 | 0] | 0;
 e = d[a + 3 | 0] | 0;
 f = cN(b << 8 | 0 >>> 24 | (d[a] | 0) | (c << 16 | 0 >>> 16) | (e << 24 | 0 >>> 8) | (0 << 8 | 0 >>> 24), 0 << 8 | b >>> 24 | (0 << 16 | c >>> 16) | (0 << 24 | e >>> 8) | (d[a + 4 | 0] | 0) | ((d[a + 5 | 0] | 0) << 8 | 0 >>> 24), 0 << 16 | 0 >>> 16, (d[a + 6 | 0] | 0) << 16 | 0 >>> 16) | 0;
 e = cN(f, H, 0 << 24 | 0 >>> 8, (d[a + 7 | 0] | 0) << 24 | 0 >>> 8) | 0;
 return (H = H, e) | 0;
}
function br(a) {
 a = a | 0;
 return (d[a + 1 | 0] | 0) << 8 | (d[a] | 0) | (d[a + 2 | 0] | 0) << 16 | (d[a + 3 | 0] | 0) << 24 | 0;
}
function bs(b, c) {
 b = b | 0;
 c = c | 0;
 a[b] = c & 255;
 a[b + 1 | 0] = c >>> 8 & 255;
 a[b + 2 | 0] = c >>> 16 & 255;
 a[b + 3 | 0] = c >>> 24 & 255;
 return;
}
function bt(a) {
 a = a | 0;
 c[a + 36 >> 2] = 0;
 c[a + 32 >> 2] = 0;
 c[a >> 2] = 1779033703;
 c[a + 4 >> 2] = -1150833019;
 c[a + 8 >> 2] = 1013904242;
 c[a + 12 >> 2] = -1521486534;
 c[a + 16 >> 2] = 1359893119;
 c[a + 20 >> 2] = -1694144372;
 c[a + 24 >> 2] = 528734635;
 c[a + 28 >> 2] = 1541459225;
 return;
}
function bu(a, b, d, e, f, g, h, i, j, k) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 e = e | 0;
 f = f | 0;
 g = g | 0;
 h = h | 0;
 i = i | 0;
 j = j | 0;
 k = k | 0;
 var l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0;
 l = cX(i, 0, h, 0) | 0;
 m = H;
 n = 0;
 if (m >>> 0 > n >>> 0 | m >>> 0 == n >>> 0 & l >>> 0 > 1073741823 >>> 0) {
  c[(aX() | 0) >> 2] = 27;
  o = -1;
  return o | 0;
 }
 l = cN(f, g, -1, -1) | 0;
 if ((l & f | 0) != 0 | (H & g | 0) != 0 | (f | 0) == 0 & (g | 0) == 0) {
  c[(aX() | 0) >> 2] = 22;
  o = -1;
  return o | 0;
 }
 do {
  if (!((33554431 / (i >>> 0) | 0) >>> 0 < h >>> 0 | h >>> 0 > 16777215)) {
   l = 0;
   if (l >>> 0 < g >>> 0 | l >>> 0 == g >>> 0 & (33554431 / (h >>> 0) | 0) >>> 0 < f >>> 0) {
    break;
   }
   l = h << 7;
   n = bL(ad(l, i) | 0) | 0;
   if ((n | 0) == 0) {
    o = -1;
    return o | 0;
   }
   m = bL(h << 8) | 0;
   do {
    if ((m | 0) != 0) {
     p = cX(l, 0, f, g) | 0;
     q = bL(p) | 0;
     if ((q | 0) == 0) {
      bM(m);
      break;
     }
     p = ad(i << 7, h) | 0;
     bJ(a, b, d, e, 1, 0, n, p);
     if ((i | 0) != 0) {
      r = h << 7;
      s = 0;
      do {
       bv(n + (ad(r, s) | 0) | 0, h, f, g, q, m);
       s = s + 1 | 0;
      } while (s >>> 0 < i >>> 0);
     }
     bJ(a, b, n, p, 1, 0, j, k);
     bM(q);
     bM(m);
     bM(n);
     o = 0;
     return o | 0;
    }
   } while (0);
   bM(n);
   o = -1;
   return o | 0;
  }
 } while (0);
 c[(aX() | 0) >> 2] = 12;
 o = -1;
 return o | 0;
}
function bv(a, b, c, d, e, f) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 e = e | 0;
 f = f | 0;
 var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
 g = b << 7;
 h = f + g | 0;
 bo(f, a, g);
 if ((c | 0) == 0 & (d | 0) == 0) {
  bo(a, f, g);
  return;
 }
 i = g;
 j = 0;
 k = 0;
 l = 0;
 do {
  m = cX(l, k, i, j) | 0;
  bo(e + m | 0, f, g);
  bw(f, h, b);
  l = cN(l, k, 1, 0) | 0;
  k = H;
 } while (k >>> 0 < d >>> 0 | k >>> 0 == d >>> 0 & l >>> 0 < c >>> 0);
 if ((c | 0) == 0 & (d | 0) == 0) {
  bo(a, f, g);
  return;
 }
 l = cN(c, d, -1, -1) | 0;
 k = H;
 j = g;
 i = 0;
 m = 0;
 n = 0;
 do {
  o = bx(f, b) | 0;
  p = cX(o & l, H & k, j, i) | 0;
  bp(f, e + p | 0, g);
  bw(f, h, b);
  n = cN(n, m, 1, 0) | 0;
  m = H;
 } while (m >>> 0 < d >>> 0 | m >>> 0 == d >>> 0 & n >>> 0 < c >>> 0);
 bo(a, f, g);
 return;
}
function bw(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
 d = i;
 i = i + 64 | 0;
 e = d | 0;
 f = c << 1;
 bo(e, a + ((c << 7) - 64) | 0, 64);
 if ((f | 0) != 0) {
  g = 0;
  do {
   h = g << 6;
   bp(e, a + h | 0, 64);
   by(e);
   bo(b + h | 0, e, 64);
   g = g + 1 | 0;
  } while (g >>> 0 < f >>> 0);
 }
 if ((c | 0) == 0) {
  i = d;
  return;
 } else {
  j = 0;
 }
 do {
  bo(a + (j << 6) | 0, b + (j << 7) | 0, 64);
  j = j + 1 | 0;
 } while (j >>> 0 < c >>> 0);
 if ((c | 0) == 0) {
  i = d;
  return;
 } else {
  k = 0;
 }
 do {
  bo(a + (k + c << 6) | 0, b + (k << 7 | 64) | 0, 64);
  k = k + 1 | 0;
 } while (k >>> 0 < c >>> 0);
 i = d;
 return;
}
function bx(a, b) {
 a = a | 0;
 b = b | 0;
 var c = 0;
 c = bq(a + ((b << 7) - 64) | 0) | 0;
 return (H = H, c) | 0;
}
function by(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, _ = 0, $ = 0, aa = 0, ab = 0;
 b = i;
 i = i + 128 | 0;
 d = b | 0;
 e = b + 64 | 0;
 f = 0;
 do {
  c[d + (f << 2) >> 2] = br(a + (f << 2) | 0) | 0;
  f = f + 1 | 0;
 } while (f >>> 0 < 16);
 f = d;
 g = e;
 cK(g | 0, f | 0, 64) | 0;
 f = e | 0;
 g = e + 48 | 0;
 h = e + 16 | 0;
 j = e + 32 | 0;
 k = e + 20 | 0;
 l = e + 4 | 0;
 m = e + 36 | 0;
 n = e + 52 | 0;
 o = e + 40 | 0;
 p = e + 24 | 0;
 q = e + 56 | 0;
 r = e + 8 | 0;
 s = e + 60 | 0;
 t = e + 44 | 0;
 u = e + 12 | 0;
 v = e + 28 | 0;
 w = 0;
 x = c[f >> 2] | 0;
 y = c[g >> 2] | 0;
 z = c[h >> 2] | 0;
 A = c[j >> 2] | 0;
 B = c[k >> 2] | 0;
 C = c[l >> 2] | 0;
 D = c[m >> 2] | 0;
 E = c[n >> 2] | 0;
 F = c[o >> 2] | 0;
 G = c[p >> 2] | 0;
 H = c[q >> 2] | 0;
 I = c[r >> 2] | 0;
 J = c[s >> 2] | 0;
 K = c[t >> 2] | 0;
 L = c[u >> 2] | 0;
 M = c[v >> 2] | 0;
 do {
  N = y + x | 0;
  O = (N << 7 | N >>> 25) ^ z;
  N = O + x | 0;
  P = (N << 9 | N >>> 23) ^ A;
  N = P + O | 0;
  Q = (N << 13 | N >>> 19) ^ y;
  N = Q + P | 0;
  R = (N << 18 | N >>> 14) ^ x;
  N = C + B | 0;
  S = (N << 7 | N >>> 25) ^ D;
  N = S + B | 0;
  T = (N << 9 | N >>> 23) ^ E;
  N = T + S | 0;
  U = (N << 13 | N >>> 19) ^ C;
  N = U + T | 0;
  V = (N << 18 | N >>> 14) ^ B;
  N = G + F | 0;
  W = (N << 7 | N >>> 25) ^ H;
  N = W + F | 0;
  X = (N << 9 | N >>> 23) ^ I;
  N = X + W | 0;
  Y = (N << 13 | N >>> 19) ^ G;
  N = Y + X | 0;
  Z = (N << 18 | N >>> 14) ^ F;
  N = K + J | 0;
  _ = (N << 7 | N >>> 25) ^ L;
  N = _ + J | 0;
  $ = (N << 9 | N >>> 23) ^ M;
  N = $ + _ | 0;
  aa = (N << 13 | N >>> 19) ^ K;
  N = aa + $ | 0;
  ab = (N << 18 | N >>> 14) ^ J;
  N = _ + R | 0;
  C = (N << 7 | N >>> 25) ^ U;
  U = C + R | 0;
  I = (U << 9 | U >>> 23) ^ X;
  X = I + C | 0;
  L = (X << 13 | X >>> 19) ^ _;
  _ = L + I | 0;
  x = (_ << 18 | _ >>> 14) ^ R;
  R = O + V | 0;
  G = (R << 7 | R >>> 25) ^ Y;
  Y = G + V | 0;
  M = (Y << 9 | Y >>> 23) ^ $;
  $ = M + G | 0;
  z = ($ << 13 | $ >>> 19) ^ O;
  O = z + M | 0;
  B = (O << 18 | O >>> 14) ^ V;
  V = S + Z | 0;
  K = (V << 7 | V >>> 25) ^ aa;
  aa = K + Z | 0;
  A = (aa << 9 | aa >>> 23) ^ P;
  P = A + K | 0;
  D = (P << 13 | P >>> 19) ^ S;
  S = D + A | 0;
  F = (S << 18 | S >>> 14) ^ Z;
  Z = W + ab | 0;
  y = (Z << 7 | Z >>> 25) ^ Q;
  Q = y + ab | 0;
  E = (Q << 9 | Q >>> 23) ^ T;
  T = E + y | 0;
  H = (T << 13 | T >>> 19) ^ W;
  W = H + E | 0;
  J = (W << 18 | W >>> 14) ^ ab;
  w = w + 2 | 0;
 } while (w >>> 0 < 8);
 c[f >> 2] = x;
 c[g >> 2] = y;
 c[h >> 2] = z;
 c[j >> 2] = A;
 c[k >> 2] = B;
 c[l >> 2] = C;
 c[m >> 2] = D;
 c[n >> 2] = E;
 c[o >> 2] = F;
 c[p >> 2] = G;
 c[q >> 2] = H;
 c[r >> 2] = I;
 c[s >> 2] = J;
 c[t >> 2] = K;
 c[u >> 2] = L;
 c[v >> 2] = M;
 M = d | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e >> 2] | 0);
 M = d + 4 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 4 >> 2] | 0);
 M = d + 8 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 8 >> 2] | 0);
 M = d + 12 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 12 >> 2] | 0);
 M = d + 16 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 16 >> 2] | 0);
 M = d + 20 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 20 >> 2] | 0);
 M = d + 24 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 24 >> 2] | 0);
 M = d + 28 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 28 >> 2] | 0);
 M = d + 32 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 32 >> 2] | 0);
 M = d + 36 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 36 >> 2] | 0);
 M = d + 40 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 40 >> 2] | 0);
 M = d + 44 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 44 >> 2] | 0);
 M = d + 48 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 48 >> 2] | 0);
 M = d + 52 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 52 >> 2] | 0);
 M = d + 56 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 56 >> 2] | 0);
 M = d + 60 | 0;
 c[M >> 2] = (c[M >> 2] | 0) + (c[e + 60 >> 2] | 0);
 e = 0;
 do {
  bs(a + (e << 2) | 0, c[d + (e << 2) >> 2] | 0);
  e = e + 1 | 0;
 } while (e >>> 0 < 16);
 i = b;
 return;
}
function bz(a, b, d) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
 e = a + 32 | 0;
 f = a + 36 | 0;
 g = c[f >> 2] | 0;
 h = g >>> 3 & 63;
 i = aN(g | 0, d << 3 | 0) | 0;
 c[f >> 2] = i;
 if (H) {
  i = e | 0;
  c[i >> 2] = (c[i >> 2] | 0) + 1;
 }
 i = e | 0;
 c[i >> 2] = (c[i >> 2] | 0) + (d >>> 29);
 i = 64 - h | 0;
 e = a + 40 + h | 0;
 if (i >>> 0 > d >>> 0) {
  cK(e | 0, b | 0, d) | 0;
  return;
 }
 cK(e | 0, b | 0, i) | 0;
 e = a | 0;
 h = a + 40 | 0;
 bA(e, h);
 a = b + i | 0;
 b = d - i | 0;
 if (b >>> 0 > 63) {
  i = b;
  d = a;
  while (1) {
   bA(e, d);
   f = d + 64 | 0;
   g = i - 64 | 0;
   if (g >>> 0 > 63) {
    i = g;
    d = f;
   } else {
    j = g;
    k = f;
    break;
   }
  }
 } else {
  j = b;
  k = a;
 }
 cK(h | 0, k | 0, j) | 0;
 return;
}
function bA(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0;
 d = i;
 i = i + 288 | 0;
 e = d | 0;
 f = d + 256 | 0;
 g = e | 0;
 bK(g, b);
 b = 16;
 do {
  h = c[e + (b - 2 << 2) >> 2] | 0;
  j = c[e + (b - 15 << 2) >> 2] | 0;
  c[e + (b << 2) >> 2] = (c[e + (b - 16 << 2) >> 2] | 0) + (c[e + (b - 7 << 2) >> 2] | 0) + ((h >>> 19 | h << 13) ^ h >>> 10 ^ (h >>> 17 | h << 15)) + ((j >>> 18 | j << 14) ^ j >>> 3 ^ (j >>> 7 | j << 25));
  b = b + 1 | 0;
 } while ((b | 0) < 64);
 b = f;
 j = a;
 cK(b | 0, j | 0, 32) | 0;
 j = f + 28 | 0;
 b = f + 16 | 0;
 h = c[b >> 2] | 0;
 k = f + 20 | 0;
 l = f + 24 | 0;
 m = c[l >> 2] | 0;
 n = (c[j >> 2] | 0) + 1116352408 + (c[g >> 2] | 0) + ((h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7)) + ((m ^ c[k >> 2]) & h ^ m) | 0;
 m = f | 0;
 h = c[m >> 2] | 0;
 g = f + 4 | 0;
 o = c[g >> 2] | 0;
 p = f + 8 | 0;
 q = c[p >> 2] | 0;
 r = f + 12 | 0;
 c[r >> 2] = (c[r >> 2] | 0) + n;
 s = ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + n + ((q | o) & h | q & o) | 0;
 c[j >> 2] = s;
 o = c[r >> 2] | 0;
 q = c[k >> 2] | 0;
 h = (c[l >> 2] | 0) + 1899447441 + (c[e + 4 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[b >> 2]) & o ^ q) | 0;
 q = c[m >> 2] | 0;
 o = c[g >> 2] | 0;
 c[p >> 2] = (c[p >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[l >> 2] = n;
 q = c[p >> 2] | 0;
 o = c[b >> 2] | 0;
 s = (c[k >> 2] | 0) - 1245643825 + (c[e + 8 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[r >> 2]) & q ^ o) | 0;
 o = c[j >> 2] | 0;
 q = c[m >> 2] | 0;
 c[g >> 2] = (c[g >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[k >> 2] = h;
 o = c[g >> 2] | 0;
 q = c[r >> 2] | 0;
 n = (c[b >> 2] | 0) - 373957723 + (c[e + 12 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[p >> 2]) & o ^ q) | 0;
 q = c[l >> 2] | 0;
 o = c[j >> 2] | 0;
 c[m >> 2] = (c[m >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[b >> 2] = s;
 q = c[m >> 2] | 0;
 o = c[p >> 2] | 0;
 h = (c[r >> 2] | 0) + 961987163 + (c[e + 16 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[g >> 2]) & q ^ o) | 0;
 o = c[k >> 2] | 0;
 q = c[l >> 2] | 0;
 c[j >> 2] = (c[j >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[r >> 2] = n;
 o = c[j >> 2] | 0;
 q = c[g >> 2] | 0;
 s = (c[p >> 2] | 0) + 1508970993 + (c[e + 20 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[m >> 2]) & o ^ q) | 0;
 q = c[b >> 2] | 0;
 o = c[k >> 2] | 0;
 c[l >> 2] = (c[l >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[p >> 2] = h;
 q = c[l >> 2] | 0;
 o = c[m >> 2] | 0;
 n = (c[g >> 2] | 0) - 1841331548 + (c[e + 24 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[j >> 2]) & q ^ o) | 0;
 o = c[r >> 2] | 0;
 q = c[b >> 2] | 0;
 c[k >> 2] = (c[k >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[g >> 2] = s;
 o = c[k >> 2] | 0;
 q = c[j >> 2] | 0;
 h = (c[m >> 2] | 0) - 1424204075 + (c[e + 28 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[l >> 2]) & o ^ q) | 0;
 q = c[p >> 2] | 0;
 o = c[r >> 2] | 0;
 c[b >> 2] = (c[b >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[m >> 2] = n;
 q = c[b >> 2] | 0;
 o = c[l >> 2] | 0;
 s = (c[j >> 2] | 0) - 670586216 + (c[e + 32 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[k >> 2]) & q ^ o) | 0;
 o = c[g >> 2] | 0;
 q = c[p >> 2] | 0;
 c[r >> 2] = (c[r >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[j >> 2] = h;
 o = c[r >> 2] | 0;
 q = c[k >> 2] | 0;
 n = (c[l >> 2] | 0) + 310598401 + (c[e + 36 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[b >> 2]) & o ^ q) | 0;
 q = c[m >> 2] | 0;
 o = c[g >> 2] | 0;
 c[p >> 2] = (c[p >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[l >> 2] = s;
 q = c[p >> 2] | 0;
 o = c[b >> 2] | 0;
 h = (c[k >> 2] | 0) + 607225278 + (c[e + 40 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[r >> 2]) & q ^ o) | 0;
 o = c[j >> 2] | 0;
 q = c[m >> 2] | 0;
 c[g >> 2] = (c[g >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[k >> 2] = n;
 o = c[g >> 2] | 0;
 q = c[r >> 2] | 0;
 s = (c[b >> 2] | 0) + 1426881987 + (c[e + 44 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[p >> 2]) & o ^ q) | 0;
 q = c[l >> 2] | 0;
 o = c[j >> 2] | 0;
 c[m >> 2] = (c[m >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[b >> 2] = h;
 q = c[m >> 2] | 0;
 o = c[p >> 2] | 0;
 n = (c[r >> 2] | 0) + 1925078388 + (c[e + 48 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[g >> 2]) & q ^ o) | 0;
 o = c[k >> 2] | 0;
 q = c[l >> 2] | 0;
 c[j >> 2] = (c[j >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[r >> 2] = s;
 o = c[j >> 2] | 0;
 q = c[g >> 2] | 0;
 h = (c[p >> 2] | 0) - 2132889090 + (c[e + 52 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[m >> 2]) & o ^ q) | 0;
 q = c[b >> 2] | 0;
 o = c[k >> 2] | 0;
 c[l >> 2] = (c[l >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[p >> 2] = n;
 q = c[l >> 2] | 0;
 o = c[m >> 2] | 0;
 s = (c[g >> 2] | 0) - 1680079193 + (c[e + 56 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[j >> 2]) & q ^ o) | 0;
 o = c[r >> 2] | 0;
 q = c[b >> 2] | 0;
 c[k >> 2] = (c[k >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[g >> 2] = h;
 o = c[k >> 2] | 0;
 q = c[j >> 2] | 0;
 n = (c[m >> 2] | 0) - 1046744716 + (c[e + 60 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[l >> 2]) & o ^ q) | 0;
 q = c[p >> 2] | 0;
 o = c[r >> 2] | 0;
 c[b >> 2] = (c[b >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[m >> 2] = s;
 q = c[b >> 2] | 0;
 o = c[l >> 2] | 0;
 h = (c[j >> 2] | 0) - 459576895 + (c[e + 64 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[k >> 2]) & q ^ o) | 0;
 o = c[g >> 2] | 0;
 q = c[p >> 2] | 0;
 c[r >> 2] = (c[r >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[j >> 2] = n;
 o = c[r >> 2] | 0;
 q = c[k >> 2] | 0;
 s = (c[l >> 2] | 0) - 272742522 + (c[e + 68 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[b >> 2]) & o ^ q) | 0;
 q = c[m >> 2] | 0;
 o = c[g >> 2] | 0;
 c[p >> 2] = (c[p >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[l >> 2] = h;
 q = c[p >> 2] | 0;
 o = c[b >> 2] | 0;
 n = (c[k >> 2] | 0) + 264347078 + (c[e + 72 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[r >> 2]) & q ^ o) | 0;
 o = c[j >> 2] | 0;
 q = c[m >> 2] | 0;
 c[g >> 2] = (c[g >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[k >> 2] = s;
 o = c[g >> 2] | 0;
 q = c[r >> 2] | 0;
 h = (c[b >> 2] | 0) + 604807628 + (c[e + 76 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[p >> 2]) & o ^ q) | 0;
 q = c[l >> 2] | 0;
 o = c[j >> 2] | 0;
 c[m >> 2] = (c[m >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[b >> 2] = n;
 q = c[m >> 2] | 0;
 o = c[p >> 2] | 0;
 s = (c[r >> 2] | 0) + 770255983 + (c[e + 80 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[g >> 2]) & q ^ o) | 0;
 o = c[k >> 2] | 0;
 q = c[l >> 2] | 0;
 c[j >> 2] = (c[j >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[r >> 2] = h;
 o = c[j >> 2] | 0;
 q = c[g >> 2] | 0;
 n = (c[p >> 2] | 0) + 1249150122 + (c[e + 84 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[m >> 2]) & o ^ q) | 0;
 q = c[b >> 2] | 0;
 o = c[k >> 2] | 0;
 c[l >> 2] = (c[l >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[p >> 2] = s;
 q = c[l >> 2] | 0;
 o = c[m >> 2] | 0;
 h = (c[g >> 2] | 0) + 1555081692 + (c[e + 88 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[j >> 2]) & q ^ o) | 0;
 o = c[r >> 2] | 0;
 q = c[b >> 2] | 0;
 c[k >> 2] = (c[k >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[g >> 2] = n;
 o = c[k >> 2] | 0;
 q = c[j >> 2] | 0;
 s = (c[m >> 2] | 0) + 1996064986 + (c[e + 92 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[l >> 2]) & o ^ q) | 0;
 q = c[p >> 2] | 0;
 o = c[r >> 2] | 0;
 c[b >> 2] = (c[b >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[m >> 2] = h;
 q = c[b >> 2] | 0;
 o = c[l >> 2] | 0;
 n = (c[j >> 2] | 0) - 1740746414 + (c[e + 96 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[k >> 2]) & q ^ o) | 0;
 o = c[g >> 2] | 0;
 q = c[p >> 2] | 0;
 c[r >> 2] = (c[r >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[j >> 2] = s;
 o = c[r >> 2] | 0;
 q = c[k >> 2] | 0;
 h = (c[l >> 2] | 0) - 1473132947 + (c[e + 100 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[b >> 2]) & o ^ q) | 0;
 q = c[m >> 2] | 0;
 o = c[g >> 2] | 0;
 c[p >> 2] = (c[p >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[l >> 2] = n;
 q = c[p >> 2] | 0;
 o = c[b >> 2] | 0;
 s = (c[k >> 2] | 0) - 1341970488 + (c[e + 104 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[r >> 2]) & q ^ o) | 0;
 o = c[j >> 2] | 0;
 q = c[m >> 2] | 0;
 c[g >> 2] = (c[g >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[k >> 2] = h;
 o = c[g >> 2] | 0;
 q = c[r >> 2] | 0;
 n = (c[b >> 2] | 0) - 1084653625 + (c[e + 108 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[p >> 2]) & o ^ q) | 0;
 q = c[l >> 2] | 0;
 o = c[j >> 2] | 0;
 c[m >> 2] = (c[m >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[b >> 2] = s;
 q = c[m >> 2] | 0;
 o = c[p >> 2] | 0;
 h = (c[r >> 2] | 0) - 958395405 + (c[e + 112 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[g >> 2]) & q ^ o) | 0;
 o = c[k >> 2] | 0;
 q = c[l >> 2] | 0;
 c[j >> 2] = (c[j >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[r >> 2] = n;
 o = c[j >> 2] | 0;
 q = c[g >> 2] | 0;
 s = (c[p >> 2] | 0) - 710438585 + (c[e + 116 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[m >> 2]) & o ^ q) | 0;
 q = c[b >> 2] | 0;
 o = c[k >> 2] | 0;
 c[l >> 2] = (c[l >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[p >> 2] = h;
 q = c[l >> 2] | 0;
 o = c[m >> 2] | 0;
 n = (c[g >> 2] | 0) + 113926993 + (c[e + 120 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[j >> 2]) & q ^ o) | 0;
 o = c[r >> 2] | 0;
 q = c[b >> 2] | 0;
 c[k >> 2] = (c[k >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[g >> 2] = s;
 o = c[k >> 2] | 0;
 q = c[j >> 2] | 0;
 h = (c[m >> 2] | 0) + 338241895 + (c[e + 124 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[l >> 2]) & o ^ q) | 0;
 q = c[p >> 2] | 0;
 o = c[r >> 2] | 0;
 c[b >> 2] = (c[b >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[m >> 2] = n;
 q = c[b >> 2] | 0;
 o = c[l >> 2] | 0;
 s = (c[j >> 2] | 0) + 666307205 + (c[e + 128 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[k >> 2]) & q ^ o) | 0;
 o = c[g >> 2] | 0;
 q = c[p >> 2] | 0;
 c[r >> 2] = (c[r >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[j >> 2] = h;
 o = c[r >> 2] | 0;
 q = c[k >> 2] | 0;
 n = (c[l >> 2] | 0) + 773529912 + (c[e + 132 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[b >> 2]) & o ^ q) | 0;
 q = c[m >> 2] | 0;
 o = c[g >> 2] | 0;
 c[p >> 2] = (c[p >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[l >> 2] = s;
 q = c[p >> 2] | 0;
 o = c[b >> 2] | 0;
 h = (c[k >> 2] | 0) + 1294757372 + (c[e + 136 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[r >> 2]) & q ^ o) | 0;
 o = c[j >> 2] | 0;
 q = c[m >> 2] | 0;
 c[g >> 2] = (c[g >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[k >> 2] = n;
 o = c[g >> 2] | 0;
 q = c[r >> 2] | 0;
 s = (c[b >> 2] | 0) + 1396182291 + (c[e + 140 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[p >> 2]) & o ^ q) | 0;
 q = c[l >> 2] | 0;
 o = c[j >> 2] | 0;
 c[m >> 2] = (c[m >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[b >> 2] = h;
 q = c[m >> 2] | 0;
 o = c[p >> 2] | 0;
 n = (c[r >> 2] | 0) + 1695183700 + (c[e + 144 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[g >> 2]) & q ^ o) | 0;
 o = c[k >> 2] | 0;
 q = c[l >> 2] | 0;
 c[j >> 2] = (c[j >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[r >> 2] = s;
 o = c[j >> 2] | 0;
 q = c[g >> 2] | 0;
 h = (c[p >> 2] | 0) + 1986661051 + (c[e + 148 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[m >> 2]) & o ^ q) | 0;
 q = c[b >> 2] | 0;
 o = c[k >> 2] | 0;
 c[l >> 2] = (c[l >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[p >> 2] = n;
 q = c[l >> 2] | 0;
 o = c[m >> 2] | 0;
 s = (c[g >> 2] | 0) - 2117940946 + (c[e + 152 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[j >> 2]) & q ^ o) | 0;
 o = c[r >> 2] | 0;
 q = c[b >> 2] | 0;
 c[k >> 2] = (c[k >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[g >> 2] = h;
 o = c[k >> 2] | 0;
 q = c[j >> 2] | 0;
 n = (c[m >> 2] | 0) - 1838011259 + (c[e + 156 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[l >> 2]) & o ^ q) | 0;
 q = c[p >> 2] | 0;
 o = c[r >> 2] | 0;
 c[b >> 2] = (c[b >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[m >> 2] = s;
 q = c[b >> 2] | 0;
 o = c[l >> 2] | 0;
 h = (c[j >> 2] | 0) - 1564481375 + (c[e + 160 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[k >> 2]) & q ^ o) | 0;
 o = c[g >> 2] | 0;
 q = c[p >> 2] | 0;
 c[r >> 2] = (c[r >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[j >> 2] = n;
 o = c[r >> 2] | 0;
 q = c[k >> 2] | 0;
 s = (c[l >> 2] | 0) - 1474664885 + (c[e + 164 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[b >> 2]) & o ^ q) | 0;
 q = c[m >> 2] | 0;
 o = c[g >> 2] | 0;
 c[p >> 2] = (c[p >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[l >> 2] = h;
 q = c[p >> 2] | 0;
 o = c[b >> 2] | 0;
 n = (c[k >> 2] | 0) - 1035236496 + (c[e + 168 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[r >> 2]) & q ^ o) | 0;
 o = c[j >> 2] | 0;
 q = c[m >> 2] | 0;
 c[g >> 2] = (c[g >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[k >> 2] = s;
 o = c[g >> 2] | 0;
 q = c[r >> 2] | 0;
 h = (c[b >> 2] | 0) - 949202525 + (c[e + 172 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[p >> 2]) & o ^ q) | 0;
 q = c[l >> 2] | 0;
 o = c[j >> 2] | 0;
 c[m >> 2] = (c[m >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[b >> 2] = n;
 q = c[m >> 2] | 0;
 o = c[p >> 2] | 0;
 s = (c[r >> 2] | 0) - 778901479 + (c[e + 176 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[g >> 2]) & q ^ o) | 0;
 o = c[k >> 2] | 0;
 q = c[l >> 2] | 0;
 c[j >> 2] = (c[j >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[r >> 2] = h;
 o = c[j >> 2] | 0;
 q = c[g >> 2] | 0;
 n = (c[p >> 2] | 0) - 694614492 + (c[e + 180 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[m >> 2]) & o ^ q) | 0;
 q = c[b >> 2] | 0;
 o = c[k >> 2] | 0;
 c[l >> 2] = (c[l >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[p >> 2] = s;
 q = c[l >> 2] | 0;
 o = c[m >> 2] | 0;
 h = (c[g >> 2] | 0) - 200395387 + (c[e + 184 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[j >> 2]) & q ^ o) | 0;
 o = c[r >> 2] | 0;
 q = c[b >> 2] | 0;
 c[k >> 2] = (c[k >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[g >> 2] = n;
 o = c[k >> 2] | 0;
 q = c[j >> 2] | 0;
 s = (c[m >> 2] | 0) + 275423344 + (c[e + 188 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[l >> 2]) & o ^ q) | 0;
 q = c[p >> 2] | 0;
 o = c[r >> 2] | 0;
 c[b >> 2] = (c[b >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[m >> 2] = h;
 q = c[b >> 2] | 0;
 o = c[l >> 2] | 0;
 n = (c[j >> 2] | 0) + 430227734 + (c[e + 192 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[k >> 2]) & q ^ o) | 0;
 o = c[g >> 2] | 0;
 q = c[p >> 2] | 0;
 c[r >> 2] = (c[r >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[j >> 2] = s;
 o = c[r >> 2] | 0;
 q = c[k >> 2] | 0;
 h = (c[l >> 2] | 0) + 506948616 + (c[e + 196 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[b >> 2]) & o ^ q) | 0;
 q = c[m >> 2] | 0;
 o = c[g >> 2] | 0;
 c[p >> 2] = (c[p >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[l >> 2] = n;
 q = c[p >> 2] | 0;
 o = c[b >> 2] | 0;
 s = (c[k >> 2] | 0) + 659060556 + (c[e + 200 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[r >> 2]) & q ^ o) | 0;
 o = c[j >> 2] | 0;
 q = c[m >> 2] | 0;
 c[g >> 2] = (c[g >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[k >> 2] = h;
 o = c[g >> 2] | 0;
 q = c[r >> 2] | 0;
 n = (c[b >> 2] | 0) + 883997877 + (c[e + 204 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[p >> 2]) & o ^ q) | 0;
 q = c[l >> 2] | 0;
 o = c[j >> 2] | 0;
 c[m >> 2] = (c[m >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[b >> 2] = s;
 q = c[m >> 2] | 0;
 o = c[p >> 2] | 0;
 h = (c[r >> 2] | 0) + 958139571 + (c[e + 208 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[g >> 2]) & q ^ o) | 0;
 o = c[k >> 2] | 0;
 q = c[l >> 2] | 0;
 c[j >> 2] = (c[j >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[r >> 2] = n;
 o = c[j >> 2] | 0;
 q = c[g >> 2] | 0;
 s = (c[p >> 2] | 0) + 1322822218 + (c[e + 212 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[m >> 2]) & o ^ q) | 0;
 q = c[b >> 2] | 0;
 o = c[k >> 2] | 0;
 c[l >> 2] = (c[l >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[p >> 2] = h;
 q = c[l >> 2] | 0;
 o = c[m >> 2] | 0;
 n = (c[g >> 2] | 0) + 1537002063 + (c[e + 216 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[j >> 2]) & q ^ o) | 0;
 o = c[r >> 2] | 0;
 q = c[b >> 2] | 0;
 c[k >> 2] = (c[k >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[g >> 2] = s;
 o = c[k >> 2] | 0;
 q = c[j >> 2] | 0;
 h = (c[m >> 2] | 0) + 1747873779 + (c[e + 220 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[l >> 2]) & o ^ q) | 0;
 q = c[p >> 2] | 0;
 o = c[r >> 2] | 0;
 c[b >> 2] = (c[b >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[m >> 2] = n;
 q = c[b >> 2] | 0;
 o = c[l >> 2] | 0;
 s = (c[j >> 2] | 0) + 1955562222 + (c[e + 224 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[k >> 2]) & q ^ o) | 0;
 o = c[g >> 2] | 0;
 q = c[p >> 2] | 0;
 c[r >> 2] = (c[r >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[j >> 2] = h;
 o = c[r >> 2] | 0;
 q = c[k >> 2] | 0;
 n = (c[l >> 2] | 0) + 2024104815 + (c[e + 228 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[b >> 2]) & o ^ q) | 0;
 q = c[m >> 2] | 0;
 o = c[g >> 2] | 0;
 c[p >> 2] = (c[p >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((o | q) & h | o & q) | 0;
 c[l >> 2] = s;
 q = c[p >> 2] | 0;
 o = c[b >> 2] | 0;
 h = (c[k >> 2] | 0) - 2067236844 + (c[e + 232 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[r >> 2]) & q ^ o) | 0;
 o = c[j >> 2] | 0;
 q = c[m >> 2] | 0;
 c[g >> 2] = (c[g >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((q | o) & s | q & o) | 0;
 c[k >> 2] = n;
 o = c[g >> 2] | 0;
 q = c[r >> 2] | 0;
 s = (c[b >> 2] | 0) - 1933114872 + (c[e + 236 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[p >> 2]) & o ^ q) | 0;
 q = c[l >> 2] | 0;
 o = c[j >> 2] | 0;
 c[m >> 2] = (c[m >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((o | q) & n | o & q) | 0;
 c[b >> 2] = h;
 q = c[m >> 2] | 0;
 o = c[p >> 2] | 0;
 n = (c[r >> 2] | 0) - 1866530822 + (c[e + 240 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[g >> 2]) & q ^ o) | 0;
 o = c[k >> 2] | 0;
 q = c[l >> 2] | 0;
 c[j >> 2] = (c[j >> 2] | 0) + n;
 s = n + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((q | o) & h | q & o) | 0;
 c[r >> 2] = s;
 o = c[j >> 2] | 0;
 q = c[g >> 2] | 0;
 h = (c[p >> 2] | 0) - 1538233109 + (c[e + 244 >> 2] | 0) + ((o >>> 6 | o << 26) ^ (o >>> 11 | o << 21) ^ (o >>> 25 | o << 7)) + ((q ^ c[m >> 2]) & o ^ q) | 0;
 q = c[b >> 2] | 0;
 o = c[k >> 2] | 0;
 c[l >> 2] = (c[l >> 2] | 0) + h;
 n = h + ((s >>> 2 | s << 30) ^ (s >>> 13 | s << 19) ^ (s >>> 22 | s << 10)) + ((o | q) & s | o & q) | 0;
 c[p >> 2] = n;
 q = c[l >> 2] | 0;
 o = c[m >> 2] | 0;
 s = (c[g >> 2] | 0) - 1090935817 + (c[e + 248 >> 2] | 0) + ((q >>> 6 | q << 26) ^ (q >>> 11 | q << 21) ^ (q >>> 25 | q << 7)) + ((o ^ c[j >> 2]) & q ^ o) | 0;
 o = c[r >> 2] | 0;
 q = c[b >> 2] | 0;
 c[k >> 2] = (c[k >> 2] | 0) + s;
 h = s + ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + ((q | o) & n | q & o) | 0;
 c[g >> 2] = h;
 g = c[k >> 2] | 0;
 k = c[j >> 2] | 0;
 j = (c[m >> 2] | 0) - 965641998 + (c[e + 252 >> 2] | 0) + ((g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7)) + ((k ^ c[l >> 2]) & g ^ k) | 0;
 k = c[p >> 2] | 0;
 p = c[r >> 2] | 0;
 c[b >> 2] = (c[b >> 2] | 0) + j;
 b = j + ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) + ((p | k) & h | p & k) | 0;
 c[m >> 2] = b;
 c[a >> 2] = (c[a >> 2] | 0) + b;
 b = a + 4 | 0;
 c[b >> 2] = (c[b >> 2] | 0) + (c[f + 4 >> 2] | 0);
 b = a + 8 | 0;
 c[b >> 2] = (c[b >> 2] | 0) + (c[f + 8 >> 2] | 0);
 b = a + 12 | 0;
 c[b >> 2] = (c[b >> 2] | 0) + (c[f + 12 >> 2] | 0);
 b = a + 16 | 0;
 c[b >> 2] = (c[b >> 2] | 0) + (c[f + 16 >> 2] | 0);
 b = a + 20 | 0;
 c[b >> 2] = (c[b >> 2] | 0) + (c[f + 20 >> 2] | 0);
 b = a + 24 | 0;
 c[b >> 2] = (c[b >> 2] | 0) + (c[f + 24 >> 2] | 0);
 b = a + 28 | 0;
 c[b >> 2] = (c[b >> 2] | 0) + (c[f + 28 >> 2] | 0);
 i = d;
 return;
}
function bB(b, c) {
 b = b | 0;
 c = c | 0;
 a[b + 3 | 0] = c & 255;
 a[b + 2 | 0] = c >>> 8 & 255;
 a[b + 1 | 0] = c >>> 16 & 255;
 a[b] = c >>> 24 & 255;
 return;
}
function bC(a) {
 a = a | 0;
 return (d[a + 2 | 0] | 0) << 8 | (d[a + 3 | 0] | 0) | (d[a + 1 | 0] | 0) << 16 | (d[a] | 0) << 24 | 0;
}
function bD(a, b) {
 a = a | 0;
 b = b | 0;
 bE(b);
 bF(a, b | 0, 32);
 cL(b | 0, 0, 104);
 return;
}
function bE(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0;
 b = i;
 i = i + 8 | 0;
 d = b | 0;
 bF(d, a + 32 | 0, 8);
 e = (c[a + 36 >> 2] | 0) >>> 3 & 63;
 bz(a, 720, (e >>> 0 < 56 ? 56 : 120) - e | 0);
 bz(a, d, 8);
 i = b;
 return;
}
function bF(a, b, d) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 var e = 0, f = 0;
 e = d >>> 2;
 if ((e | 0) == 0) {
  return;
 } else {
  f = 0;
 }
 do {
  bB(a + (f << 2) | 0, c[b + (f << 2) >> 2] | 0);
  f = f + 1 | 0;
 } while (f >>> 0 < e >>> 0);
 return;
}
function bG(b, c, d) {
 b = b | 0;
 c = c | 0;
 d = d | 0;
 var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
 e = i;
 i = i + 96 | 0;
 f = e | 0;
 if (d >>> 0 > 64) {
  g = b | 0;
  bt(g);
  bz(g, c, d);
  h = e + 64 | 0;
  bD(h, g);
  j = h;
  k = 32;
 } else {
  j = c;
  k = d;
 }
 d = b | 0;
 bt(d);
 c = f | 0;
 cL(c | 0, 54, 64);
 if ((k | 0) != 0) {
  h = 0;
  do {
   g = f + h | 0;
   a[g] = a[g] ^ a[j + h | 0];
   h = h + 1 | 0;
  } while (h >>> 0 < k >>> 0);
 }
 bz(d, c, 64);
 d = b + 104 | 0;
 bt(d);
 cL(c | 0, 92, 64);
 if ((k | 0) == 0) {
  bz(d, c, 64);
  i = e;
  return;
 } else {
  l = 0;
 }
 do {
  b = f + l | 0;
  a[b] = a[b] ^ a[j + l | 0];
  l = l + 1 | 0;
 } while (l >>> 0 < k >>> 0);
 bz(d, c, 64);
 i = e;
 return;
}
function bH(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 bz(a | 0, b, c);
 return;
}
function bI(a, b) {
 a = a | 0;
 b = b | 0;
 var c = 0, d = 0, e = 0;
 c = i;
 i = i + 32 | 0;
 d = c | 0;
 bD(d, b | 0);
 e = b + 104 | 0;
 bz(e, d, 32);
 bD(a, e);
 i = c;
 return;
}
function bJ(b, c, d, e, f, g, h, j) {
 b = b | 0;
 c = c | 0;
 d = d | 0;
 e = e | 0;
 f = f | 0;
 g = g | 0;
 h = h | 0;
 j = j | 0;
 var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0;
 k = i;
 i = i + 488 | 0;
 l = k | 0;
 m = k + 208 | 0;
 n = k + 424 | 0;
 o = k + 456 | 0;
 bG(l, b, c);
 bH(l, d, e);
 if ((j | 0) == 0) {
  i = k;
  return;
 }
 e = k + 416 | 0;
 d = m;
 p = l;
 l = n | 0;
 q = o | 0;
 r = 0;
 s = g >>> 0 < r >>> 0 | g >>> 0 == r >>> 0 & f >>> 0 < 2 >>> 0;
 r = 0;
 t = 0;
 do {
  r = r + 1 | 0;
  bB(e, r);
  cK(d | 0, p | 0, 208) | 0;
  bH(m, e, 4);
  bI(l, m);
  cK(q | 0, l | 0, 32) | 0;
  if (!s) {
   u = 0;
   v = 2;
   do {
    bG(m, b, c);
    bH(m, l, 32);
    bI(l, m);
    w = 0;
    do {
     x = o + w | 0;
     a[x] = a[x] ^ a[n + w | 0];
     w = w + 1 | 0;
    } while ((w | 0) < 32);
    v = cN(v, u, 1, 0) | 0;
    u = H;
   } while (!(u >>> 0 > g >>> 0 | u >>> 0 == g >>> 0 & v >>> 0 > f >>> 0));
  }
  v = j - t | 0;
  u = v >>> 0 > 32 ? 32 : v;
  v = h + t | 0;
  cK(v | 0, q | 0, u) | 0;
  t = r << 5;
 } while (t >>> 0 < j >>> 0);
 i = k;
 return;
}
function bK(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0;
 d = 0;
 do {
  c[a + (d << 2) >> 2] = bC(b + (d << 2) | 0) | 0;
  d = d + 1 | 0;
 } while (d >>> 0 < 16);
 return;
}
function bL(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, _ = 0, $ = 0, aa = 0, ab = 0, ac = 0, ad = 0, ae = 0, af = 0, ag = 0, ah = 0, ai = 0, aj = 0, ak = 0, al = 0, am = 0, an = 0, ao = 0, ap = 0, aq = 0, as = 0, at = 0, av = 0, aw = 0, ax = 0, ay = 0, az = 0, aA = 0, aB = 0, aC = 0, aD = 0, aE = 0, aF = 0, aG = 0, aH = 0, aI = 0;
 do {
  if (a >>> 0 < 245) {
   if (a >>> 0 < 11) {
    b = 16;
   } else {
    b = a + 11 & -8;
   }
   d = b >>> 3;
   e = c[208] | 0;
   f = e >>> (d >>> 0);
   if ((f & 3 | 0) != 0) {
    g = (f & 1 ^ 1) + d | 0;
    h = g << 1;
    i = 872 + (h << 2) | 0;
    j = 872 + (h + 2 << 2) | 0;
    h = c[j >> 2] | 0;
    k = h + 8 | 0;
    l = c[k >> 2] | 0;
    do {
     if ((i | 0) == (l | 0)) {
      c[208] = e & ~(1 << g);
     } else {
      if (l >>> 0 < (c[212] | 0) >>> 0) {
       au();
       return 0;
      }
      m = l + 12 | 0;
      if ((c[m >> 2] | 0) == (h | 0)) {
       c[m >> 2] = i;
       c[j >> 2] = l;
       break;
      } else {
       au();
       return 0;
      }
     }
    } while (0);
    l = g << 3;
    c[h + 4 >> 2] = l | 3;
    j = h + (l | 4) | 0;
    c[j >> 2] = c[j >> 2] | 1;
    n = k;
    return n | 0;
   }
   if (b >>> 0 <= (c[210] | 0) >>> 0) {
    o = b;
    break;
   }
   if ((f | 0) != 0) {
    j = 2 << d;
    l = f << d & (j | -j);
    j = (l & -l) - 1 | 0;
    l = j >>> 12 & 16;
    i = j >>> (l >>> 0);
    j = i >>> 5 & 8;
    m = i >>> (j >>> 0);
    i = m >>> 2 & 4;
    p = m >>> (i >>> 0);
    m = p >>> 1 & 2;
    q = p >>> (m >>> 0);
    p = q >>> 1 & 1;
    r = (j | l | i | m | p) + (q >>> (p >>> 0)) | 0;
    p = r << 1;
    q = 872 + (p << 2) | 0;
    m = 872 + (p + 2 << 2) | 0;
    p = c[m >> 2] | 0;
    i = p + 8 | 0;
    l = c[i >> 2] | 0;
    do {
     if ((q | 0) == (l | 0)) {
      c[208] = e & ~(1 << r);
     } else {
      if (l >>> 0 < (c[212] | 0) >>> 0) {
       au();
       return 0;
      }
      j = l + 12 | 0;
      if ((c[j >> 2] | 0) == (p | 0)) {
       c[j >> 2] = q;
       c[m >> 2] = l;
       break;
      } else {
       au();
       return 0;
      }
     }
    } while (0);
    l = r << 3;
    m = l - b | 0;
    c[p + 4 >> 2] = b | 3;
    q = p;
    e = q + b | 0;
    c[q + (b | 4) >> 2] = m | 1;
    c[q + l >> 2] = m;
    l = c[210] | 0;
    if ((l | 0) != 0) {
     q = c[213] | 0;
     d = l >>> 3;
     l = d << 1;
     f = 872 + (l << 2) | 0;
     k = c[208] | 0;
     h = 1 << d;
     do {
      if ((k & h | 0) == 0) {
       c[208] = k | h;
       s = f;
       t = 872 + (l + 2 << 2) | 0;
      } else {
       d = 872 + (l + 2 << 2) | 0;
       g = c[d >> 2] | 0;
       if (g >>> 0 >= (c[212] | 0) >>> 0) {
        s = g;
        t = d;
        break;
       }
       au();
       return 0;
      }
     } while (0);
     c[t >> 2] = q;
     c[s + 12 >> 2] = q;
     c[q + 8 >> 2] = s;
     c[q + 12 >> 2] = f;
    }
    c[210] = m;
    c[213] = e;
    n = i;
    return n | 0;
   }
   l = c[209] | 0;
   if ((l | 0) == 0) {
    o = b;
    break;
   }
   h = (l & -l) - 1 | 0;
   l = h >>> 12 & 16;
   k = h >>> (l >>> 0);
   h = k >>> 5 & 8;
   p = k >>> (h >>> 0);
   k = p >>> 2 & 4;
   r = p >>> (k >>> 0);
   p = r >>> 1 & 2;
   d = r >>> (p >>> 0);
   r = d >>> 1 & 1;
   g = c[1136 + ((h | l | k | p | r) + (d >>> (r >>> 0)) << 2) >> 2] | 0;
   r = g;
   d = g;
   p = (c[g + 4 >> 2] & -8) - b | 0;
   while (1) {
    g = c[r + 16 >> 2] | 0;
    if ((g | 0) == 0) {
     k = c[r + 20 >> 2] | 0;
     if ((k | 0) == 0) {
      break;
     } else {
      u = k;
     }
    } else {
     u = g;
    }
    g = (c[u + 4 >> 2] & -8) - b | 0;
    k = g >>> 0 < p >>> 0;
    r = u;
    d = k ? u : d;
    p = k ? g : p;
   }
   r = d;
   i = c[212] | 0;
   if (r >>> 0 < i >>> 0) {
    au();
    return 0;
   }
   e = r + b | 0;
   m = e;
   if (r >>> 0 >= e >>> 0) {
    au();
    return 0;
   }
   e = c[d + 24 >> 2] | 0;
   f = c[d + 12 >> 2] | 0;
   do {
    if ((f | 0) == (d | 0)) {
     q = d + 20 | 0;
     g = c[q >> 2] | 0;
     if ((g | 0) == 0) {
      k = d + 16 | 0;
      l = c[k >> 2] | 0;
      if ((l | 0) == 0) {
       v = 0;
       break;
      } else {
       w = l;
       x = k;
      }
     } else {
      w = g;
      x = q;
     }
     while (1) {
      q = w + 20 | 0;
      g = c[q >> 2] | 0;
      if ((g | 0) != 0) {
       w = g;
       x = q;
       continue;
      }
      q = w + 16 | 0;
      g = c[q >> 2] | 0;
      if ((g | 0) == 0) {
       break;
      } else {
       w = g;
       x = q;
      }
     }
     if (x >>> 0 < i >>> 0) {
      au();
      return 0;
     } else {
      c[x >> 2] = 0;
      v = w;
      break;
     }
    } else {
     q = c[d + 8 >> 2] | 0;
     if (q >>> 0 < i >>> 0) {
      au();
      return 0;
     }
     g = q + 12 | 0;
     if ((c[g >> 2] | 0) != (d | 0)) {
      au();
      return 0;
     }
     k = f + 8 | 0;
     if ((c[k >> 2] | 0) == (d | 0)) {
      c[g >> 2] = f;
      c[k >> 2] = q;
      v = f;
      break;
     } else {
      au();
      return 0;
     }
    }
   } while (0);
   L223 : do {
    if ((e | 0) != 0) {
     f = d + 28 | 0;
     i = 1136 + (c[f >> 2] << 2) | 0;
     do {
      if ((d | 0) == (c[i >> 2] | 0)) {
       c[i >> 2] = v;
       if ((v | 0) != 0) {
        break;
       }
       c[209] = c[209] & ~(1 << c[f >> 2]);
       break L223;
      } else {
       if (e >>> 0 < (c[212] | 0) >>> 0) {
        au();
        return 0;
       }
       q = e + 16 | 0;
       if ((c[q >> 2] | 0) == (d | 0)) {
        c[q >> 2] = v;
       } else {
        c[e + 20 >> 2] = v;
       }
       if ((v | 0) == 0) {
        break L223;
       }
      }
     } while (0);
     if (v >>> 0 < (c[212] | 0) >>> 0) {
      au();
      return 0;
     }
     c[v + 24 >> 2] = e;
     f = c[d + 16 >> 2] | 0;
     do {
      if ((f | 0) != 0) {
       if (f >>> 0 < (c[212] | 0) >>> 0) {
        au();
        return 0;
       } else {
        c[v + 16 >> 2] = f;
        c[f + 24 >> 2] = v;
        break;
       }
      }
     } while (0);
     f = c[d + 20 >> 2] | 0;
     if ((f | 0) == 0) {
      break;
     }
     if (f >>> 0 < (c[212] | 0) >>> 0) {
      au();
      return 0;
     } else {
      c[v + 20 >> 2] = f;
      c[f + 24 >> 2] = v;
      break;
     }
    }
   } while (0);
   if (p >>> 0 < 16) {
    e = p + b | 0;
    c[d + 4 >> 2] = e | 3;
    f = r + (e + 4) | 0;
    c[f >> 2] = c[f >> 2] | 1;
   } else {
    c[d + 4 >> 2] = b | 3;
    c[r + (b | 4) >> 2] = p | 1;
    c[r + (p + b) >> 2] = p;
    f = c[210] | 0;
    if ((f | 0) != 0) {
     e = c[213] | 0;
     i = f >>> 3;
     f = i << 1;
     q = 872 + (f << 2) | 0;
     k = c[208] | 0;
     g = 1 << i;
     do {
      if ((k & g | 0) == 0) {
       c[208] = k | g;
       y = q;
       z = 872 + (f + 2 << 2) | 0;
      } else {
       i = 872 + (f + 2 << 2) | 0;
       l = c[i >> 2] | 0;
       if (l >>> 0 >= (c[212] | 0) >>> 0) {
        y = l;
        z = i;
        break;
       }
       au();
       return 0;
      }
     } while (0);
     c[z >> 2] = e;
     c[y + 12 >> 2] = e;
     c[e + 8 >> 2] = y;
     c[e + 12 >> 2] = q;
    }
    c[210] = p;
    c[213] = m;
   }
   f = d + 8 | 0;
   if ((f | 0) == 0) {
    o = b;
    break;
   } else {
    n = f;
   }
   return n | 0;
  } else {
   if (a >>> 0 > 4294967231) {
    o = -1;
    break;
   }
   f = a + 11 | 0;
   g = f & -8;
   k = c[209] | 0;
   if ((k | 0) == 0) {
    o = g;
    break;
   }
   r = -g | 0;
   i = f >>> 8;
   do {
    if ((i | 0) == 0) {
     A = 0;
    } else {
     if (g >>> 0 > 16777215) {
      A = 31;
      break;
     }
     f = (i + 1048320 | 0) >>> 16 & 8;
     l = i << f;
     h = (l + 520192 | 0) >>> 16 & 4;
     j = l << h;
     l = (j + 245760 | 0) >>> 16 & 2;
     B = 14 - (h | f | l) + (j << l >>> 15) | 0;
     A = g >>> ((B + 7 | 0) >>> 0) & 1 | B << 1;
    }
   } while (0);
   i = c[1136 + (A << 2) >> 2] | 0;
   L271 : do {
    if ((i | 0) == 0) {
     C = 0;
     D = r;
     E = 0;
    } else {
     if ((A | 0) == 31) {
      F = 0;
     } else {
      F = 25 - (A >>> 1) | 0;
     }
     d = 0;
     m = r;
     p = i;
     q = g << F;
     e = 0;
     while (1) {
      B = c[p + 4 >> 2] & -8;
      l = B - g | 0;
      if (l >>> 0 < m >>> 0) {
       if ((B | 0) == (g | 0)) {
        C = p;
        D = l;
        E = p;
        break L271;
       } else {
        G = p;
        H = l;
       }
      } else {
       G = d;
       H = m;
      }
      l = c[p + 20 >> 2] | 0;
      B = c[p + 16 + (q >>> 31 << 2) >> 2] | 0;
      j = (l | 0) == 0 | (l | 0) == (B | 0) ? e : l;
      if ((B | 0) == 0) {
       C = G;
       D = H;
       E = j;
       break;
      } else {
       d = G;
       m = H;
       p = B;
       q = q << 1;
       e = j;
      }
     }
    }
   } while (0);
   if ((E | 0) == 0 & (C | 0) == 0) {
    i = 2 << A;
    r = k & (i | -i);
    if ((r | 0) == 0) {
     o = g;
     break;
    }
    i = (r & -r) - 1 | 0;
    r = i >>> 12 & 16;
    e = i >>> (r >>> 0);
    i = e >>> 5 & 8;
    q = e >>> (i >>> 0);
    e = q >>> 2 & 4;
    p = q >>> (e >>> 0);
    q = p >>> 1 & 2;
    m = p >>> (q >>> 0);
    p = m >>> 1 & 1;
    I = c[1136 + ((i | r | e | q | p) + (m >>> (p >>> 0)) << 2) >> 2] | 0;
   } else {
    I = E;
   }
   if ((I | 0) == 0) {
    J = D;
    K = C;
   } else {
    p = I;
    m = D;
    q = C;
    while (1) {
     e = (c[p + 4 >> 2] & -8) - g | 0;
     r = e >>> 0 < m >>> 0;
     i = r ? e : m;
     e = r ? p : q;
     r = c[p + 16 >> 2] | 0;
     if ((r | 0) != 0) {
      p = r;
      m = i;
      q = e;
      continue;
     }
     r = c[p + 20 >> 2] | 0;
     if ((r | 0) == 0) {
      J = i;
      K = e;
      break;
     } else {
      p = r;
      m = i;
      q = e;
     }
    }
   }
   if ((K | 0) == 0) {
    o = g;
    break;
   }
   if (J >>> 0 >= ((c[210] | 0) - g | 0) >>> 0) {
    o = g;
    break;
   }
   q = K;
   m = c[212] | 0;
   if (q >>> 0 < m >>> 0) {
    au();
    return 0;
   }
   p = q + g | 0;
   k = p;
   if (q >>> 0 >= p >>> 0) {
    au();
    return 0;
   }
   e = c[K + 24 >> 2] | 0;
   i = c[K + 12 >> 2] | 0;
   do {
    if ((i | 0) == (K | 0)) {
     r = K + 20 | 0;
     d = c[r >> 2] | 0;
     if ((d | 0) == 0) {
      j = K + 16 | 0;
      B = c[j >> 2] | 0;
      if ((B | 0) == 0) {
       L = 0;
       break;
      } else {
       M = B;
       N = j;
      }
     } else {
      M = d;
      N = r;
     }
     while (1) {
      r = M + 20 | 0;
      d = c[r >> 2] | 0;
      if ((d | 0) != 0) {
       M = d;
       N = r;
       continue;
      }
      r = M + 16 | 0;
      d = c[r >> 2] | 0;
      if ((d | 0) == 0) {
       break;
      } else {
       M = d;
       N = r;
      }
     }
     if (N >>> 0 < m >>> 0) {
      au();
      return 0;
     } else {
      c[N >> 2] = 0;
      L = M;
      break;
     }
    } else {
     r = c[K + 8 >> 2] | 0;
     if (r >>> 0 < m >>> 0) {
      au();
      return 0;
     }
     d = r + 12 | 0;
     if ((c[d >> 2] | 0) != (K | 0)) {
      au();
      return 0;
     }
     j = i + 8 | 0;
     if ((c[j >> 2] | 0) == (K | 0)) {
      c[d >> 2] = i;
      c[j >> 2] = r;
      L = i;
      break;
     } else {
      au();
      return 0;
     }
    }
   } while (0);
   L321 : do {
    if ((e | 0) != 0) {
     i = K + 28 | 0;
     m = 1136 + (c[i >> 2] << 2) | 0;
     do {
      if ((K | 0) == (c[m >> 2] | 0)) {
       c[m >> 2] = L;
       if ((L | 0) != 0) {
        break;
       }
       c[209] = c[209] & ~(1 << c[i >> 2]);
       break L321;
      } else {
       if (e >>> 0 < (c[212] | 0) >>> 0) {
        au();
        return 0;
       }
       r = e + 16 | 0;
       if ((c[r >> 2] | 0) == (K | 0)) {
        c[r >> 2] = L;
       } else {
        c[e + 20 >> 2] = L;
       }
       if ((L | 0) == 0) {
        break L321;
       }
      }
     } while (0);
     if (L >>> 0 < (c[212] | 0) >>> 0) {
      au();
      return 0;
     }
     c[L + 24 >> 2] = e;
     i = c[K + 16 >> 2] | 0;
     do {
      if ((i | 0) != 0) {
       if (i >>> 0 < (c[212] | 0) >>> 0) {
        au();
        return 0;
       } else {
        c[L + 16 >> 2] = i;
        c[i + 24 >> 2] = L;
        break;
       }
      }
     } while (0);
     i = c[K + 20 >> 2] | 0;
     if ((i | 0) == 0) {
      break;
     }
     if (i >>> 0 < (c[212] | 0) >>> 0) {
      au();
      return 0;
     } else {
      c[L + 20 >> 2] = i;
      c[i + 24 >> 2] = L;
      break;
     }
    }
   } while (0);
   do {
    if (J >>> 0 < 16) {
     e = J + g | 0;
     c[K + 4 >> 2] = e | 3;
     i = q + (e + 4) | 0;
     c[i >> 2] = c[i >> 2] | 1;
    } else {
     c[K + 4 >> 2] = g | 3;
     c[q + (g | 4) >> 2] = J | 1;
     c[q + (J + g) >> 2] = J;
     i = J >>> 3;
     if (J >>> 0 < 256) {
      e = i << 1;
      m = 872 + (e << 2) | 0;
      r = c[208] | 0;
      j = 1 << i;
      do {
       if ((r & j | 0) == 0) {
        c[208] = r | j;
        O = m;
        P = 872 + (e + 2 << 2) | 0;
       } else {
        i = 872 + (e + 2 << 2) | 0;
        d = c[i >> 2] | 0;
        if (d >>> 0 >= (c[212] | 0) >>> 0) {
         O = d;
         P = i;
         break;
        }
        au();
        return 0;
       }
      } while (0);
      c[P >> 2] = k;
      c[O + 12 >> 2] = k;
      c[q + (g + 8) >> 2] = O;
      c[q + (g + 12) >> 2] = m;
      break;
     }
     e = p;
     j = J >>> 8;
     do {
      if ((j | 0) == 0) {
       Q = 0;
      } else {
       if (J >>> 0 > 16777215) {
        Q = 31;
        break;
       }
       r = (j + 1048320 | 0) >>> 16 & 8;
       i = j << r;
       d = (i + 520192 | 0) >>> 16 & 4;
       B = i << d;
       i = (B + 245760 | 0) >>> 16 & 2;
       l = 14 - (d | r | i) + (B << i >>> 15) | 0;
       Q = J >>> ((l + 7 | 0) >>> 0) & 1 | l << 1;
      }
     } while (0);
     j = 1136 + (Q << 2) | 0;
     c[q + (g + 28) >> 2] = Q;
     c[q + (g + 20) >> 2] = 0;
     c[q + (g + 16) >> 2] = 0;
     m = c[209] | 0;
     l = 1 << Q;
     if ((m & l | 0) == 0) {
      c[209] = m | l;
      c[j >> 2] = e;
      c[q + (g + 24) >> 2] = j;
      c[q + (g + 12) >> 2] = e;
      c[q + (g + 8) >> 2] = e;
      break;
     }
     if ((Q | 0) == 31) {
      R = 0;
     } else {
      R = 25 - (Q >>> 1) | 0;
     }
     l = J << R;
     m = c[j >> 2] | 0;
     while (1) {
      if ((c[m + 4 >> 2] & -8 | 0) == (J | 0)) {
       break;
      }
      S = m + 16 + (l >>> 31 << 2) | 0;
      j = c[S >> 2] | 0;
      if ((j | 0) == 0) {
       T = 262;
       break;
      } else {
       l = l << 1;
       m = j;
      }
     }
     if ((T | 0) == 262) {
      if (S >>> 0 < (c[212] | 0) >>> 0) {
       au();
       return 0;
      } else {
       c[S >> 2] = e;
       c[q + (g + 24) >> 2] = m;
       c[q + (g + 12) >> 2] = e;
       c[q + (g + 8) >> 2] = e;
       break;
      }
     }
     l = m + 8 | 0;
     j = c[l >> 2] | 0;
     i = c[212] | 0;
     if (m >>> 0 < i >>> 0) {
      au();
      return 0;
     }
     if (j >>> 0 < i >>> 0) {
      au();
      return 0;
     } else {
      c[j + 12 >> 2] = e;
      c[l >> 2] = e;
      c[q + (g + 8) >> 2] = j;
      c[q + (g + 12) >> 2] = m;
      c[q + (g + 24) >> 2] = 0;
      break;
     }
    }
   } while (0);
   q = K + 8 | 0;
   if ((q | 0) == 0) {
    o = g;
    break;
   } else {
    n = q;
   }
   return n | 0;
  }
 } while (0);
 K = c[210] | 0;
 if (o >>> 0 <= K >>> 0) {
  S = K - o | 0;
  J = c[213] | 0;
  if (S >>> 0 > 15) {
   R = J;
   c[213] = R + o;
   c[210] = S;
   c[R + (o + 4) >> 2] = S | 1;
   c[R + K >> 2] = S;
   c[J + 4 >> 2] = o | 3;
  } else {
   c[210] = 0;
   c[213] = 0;
   c[J + 4 >> 2] = K | 3;
   S = J + (K + 4) | 0;
   c[S >> 2] = c[S >> 2] | 1;
  }
  n = J + 8 | 0;
  return n | 0;
 }
 J = c[211] | 0;
 if (o >>> 0 < J >>> 0) {
  S = J - o | 0;
  c[211] = S;
  J = c[214] | 0;
  K = J;
  c[214] = K + o;
  c[K + (o + 4) >> 2] = S | 1;
  c[J + 4 >> 2] = o | 3;
  n = J + 8 | 0;
  return n | 0;
 }
 do {
  if ((c[200] | 0) == 0) {
   J = ar(8) | 0;
   if ((J - 1 & J | 0) == 0) {
    c[202] = J;
    c[201] = J;
    c[203] = -1;
    c[204] = 2097152;
    c[205] = 0;
    c[319] = 0;
    c[200] = (a_(0) | 0) & -16 ^ 1431655768;
    break;
   } else {
    au();
    return 0;
   }
  }
 } while (0);
 J = o + 48 | 0;
 S = c[202] | 0;
 K = o + 47 | 0;
 R = S + K | 0;
 Q = -S | 0;
 S = R & Q;
 if (S >>> 0 <= o >>> 0) {
  n = 0;
  return n | 0;
 }
 O = c[318] | 0;
 do {
  if ((O | 0) != 0) {
   P = c[316] | 0;
   L = P + S | 0;
   if (L >>> 0 <= P >>> 0 | L >>> 0 > O >>> 0) {
    n = 0;
   } else {
    break;
   }
   return n | 0;
  }
 } while (0);
 L413 : do {
  if ((c[319] & 4 | 0) == 0) {
   O = c[214] | 0;
   L415 : do {
    if ((O | 0) == 0) {
     T = 292;
    } else {
     L = O;
     P = 1280;
     while (1) {
      U = P | 0;
      M = c[U >> 2] | 0;
      if (M >>> 0 <= L >>> 0) {
       V = P + 4 | 0;
       if ((M + (c[V >> 2] | 0) | 0) >>> 0 > L >>> 0) {
        break;
       }
      }
      M = c[P + 8 >> 2] | 0;
      if ((M | 0) == 0) {
       T = 292;
       break L415;
      } else {
       P = M;
      }
     }
     if ((P | 0) == 0) {
      T = 292;
      break;
     }
     L = R - (c[211] | 0) & Q;
     if (L >>> 0 >= 2147483647) {
      W = 0;
      break;
     }
     m = aV(L | 0) | 0;
     e = (m | 0) == ((c[U >> 2] | 0) + (c[V >> 2] | 0) | 0);
     X = e ? m : -1;
     Y = e ? L : 0;
     Z = m;
     _ = L;
     T = 301;
    }
   } while (0);
   do {
    if ((T | 0) == 292) {
     O = aV(0) | 0;
     if ((O | 0) == -1) {
      W = 0;
      break;
     }
     g = O;
     L = c[201] | 0;
     m = L - 1 | 0;
     if ((m & g | 0) == 0) {
      $ = S;
     } else {
      $ = S - g + (m + g & -L) | 0;
     }
     L = c[316] | 0;
     g = L + $ | 0;
     if (!($ >>> 0 > o >>> 0 & $ >>> 0 < 2147483647)) {
      W = 0;
      break;
     }
     m = c[318] | 0;
     if ((m | 0) != 0) {
      if (g >>> 0 <= L >>> 0 | g >>> 0 > m >>> 0) {
       W = 0;
       break;
      }
     }
     m = aV($ | 0) | 0;
     g = (m | 0) == (O | 0);
     X = g ? O : -1;
     Y = g ? $ : 0;
     Z = m;
     _ = $;
     T = 301;
    }
   } while (0);
   L435 : do {
    if ((T | 0) == 301) {
     m = -_ | 0;
     if ((X | 0) != -1) {
      aa = Y;
      ab = X;
      T = 312;
      break L413;
     }
     do {
      if ((Z | 0) != -1 & _ >>> 0 < 2147483647 & _ >>> 0 < J >>> 0) {
       g = c[202] | 0;
       O = K - _ + g & -g;
       if (O >>> 0 >= 2147483647) {
        ac = _;
        break;
       }
       if ((aV(O | 0) | 0) == -1) {
        aV(m | 0) | 0;
        W = Y;
        break L435;
       } else {
        ac = O + _ | 0;
        break;
       }
      } else {
       ac = _;
      }
     } while (0);
     if ((Z | 0) == -1) {
      W = Y;
     } else {
      aa = ac;
      ab = Z;
      T = 312;
      break L413;
     }
    }
   } while (0);
   c[319] = c[319] | 4;
   ad = W;
   T = 309;
  } else {
   ad = 0;
   T = 309;
  }
 } while (0);
 do {
  if ((T | 0) == 309) {
   if (S >>> 0 >= 2147483647) {
    break;
   }
   W = aV(S | 0) | 0;
   Z = aV(0) | 0;
   if (!((Z | 0) != -1 & (W | 0) != -1 & W >>> 0 < Z >>> 0)) {
    break;
   }
   ac = Z - W | 0;
   Z = ac >>> 0 > (o + 40 | 0) >>> 0;
   Y = Z ? W : -1;
   if ((Y | 0) != -1) {
    aa = Z ? ac : ad;
    ab = Y;
    T = 312;
   }
  }
 } while (0);
 do {
  if ((T | 0) == 312) {
   ad = (c[316] | 0) + aa | 0;
   c[316] = ad;
   if (ad >>> 0 > (c[317] | 0) >>> 0) {
    c[317] = ad;
   }
   ad = c[214] | 0;
   L455 : do {
    if ((ad | 0) == 0) {
     S = c[212] | 0;
     if ((S | 0) == 0 | ab >>> 0 < S >>> 0) {
      c[212] = ab;
     }
     c[320] = ab;
     c[321] = aa;
     c[323] = 0;
     c[217] = c[200];
     c[216] = -1;
     S = 0;
     do {
      Y = S << 1;
      ac = 872 + (Y << 2) | 0;
      c[872 + (Y + 3 << 2) >> 2] = ac;
      c[872 + (Y + 2 << 2) >> 2] = ac;
      S = S + 1 | 0;
     } while (S >>> 0 < 32);
     S = ab + 8 | 0;
     if ((S & 7 | 0) == 0) {
      ae = 0;
     } else {
      ae = -S & 7;
     }
     S = aa - 40 - ae | 0;
     c[214] = ab + ae;
     c[211] = S;
     c[ab + (ae + 4) >> 2] = S | 1;
     c[ab + (aa - 36) >> 2] = 40;
     c[215] = c[204];
    } else {
     S = 1280;
     while (1) {
      af = c[S >> 2] | 0;
      ag = S + 4 | 0;
      ah = c[ag >> 2] | 0;
      if ((ab | 0) == (af + ah | 0)) {
       T = 324;
       break;
      }
      ac = c[S + 8 >> 2] | 0;
      if ((ac | 0) == 0) {
       break;
      } else {
       S = ac;
      }
     }
     do {
      if ((T | 0) == 324) {
       if ((c[S + 12 >> 2] & 8 | 0) != 0) {
        break;
       }
       ac = ad;
       if (!(ac >>> 0 >= af >>> 0 & ac >>> 0 < ab >>> 0)) {
        break;
       }
       c[ag >> 2] = ah + aa;
       ac = c[214] | 0;
       Y = (c[211] | 0) + aa | 0;
       Z = ac;
       W = ac + 8 | 0;
       if ((W & 7 | 0) == 0) {
        ai = 0;
       } else {
        ai = -W & 7;
       }
       W = Y - ai | 0;
       c[214] = Z + ai;
       c[211] = W;
       c[Z + (ai + 4) >> 2] = W | 1;
       c[Z + (Y + 4) >> 2] = 40;
       c[215] = c[204];
       break L455;
      }
     } while (0);
     if (ab >>> 0 < (c[212] | 0) >>> 0) {
      c[212] = ab;
     }
     S = ab + aa | 0;
     Y = 1280;
     while (1) {
      aj = Y | 0;
      if ((c[aj >> 2] | 0) == (S | 0)) {
       T = 334;
       break;
      }
      Z = c[Y + 8 >> 2] | 0;
      if ((Z | 0) == 0) {
       break;
      } else {
       Y = Z;
      }
     }
     do {
      if ((T | 0) == 334) {
       if ((c[Y + 12 >> 2] & 8 | 0) != 0) {
        break;
       }
       c[aj >> 2] = ab;
       S = Y + 4 | 0;
       c[S >> 2] = (c[S >> 2] | 0) + aa;
       S = ab + 8 | 0;
       if ((S & 7 | 0) == 0) {
        ak = 0;
       } else {
        ak = -S & 7;
       }
       S = ab + (aa + 8) | 0;
       if ((S & 7 | 0) == 0) {
        al = 0;
       } else {
        al = -S & 7;
       }
       S = ab + (al + aa) | 0;
       Z = S;
       W = ak + o | 0;
       ac = ab + W | 0;
       _ = ac;
       K = S - (ab + ak) - o | 0;
       c[ab + (ak + 4) >> 2] = o | 3;
       do {
        if ((Z | 0) == (c[214] | 0)) {
         J = (c[211] | 0) + K | 0;
         c[211] = J;
         c[214] = _;
         c[ab + (W + 4) >> 2] = J | 1;
        } else {
         if ((Z | 0) == (c[213] | 0)) {
          J = (c[210] | 0) + K | 0;
          c[210] = J;
          c[213] = _;
          c[ab + (W + 4) >> 2] = J | 1;
          c[ab + (J + W) >> 2] = J;
          break;
         }
         J = aa + 4 | 0;
         X = c[ab + (J + al) >> 2] | 0;
         if ((X & 3 | 0) == 1) {
          $ = X & -8;
          V = X >>> 3;
          L500 : do {
           if (X >>> 0 < 256) {
            U = c[ab + ((al | 8) + aa) >> 2] | 0;
            Q = c[ab + (aa + 12 + al) >> 2] | 0;
            R = 872 + (V << 1 << 2) | 0;
            do {
             if ((U | 0) != (R | 0)) {
              if (U >>> 0 < (c[212] | 0) >>> 0) {
               au();
               return 0;
              }
              if ((c[U + 12 >> 2] | 0) == (Z | 0)) {
               break;
              }
              au();
              return 0;
             }
            } while (0);
            if ((Q | 0) == (U | 0)) {
             c[208] = c[208] & ~(1 << V);
             break;
            }
            do {
             if ((Q | 0) == (R | 0)) {
              am = Q + 8 | 0;
             } else {
              if (Q >>> 0 < (c[212] | 0) >>> 0) {
               au();
               return 0;
              }
              m = Q + 8 | 0;
              if ((c[m >> 2] | 0) == (Z | 0)) {
               am = m;
               break;
              }
              au();
              return 0;
             }
            } while (0);
            c[U + 12 >> 2] = Q;
            c[am >> 2] = U;
           } else {
            R = S;
            m = c[ab + ((al | 24) + aa) >> 2] | 0;
            P = c[ab + (aa + 12 + al) >> 2] | 0;
            do {
             if ((P | 0) == (R | 0)) {
              O = al | 16;
              g = ab + (J + O) | 0;
              L = c[g >> 2] | 0;
              if ((L | 0) == 0) {
               e = ab + (O + aa) | 0;
               O = c[e >> 2] | 0;
               if ((O | 0) == 0) {
                an = 0;
                break;
               } else {
                ao = O;
                ap = e;
               }
              } else {
               ao = L;
               ap = g;
              }
              while (1) {
               g = ao + 20 | 0;
               L = c[g >> 2] | 0;
               if ((L | 0) != 0) {
                ao = L;
                ap = g;
                continue;
               }
               g = ao + 16 | 0;
               L = c[g >> 2] | 0;
               if ((L | 0) == 0) {
                break;
               } else {
                ao = L;
                ap = g;
               }
              }
              if (ap >>> 0 < (c[212] | 0) >>> 0) {
               au();
               return 0;
              } else {
               c[ap >> 2] = 0;
               an = ao;
               break;
              }
             } else {
              g = c[ab + ((al | 8) + aa) >> 2] | 0;
              if (g >>> 0 < (c[212] | 0) >>> 0) {
               au();
               return 0;
              }
              L = g + 12 | 0;
              if ((c[L >> 2] | 0) != (R | 0)) {
               au();
               return 0;
              }
              e = P + 8 | 0;
              if ((c[e >> 2] | 0) == (R | 0)) {
               c[L >> 2] = P;
               c[e >> 2] = g;
               an = P;
               break;
              } else {
               au();
               return 0;
              }
             }
            } while (0);
            if ((m | 0) == 0) {
             break;
            }
            P = ab + (aa + 28 + al) | 0;
            U = 1136 + (c[P >> 2] << 2) | 0;
            do {
             if ((R | 0) == (c[U >> 2] | 0)) {
              c[U >> 2] = an;
              if ((an | 0) != 0) {
               break;
              }
              c[209] = c[209] & ~(1 << c[P >> 2]);
              break L500;
             } else {
              if (m >>> 0 < (c[212] | 0) >>> 0) {
               au();
               return 0;
              }
              Q = m + 16 | 0;
              if ((c[Q >> 2] | 0) == (R | 0)) {
               c[Q >> 2] = an;
              } else {
               c[m + 20 >> 2] = an;
              }
              if ((an | 0) == 0) {
               break L500;
              }
             }
            } while (0);
            if (an >>> 0 < (c[212] | 0) >>> 0) {
             au();
             return 0;
            }
            c[an + 24 >> 2] = m;
            R = al | 16;
            P = c[ab + (R + aa) >> 2] | 0;
            do {
             if ((P | 0) != 0) {
              if (P >>> 0 < (c[212] | 0) >>> 0) {
               au();
               return 0;
              } else {
               c[an + 16 >> 2] = P;
               c[P + 24 >> 2] = an;
               break;
              }
             }
            } while (0);
            P = c[ab + (J + R) >> 2] | 0;
            if ((P | 0) == 0) {
             break;
            }
            if (P >>> 0 < (c[212] | 0) >>> 0) {
             au();
             return 0;
            } else {
             c[an + 20 >> 2] = P;
             c[P + 24 >> 2] = an;
             break;
            }
           }
          } while (0);
          aq = ab + (($ | al) + aa) | 0;
          as = $ + K | 0;
         } else {
          aq = Z;
          as = K;
         }
         J = aq + 4 | 0;
         c[J >> 2] = c[J >> 2] & -2;
         c[ab + (W + 4) >> 2] = as | 1;
         c[ab + (as + W) >> 2] = as;
         J = as >>> 3;
         if (as >>> 0 < 256) {
          V = J << 1;
          X = 872 + (V << 2) | 0;
          P = c[208] | 0;
          m = 1 << J;
          do {
           if ((P & m | 0) == 0) {
            c[208] = P | m;
            at = X;
            av = 872 + (V + 2 << 2) | 0;
           } else {
            J = 872 + (V + 2 << 2) | 0;
            U = c[J >> 2] | 0;
            if (U >>> 0 >= (c[212] | 0) >>> 0) {
             at = U;
             av = J;
             break;
            }
            au();
            return 0;
           }
          } while (0);
          c[av >> 2] = _;
          c[at + 12 >> 2] = _;
          c[ab + (W + 8) >> 2] = at;
          c[ab + (W + 12) >> 2] = X;
          break;
         }
         V = ac;
         m = as >>> 8;
         do {
          if ((m | 0) == 0) {
           aw = 0;
          } else {
           if (as >>> 0 > 16777215) {
            aw = 31;
            break;
           }
           P = (m + 1048320 | 0) >>> 16 & 8;
           $ = m << P;
           J = ($ + 520192 | 0) >>> 16 & 4;
           U = $ << J;
           $ = (U + 245760 | 0) >>> 16 & 2;
           Q = 14 - (J | P | $) + (U << $ >>> 15) | 0;
           aw = as >>> ((Q + 7 | 0) >>> 0) & 1 | Q << 1;
          }
         } while (0);
         m = 1136 + (aw << 2) | 0;
         c[ab + (W + 28) >> 2] = aw;
         c[ab + (W + 20) >> 2] = 0;
         c[ab + (W + 16) >> 2] = 0;
         X = c[209] | 0;
         Q = 1 << aw;
         if ((X & Q | 0) == 0) {
          c[209] = X | Q;
          c[m >> 2] = V;
          c[ab + (W + 24) >> 2] = m;
          c[ab + (W + 12) >> 2] = V;
          c[ab + (W + 8) >> 2] = V;
          break;
         }
         if ((aw | 0) == 31) {
          ax = 0;
         } else {
          ax = 25 - (aw >>> 1) | 0;
         }
         Q = as << ax;
         X = c[m >> 2] | 0;
         while (1) {
          if ((c[X + 4 >> 2] & -8 | 0) == (as | 0)) {
           break;
          }
          ay = X + 16 + (Q >>> 31 << 2) | 0;
          m = c[ay >> 2] | 0;
          if ((m | 0) == 0) {
           T = 407;
           break;
          } else {
           Q = Q << 1;
           X = m;
          }
         }
         if ((T | 0) == 407) {
          if (ay >>> 0 < (c[212] | 0) >>> 0) {
           au();
           return 0;
          } else {
           c[ay >> 2] = V;
           c[ab + (W + 24) >> 2] = X;
           c[ab + (W + 12) >> 2] = V;
           c[ab + (W + 8) >> 2] = V;
           break;
          }
         }
         Q = X + 8 | 0;
         m = c[Q >> 2] | 0;
         $ = c[212] | 0;
         if (X >>> 0 < $ >>> 0) {
          au();
          return 0;
         }
         if (m >>> 0 < $ >>> 0) {
          au();
          return 0;
         } else {
          c[m + 12 >> 2] = V;
          c[Q >> 2] = V;
          c[ab + (W + 8) >> 2] = m;
          c[ab + (W + 12) >> 2] = X;
          c[ab + (W + 24) >> 2] = 0;
          break;
         }
        }
       } while (0);
       n = ab + (ak | 8) | 0;
       return n | 0;
      }
     } while (0);
     Y = ad;
     W = 1280;
     while (1) {
      az = c[W >> 2] | 0;
      if (az >>> 0 <= Y >>> 0) {
       aA = c[W + 4 >> 2] | 0;
       aB = az + aA | 0;
       if (aB >>> 0 > Y >>> 0) {
        break;
       }
      }
      W = c[W + 8 >> 2] | 0;
     }
     W = az + (aA - 39) | 0;
     if ((W & 7 | 0) == 0) {
      aC = 0;
     } else {
      aC = -W & 7;
     }
     W = az + (aA - 47 + aC) | 0;
     ac = W >>> 0 < (ad + 16 | 0) >>> 0 ? Y : W;
     W = ac + 8 | 0;
     _ = ab + 8 | 0;
     if ((_ & 7 | 0) == 0) {
      aD = 0;
     } else {
      aD = -_ & 7;
     }
     _ = aa - 40 - aD | 0;
     c[214] = ab + aD;
     c[211] = _;
     c[ab + (aD + 4) >> 2] = _ | 1;
     c[ab + (aa - 36) >> 2] = 40;
     c[215] = c[204];
     c[ac + 4 >> 2] = 27;
     c[W >> 2] = c[320];
     c[W + 4 >> 2] = c[1284 >> 2];
     c[W + 8 >> 2] = c[1288 >> 2];
     c[W + 12 >> 2] = c[1292 >> 2];
     c[320] = ab;
     c[321] = aa;
     c[323] = 0;
     c[322] = W;
     W = ac + 28 | 0;
     c[W >> 2] = 7;
     if ((ac + 32 | 0) >>> 0 < aB >>> 0) {
      _ = W;
      while (1) {
       W = _ + 4 | 0;
       c[W >> 2] = 7;
       if ((_ + 8 | 0) >>> 0 < aB >>> 0) {
        _ = W;
       } else {
        break;
       }
      }
     }
     if ((ac | 0) == (Y | 0)) {
      break;
     }
     _ = ac - ad | 0;
     W = Y + (_ + 4) | 0;
     c[W >> 2] = c[W >> 2] & -2;
     c[ad + 4 >> 2] = _ | 1;
     c[Y + _ >> 2] = _;
     W = _ >>> 3;
     if (_ >>> 0 < 256) {
      K = W << 1;
      Z = 872 + (K << 2) | 0;
      S = c[208] | 0;
      m = 1 << W;
      do {
       if ((S & m | 0) == 0) {
        c[208] = S | m;
        aE = Z;
        aF = 872 + (K + 2 << 2) | 0;
       } else {
        W = 872 + (K + 2 << 2) | 0;
        Q = c[W >> 2] | 0;
        if (Q >>> 0 >= (c[212] | 0) >>> 0) {
         aE = Q;
         aF = W;
         break;
        }
        au();
        return 0;
       }
      } while (0);
      c[aF >> 2] = ad;
      c[aE + 12 >> 2] = ad;
      c[ad + 8 >> 2] = aE;
      c[ad + 12 >> 2] = Z;
      break;
     }
     K = ad;
     m = _ >>> 8;
     do {
      if ((m | 0) == 0) {
       aG = 0;
      } else {
       if (_ >>> 0 > 16777215) {
        aG = 31;
        break;
       }
       S = (m + 1048320 | 0) >>> 16 & 8;
       Y = m << S;
       ac = (Y + 520192 | 0) >>> 16 & 4;
       W = Y << ac;
       Y = (W + 245760 | 0) >>> 16 & 2;
       Q = 14 - (ac | S | Y) + (W << Y >>> 15) | 0;
       aG = _ >>> ((Q + 7 | 0) >>> 0) & 1 | Q << 1;
      }
     } while (0);
     m = 1136 + (aG << 2) | 0;
     c[ad + 28 >> 2] = aG;
     c[ad + 20 >> 2] = 0;
     c[ad + 16 >> 2] = 0;
     Z = c[209] | 0;
     Q = 1 << aG;
     if ((Z & Q | 0) == 0) {
      c[209] = Z | Q;
      c[m >> 2] = K;
      c[ad + 24 >> 2] = m;
      c[ad + 12 >> 2] = ad;
      c[ad + 8 >> 2] = ad;
      break;
     }
     if ((aG | 0) == 31) {
      aH = 0;
     } else {
      aH = 25 - (aG >>> 1) | 0;
     }
     Q = _ << aH;
     Z = c[m >> 2] | 0;
     while (1) {
      if ((c[Z + 4 >> 2] & -8 | 0) == (_ | 0)) {
       break;
      }
      aI = Z + 16 + (Q >>> 31 << 2) | 0;
      m = c[aI >> 2] | 0;
      if ((m | 0) == 0) {
       T = 442;
       break;
      } else {
       Q = Q << 1;
       Z = m;
      }
     }
     if ((T | 0) == 442) {
      if (aI >>> 0 < (c[212] | 0) >>> 0) {
       au();
       return 0;
      } else {
       c[aI >> 2] = K;
       c[ad + 24 >> 2] = Z;
       c[ad + 12 >> 2] = ad;
       c[ad + 8 >> 2] = ad;
       break;
      }
     }
     Q = Z + 8 | 0;
     _ = c[Q >> 2] | 0;
     m = c[212] | 0;
     if (Z >>> 0 < m >>> 0) {
      au();
      return 0;
     }
     if (_ >>> 0 < m >>> 0) {
      au();
      return 0;
     } else {
      c[_ + 12 >> 2] = K;
      c[Q >> 2] = K;
      c[ad + 8 >> 2] = _;
      c[ad + 12 >> 2] = Z;
      c[ad + 24 >> 2] = 0;
      break;
     }
    }
   } while (0);
   ad = c[211] | 0;
   if (ad >>> 0 <= o >>> 0) {
    break;
   }
   _ = ad - o | 0;
   c[211] = _;
   ad = c[214] | 0;
   Q = ad;
   c[214] = Q + o;
   c[Q + (o + 4) >> 2] = _ | 1;
   c[ad + 4 >> 2] = o | 3;
   n = ad + 8 | 0;
   return n | 0;
  }
 } while (0);
 c[(aX() | 0) >> 2] = 12;
 n = 0;
 return n | 0;
}
function bM(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0;
 if ((a | 0) == 0) {
  return;
 }
 b = a - 8 | 0;
 d = b;
 e = c[212] | 0;
 if (b >>> 0 < e >>> 0) {
  au();
 }
 f = c[a - 4 >> 2] | 0;
 g = f & 3;
 if ((g | 0) == 1) {
  au();
 }
 h = f & -8;
 i = a + (h - 8) | 0;
 j = i;
 L672 : do {
  if ((f & 1 | 0) == 0) {
   k = c[b >> 2] | 0;
   if ((g | 0) == 0) {
    return;
   }
   l = -8 - k | 0;
   m = a + l | 0;
   n = m;
   o = k + h | 0;
   if (m >>> 0 < e >>> 0) {
    au();
   }
   if ((n | 0) == (c[213] | 0)) {
    p = a + (h - 4) | 0;
    if ((c[p >> 2] & 3 | 0) != 3) {
     q = n;
     r = o;
     break;
    }
    c[210] = o;
    c[p >> 2] = c[p >> 2] & -2;
    c[a + (l + 4) >> 2] = o | 1;
    c[i >> 2] = o;
    return;
   }
   p = k >>> 3;
   if (k >>> 0 < 256) {
    k = c[a + (l + 8) >> 2] | 0;
    s = c[a + (l + 12) >> 2] | 0;
    t = 872 + (p << 1 << 2) | 0;
    do {
     if ((k | 0) != (t | 0)) {
      if (k >>> 0 < e >>> 0) {
       au();
      }
      if ((c[k + 12 >> 2] | 0) == (n | 0)) {
       break;
      }
      au();
     }
    } while (0);
    if ((s | 0) == (k | 0)) {
     c[208] = c[208] & ~(1 << p);
     q = n;
     r = o;
     break;
    }
    do {
     if ((s | 0) == (t | 0)) {
      u = s + 8 | 0;
     } else {
      if (s >>> 0 < e >>> 0) {
       au();
      }
      v = s + 8 | 0;
      if ((c[v >> 2] | 0) == (n | 0)) {
       u = v;
       break;
      }
      au();
     }
    } while (0);
    c[k + 12 >> 2] = s;
    c[u >> 2] = k;
    q = n;
    r = o;
    break;
   }
   t = m;
   p = c[a + (l + 24) >> 2] | 0;
   v = c[a + (l + 12) >> 2] | 0;
   do {
    if ((v | 0) == (t | 0)) {
     w = a + (l + 20) | 0;
     x = c[w >> 2] | 0;
     if ((x | 0) == 0) {
      y = a + (l + 16) | 0;
      z = c[y >> 2] | 0;
      if ((z | 0) == 0) {
       A = 0;
       break;
      } else {
       B = z;
       C = y;
      }
     } else {
      B = x;
      C = w;
     }
     while (1) {
      w = B + 20 | 0;
      x = c[w >> 2] | 0;
      if ((x | 0) != 0) {
       B = x;
       C = w;
       continue;
      }
      w = B + 16 | 0;
      x = c[w >> 2] | 0;
      if ((x | 0) == 0) {
       break;
      } else {
       B = x;
       C = w;
      }
     }
     if (C >>> 0 < e >>> 0) {
      au();
     } else {
      c[C >> 2] = 0;
      A = B;
      break;
     }
    } else {
     w = c[a + (l + 8) >> 2] | 0;
     if (w >>> 0 < e >>> 0) {
      au();
     }
     x = w + 12 | 0;
     if ((c[x >> 2] | 0) != (t | 0)) {
      au();
     }
     y = v + 8 | 0;
     if ((c[y >> 2] | 0) == (t | 0)) {
      c[x >> 2] = v;
      c[y >> 2] = w;
      A = v;
      break;
     } else {
      au();
     }
    }
   } while (0);
   if ((p | 0) == 0) {
    q = n;
    r = o;
    break;
   }
   v = a + (l + 28) | 0;
   m = 1136 + (c[v >> 2] << 2) | 0;
   do {
    if ((t | 0) == (c[m >> 2] | 0)) {
     c[m >> 2] = A;
     if ((A | 0) != 0) {
      break;
     }
     c[209] = c[209] & ~(1 << c[v >> 2]);
     q = n;
     r = o;
     break L672;
    } else {
     if (p >>> 0 < (c[212] | 0) >>> 0) {
      au();
     }
     k = p + 16 | 0;
     if ((c[k >> 2] | 0) == (t | 0)) {
      c[k >> 2] = A;
     } else {
      c[p + 20 >> 2] = A;
     }
     if ((A | 0) == 0) {
      q = n;
      r = o;
      break L672;
     }
    }
   } while (0);
   if (A >>> 0 < (c[212] | 0) >>> 0) {
    au();
   }
   c[A + 24 >> 2] = p;
   t = c[a + (l + 16) >> 2] | 0;
   do {
    if ((t | 0) != 0) {
     if (t >>> 0 < (c[212] | 0) >>> 0) {
      au();
     } else {
      c[A + 16 >> 2] = t;
      c[t + 24 >> 2] = A;
      break;
     }
    }
   } while (0);
   t = c[a + (l + 20) >> 2] | 0;
   if ((t | 0) == 0) {
    q = n;
    r = o;
    break;
   }
   if (t >>> 0 < (c[212] | 0) >>> 0) {
    au();
   } else {
    c[A + 20 >> 2] = t;
    c[t + 24 >> 2] = A;
    q = n;
    r = o;
    break;
   }
  } else {
   q = d;
   r = h;
  }
 } while (0);
 d = q;
 if (d >>> 0 >= i >>> 0) {
  au();
 }
 A = a + (h - 4) | 0;
 e = c[A >> 2] | 0;
 if ((e & 1 | 0) == 0) {
  au();
 }
 do {
  if ((e & 2 | 0) == 0) {
   if ((j | 0) == (c[214] | 0)) {
    B = (c[211] | 0) + r | 0;
    c[211] = B;
    c[214] = q;
    c[q + 4 >> 2] = B | 1;
    if ((q | 0) == (c[213] | 0)) {
     c[213] = 0;
     c[210] = 0;
    }
    if (B >>> 0 <= (c[215] | 0) >>> 0) {
     return;
    }
    bS(0) | 0;
    return;
   }
   if ((j | 0) == (c[213] | 0)) {
    B = (c[210] | 0) + r | 0;
    c[210] = B;
    c[213] = q;
    c[q + 4 >> 2] = B | 1;
    c[d + B >> 2] = B;
    return;
   }
   B = (e & -8) + r | 0;
   C = e >>> 3;
   L777 : do {
    if (e >>> 0 < 256) {
     u = c[a + h >> 2] | 0;
     g = c[a + (h | 4) >> 2] | 0;
     b = 872 + (C << 1 << 2) | 0;
     do {
      if ((u | 0) != (b | 0)) {
       if (u >>> 0 < (c[212] | 0) >>> 0) {
        au();
       }
       if ((c[u + 12 >> 2] | 0) == (j | 0)) {
        break;
       }
       au();
      }
     } while (0);
     if ((g | 0) == (u | 0)) {
      c[208] = c[208] & ~(1 << C);
      break;
     }
     do {
      if ((g | 0) == (b | 0)) {
       D = g + 8 | 0;
      } else {
       if (g >>> 0 < (c[212] | 0) >>> 0) {
        au();
       }
       f = g + 8 | 0;
       if ((c[f >> 2] | 0) == (j | 0)) {
        D = f;
        break;
       }
       au();
      }
     } while (0);
     c[u + 12 >> 2] = g;
     c[D >> 2] = u;
    } else {
     b = i;
     f = c[a + (h + 16) >> 2] | 0;
     t = c[a + (h | 4) >> 2] | 0;
     do {
      if ((t | 0) == (b | 0)) {
       p = a + (h + 12) | 0;
       v = c[p >> 2] | 0;
       if ((v | 0) == 0) {
        m = a + (h + 8) | 0;
        k = c[m >> 2] | 0;
        if ((k | 0) == 0) {
         E = 0;
         break;
        } else {
         F = k;
         G = m;
        }
       } else {
        F = v;
        G = p;
       }
       while (1) {
        p = F + 20 | 0;
        v = c[p >> 2] | 0;
        if ((v | 0) != 0) {
         F = v;
         G = p;
         continue;
        }
        p = F + 16 | 0;
        v = c[p >> 2] | 0;
        if ((v | 0) == 0) {
         break;
        } else {
         F = v;
         G = p;
        }
       }
       if (G >>> 0 < (c[212] | 0) >>> 0) {
        au();
       } else {
        c[G >> 2] = 0;
        E = F;
        break;
       }
      } else {
       p = c[a + h >> 2] | 0;
       if (p >>> 0 < (c[212] | 0) >>> 0) {
        au();
       }
       v = p + 12 | 0;
       if ((c[v >> 2] | 0) != (b | 0)) {
        au();
       }
       m = t + 8 | 0;
       if ((c[m >> 2] | 0) == (b | 0)) {
        c[v >> 2] = t;
        c[m >> 2] = p;
        E = t;
        break;
       } else {
        au();
       }
      }
     } while (0);
     if ((f | 0) == 0) {
      break;
     }
     t = a + (h + 20) | 0;
     u = 1136 + (c[t >> 2] << 2) | 0;
     do {
      if ((b | 0) == (c[u >> 2] | 0)) {
       c[u >> 2] = E;
       if ((E | 0) != 0) {
        break;
       }
       c[209] = c[209] & ~(1 << c[t >> 2]);
       break L777;
      } else {
       if (f >>> 0 < (c[212] | 0) >>> 0) {
        au();
       }
       g = f + 16 | 0;
       if ((c[g >> 2] | 0) == (b | 0)) {
        c[g >> 2] = E;
       } else {
        c[f + 20 >> 2] = E;
       }
       if ((E | 0) == 0) {
        break L777;
       }
      }
     } while (0);
     if (E >>> 0 < (c[212] | 0) >>> 0) {
      au();
     }
     c[E + 24 >> 2] = f;
     b = c[a + (h + 8) >> 2] | 0;
     do {
      if ((b | 0) != 0) {
       if (b >>> 0 < (c[212] | 0) >>> 0) {
        au();
       } else {
        c[E + 16 >> 2] = b;
        c[b + 24 >> 2] = E;
        break;
       }
      }
     } while (0);
     b = c[a + (h + 12) >> 2] | 0;
     if ((b | 0) == 0) {
      break;
     }
     if (b >>> 0 < (c[212] | 0) >>> 0) {
      au();
     } else {
      c[E + 20 >> 2] = b;
      c[b + 24 >> 2] = E;
      break;
     }
    }
   } while (0);
   c[q + 4 >> 2] = B | 1;
   c[d + B >> 2] = B;
   if ((q | 0) != (c[213] | 0)) {
    H = B;
    break;
   }
   c[210] = B;
   return;
  } else {
   c[A >> 2] = e & -2;
   c[q + 4 >> 2] = r | 1;
   c[d + r >> 2] = r;
   H = r;
  }
 } while (0);
 r = H >>> 3;
 if (H >>> 0 < 256) {
  d = r << 1;
  e = 872 + (d << 2) | 0;
  A = c[208] | 0;
  E = 1 << r;
  do {
   if ((A & E | 0) == 0) {
    c[208] = A | E;
    I = e;
    J = 872 + (d + 2 << 2) | 0;
   } else {
    r = 872 + (d + 2 << 2) | 0;
    h = c[r >> 2] | 0;
    if (h >>> 0 >= (c[212] | 0) >>> 0) {
     I = h;
     J = r;
     break;
    }
    au();
   }
  } while (0);
  c[J >> 2] = q;
  c[I + 12 >> 2] = q;
  c[q + 8 >> 2] = I;
  c[q + 12 >> 2] = e;
  return;
 }
 e = q;
 I = H >>> 8;
 do {
  if ((I | 0) == 0) {
   K = 0;
  } else {
   if (H >>> 0 > 16777215) {
    K = 31;
    break;
   }
   J = (I + 1048320 | 0) >>> 16 & 8;
   d = I << J;
   E = (d + 520192 | 0) >>> 16 & 4;
   A = d << E;
   d = (A + 245760 | 0) >>> 16 & 2;
   r = 14 - (E | J | d) + (A << d >>> 15) | 0;
   K = H >>> ((r + 7 | 0) >>> 0) & 1 | r << 1;
  }
 } while (0);
 I = 1136 + (K << 2) | 0;
 c[q + 28 >> 2] = K;
 c[q + 20 >> 2] = 0;
 c[q + 16 >> 2] = 0;
 r = c[209] | 0;
 d = 1 << K;
 do {
  if ((r & d | 0) == 0) {
   c[209] = r | d;
   c[I >> 2] = e;
   c[q + 24 >> 2] = I;
   c[q + 12 >> 2] = q;
   c[q + 8 >> 2] = q;
  } else {
   if ((K | 0) == 31) {
    L = 0;
   } else {
    L = 25 - (K >>> 1) | 0;
   }
   A = H << L;
   J = c[I >> 2] | 0;
   while (1) {
    if ((c[J + 4 >> 2] & -8 | 0) == (H | 0)) {
     break;
    }
    M = J + 16 + (A >>> 31 << 2) | 0;
    E = c[M >> 2] | 0;
    if ((E | 0) == 0) {
     N = 621;
     break;
    } else {
     A = A << 1;
     J = E;
    }
   }
   if ((N | 0) == 621) {
    if (M >>> 0 < (c[212] | 0) >>> 0) {
     au();
    } else {
     c[M >> 2] = e;
     c[q + 24 >> 2] = J;
     c[q + 12 >> 2] = q;
     c[q + 8 >> 2] = q;
     break;
    }
   }
   A = J + 8 | 0;
   B = c[A >> 2] | 0;
   E = c[212] | 0;
   if (J >>> 0 < E >>> 0) {
    au();
   }
   if (B >>> 0 < E >>> 0) {
    au();
   } else {
    c[B + 12 >> 2] = e;
    c[A >> 2] = e;
    c[q + 8 >> 2] = B;
    c[q + 12 >> 2] = J;
    c[q + 24 >> 2] = 0;
    break;
   }
  }
 } while (0);
 q = (c[216] | 0) - 1 | 0;
 c[216] = q;
 if ((q | 0) == 0) {
  O = 1288;
 } else {
  return;
 }
 while (1) {
  q = c[O >> 2] | 0;
  if ((q | 0) == 0) {
   break;
  } else {
   O = q + 8 | 0;
  }
 }
 c[216] = -1;
 return;
}
function bN(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0;
 do {
  if ((a | 0) == 0) {
   d = 0;
  } else {
   e = ad(b, a) | 0;
   if ((b | a) >>> 0 <= 65535) {
    d = e;
    break;
   }
   d = ((e >>> 0) / (a >>> 0) | 0 | 0) == (b | 0) ? e : -1;
  }
 } while (0);
 b = bL(d) | 0;
 if ((b | 0) == 0) {
  return b | 0;
 }
 if ((c[b - 4 >> 2] & 3 | 0) == 0) {
  return b | 0;
 }
 cL(b | 0, 0, d | 0);
 return b | 0;
}
function bO(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0, g = 0;
 if ((a | 0) == 0) {
  d = bL(b) | 0;
  return d | 0;
 }
 if (b >>> 0 > 4294967231) {
  c[(aX() | 0) >> 2] = 12;
  d = 0;
  return d | 0;
 }
 if (b >>> 0 < 11) {
  e = 16;
 } else {
  e = b + 11 & -8;
 }
 f = bT(a - 8 | 0, e) | 0;
 if ((f | 0) != 0) {
  d = f + 8 | 0;
  return d | 0;
 }
 f = bL(b) | 0;
 if ((f | 0) == 0) {
  d = 0;
  return d | 0;
 }
 e = c[a - 4 >> 2] | 0;
 g = (e & -8) - ((e & 3 | 0) == 0 ? 8 : 4) | 0;
 e = g >>> 0 < b >>> 0 ? g : b;
 cK(f | 0, a | 0, e) | 0;
 bM(a);
 d = f;
 return d | 0;
}
function bP(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0;
 if ((a | 0) == 0) {
  return 0;
 }
 if (b >>> 0 > 4294967231) {
  c[(aX() | 0) >> 2] = 12;
  return 0;
 }
 if (b >>> 0 < 11) {
  d = 16;
 } else {
  d = b + 11 & -8;
 }
 b = a - 8 | 0;
 return ((bT(b, d) | 0) == (b | 0) ? a : 0) | 0;
}
function bQ(a, b) {
 a = a | 0;
 b = b | 0;
 var c = 0;
 if (a >>> 0 < 9) {
  c = bL(b) | 0;
  return c | 0;
 } else {
  c = bR(a, b) | 0;
  return c | 0;
 }
 return 0;
}
function bR(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
 d = a >>> 0 < 16 ? 16 : a;
 if ((d - 1 & d | 0) == 0) {
  e = d;
 } else {
  a = 16;
  while (1) {
   if (a >>> 0 < d >>> 0) {
    a = a << 1;
   } else {
    e = a;
    break;
   }
  }
 }
 if ((-64 - e | 0) >>> 0 <= b >>> 0) {
  c[(aX() | 0) >> 2] = 12;
  f = 0;
  return f | 0;
 }
 if (b >>> 0 < 11) {
  g = 16;
 } else {
  g = b + 11 & -8;
 }
 b = bL(e + 12 + g | 0) | 0;
 if ((b | 0) == 0) {
  f = 0;
  return f | 0;
 }
 a = b - 8 | 0;
 d = a;
 h = e - 1 | 0;
 do {
  if ((b & h | 0) == 0) {
   i = d;
  } else {
   j = b + h & -e;
   k = j - 8 | 0;
   l = a;
   if ((k - l | 0) >>> 0 > 15) {
    m = k;
   } else {
    m = j + (e - 8) | 0;
   }
   j = m;
   k = m - l | 0;
   l = b - 4 | 0;
   n = c[l >> 2] | 0;
   o = (n & -8) - k | 0;
   if ((n & 3 | 0) == 0) {
    c[m >> 2] = (c[a >> 2] | 0) + k;
    c[m + 4 >> 2] = o;
    i = j;
    break;
   } else {
    n = m + 4 | 0;
    c[n >> 2] = o | c[n >> 2] & 1 | 2;
    n = m + (o + 4) | 0;
    c[n >> 2] = c[n >> 2] | 1;
    c[l >> 2] = k | c[l >> 2] & 1 | 2;
    l = b + (k - 4) | 0;
    c[l >> 2] = c[l >> 2] | 1;
    b9(d, k);
    i = j;
    break;
   }
  }
 } while (0);
 d = i + 4 | 0;
 b = c[d >> 2] | 0;
 do {
  if ((b & 3 | 0) != 0) {
   m = b & -8;
   if (m >>> 0 <= (g + 16 | 0) >>> 0) {
    break;
   }
   a = m - g | 0;
   e = i;
   c[d >> 2] = g | b & 1 | 2;
   c[e + (g | 4) >> 2] = a | 3;
   h = e + (m | 4) | 0;
   c[h >> 2] = c[h >> 2] | 1;
   b9(e + g | 0, a);
  }
 } while (0);
 f = i + 8 | 0;
 return f | 0;
}
function bS(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
 do {
  if ((c[200] | 0) == 0) {
   b = ar(8) | 0;
   if ((b - 1 & b | 0) == 0) {
    c[202] = b;
    c[201] = b;
    c[203] = -1;
    c[204] = 2097152;
    c[205] = 0;
    c[319] = 0;
    c[200] = (a_(0) | 0) & -16 ^ 1431655768;
    break;
   } else {
    au();
    return 0;
   }
  }
 } while (0);
 if (a >>> 0 >= 4294967232) {
  d = 0;
  return d | 0;
 }
 b = c[214] | 0;
 if ((b | 0) == 0) {
  d = 0;
  return d | 0;
 }
 e = c[211] | 0;
 do {
  if (e >>> 0 > (a + 40 | 0) >>> 0) {
   f = c[202] | 0;
   g = ad((((-40 - a - 1 + e + f | 0) >>> 0) / (f >>> 0) | 0) - 1 | 0, f) | 0;
   h = b;
   i = 1280;
   while (1) {
    j = c[i >> 2] | 0;
    if (j >>> 0 <= h >>> 0) {
     if ((j + (c[i + 4 >> 2] | 0) | 0) >>> 0 > h >>> 0) {
      k = i;
      break;
     }
    }
    j = c[i + 8 >> 2] | 0;
    if ((j | 0) == 0) {
     k = 0;
     break;
    } else {
     i = j;
    }
   }
   if ((c[k + 12 >> 2] & 8 | 0) != 0) {
    break;
   }
   i = aV(0) | 0;
   h = k + 4 | 0;
   if ((i | 0) != ((c[k >> 2] | 0) + (c[h >> 2] | 0) | 0)) {
    break;
   }
   j = aV(-(g >>> 0 > 2147483646 ? -2147483648 - f | 0 : g) | 0) | 0;
   l = aV(0) | 0;
   if (!((j | 0) != -1 & l >>> 0 < i >>> 0)) {
    break;
   }
   j = i - l | 0;
   if ((i | 0) == (l | 0)) {
    break;
   }
   c[h >> 2] = (c[h >> 2] | 0) - j;
   c[316] = (c[316] | 0) - j;
   h = c[214] | 0;
   m = (c[211] | 0) - j | 0;
   j = h;
   n = h + 8 | 0;
   if ((n & 7 | 0) == 0) {
    o = 0;
   } else {
    o = -n & 7;
   }
   n = m - o | 0;
   c[214] = j + o;
   c[211] = n;
   c[j + (o + 4) >> 2] = n | 1;
   c[j + (m + 4) >> 2] = 40;
   c[215] = c[204];
   d = (i | 0) != (l | 0) | 0;
   return d | 0;
  }
 } while (0);
 if ((c[211] | 0) >>> 0 <= (c[215] | 0) >>> 0) {
  d = 0;
  return d | 0;
 }
 c[215] = -1;
 d = 0;
 return d | 0;
}
function bT(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0;
 d = a + 4 | 0;
 e = c[d >> 2] | 0;
 f = e & -8;
 g = a;
 h = g + f | 0;
 i = h;
 j = c[212] | 0;
 if (g >>> 0 < j >>> 0) {
  au();
  return 0;
 }
 k = e & 3;
 if (!((k | 0) != 1 & g >>> 0 < h >>> 0)) {
  au();
  return 0;
 }
 l = g + (f | 4) | 0;
 m = c[l >> 2] | 0;
 if ((m & 1 | 0) == 0) {
  au();
  return 0;
 }
 if ((k | 0) == 0) {
  if (b >>> 0 < 256) {
   n = 0;
   return n | 0;
  }
  do {
   if (f >>> 0 >= (b + 4 | 0) >>> 0) {
    if ((f - b | 0) >>> 0 > c[202] << 1 >>> 0) {
     break;
    } else {
     n = a;
    }
    return n | 0;
   }
  } while (0);
  n = 0;
  return n | 0;
 }
 if (f >>> 0 >= b >>> 0) {
  k = f - b | 0;
  if (k >>> 0 <= 15) {
   n = a;
   return n | 0;
  }
  c[d >> 2] = e & 1 | b | 2;
  c[g + (b + 4) >> 2] = k | 3;
  c[l >> 2] = c[l >> 2] | 1;
  b9(g + b | 0, k);
  n = a;
  return n | 0;
 }
 if ((i | 0) == (c[214] | 0)) {
  k = (c[211] | 0) + f | 0;
  if (k >>> 0 <= b >>> 0) {
   n = 0;
   return n | 0;
  }
  l = k - b | 0;
  c[d >> 2] = e & 1 | b | 2;
  c[g + (b + 4) >> 2] = l | 1;
  c[214] = g + b;
  c[211] = l;
  n = a;
  return n | 0;
 }
 if ((i | 0) == (c[213] | 0)) {
  l = (c[210] | 0) + f | 0;
  if (l >>> 0 < b >>> 0) {
   n = 0;
   return n | 0;
  }
  k = l - b | 0;
  if (k >>> 0 > 15) {
   c[d >> 2] = e & 1 | b | 2;
   c[g + (b + 4) >> 2] = k | 1;
   c[g + l >> 2] = k;
   o = g + (l + 4) | 0;
   c[o >> 2] = c[o >> 2] & -2;
   p = g + b | 0;
   q = k;
  } else {
   c[d >> 2] = e & 1 | l | 2;
   e = g + (l + 4) | 0;
   c[e >> 2] = c[e >> 2] | 1;
   p = 0;
   q = 0;
  }
  c[210] = q;
  c[213] = p;
  n = a;
  return n | 0;
 }
 if ((m & 2 | 0) != 0) {
  n = 0;
  return n | 0;
 }
 p = (m & -8) + f | 0;
 if (p >>> 0 < b >>> 0) {
  n = 0;
  return n | 0;
 }
 q = p - b | 0;
 e = m >>> 3;
 L1056 : do {
  if (m >>> 0 < 256) {
   l = c[g + (f + 8) >> 2] | 0;
   k = c[g + (f + 12) >> 2] | 0;
   o = 872 + (e << 1 << 2) | 0;
   do {
    if ((l | 0) != (o | 0)) {
     if (l >>> 0 < j >>> 0) {
      au();
      return 0;
     }
     if ((c[l + 12 >> 2] | 0) == (i | 0)) {
      break;
     }
     au();
     return 0;
    }
   } while (0);
   if ((k | 0) == (l | 0)) {
    c[208] = c[208] & ~(1 << e);
    break;
   }
   do {
    if ((k | 0) == (o | 0)) {
     r = k + 8 | 0;
    } else {
     if (k >>> 0 < j >>> 0) {
      au();
      return 0;
     }
     s = k + 8 | 0;
     if ((c[s >> 2] | 0) == (i | 0)) {
      r = s;
      break;
     }
     au();
     return 0;
    }
   } while (0);
   c[l + 12 >> 2] = k;
   c[r >> 2] = l;
  } else {
   o = h;
   s = c[g + (f + 24) >> 2] | 0;
   t = c[g + (f + 12) >> 2] | 0;
   do {
    if ((t | 0) == (o | 0)) {
     u = g + (f + 20) | 0;
     v = c[u >> 2] | 0;
     if ((v | 0) == 0) {
      w = g + (f + 16) | 0;
      x = c[w >> 2] | 0;
      if ((x | 0) == 0) {
       y = 0;
       break;
      } else {
       z = x;
       A = w;
      }
     } else {
      z = v;
      A = u;
     }
     while (1) {
      u = z + 20 | 0;
      v = c[u >> 2] | 0;
      if ((v | 0) != 0) {
       z = v;
       A = u;
       continue;
      }
      u = z + 16 | 0;
      v = c[u >> 2] | 0;
      if ((v | 0) == 0) {
       break;
      } else {
       z = v;
       A = u;
      }
     }
     if (A >>> 0 < j >>> 0) {
      au();
      return 0;
     } else {
      c[A >> 2] = 0;
      y = z;
      break;
     }
    } else {
     u = c[g + (f + 8) >> 2] | 0;
     if (u >>> 0 < j >>> 0) {
      au();
      return 0;
     }
     v = u + 12 | 0;
     if ((c[v >> 2] | 0) != (o | 0)) {
      au();
      return 0;
     }
     w = t + 8 | 0;
     if ((c[w >> 2] | 0) == (o | 0)) {
      c[v >> 2] = t;
      c[w >> 2] = u;
      y = t;
      break;
     } else {
      au();
      return 0;
     }
    }
   } while (0);
   if ((s | 0) == 0) {
    break;
   }
   t = g + (f + 28) | 0;
   l = 1136 + (c[t >> 2] << 2) | 0;
   do {
    if ((o | 0) == (c[l >> 2] | 0)) {
     c[l >> 2] = y;
     if ((y | 0) != 0) {
      break;
     }
     c[209] = c[209] & ~(1 << c[t >> 2]);
     break L1056;
    } else {
     if (s >>> 0 < (c[212] | 0) >>> 0) {
      au();
      return 0;
     }
     k = s + 16 | 0;
     if ((c[k >> 2] | 0) == (o | 0)) {
      c[k >> 2] = y;
     } else {
      c[s + 20 >> 2] = y;
     }
     if ((y | 0) == 0) {
      break L1056;
     }
    }
   } while (0);
   if (y >>> 0 < (c[212] | 0) >>> 0) {
    au();
    return 0;
   }
   c[y + 24 >> 2] = s;
   o = c[g + (f + 16) >> 2] | 0;
   do {
    if ((o | 0) != 0) {
     if (o >>> 0 < (c[212] | 0) >>> 0) {
      au();
      return 0;
     } else {
      c[y + 16 >> 2] = o;
      c[o + 24 >> 2] = y;
      break;
     }
    }
   } while (0);
   o = c[g + (f + 20) >> 2] | 0;
   if ((o | 0) == 0) {
    break;
   }
   if (o >>> 0 < (c[212] | 0) >>> 0) {
    au();
    return 0;
   } else {
    c[y + 20 >> 2] = o;
    c[o + 24 >> 2] = y;
    break;
   }
  }
 } while (0);
 if (q >>> 0 < 16) {
  c[d >> 2] = p | c[d >> 2] & 1 | 2;
  y = g + (p | 4) | 0;
  c[y >> 2] = c[y >> 2] | 1;
  n = a;
  return n | 0;
 } else {
  c[d >> 2] = c[d >> 2] & 1 | b | 2;
  c[g + (b + 4) >> 2] = q | 3;
  d = g + (p | 4) | 0;
  c[d >> 2] = c[d >> 2] | 1;
  b9(g + b | 0, q);
  n = a;
  return n | 0;
 }
 return 0;
}
function bU() {
 return c[316] | 0;
}
function bV() {
 return c[317] | 0;
}
function bW() {
 var a = 0;
 a = c[318] | 0;
 return ((a | 0) == 0 ? -1 : a) | 0;
}
function bX(a) {
 a = a | 0;
 var b = 0, d = 0;
 if ((a | 0) == -1) {
  b = 0;
 } else {
  d = c[202] | 0;
  b = a - 1 + d & -d;
 }
 c[318] = b;
 return b | 0;
}
function bY(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0;
 do {
  if ((a | 0) == 0) {
   b = 0;
  } else {
   d = c[a - 4 >> 2] | 0;
   e = d & 3;
   if ((e | 0) == 1) {
    b = 0;
    break;
   }
   b = (d & -8) - ((e | 0) == 0 ? 8 : 4) | 0;
  }
 } while (0);
 return b | 0;
}
function bZ(a, b, d) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 var e = 0, f = 0, g = 0;
 do {
  if ((b | 0) == 8) {
   e = bL(d) | 0;
  } else {
   f = b >>> 2;
   if ((b & 3 | 0) != 0 | (f | 0) == 0) {
    g = 22;
    return g | 0;
   }
   if ((f + 1073741823 & f | 0) != 0) {
    g = 22;
    return g | 0;
   }
   if ((-64 - b | 0) >>> 0 < d >>> 0) {
    g = 12;
    return g | 0;
   } else {
    e = bR(b >>> 0 < 16 ? 16 : b, d) | 0;
    break;
   }
  }
 } while (0);
 if ((e | 0) == 0) {
  g = 12;
  return g | 0;
 }
 c[a >> 2] = e;
 g = 0;
 return g | 0;
}
function b_(a, b, d) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 var e = 0, f = 0;
 e = i;
 i = i + 8 | 0;
 f = e | 0;
 c[f >> 2] = b;
 b = b2(a, f, 3, d) | 0;
 i = e;
 return b | 0;
}
function b$(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 return b2(a, b, 0, c) | 0;
}
function b0(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0;
 if ((c[200] | 0) != 0) {
  b = c[201] | 0;
  d = bQ(b, a) | 0;
  return d | 0;
 }
 e = ar(8) | 0;
 if ((e - 1 & e | 0) != 0) {
  au();
  return 0;
 }
 c[202] = e;
 c[201] = e;
 c[203] = -1;
 c[204] = 2097152;
 c[205] = 0;
 c[319] = 0;
 c[200] = (a_(0) | 0) & -16 ^ 1431655768;
 b = c[201] | 0;
 d = bQ(b, a) | 0;
 return d | 0;
}
function b1(a) {
 a = a | 0;
 var b = 0;
 do {
  if ((c[200] | 0) == 0) {
   b = ar(8) | 0;
   if ((b - 1 & b | 0) == 0) {
    c[202] = b;
    c[201] = b;
    c[203] = -1;
    c[204] = 2097152;
    c[205] = 0;
    c[319] = 0;
    c[200] = (a_(0) | 0) & -16 ^ 1431655768;
    break;
   } else {
    au();
    return 0;
   }
  }
 } while (0);
 b = c[201] | 0;
 return bQ(b, a - 1 + b & -b) | 0;
}
function b2(a, b, d, e) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 e = e | 0;
 var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0;
 do {
  if ((c[200] | 0) == 0) {
   f = ar(8) | 0;
   if ((f - 1 & f | 0) == 0) {
    c[202] = f;
    c[201] = f;
    c[203] = -1;
    c[204] = 2097152;
    c[205] = 0;
    c[319] = 0;
    c[200] = (a_(0) | 0) & -16 ^ 1431655768;
    break;
   } else {
    au();
    return 0;
   }
  }
 } while (0);
 f = (a | 0) == 0;
 do {
  if ((e | 0) == 0) {
   if (f) {
    g = bL(0) | 0;
    return g | 0;
   } else {
    h = a << 2;
    if (h >>> 0 < 11) {
     i = 0;
     j = 16;
     break;
    }
    i = 0;
    j = h + 11 & -8;
    break;
   }
  } else {
   if (f) {
    g = e;
   } else {
    i = e;
    j = 0;
    break;
   }
   return g | 0;
  }
 } while (0);
 do {
  if ((d & 1 | 0) == 0) {
   if (f) {
    k = 0;
    l = 0;
    break;
   } else {
    m = 0;
    n = 0;
   }
   while (1) {
    e = c[b + (n << 2) >> 2] | 0;
    if (e >>> 0 < 11) {
     o = 16;
    } else {
     o = e + 11 & -8;
    }
    e = o + m | 0;
    h = n + 1 | 0;
    if ((h | 0) == (a | 0)) {
     k = 0;
     l = e;
     break;
    } else {
     m = e;
     n = h;
    }
   }
  } else {
   h = c[b >> 2] | 0;
   if (h >>> 0 < 11) {
    p = 16;
   } else {
    p = h + 11 & -8;
   }
   k = p;
   l = ad(p, a) | 0;
  }
 } while (0);
 p = bL(j - 4 + l | 0) | 0;
 if ((p | 0) == 0) {
  g = 0;
  return g | 0;
 }
 n = p - 8 | 0;
 m = c[p - 4 >> 2] & -8;
 if ((d & 2 | 0) != 0) {
  cL(p | 0, 0, -4 - j + m | 0);
 }
 if ((i | 0) == 0) {
  c[p + (l - 4) >> 2] = m - l | 3;
  q = p + l | 0;
  r = l;
 } else {
  q = i;
  r = m;
 }
 c[q >> 2] = p;
 p = a - 1 | 0;
 L1216 : do {
  if ((p | 0) == 0) {
   s = n;
   t = r;
  } else {
   if ((k | 0) == 0) {
    u = n;
    v = r;
    w = 0;
   } else {
    a = n;
    m = r;
    i = 0;
    while (1) {
     l = m - k | 0;
     c[a + 4 >> 2] = k | 3;
     j = a + k | 0;
     d = i + 1 | 0;
     c[q + (d << 2) >> 2] = a + (k + 8);
     if ((d | 0) == (p | 0)) {
      s = j;
      t = l;
      break L1216;
     } else {
      a = j;
      m = l;
      i = d;
     }
    }
   }
   while (1) {
    i = c[b + (w << 2) >> 2] | 0;
    if (i >>> 0 < 11) {
     x = 16;
    } else {
     x = i + 11 & -8;
    }
    i = v - x | 0;
    c[u + 4 >> 2] = x | 3;
    m = u + x | 0;
    a = w + 1 | 0;
    c[q + (a << 2) >> 2] = u + (x + 8);
    if ((a | 0) == (p | 0)) {
     s = m;
     t = i;
     break;
    } else {
     u = m;
     v = i;
     w = a;
    }
   }
  }
 } while (0);
 c[s + 4 >> 2] = t | 3;
 g = q;
 return g | 0;
}
function b3(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
 d = a + (b << 2) | 0;
 L1229 : do {
  if ((b | 0) != 0) {
   e = a;
   L1230 : while (1) {
    f = c[e >> 2] | 0;
    L1232 : do {
     if ((f | 0) == 0) {
      g = e + 4 | 0;
     } else {
      h = f - 8 | 0;
      i = h;
      j = f - 4 | 0;
      k = c[j >> 2] & -8;
      c[e >> 2] = 0;
      if (h >>> 0 < (c[212] | 0) >>> 0) {
       l = 935;
       break L1230;
      }
      h = c[j >> 2] | 0;
      if ((h & 3 | 0) == 1) {
       l = 936;
       break L1230;
      }
      m = e + 4 | 0;
      n = h - 8 & -8;
      do {
       if ((m | 0) != (d | 0)) {
        if ((c[m >> 2] | 0) != (f + (n + 8) | 0)) {
         break;
        }
        o = (c[f + (n | 4) >> 2] & -8) + k | 0;
        c[j >> 2] = h & 1 | o | 2;
        p = f + (o - 4) | 0;
        c[p >> 2] = c[p >> 2] | 1;
        c[m >> 2] = f;
        g = m;
        break L1232;
       }
      } while (0);
      b9(i, k);
      g = m;
     }
    } while (0);
    if ((g | 0) == (d | 0)) {
     break L1229;
    } else {
     e = g;
    }
   }
   if ((l | 0) == 935) {
    au();
    return 0;
   } else if ((l | 0) == 936) {
    au();
    return 0;
   }
  }
 } while (0);
 if ((c[211] | 0) >>> 0 <= (c[215] | 0) >>> 0) {
  return 0;
 }
 bS(0) | 0;
 return 0;
}
function b4(a) {
 a = a | 0;
 var b = 0, d = 0;
 if ((c[200] | 0) != 0) {
  b = bS(a) | 0;
  return b | 0;
 }
 d = ar(8) | 0;
 if ((d - 1 & d | 0) != 0) {
  au();
  return 0;
 }
 c[202] = d;
 c[201] = d;
 c[203] = -1;
 c[204] = 2097152;
 c[205] = 0;
 c[319] = 0;
 c[200] = (a_(0) | 0) & -16 ^ 1431655768;
 b = bS(a) | 0;
 return b | 0;
}
function b5(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0;
 do {
  if ((c[200] | 0) == 0) {
   b = ar(8) | 0;
   if ((b - 1 & b | 0) == 0) {
    c[202] = b;
    c[201] = b;
    c[203] = -1;
    c[204] = 2097152;
    c[205] = 0;
    c[319] = 0;
    c[200] = (a_(0) | 0) & -16 ^ 1431655768;
    break;
   } else {
    au();
   }
  }
 } while (0);
 b = c[214] | 0;
 if ((b | 0) == 0) {
  d = 0;
  e = 0;
  f = 0;
  g = 0;
  h = 0;
  i = 0;
  j = 0;
 } else {
  k = c[211] | 0;
  l = k + 40 | 0;
  m = 1;
  n = l;
  o = l;
  l = 1280;
  while (1) {
   p = c[l >> 2] | 0;
   q = p + 8 | 0;
   if ((q & 7 | 0) == 0) {
    r = 0;
   } else {
    r = -q & 7;
   }
   q = p + (c[l + 4 >> 2] | 0) | 0;
   s = m;
   t = n;
   u = o;
   v = p + r | 0;
   while (1) {
    if (v >>> 0 >= q >>> 0 | (v | 0) == (b | 0)) {
     w = s;
     x = t;
     y = u;
     break;
    }
    z = c[v + 4 >> 2] | 0;
    if ((z | 0) == 7) {
     w = s;
     x = t;
     y = u;
     break;
    }
    A = z & -8;
    B = A + u | 0;
    if ((z & 3 | 0) == 1) {
     C = A + t | 0;
     D = s + 1 | 0;
    } else {
     C = t;
     D = s;
    }
    z = v + A | 0;
    if (z >>> 0 < p >>> 0) {
     w = D;
     x = C;
     y = B;
     break;
    } else {
     s = D;
     t = C;
     u = B;
     v = z;
    }
   }
   v = c[l + 8 >> 2] | 0;
   if ((v | 0) == 0) {
    break;
   } else {
    m = w;
    n = x;
    o = y;
    l = v;
   }
  }
  l = c[316] | 0;
  d = k;
  e = y;
  f = w;
  g = l - y | 0;
  h = c[317] | 0;
  i = l - x | 0;
  j = x;
 }
 c[a >> 2] = e;
 c[a + 4 >> 2] = f;
 f = a + 8 | 0;
 c[f >> 2] = 0;
 c[f + 4 >> 2] = 0;
 c[a + 16 >> 2] = g;
 c[a + 20 >> 2] = h;
 c[a + 24 >> 2] = 0;
 c[a + 28 >> 2] = i;
 c[a + 32 >> 2] = j;
 c[a + 36 >> 2] = d;
 return;
}
function b6() {
 var a = 0, b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
 a = i;
 do {
  if ((c[200] | 0) == 0) {
   b = ar(8) | 0;
   if ((b - 1 & b | 0) == 0) {
    c[202] = b;
    c[201] = b;
    c[203] = -1;
    c[204] = 2097152;
    c[205] = 0;
    c[319] = 0;
    c[200] = (a_(0) | 0) & -16 ^ 1431655768;
    break;
   } else {
    au();
   }
  }
 } while (0);
 b = c[214] | 0;
 if ((b | 0) == 0) {
  d = 0;
  e = 0;
  f = 0;
 } else {
  g = c[317] | 0;
  h = c[316] | 0;
  j = h - 40 - (c[211] | 0) | 0;
  k = 1280;
  while (1) {
   l = c[k >> 2] | 0;
   m = l + 8 | 0;
   if ((m & 7 | 0) == 0) {
    n = 0;
   } else {
    n = -m & 7;
   }
   m = l + (c[k + 4 >> 2] | 0) | 0;
   p = j;
   q = l + n | 0;
   while (1) {
    if (q >>> 0 >= m >>> 0 | (q | 0) == (b | 0)) {
     r = p;
     break;
    }
    s = c[q + 4 >> 2] | 0;
    if ((s | 0) == 7) {
     r = p;
     break;
    }
    t = s & -8;
    u = p - ((s & 3 | 0) == 1 ? t : 0) | 0;
    s = q + t | 0;
    if (s >>> 0 < l >>> 0) {
     r = u;
     break;
    } else {
     p = u;
     q = s;
    }
   }
   q = c[k + 8 >> 2] | 0;
   if ((q | 0) == 0) {
    d = r;
    e = h;
    f = g;
    break;
   } else {
    j = r;
    k = q;
   }
  }
 }
 av(c[o >> 2] | 0, 520, (y = i, i = i + 8 | 0, c[y >> 2] = f, y) | 0) | 0;
 av(c[o >> 2] | 0, 488, (y = i, i = i + 8 | 0, c[y >> 2] = e, y) | 0) | 0;
 av(c[o >> 2] | 0, 400, (y = i, i = i + 8 | 0, c[y >> 2] = d, y) | 0) | 0;
 i = a;
 return;
}
function b7(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0;
 do {
  if ((c[200] | 0) == 0) {
   d = ar(8) | 0;
   if ((d - 1 & d | 0) == 0) {
    c[202] = d;
    c[201] = d;
    c[203] = -1;
    c[204] = 2097152;
    c[205] = 0;
    c[319] = 0;
    c[200] = (a_(0) | 0) & -16 ^ 1431655768;
    break;
   } else {
    au();
    return 0;
   }
  }
 } while (0);
 if ((a | 0) == (-1 | 0)) {
  c[204] = b;
  e = 1;
  return e | 0;
 } else if ((a | 0) == (-2 | 0)) {
  if ((c[201] | 0) >>> 0 > b >>> 0) {
   e = 0;
   return e | 0;
  }
  if ((b - 1 & b | 0) != 0) {
   e = 0;
   return e | 0;
  }
  c[202] = b;
  e = 1;
  return e | 0;
 } else if ((a | 0) == (-3 | 0)) {
  c[203] = b;
  e = 1;
  return e | 0;
 } else {
  e = 0;
  return e | 0;
 }
 return 0;
}
function b8() {
 return (F = c[328] | 0, c[328] = F + 0, F) | 0;
}
function b9(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0;
 d = a;
 e = d + b | 0;
 f = e;
 g = c[a + 4 >> 2] | 0;
 L1325 : do {
  if ((g & 1 | 0) == 0) {
   h = c[a >> 2] | 0;
   if ((g & 3 | 0) == 0) {
    return;
   }
   i = d + (-h | 0) | 0;
   j = i;
   k = h + b | 0;
   l = c[212] | 0;
   if (i >>> 0 < l >>> 0) {
    au();
   }
   if ((j | 0) == (c[213] | 0)) {
    m = d + (b + 4) | 0;
    if ((c[m >> 2] & 3 | 0) != 3) {
     n = j;
     o = k;
     break;
    }
    c[210] = k;
    c[m >> 2] = c[m >> 2] & -2;
    c[d + (4 - h) >> 2] = k | 1;
    c[e >> 2] = k;
    return;
   }
   m = h >>> 3;
   if (h >>> 0 < 256) {
    p = c[d + (8 - h) >> 2] | 0;
    q = c[d + (12 - h) >> 2] | 0;
    r = 872 + (m << 1 << 2) | 0;
    do {
     if ((p | 0) != (r | 0)) {
      if (p >>> 0 < l >>> 0) {
       au();
      }
      if ((c[p + 12 >> 2] | 0) == (j | 0)) {
       break;
      }
      au();
     }
    } while (0);
    if ((q | 0) == (p | 0)) {
     c[208] = c[208] & ~(1 << m);
     n = j;
     o = k;
     break;
    }
    do {
     if ((q | 0) == (r | 0)) {
      s = q + 8 | 0;
     } else {
      if (q >>> 0 < l >>> 0) {
       au();
      }
      t = q + 8 | 0;
      if ((c[t >> 2] | 0) == (j | 0)) {
       s = t;
       break;
      }
      au();
     }
    } while (0);
    c[p + 12 >> 2] = q;
    c[s >> 2] = p;
    n = j;
    o = k;
    break;
   }
   r = i;
   m = c[d + (24 - h) >> 2] | 0;
   t = c[d + (12 - h) >> 2] | 0;
   do {
    if ((t | 0) == (r | 0)) {
     u = 16 - h | 0;
     v = d + (u + 4) | 0;
     w = c[v >> 2] | 0;
     if ((w | 0) == 0) {
      x = d + u | 0;
      u = c[x >> 2] | 0;
      if ((u | 0) == 0) {
       y = 0;
       break;
      } else {
       z = u;
       A = x;
      }
     } else {
      z = w;
      A = v;
     }
     while (1) {
      v = z + 20 | 0;
      w = c[v >> 2] | 0;
      if ((w | 0) != 0) {
       z = w;
       A = v;
       continue;
      }
      v = z + 16 | 0;
      w = c[v >> 2] | 0;
      if ((w | 0) == 0) {
       break;
      } else {
       z = w;
       A = v;
      }
     }
     if (A >>> 0 < l >>> 0) {
      au();
     } else {
      c[A >> 2] = 0;
      y = z;
      break;
     }
    } else {
     v = c[d + (8 - h) >> 2] | 0;
     if (v >>> 0 < l >>> 0) {
      au();
     }
     w = v + 12 | 0;
     if ((c[w >> 2] | 0) != (r | 0)) {
      au();
     }
     x = t + 8 | 0;
     if ((c[x >> 2] | 0) == (r | 0)) {
      c[w >> 2] = t;
      c[x >> 2] = v;
      y = t;
      break;
     } else {
      au();
     }
    }
   } while (0);
   if ((m | 0) == 0) {
    n = j;
    o = k;
    break;
   }
   t = d + (28 - h) | 0;
   l = 1136 + (c[t >> 2] << 2) | 0;
   do {
    if ((r | 0) == (c[l >> 2] | 0)) {
     c[l >> 2] = y;
     if ((y | 0) != 0) {
      break;
     }
     c[209] = c[209] & ~(1 << c[t >> 2]);
     n = j;
     o = k;
     break L1325;
    } else {
     if (m >>> 0 < (c[212] | 0) >>> 0) {
      au();
     }
     i = m + 16 | 0;
     if ((c[i >> 2] | 0) == (r | 0)) {
      c[i >> 2] = y;
     } else {
      c[m + 20 >> 2] = y;
     }
     if ((y | 0) == 0) {
      n = j;
      o = k;
      break L1325;
     }
    }
   } while (0);
   if (y >>> 0 < (c[212] | 0) >>> 0) {
    au();
   }
   c[y + 24 >> 2] = m;
   r = 16 - h | 0;
   t = c[d + r >> 2] | 0;
   do {
    if ((t | 0) != 0) {
     if (t >>> 0 < (c[212] | 0) >>> 0) {
      au();
     } else {
      c[y + 16 >> 2] = t;
      c[t + 24 >> 2] = y;
      break;
     }
    }
   } while (0);
   t = c[d + (r + 4) >> 2] | 0;
   if ((t | 0) == 0) {
    n = j;
    o = k;
    break;
   }
   if (t >>> 0 < (c[212] | 0) >>> 0) {
    au();
   } else {
    c[y + 20 >> 2] = t;
    c[t + 24 >> 2] = y;
    n = j;
    o = k;
    break;
   }
  } else {
   n = a;
   o = b;
  }
 } while (0);
 a = c[212] | 0;
 if (e >>> 0 < a >>> 0) {
  au();
 }
 y = d + (b + 4) | 0;
 z = c[y >> 2] | 0;
 do {
  if ((z & 2 | 0) == 0) {
   if ((f | 0) == (c[214] | 0)) {
    A = (c[211] | 0) + o | 0;
    c[211] = A;
    c[214] = n;
    c[n + 4 >> 2] = A | 1;
    if ((n | 0) != (c[213] | 0)) {
     return;
    }
    c[213] = 0;
    c[210] = 0;
    return;
   }
   if ((f | 0) == (c[213] | 0)) {
    A = (c[210] | 0) + o | 0;
    c[210] = A;
    c[213] = n;
    c[n + 4 >> 2] = A | 1;
    c[n + A >> 2] = A;
    return;
   }
   A = (z & -8) + o | 0;
   s = z >>> 3;
   L1424 : do {
    if (z >>> 0 < 256) {
     g = c[d + (b + 8) >> 2] | 0;
     t = c[d + (b + 12) >> 2] | 0;
     h = 872 + (s << 1 << 2) | 0;
     do {
      if ((g | 0) != (h | 0)) {
       if (g >>> 0 < a >>> 0) {
        au();
       }
       if ((c[g + 12 >> 2] | 0) == (f | 0)) {
        break;
       }
       au();
      }
     } while (0);
     if ((t | 0) == (g | 0)) {
      c[208] = c[208] & ~(1 << s);
      break;
     }
     do {
      if ((t | 0) == (h | 0)) {
       B = t + 8 | 0;
      } else {
       if (t >>> 0 < a >>> 0) {
        au();
       }
       m = t + 8 | 0;
       if ((c[m >> 2] | 0) == (f | 0)) {
        B = m;
        break;
       }
       au();
      }
     } while (0);
     c[g + 12 >> 2] = t;
     c[B >> 2] = g;
    } else {
     h = e;
     m = c[d + (b + 24) >> 2] | 0;
     l = c[d + (b + 12) >> 2] | 0;
     do {
      if ((l | 0) == (h | 0)) {
       i = d + (b + 20) | 0;
       p = c[i >> 2] | 0;
       if ((p | 0) == 0) {
        q = d + (b + 16) | 0;
        v = c[q >> 2] | 0;
        if ((v | 0) == 0) {
         C = 0;
         break;
        } else {
         D = v;
         E = q;
        }
       } else {
        D = p;
        E = i;
       }
       while (1) {
        i = D + 20 | 0;
        p = c[i >> 2] | 0;
        if ((p | 0) != 0) {
         D = p;
         E = i;
         continue;
        }
        i = D + 16 | 0;
        p = c[i >> 2] | 0;
        if ((p | 0) == 0) {
         break;
        } else {
         D = p;
         E = i;
        }
       }
       if (E >>> 0 < a >>> 0) {
        au();
       } else {
        c[E >> 2] = 0;
        C = D;
        break;
       }
      } else {
       i = c[d + (b + 8) >> 2] | 0;
       if (i >>> 0 < a >>> 0) {
        au();
       }
       p = i + 12 | 0;
       if ((c[p >> 2] | 0) != (h | 0)) {
        au();
       }
       q = l + 8 | 0;
       if ((c[q >> 2] | 0) == (h | 0)) {
        c[p >> 2] = l;
        c[q >> 2] = i;
        C = l;
        break;
       } else {
        au();
       }
      }
     } while (0);
     if ((m | 0) == 0) {
      break;
     }
     l = d + (b + 28) | 0;
     g = 1136 + (c[l >> 2] << 2) | 0;
     do {
      if ((h | 0) == (c[g >> 2] | 0)) {
       c[g >> 2] = C;
       if ((C | 0) != 0) {
        break;
       }
       c[209] = c[209] & ~(1 << c[l >> 2]);
       break L1424;
      } else {
       if (m >>> 0 < (c[212] | 0) >>> 0) {
        au();
       }
       t = m + 16 | 0;
       if ((c[t >> 2] | 0) == (h | 0)) {
        c[t >> 2] = C;
       } else {
        c[m + 20 >> 2] = C;
       }
       if ((C | 0) == 0) {
        break L1424;
       }
      }
     } while (0);
     if (C >>> 0 < (c[212] | 0) >>> 0) {
      au();
     }
     c[C + 24 >> 2] = m;
     h = c[d + (b + 16) >> 2] | 0;
     do {
      if ((h | 0) != 0) {
       if (h >>> 0 < (c[212] | 0) >>> 0) {
        au();
       } else {
        c[C + 16 >> 2] = h;
        c[h + 24 >> 2] = C;
        break;
       }
      }
     } while (0);
     h = c[d + (b + 20) >> 2] | 0;
     if ((h | 0) == 0) {
      break;
     }
     if (h >>> 0 < (c[212] | 0) >>> 0) {
      au();
     } else {
      c[C + 20 >> 2] = h;
      c[h + 24 >> 2] = C;
      break;
     }
    }
   } while (0);
   c[n + 4 >> 2] = A | 1;
   c[n + A >> 2] = A;
   if ((n | 0) != (c[213] | 0)) {
    F = A;
    break;
   }
   c[210] = A;
   return;
  } else {
   c[y >> 2] = z & -2;
   c[n + 4 >> 2] = o | 1;
   c[n + o >> 2] = o;
   F = o;
  }
 } while (0);
 o = F >>> 3;
 if (F >>> 0 < 256) {
  z = o << 1;
  y = 872 + (z << 2) | 0;
  C = c[208] | 0;
  b = 1 << o;
  do {
   if ((C & b | 0) == 0) {
    c[208] = C | b;
    G = y;
    H = 872 + (z + 2 << 2) | 0;
   } else {
    o = 872 + (z + 2 << 2) | 0;
    d = c[o >> 2] | 0;
    if (d >>> 0 >= (c[212] | 0) >>> 0) {
     G = d;
     H = o;
     break;
    }
    au();
   }
  } while (0);
  c[H >> 2] = n;
  c[G + 12 >> 2] = n;
  c[n + 8 >> 2] = G;
  c[n + 12 >> 2] = y;
  return;
 }
 y = n;
 G = F >>> 8;
 do {
  if ((G | 0) == 0) {
   I = 0;
  } else {
   if (F >>> 0 > 16777215) {
    I = 31;
    break;
   }
   H = (G + 1048320 | 0) >>> 16 & 8;
   z = G << H;
   b = (z + 520192 | 0) >>> 16 & 4;
   C = z << b;
   z = (C + 245760 | 0) >>> 16 & 2;
   o = 14 - (b | H | z) + (C << z >>> 15) | 0;
   I = F >>> ((o + 7 | 0) >>> 0) & 1 | o << 1;
  }
 } while (0);
 G = 1136 + (I << 2) | 0;
 c[n + 28 >> 2] = I;
 c[n + 20 >> 2] = 0;
 c[n + 16 >> 2] = 0;
 o = c[209] | 0;
 z = 1 << I;
 if ((o & z | 0) == 0) {
  c[209] = o | z;
  c[G >> 2] = y;
  c[n + 24 >> 2] = G;
  c[n + 12 >> 2] = n;
  c[n + 8 >> 2] = n;
  return;
 }
 if ((I | 0) == 31) {
  J = 0;
 } else {
  J = 25 - (I >>> 1) | 0;
 }
 I = F << J;
 J = c[G >> 2] | 0;
 while (1) {
  if ((c[J + 4 >> 2] & -8 | 0) == (F | 0)) {
   break;
  }
  K = J + 16 + (I >>> 31 << 2) | 0;
  G = c[K >> 2] | 0;
  if ((G | 0) == 0) {
   L = 1120;
   break;
  } else {
   I = I << 1;
   J = G;
  }
 }
 if ((L | 0) == 1120) {
  if (K >>> 0 < (c[212] | 0) >>> 0) {
   au();
  }
  c[K >> 2] = y;
  c[n + 24 >> 2] = J;
  c[n + 12 >> 2] = n;
  c[n + 8 >> 2] = n;
  return;
 }
 K = J + 8 | 0;
 L = c[K >> 2] | 0;
 I = c[212] | 0;
 if (J >>> 0 < I >>> 0) {
  au();
 }
 if (L >>> 0 < I >>> 0) {
  au();
 }
 c[L + 12 >> 2] = y;
 c[K >> 2] = y;
 c[n + 8 >> 2] = L;
 c[n + 12 >> 2] = J;
 c[n + 24 >> 2] = 0;
 return;
}
function ca(a) {
 a = a | 0;
 var b = 0, d = 0, e = 0;
 b = (a | 0) == 0 ? 1 : a;
 while (1) {
  d = bL(b) | 0;
  if ((d | 0) != 0) {
   e = 1164;
   break;
  }
  a = (F = c[328] | 0, c[328] = F + 0, F);
  if ((a | 0) == 0) {
   break;
  }
  a5[a & 1]();
 }
 if ((e | 0) == 1164) {
  return d | 0;
 }
 d = aJ(4) | 0;
 c[d >> 2] = 560;
 as(d | 0, 688, 6);
 return 0;
}
function cb(a, b) {
 a = a | 0;
 b = b | 0;
 return ca(a) | 0;
}
function cc(a) {
 a = a | 0;
 return;
}
function cd(a) {
 a = a | 0;
 return 360 | 0;
}
function ce(a) {
 a = a | 0;
 return 448 | 0;
}
function cf(a) {
 a = a | 0;
 return (F = c[328] | 0, c[328] = a, F) | 0;
}
function cg(a) {
 a = a | 0;
 c[a >> 2] = 560;
 return;
}
function ch(a) {
 a = a | 0;
 c[a >> 2] = 592;
 return;
}
function ci(a) {
 a = a | 0;
 if ((a | 0) != 0) {
  bM(a);
 }
 return;
}
function cj(a, b) {
 a = a | 0;
 b = b | 0;
 ci(a);
 return;
}
function ck(a) {
 a = a | 0;
 ci(a);
 return;
}
function cl(a, b) {
 a = a | 0;
 b = b | 0;
 ck(a);
 return;
}
function cm(a) {
 a = a | 0;
 ci(a);
 return;
}
function cn(a) {
 a = a | 0;
 ci(a);
 return;
}
function co(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 return cp(a, b, c, 0, 0, 0) | 0;
}
function cp(b, d, e, f, g, h) {
 b = b | 0;
 d = d | 0;
 e = e | 0;
 f = f | 0;
 g = g | 0;
 h = h | 0;
 var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, _ = 0, $ = 0, aa = 0, ab = 0, ac = 0, ad = 0;
 j = i;
 if ((e | 0) == 0) {
  k = -1;
  i = j;
  return k | 0;
 }
 l = c[44] | 0;
 if ((l | 0) == 0) {
  c[196] = 1;
  c[44] = 1;
  m = 1;
  n = 1;
  o = 1190;
 } else {
  p = c[196] | 0;
  q = c[74] | 0;
  if ((q | 0) == -1 | (p | 0) != 0) {
   m = p;
   n = l;
   o = 1190;
  } else {
   r = q;
   s = p;
   t = l;
  }
 }
 if ((o | 0) == 1190) {
  l = (aP(344) | 0) != 0 | 0;
  c[74] = l;
  r = l;
  s = m;
  t = n;
 }
 n = a[e] | 0;
 if (n << 24 >> 24 == 45) {
  u = h | 2;
  o = 1194;
 } else {
  m = (r | 0) != 0 | n << 24 >> 24 == 43 ? h & -2 : h;
  if (n << 24 >> 24 == 43) {
   u = m;
   o = 1194;
  } else {
   v = e;
   w = m;
  }
 }
 if ((o | 0) == 1194) {
  v = e + 1 | 0;
  w = u;
 }
 c[198] = 0;
 if ((s | 0) == 0) {
  x = t;
  o = 1198;
 } else {
  c[50] = -1;
  c[48] = -1;
  z = t;
  A = s;
  o = 1197;
 }
 while (1) {
  if ((o | 0) == 1197) {
   o = 0;
   if ((A | 0) == 0) {
    x = z;
    o = 1198;
    continue;
   } else {
    B = z;
   }
  } else if ((o | 0) == 1198) {
   o = 0;
   s = c[40] | 0;
   if ((a[s] | 0) == 0) {
    B = x;
   } else {
    C = s;
    D = x;
    break;
   }
  }
  c[196] = 0;
  if ((B | 0) >= (b | 0)) {
   o = 1200;
   break;
  }
  E = d + (B << 2) | 0;
  F = c[E >> 2] | 0;
  c[40] = F;
  if ((a[F] | 0) == 45) {
   G = F + 1 | 0;
   H = a[G] | 0;
   if (H << 24 >> 24 != 0) {
    o = 1232;
    break;
   }
   if ((aB(v | 0, 45) | 0) != 0) {
    o = 1232;
    break;
   }
  }
  c[40] = 824;
  if ((w & 2 | 0) != 0) {
   o = 1217;
   break;
  }
  if ((w & 1 | 0) == 0) {
   k = -1;
   o = 1298;
   break;
  }
  s = c[48] | 0;
  do {
   if ((s | 0) == -1) {
    c[48] = B;
    I = B;
    J = 0;
   } else {
    t = c[50] | 0;
    if ((t | 0) == -1) {
     I = B;
     J = 0;
     break;
    }
    u = t - s | 0;
    e = B - t | 0;
    m = (u | 0) % (e | 0) | 0;
    if ((m | 0) == 0) {
     K = e;
    } else {
     n = e;
     h = m;
     while (1) {
      m = (n | 0) % (h | 0) | 0;
      if ((m | 0) == 0) {
       K = h;
       break;
      } else {
       n = h;
       h = m;
      }
     }
    }
    h = (B - s | 0) / (K | 0) | 0;
    do {
     if ((K | 0) > 0) {
      n = -u | 0;
      if ((h | 0) > 0) {
       L = 0;
      } else {
       M = B;
       N = t;
       O = s;
       P = 0;
       break;
      }
      do {
       m = L + t | 0;
       r = d + (m << 2) | 0;
       l = 0;
       p = m;
       m = c[r >> 2] | 0;
       while (1) {
        q = ((p | 0) < (t | 0) ? e : n) + p | 0;
        Q = d + (q << 2) | 0;
        R = c[Q >> 2] | 0;
        c[Q >> 2] = m;
        c[r >> 2] = R;
        Q = l + 1 | 0;
        if ((Q | 0) < (h | 0)) {
         l = Q;
         p = q;
         m = R;
        } else {
         break;
        }
       }
       L = L + 1 | 0;
      } while ((L | 0) < (K | 0));
      M = c[44] | 0;
      N = c[50] | 0;
      O = c[48] | 0;
      P = c[196] | 0;
     } else {
      M = B;
      N = t;
      O = s;
      P = 0;
     }
    } while (0);
    c[48] = M - N + O;
    c[50] = -1;
    I = M;
    J = P;
   }
  } while (0);
  s = I + 1 | 0;
  c[44] = s;
  z = s;
  A = J;
  o = 1197;
 }
 do {
  if ((o | 0) == 1298) {
   i = j;
   return k | 0;
  } else if ((o | 0) == 1232) {
   J = c[48] | 0;
   A = c[50] | 0;
   if ((J | 0) != -1 & (A | 0) == -1) {
    c[50] = B;
    S = a[G] | 0;
    T = B;
   } else {
    S = H;
    T = A;
   }
   if (S << 24 >> 24 == 0) {
    C = F;
    D = B;
    break;
   }
   c[40] = G;
   if ((a[G] | 0) != 45) {
    C = G;
    D = B;
    break;
   }
   if ((a[F + 2 | 0] | 0) != 0) {
    C = G;
    D = B;
    break;
   }
   A = B + 1 | 0;
   c[44] = A;
   c[40] = 824;
   if ((T | 0) != -1) {
    z = T - J | 0;
    I = A - T | 0;
    P = (z | 0) % (I | 0) | 0;
    if ((P | 0) == 0) {
     U = I;
    } else {
     M = I;
     O = P;
     while (1) {
      P = (M | 0) % (O | 0) | 0;
      if ((P | 0) == 0) {
       U = O;
       break;
      } else {
       M = O;
       O = P;
      }
     }
    }
    O = (A - J | 0) / (U | 0) | 0;
    do {
     if ((U | 0) > 0) {
      M = -z | 0;
      if ((O | 0) > 0) {
       V = 0;
      } else {
       W = T;
       X = J;
       Y = A;
       break;
      }
      do {
       P = V + T | 0;
       N = d + (P << 2) | 0;
       K = 0;
       L = P;
       P = c[N >> 2] | 0;
       while (1) {
        x = ((L | 0) < (T | 0) ? I : M) + L | 0;
        s = d + (x << 2) | 0;
        t = c[s >> 2] | 0;
        c[s >> 2] = P;
        c[N >> 2] = t;
        s = K + 1 | 0;
        if ((s | 0) < (O | 0)) {
         K = s;
         L = x;
         P = t;
        } else {
         break;
        }
       }
       V = V + 1 | 0;
      } while ((V | 0) < (U | 0));
      W = c[50] | 0;
      X = c[48] | 0;
      Y = c[44] | 0;
     } else {
      W = T;
      X = J;
      Y = A;
     }
    } while (0);
    c[44] = X - W + Y;
   }
   c[50] = -1;
   c[48] = -1;
   k = -1;
   i = j;
   return k | 0;
  } else if ((o | 0) == 1200) {
   c[40] = 824;
   A = c[50] | 0;
   J = c[48] | 0;
   do {
    if ((A | 0) == -1) {
     if ((J | 0) == -1) {
      break;
     }
     c[44] = J;
    } else {
     O = A - J | 0;
     I = B - A | 0;
     z = (O | 0) % (I | 0) | 0;
     if ((z | 0) == 0) {
      Z = I;
     } else {
      M = I;
      P = z;
      while (1) {
       z = (M | 0) % (P | 0) | 0;
       if ((z | 0) == 0) {
        Z = P;
        break;
       } else {
        M = P;
        P = z;
       }
      }
     }
     P = (B - J | 0) / (Z | 0) | 0;
     do {
      if ((Z | 0) > 0) {
       M = -O | 0;
       if ((P | 0) > 0) {
        _ = 0;
       } else {
        $ = A;
        aa = J;
        ab = B;
        break;
       }
       do {
        z = _ + A | 0;
        L = d + (z << 2) | 0;
        K = 0;
        N = z;
        z = c[L >> 2] | 0;
        while (1) {
         t = ((N | 0) < (A | 0) ? I : M) + N | 0;
         x = d + (t << 2) | 0;
         s = c[x >> 2] | 0;
         c[x >> 2] = z;
         c[L >> 2] = s;
         x = K + 1 | 0;
         if ((x | 0) < (P | 0)) {
          K = x;
          N = t;
          z = s;
         } else {
          break;
         }
        }
        _ = _ + 1 | 0;
       } while ((_ | 0) < (Z | 0));
       $ = c[50] | 0;
       aa = c[48] | 0;
       ab = c[44] | 0;
      } else {
       $ = A;
       aa = J;
       ab = B;
      }
     } while (0);
     c[44] = aa - $ + ab;
    }
   } while (0);
   c[50] = -1;
   c[48] = -1;
   k = -1;
   i = j;
   return k | 0;
  } else if ((o | 0) == 1217) {
   c[44] = B + 1;
   c[198] = c[E >> 2];
   k = 1;
   i = j;
   return k | 0;
  }
 } while (0);
 E = (f | 0) != 0;
 L1659 : do {
  if (E) {
   if ((C | 0) == (c[d + (D << 2) >> 2] | 0)) {
    ac = C;
    break;
   }
   B = a[C] | 0;
   do {
    if (B << 24 >> 24 == 45) {
     c[40] = C + 1;
     ad = 0;
    } else {
     if ((w & 4 | 0) == 0) {
      ac = C;
      break L1659;
     }
     if (B << 24 >> 24 == 58) {
      ad = 0;
      break;
     }
     ad = (aB(v | 0, B << 24 >> 24 | 0) | 0) != 0 | 0;
    }
   } while (0);
   B = cv(d, v, f, g, ad) | 0;
   if ((B | 0) == -1) {
    ac = c[40] | 0;
    break;
   }
   c[40] = 824;
   k = B;
   i = j;
   return k | 0;
  } else {
   ac = C;
  }
 } while (0);
 C = ac + 1 | 0;
 c[40] = C;
 ad = a[ac] | 0;
 ac = ad << 24 >> 24;
 if ((ad << 24 >> 24 | 0) == 45) {
  if ((a[C] | 0) == 0) {
   o = 1260;
  }
 } else if ((ad << 24 >> 24 | 0) == 58) {
  o = 1263;
 } else {
  o = 1260;
 }
 do {
  if ((o | 0) == 1260) {
   w = aB(v | 0, ac | 0) | 0;
   if ((w | 0) == 0) {
    if (ad << 24 >> 24 != 45) {
     o = 1263;
     break;
    }
    if ((a[C] | 0) == 0) {
     k = -1;
    } else {
     break;
    }
    i = j;
    return k | 0;
   }
   D = a[w + 1 | 0] | 0;
   if (E & ad << 24 >> 24 == 87 & D << 24 >> 24 == 59) {
    do {
     if ((a[C] | 0) == 0) {
      B = (c[44] | 0) + 1 | 0;
      c[44] = B;
      if ((B | 0) < (b | 0)) {
       c[40] = c[d + (B << 2) >> 2];
       break;
      }
      c[40] = 824;
      do {
       if ((c[46] | 0) != 0) {
        if ((a[v] | 0) == 58) {
         break;
        }
        cx(48, (y = i, i = i + 8 | 0, c[y >> 2] = ac, y) | 0);
       }
      } while (0);
      c[42] = ac;
      k = (a[v] | 0) == 58 ? 58 : 63;
      i = j;
      return k | 0;
     }
    } while (0);
    B = cv(d, v, f, g, 0) | 0;
    c[40] = 824;
    k = B;
    i = j;
    return k | 0;
   }
   if (D << 24 >> 24 != 58) {
    if ((a[C] | 0) != 0) {
     k = ac;
     i = j;
     return k | 0;
    }
    c[44] = (c[44] | 0) + 1;
    k = ac;
    i = j;
    return k | 0;
   }
   c[198] = 0;
   do {
    if ((a[C] | 0) == 0) {
     if ((a[w + 2 | 0] | 0) == 58) {
      break;
     }
     B = (c[44] | 0) + 1 | 0;
     c[44] = B;
     if ((B | 0) < (b | 0)) {
      c[198] = c[d + (B << 2) >> 2];
      break;
     }
     c[40] = 824;
     do {
      if ((c[46] | 0) != 0) {
       if ((a[v] | 0) == 58) {
        break;
       }
       cx(48, (y = i, i = i + 8 | 0, c[y >> 2] = ac, y) | 0);
      }
     } while (0);
     c[42] = ac;
     k = (a[v] | 0) == 58 ? 58 : 63;
     i = j;
     return k | 0;
    } else {
     c[198] = C;
    }
   } while (0);
   c[40] = 824;
   c[44] = (c[44] | 0) + 1;
   k = ac;
   i = j;
   return k | 0;
  }
 } while (0);
 do {
  if ((o | 0) == 1263) {
   if ((a[C] | 0) != 0) {
    break;
   }
   c[44] = (c[44] | 0) + 1;
  }
 } while (0);
 do {
  if ((c[46] | 0) != 0) {
   if ((a[v] | 0) == 58) {
    break;
   }
   cx(272, (y = i, i = i + 8 | 0, c[y >> 2] = ac, y) | 0);
  }
 } while (0);
 c[42] = ac;
 k = 63;
 i = j;
 return k | 0;
}
function cq(a, b, c, d, e) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 e = e | 0;
 return cp(a, b, c, d, e, 1) | 0;
}
function cr(a, b, c, d, e) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 e = e | 0;
 return cp(a, b, c, d, e, 5) | 0;
}
function cs(a) {
 a = a | 0;
 return ca(a) | 0;
}
function ct(a, b) {
 a = a | 0;
 b = b | 0;
 return cs(a) | 0;
}
function cu() {
 var a = 0;
 a = aJ(4) | 0;
 c[a >> 2] = 560;
 as(a | 0, 688, 6);
}
function cv(b, d, e, f, g) {
 b = b | 0;
 d = d | 0;
 e = e | 0;
 f = f | 0;
 g = g | 0;
 var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, z = 0;
 h = i;
 j = c[40] | 0;
 k = c[44] | 0;
 l = k + 1 | 0;
 c[44] = l;
 m = aB(j | 0, 61) | 0;
 if ((m | 0) == 0) {
  n = cM(j | 0) | 0;
  o = 0;
 } else {
  n = m - j | 0;
  o = m + 1 | 0;
 }
 m = c[e >> 2] | 0;
 L1739 : do {
  if ((m | 0) != 0) {
   L1741 : do {
    if ((g | 0) != 0 & (n | 0) == 1) {
     p = 0;
     q = m;
     while (1) {
      if ((a[j] | 0) == (a[q] | 0)) {
       if ((cM(q | 0) | 0) == 1) {
        r = p;
        break L1741;
       }
      }
      p = p + 1 | 0;
      q = c[e + (p << 4) >> 2] | 0;
      if ((q | 0) == 0) {
       break L1739;
      }
     }
    } else {
     q = 0;
     p = -1;
     s = m;
     while (1) {
      if ((ap(j | 0, s | 0, n | 0) | 0) == 0) {
       if ((cM(s | 0) | 0) == (n | 0)) {
        r = q;
        break L1741;
       }
       if ((p | 0) == -1) {
        t = q;
       } else {
        break;
       }
      } else {
       t = p;
      }
      u = q + 1 | 0;
      v = c[e + (u << 4) >> 2] | 0;
      if ((v | 0) == 0) {
       r = t;
       break L1741;
      } else {
       q = u;
       p = t;
       s = v;
      }
     }
     do {
      if ((c[46] | 0) != 0) {
       if ((a[d] | 0) == 58) {
        break;
       }
       cx(304, (y = i, i = i + 16 | 0, c[y >> 2] = n, c[y + 8 >> 2] = j, y) | 0);
      }
     } while (0);
     c[42] = 0;
     w = 63;
     i = h;
     return w | 0;
    }
   } while (0);
   if ((r | 0) == -1) {
    break;
   }
   s = e + (r << 4) + 4 | 0;
   p = c[s >> 2] | 0;
   q = (o | 0) == 0;
   if (!((p | 0) != 0 | q)) {
    do {
     if ((c[46] | 0) != 0) {
      if ((a[d] | 0) == 58) {
       break;
      }
      cx(208, (y = i, i = i + 16 | 0, c[y >> 2] = n, c[y + 8 >> 2] = j, y) | 0);
     }
    } while (0);
    if ((c[e + (r << 4) + 8 >> 2] | 0) == 0) {
     x = c[e + (r << 4) + 12 >> 2] | 0;
    } else {
     x = 0;
    }
    c[42] = x;
    w = (a[d] | 0) == 58 ? 58 : 63;
    i = h;
    return w | 0;
   }
   do {
    if ((p - 1 | 0) >>> 0 < 2) {
     if (!q) {
      c[198] = o;
      break;
     }
     if ((p | 0) != 1) {
      break;
     }
     c[44] = k + 2;
     c[198] = c[b + (l << 2) >> 2];
    }
   } while (0);
   if (!((c[s >> 2] | 0) == 1 & (c[198] | 0) == 0)) {
    if ((f | 0) != 0) {
     c[f >> 2] = r;
    }
    p = c[e + (r << 4) + 8 >> 2] | 0;
    q = c[e + (r << 4) + 12 >> 2] | 0;
    if ((p | 0) == 0) {
     w = q;
     i = h;
     return w | 0;
    }
    c[p >> 2] = q;
    w = 0;
    i = h;
    return w | 0;
   }
   do {
    if ((c[46] | 0) != 0) {
     if ((a[d] | 0) == 58) {
      break;
     }
     cx(8, (y = i, i = i + 8 | 0, c[y >> 2] = j, y) | 0);
    }
   } while (0);
   if ((c[e + (r << 4) + 8 >> 2] | 0) == 0) {
    z = c[e + (r << 4) + 12 >> 2] | 0;
   } else {
    z = 0;
   }
   c[42] = z;
   c[44] = (c[44] | 0) - 1;
   w = (a[d] | 0) == 58 ? 58 : 63;
   i = h;
   return w | 0;
  }
 } while (0);
 if ((g | 0) != 0) {
  c[44] = k;
  w = -1;
  i = h;
  return w | 0;
 }
 do {
  if ((c[46] | 0) != 0) {
   if ((a[d] | 0) == 58) {
    break;
   }
   cx(248, (y = i, i = i + 8 | 0, c[y >> 2] = j, y) | 0);
  }
 } while (0);
 c[42] = 0;
 w = 63;
 i = h;
 return w | 0;
}
function cw(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0;
 d = i;
 i = i + 16 | 0;
 e = d | 0;
 f = e;
 c[f >> 2] = b;
 c[f + 4 >> 2] = 0;
 cy(a, e | 0);
 i = d;
 return;
}
function cx(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0;
 d = i;
 i = i + 16 | 0;
 e = d | 0;
 f = e;
 c[f >> 2] = b;
 c[f + 4 >> 2] = 0;
 cz(a, e | 0);
 i = d;
 return;
}
function cy(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0, f = 0;
 d = i;
 e = c[(aX() | 0) >> 2] | 0;
 f = c[r >> 2] | 0;
 av(c[o >> 2] | 0, 432, (y = i, i = i + 8 | 0, c[y >> 2] = f, y) | 0) | 0;
 if ((a | 0) != 0) {
  f = c[o >> 2] | 0;
  aQ(f | 0, a | 0, b | 0) | 0;
  b = c[o >> 2] | 0;
  aE(472, 2, 1, b | 0) | 0;
 }
 b = c[o >> 2] | 0;
 a = at(e | 0) | 0;
 av(b | 0, 384, (y = i, i = i + 8 | 0, c[y >> 2] = a, y) | 0) | 0;
 i = d;
 return;
}
function cz(a, b) {
 a = a | 0;
 b = b | 0;
 var d = 0, e = 0;
 d = i;
 e = c[r >> 2] | 0;
 av(c[o >> 2] | 0, 376, (y = i, i = i + 8 | 0, c[y >> 2] = e, y) | 0) | 0;
 if ((a | 0) != 0) {
  e = c[o >> 2] | 0;
  aQ(e | 0, a | 0, b | 0) | 0;
 }
 aC(10, c[o >> 2] | 0) | 0;
 i = d;
 return;
}
function cA(b, d) {
 b = b | 0;
 d = d | 0;
 var e = 0, f = 0, g = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0.0, r = 0, s = 0, t = 0, u = 0, v = 0.0, w = 0, x = 0, y = 0, z = 0.0, A = 0.0, B = 0, C = 0, D = 0, E = 0.0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0.0, O = 0, P = 0, Q = 0.0, R = 0.0, S = 0.0;
 e = b;
 while (1) {
  f = e + 1 | 0;
  if ((aK(a[e] | 0) | 0) == 0) {
   break;
  } else {
   e = f;
  }
 }
 g = a[e] | 0;
 if ((g << 24 >> 24 | 0) == 45) {
  i = f;
  j = 1;
 } else if ((g << 24 >> 24 | 0) == 43) {
  i = f;
  j = 0;
 } else {
  i = e;
  j = 0;
 }
 e = -1;
 f = 0;
 g = i;
 while (1) {
  k = a[g] | 0;
  if (((k << 24 >> 24) - 48 | 0) >>> 0 < 10) {
   l = e;
  } else {
   if (k << 24 >> 24 != 46 | (e | 0) > -1) {
    break;
   } else {
    l = f;
   }
  }
  e = l;
  f = f + 1 | 0;
  g = g + 1 | 0;
 }
 l = g + (-f | 0) | 0;
 i = (e | 0) < 0;
 m = ((i ^ 1) << 31 >> 31) + f | 0;
 n = (m | 0) > 18;
 o = (n ? -18 : -m | 0) + (i ? f : e) | 0;
 e = n ? 18 : m;
 do {
  if ((e | 0) == 0) {
   p = b;
   q = 0.0;
  } else {
   if ((e | 0) > 9) {
    m = l;
    n = e;
    f = 0;
    while (1) {
     i = a[m] | 0;
     r = m + 1 | 0;
     if (i << 24 >> 24 == 46) {
      s = a[r] | 0;
      t = m + 2 | 0;
     } else {
      s = i;
      t = r;
     }
     u = (f * 10 | 0) - 48 + (s << 24 >> 24) | 0;
     r = n - 1 | 0;
     if ((r | 0) > 9) {
      m = t;
      n = r;
      f = u;
     } else {
      break;
     }
    }
    v = +(u | 0) * 1.0e9;
    w = 9;
    x = t;
    y = 1393;
   } else {
    if ((e | 0) > 0) {
     v = 0.0;
     w = e;
     x = l;
     y = 1393;
    } else {
     z = 0.0;
     A = 0.0;
    }
   }
   if ((y | 0) == 1393) {
    f = x;
    n = w;
    m = 0;
    while (1) {
     r = a[f] | 0;
     i = f + 1 | 0;
     if (r << 24 >> 24 == 46) {
      B = a[i] | 0;
      C = f + 2 | 0;
     } else {
      B = r;
      C = i;
     }
     D = (m * 10 | 0) - 48 + (B << 24 >> 24) | 0;
     i = n - 1 | 0;
     if ((i | 0) > 0) {
      f = C;
      n = i;
      m = D;
     } else {
      break;
     }
    }
    z = +(D | 0);
    A = v;
   }
   E = A + z;
   do {
    if ((k << 24 >> 24 | 0) == 69 | (k << 24 >> 24 | 0) == 101) {
     m = g + 1 | 0;
     n = a[m] | 0;
     if ((n << 24 >> 24 | 0) == 43) {
      F = g + 2 | 0;
      G = 0;
     } else if ((n << 24 >> 24 | 0) == 45) {
      F = g + 2 | 0;
      G = 1;
     } else {
      F = m;
      G = 0;
     }
     m = a[F] | 0;
     if (((m << 24 >> 24) - 48 | 0) >>> 0 < 10) {
      H = F;
      I = 0;
      J = m;
     } else {
      K = 0;
      L = F;
      M = G;
      break;
     }
     while (1) {
      m = (I * 10 | 0) - 48 + (J << 24 >> 24) | 0;
      n = H + 1 | 0;
      f = a[n] | 0;
      if (((f << 24 >> 24) - 48 | 0) >>> 0 < 10) {
       H = n;
       I = m;
       J = f;
      } else {
       K = m;
       L = n;
       M = G;
       break;
      }
     }
    } else {
     K = 0;
     L = g;
     M = 0;
    }
   } while (0);
   n = o + ((M | 0) == 0 ? K : -K | 0) | 0;
   m = (n | 0) < 0 ? -n | 0 : n;
   if ((m | 0) > 511) {
    c[(aX() | 0) >> 2] = 34;
    N = 1.0;
    O = 88;
    P = 511;
    y = 1410;
   } else {
    if ((m | 0) == 0) {
     Q = 1.0;
    } else {
     N = 1.0;
     O = 88;
     P = m;
     y = 1410;
    }
   }
   if ((y | 0) == 1410) {
    while (1) {
     y = 0;
     if ((P & 1 | 0) == 0) {
      R = N;
     } else {
      R = N * +h[O >> 3];
     }
     m = P >> 1;
     if ((m | 0) == 0) {
      Q = R;
      break;
     } else {
      N = R;
      O = O + 8 | 0;
      P = m;
      y = 1410;
     }
    }
   }
   if ((n | 0) > -1) {
    p = L;
    q = E * Q;
    break;
   } else {
    p = L;
    q = E / Q;
    break;
   }
  }
 } while (0);
 if ((d | 0) != 0) {
  c[d >> 2] = p;
 }
 if ((j | 0) == 0) {
  S = q;
  return +S;
 }
 S = -0.0 - q;
 return +S;
}
function cB(a, b) {
 a = a | 0;
 b = b | 0;
 return +(+cA(a, b));
}
function cC(a, b) {
 a = a | 0;
 b = b | 0;
 return +(+cA(a, b));
}
function cD(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 return +(+cA(a, b));
}
function cE(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 return +(+cA(a, b));
}
function cF(a) {
 a = a | 0;
 return +(+cA(a, 0));
}
function cG(a, b, d) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 var e = 0, f = 0;
 e = i;
 i = i + 16 | 0;
 f = e | 0;
 e = f;
 c[e >> 2] = d;
 c[e + 4 >> 2] = 0;
 cI(a, b, f | 0);
}
function cH(a, b, d) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 var e = 0, f = 0;
 e = i;
 i = i + 16 | 0;
 f = e | 0;
 e = f;
 c[e >> 2] = d;
 c[e + 4 >> 2] = 0;
 cJ(a, b, f | 0);
}
function cI(a, b, d) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 var e = 0, f = 0;
 e = c[(aX() | 0) >> 2] | 0;
 f = c[r >> 2] | 0;
 av(c[o >> 2] | 0, 336, (y = i, i = i + 8 | 0, c[y >> 2] = f, y) | 0) | 0;
 if ((b | 0) != 0) {
  f = c[o >> 2] | 0;
  aQ(f | 0, b | 0, d | 0) | 0;
  d = c[o >> 2] | 0;
  aE(480, 2, 1, d | 0) | 0;
 }
 d = c[o >> 2] | 0;
 b = at(e | 0) | 0;
 av(d | 0, 392, (y = i, i = i + 8 | 0, c[y >> 2] = b, y) | 0) | 0;
 aH(a | 0);
}
function cJ(a, b, d) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 var e = 0;
 e = c[r >> 2] | 0;
 av(c[o >> 2] | 0, 440, (y = i, i = i + 8 | 0, c[y >> 2] = e, y) | 0) | 0;
 if ((b | 0) != 0) {
  e = c[o >> 2] | 0;
  aQ(e | 0, b | 0, d | 0) | 0;
 }
 aC(10, c[o >> 2] | 0) | 0;
 aH(a | 0);
}
function cK(b, d, e) {
 b = b | 0;
 d = d | 0;
 e = e | 0;
 var f = 0;
 f = b | 0;
 if ((b & 3) == (d & 3)) {
  while (b & 3) {
   if ((e | 0) == 0) return f | 0;
   a[b] = a[d] | 0;
   b = b + 1 | 0;
   d = d + 1 | 0;
   e = e - 1 | 0;
  }
  while ((e | 0) >= 4) {
   c[b >> 2] = c[d >> 2];
   b = b + 4 | 0;
   d = d + 4 | 0;
   e = e - 4 | 0;
  }
 }
 while ((e | 0) > 0) {
  a[b] = a[d] | 0;
  b = b + 1 | 0;
  d = d + 1 | 0;
  e = e - 1 | 0;
 }
 return f | 0;
}
function cL(b, d, e) {
 b = b | 0;
 d = d | 0;
 e = e | 0;
 var f = 0, g = 0, h = 0;
 f = b + e | 0;
 if ((e | 0) >= 20) {
  d = d & 255;
  e = b & 3;
  g = d | d << 8 | d << 16 | d << 24;
  h = f & ~3;
  if (e) {
   e = b + 4 - e | 0;
   while ((b | 0) < (e | 0)) {
    a[b] = d;
    b = b + 1 | 0;
   }
  }
  while ((b | 0) < (h | 0)) {
   c[b >> 2] = g;
   b = b + 4 | 0;
  }
 }
 while ((b | 0) < (f | 0)) {
  a[b] = d;
  b = b + 1 | 0;
 }
}
function cM(b) {
 b = b | 0;
 var c = 0;
 c = b;
 while (a[c] | 0) {
  c = c + 1 | 0;
 }
 return c - b | 0;
}
function cN(a, b, c, d) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 var e = 0;
 e = a + c >>> 0;
 return (H = b + d + (e >>> 0 < a >>> 0 | 0) >>> 0, e | 0) | 0;
}
function cO(a, b, c, d) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 var e = 0;
 e = b - d >>> 0;
 e = b - d - (c >>> 0 > a >>> 0 | 0) >>> 0;
 return (H = e, a - c >>> 0 | 0) | 0;
}
function cP(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 if ((c | 0) < 32) {
  H = b << c | (a & (1 << c) - 1 << 32 - c) >>> 32 - c;
  return a << c;
 }
 H = a << c - 32;
 return 0;
}
function cQ(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 if ((c | 0) < 32) {
  H = b >>> c;
  return a >>> c | (b & (1 << c) - 1) << 32 - c;
 }
 H = 0;
 return b >>> c - 32 | 0;
}
function cR(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 if ((c | 0) < 32) {
  H = b >> c;
  return a >>> c | (b & (1 << c) - 1) << 32 - c;
 }
 H = (b | 0) < 0 ? -1 : 0;
 return b >> c - 32 | 0;
}
function cS(b) {
 b = b | 0;
 var c = 0;
 c = a[n + (b >>> 24) | 0] | 0;
 if ((c | 0) < 8) return c | 0;
 c = a[n + (b >> 16 & 255) | 0] | 0;
 if ((c | 0) < 8) return c + 8 | 0;
 c = a[n + (b >> 8 & 255) | 0] | 0;
 if ((c | 0) < 8) return c + 16 | 0;
 return (a[n + (b & 255) | 0] | 0) + 24 | 0;
}
function cT(b) {
 b = b | 0;
 var c = 0;
 c = a[m + (b & 255) | 0] | 0;
 if ((c | 0) < 8) return c | 0;
 c = a[m + (b >> 8 & 255) | 0] | 0;
 if ((c | 0) < 8) return c + 8 | 0;
 c = a[m + (b >> 16 & 255) | 0] | 0;
 if ((c | 0) < 8) return c + 16 | 0;
 return (a[m + (b >>> 24) | 0] | 0) + 24 | 0;
}
function cU(a, b) {
 a = a | 0;
 b = b | 0;
 var c = 0, d = 0, e = 0, f = 0;
 c = a & 65535;
 d = b & 65535;
 e = ad(d, c) | 0;
 f = a >>> 16;
 a = (e >>> 16) + (ad(d, f) | 0) | 0;
 d = b >>> 16;
 b = ad(d, c) | 0;
 return (H = (a >>> 16) + (ad(d, f) | 0) + (((a & 65535) + b | 0) >>> 16) | 0, a + b << 16 | e & 65535 | 0) | 0;
}
function cV(a, b, c, d) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 var e = 0, f = 0, g = 0, h = 0, i = 0;
 e = b >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
 f = ((b | 0) < 0 ? -1 : 0) >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
 g = d >> 31 | ((d | 0) < 0 ? -1 : 0) << 1;
 h = ((d | 0) < 0 ? -1 : 0) >> 31 | ((d | 0) < 0 ? -1 : 0) << 1;
 i = cO(e ^ a, f ^ b, e, f) | 0;
 b = H;
 a = g ^ e;
 e = h ^ f;
 f = cO((c_(i, b, cO(g ^ c, h ^ d, g, h) | 0, H, 0) | 0) ^ a, H ^ e, a, e) | 0;
 return (H = H, f) | 0;
}
function cW(a, b, d, e) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 e = e | 0;
 var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0;
 f = i;
 i = i + 8 | 0;
 g = f | 0;
 h = b >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
 j = ((b | 0) < 0 ? -1 : 0) >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
 k = e >> 31 | ((e | 0) < 0 ? -1 : 0) << 1;
 l = ((e | 0) < 0 ? -1 : 0) >> 31 | ((e | 0) < 0 ? -1 : 0) << 1;
 m = cO(h ^ a, j ^ b, h, j) | 0;
 b = H;
 a = cO(k ^ d, l ^ e, k, l) | 0;
 c_(m, b, a, H, g) | 0;
 a = cO(c[g >> 2] ^ h, c[g + 4 >> 2] ^ j, h, j) | 0;
 j = H;
 i = f;
 return (H = j, a) | 0;
}
function cX(a, b, c, d) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 var e = 0, f = 0;
 e = a;
 a = c;
 c = cU(e, a) | 0;
 f = H;
 return (H = (ad(b, a) | 0) + (ad(d, e) | 0) + f | f & 0, c | 0 | 0) | 0;
}
function cY(a, b, c, d) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 var e = 0;
 e = c_(a, b, c, d, 0) | 0;
 return (H = H, e) | 0;
}
function cZ(a, b, d, e) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 e = e | 0;
 var f = 0, g = 0;
 f = i;
 i = i + 8 | 0;
 g = f | 0;
 c_(a, b, d, e, g) | 0;
 i = f;
 return (H = c[g + 4 >> 2] | 0, c[g >> 2] | 0) | 0;
}
function c_(a, b, d, e, f) {
 a = a | 0;
 b = b | 0;
 d = d | 0;
 e = e | 0;
 f = f | 0;
 var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, I = 0, J = 0, K = 0, L = 0, M = 0;
 g = a;
 h = b;
 i = h;
 j = d;
 k = e;
 l = k;
 if ((i | 0) == 0) {
  m = (f | 0) != 0;
  if ((l | 0) == 0) {
   if (m) {
    c[f >> 2] = (g >>> 0) % (j >>> 0);
    c[f + 4 >> 2] = 0;
   }
   n = 0;
   o = (g >>> 0) / (j >>> 0) >>> 0;
   return (H = n, o) | 0;
  } else {
   if (!m) {
    n = 0;
    o = 0;
    return (H = n, o) | 0;
   }
   c[f >> 2] = a | 0;
   c[f + 4 >> 2] = b & 0;
   n = 0;
   o = 0;
   return (H = n, o) | 0;
  }
 }
 m = (l | 0) == 0;
 do {
  if ((j | 0) == 0) {
   if (m) {
    if ((f | 0) != 0) {
     c[f >> 2] = (i >>> 0) % (j >>> 0);
     c[f + 4 >> 2] = 0;
    }
    n = 0;
    o = (i >>> 0) / (j >>> 0) >>> 0;
    return (H = n, o) | 0;
   }
   if ((g | 0) == 0) {
    if ((f | 0) != 0) {
     c[f >> 2] = 0;
     c[f + 4 >> 2] = (i >>> 0) % (l >>> 0);
    }
    n = 0;
    o = (i >>> 0) / (l >>> 0) >>> 0;
    return (H = n, o) | 0;
   }
   p = l - 1 | 0;
   if ((p & l | 0) == 0) {
    if ((f | 0) != 0) {
     c[f >> 2] = a | 0;
     c[f + 4 >> 2] = p & i | b & 0;
    }
    n = 0;
    o = i >>> ((cT(l | 0) | 0) >>> 0);
    return (H = n, o) | 0;
   }
   p = (cS(l | 0) | 0) - (cS(i | 0) | 0) | 0;
   if (p >>> 0 <= 30) {
    q = p + 1 | 0;
    r = 31 - p | 0;
    s = q;
    t = i << r | g >>> (q >>> 0);
    u = i >>> (q >>> 0);
    v = 0;
    w = g << r;
    break;
   }
   if ((f | 0) == 0) {
    n = 0;
    o = 0;
    return (H = n, o) | 0;
   }
   c[f >> 2] = a | 0;
   c[f + 4 >> 2] = h | b & 0;
   n = 0;
   o = 0;
   return (H = n, o) | 0;
  } else {
   if (!m) {
    r = (cS(l | 0) | 0) - (cS(i | 0) | 0) | 0;
    if (r >>> 0 <= 31) {
     q = r + 1 | 0;
     p = 31 - r | 0;
     x = r - 31 >> 31;
     s = q;
     t = g >>> (q >>> 0) & x | i << p;
     u = i >>> (q >>> 0) & x;
     v = 0;
     w = g << p;
     break;
    }
    if ((f | 0) == 0) {
     n = 0;
     o = 0;
     return (H = n, o) | 0;
    }
    c[f >> 2] = a | 0;
    c[f + 4 >> 2] = h | b & 0;
    n = 0;
    o = 0;
    return (H = n, o) | 0;
   }
   p = j - 1 | 0;
   if ((p & j | 0) != 0) {
    x = (cS(j | 0) | 0) + 33 - (cS(i | 0) | 0) | 0;
    q = 64 - x | 0;
    r = 32 - x | 0;
    y = r >> 31;
    z = x - 32 | 0;
    A = z >> 31;
    s = x;
    t = r - 1 >> 31 & i >>> (z >>> 0) | (i << r | g >>> (x >>> 0)) & A;
    u = A & i >>> (x >>> 0);
    v = g << q & y;
    w = (i << q | g >>> (z >>> 0)) & y | g << r & x - 33 >> 31;
    break;
   }
   if ((f | 0) != 0) {
    c[f >> 2] = p & g;
    c[f + 4 >> 2] = 0;
   }
   if ((j | 0) == 1) {
    n = h | b & 0;
    o = a | 0 | 0;
    return (H = n, o) | 0;
   } else {
    p = cT(j | 0) | 0;
    n = i >>> (p >>> 0) | 0;
    o = i << 32 - p | g >>> (p >>> 0) | 0;
    return (H = n, o) | 0;
   }
  }
 } while (0);
 if ((s | 0) == 0) {
  B = w;
  C = v;
  D = u;
  E = t;
  F = 0;
  G = 0;
 } else {
  g = d | 0 | 0;
  d = k | e & 0;
  e = cN(g, d, -1, -1) | 0;
  k = H;
  i = w;
  w = v;
  v = u;
  u = t;
  t = s;
  s = 0;
  while (1) {
   I = w >>> 31 | i << 1;
   J = s | w << 1;
   j = u << 1 | i >>> 31 | 0;
   a = u >>> 31 | v << 1 | 0;
   cO(e, k, j, a) | 0;
   b = H;
   h = b >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
   K = h & 1;
   L = cO(j, a, h & g, (((b | 0) < 0 ? -1 : 0) >> 31 | ((b | 0) < 0 ? -1 : 0) << 1) & d) | 0;
   M = H;
   b = t - 1 | 0;
   if ((b | 0) == 0) {
    break;
   } else {
    i = I;
    w = J;
    v = M;
    u = L;
    t = b;
    s = K;
   }
  }
  B = I;
  C = J;
  D = M;
  E = L;
  F = 0;
  G = K;
 }
 K = C;
 C = 0;
 if ((f | 0) != 0) {
  c[f >> 2] = E;
  c[f + 4 >> 2] = D;
 }
 n = (K | 0) >>> 31 | (B | C) << 1 | (C << 1 | K >>> 31) & 0 | F;
 o = (K << 1 | 0 >>> 31) & -2 | G;
 return (H = n, o) | 0;
}
function c$(a, b) {
 a = a | 0;
 b = b | 0;
 a1[a & 15](b | 0);
}
function c0(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 a2[a & 15](b | 0, c | 0);
}
function c1(a, b) {
 a = a | 0;
 b = b | 0;
 return a3[a & 7](b | 0) | 0;
}
function c2(a, b, c, d) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 d = d | 0;
 a4[a & 15](b | 0, c | 0, d | 0);
}
function c3(a) {
 a = a | 0;
 a5[a & 1]();
}
function c4(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 return a6[a & 1](b | 0, c | 0) | 0;
}
function c5(a) {
 a = a | 0;
 ae(0);
}
function c6(a, b) {
 a = a | 0;
 b = b | 0;
 ae(1);
}
function c7(a) {
 a = a | 0;
 ae(2);
 return 0;
}
function c8(a, b, c) {
 a = a | 0;
 b = b | 0;
 c = c | 0;
 ae(3);
}
function c9() {
 ae(4);
}
function da(a, b) {
 a = a | 0;
 b = b | 0;
 ae(5);
 return 0;
}
// EMSCRIPTEN_END_FUNCS
 var a1 = [ c5, c5, ch, c5, cn, c5, cc, c5, cg, c5, cm, c5, c5, c5, c5, c5 ];
 var a2 = [ c6, c6, cw, c6, cy, c6, cx, c6, cz, c6, c6, c6, c6, c6, c6, c6 ];
 var a3 = [ c7, c7, cd, c7, ce, c7, c7, c7 ];
 var a4 = [ c8, c8, cJ, c8, cI, c8, cG, c8, cH, c8, c8, c8, c8, c8, c8, c8 ];
 var a5 = [ c9, c9 ];
 var a6 = [ da, da ];
 return {
  _crypto_scrypt: bu,
  _strlen: cM,
  _free: bM,
  _realloc: bO,
  _memset: cL,
  _malloc: bL,
  _memcpy: cK,
  _calloc: bN,
  runPostSets: bn,
  stackAlloc: a7,
  stackSave: a8,
  stackRestore: a9,
  setThrew: ba,
  setTempRet0: bd,
  setTempRet1: be,
  setTempRet2: bf,
  setTempRet3: bg,
  setTempRet4: bh,
  setTempRet5: bi,
  setTempRet6: bj,
  setTempRet7: bk,
  setTempRet8: bl,
  setTempRet9: bm,
  dynCall_vi: c$,
  dynCall_vii: c0,
  dynCall_ii: c1,
  dynCall_viii: c2,
  dynCall_v: c3,
  dynCall_iii: c4
 };
// EMSCRIPTEN_END_ASM
})({Math:Math, Int8Array:Int8Array, Int16Array:Int16Array, Int32Array:Int32Array, Uint8Array:Uint8Array, Uint16Array:Uint16Array, Uint32Array:Uint32Array, Float32Array:Float32Array, Float64Array:Float64Array}, {abort:wa, assert:w, asmPrintInt:function(a, b) {
  s.print("int " + a + "," + b)
}, asmPrintFloat:function(a, b) {
  s.print("float " + a + "," + b)
}, min:Xc, invoke_vi:function(a, b) {
  try {
    s.dynCall_vi(a, b)
  }catch(c) {
    "number" !== typeof c && "longjmp" !== c && g(c), V.setThrew(1, 0)
  }
}, invoke_vii:function(a, b, c) {
  try {
    s.dynCall_vii(a, b, c)
  }catch(d) {
    "number" !== typeof d && "longjmp" !== d && g(d), V.setThrew(1, 0)
  }
}, invoke_ii:function(a, b) {
  try {
    return s.dynCall_ii(a, b)
  }catch(c) {
    "number" !== typeof c && "longjmp" !== c && g(c), V.setThrew(1, 0)
  }
}, invoke_viii:function(a, b, c, d) {
  try {
    s.dynCall_viii(a, b, c, d)
  }catch(e) {
    "number" !== typeof e && "longjmp" !== e && g(e), V.setThrew(1, 0)
  }
}, invoke_v:function(a) {
  try {
    s.dynCall_v(a)
  }catch(b) {
    "number" !== typeof b && "longjmp" !== b && g(b), V.setThrew(1, 0)
  }
}, invoke_iii:function(a, b, c) {
  try {
    return s.dynCall_iii(a, b, c)
  }catch(d) {
    "number" !== typeof d && "longjmp" !== d && g(d), V.setThrew(1, 0)
  }
}, _strncmp:function(a, b, c) {
  for(var d = 0;d < c;) {
    var e = G[a + d | 0], f = G[b + d | 0];
    if(e == f && 0 == e) {
      break
    }
    if(0 == e) {
      return-1
    }
    if(0 == f) {
      return 1
    }
    if(e == f) {
      d++
    }else {
      return e > f ? 1 : -1
    }
  }
  return 0
}, _llvm_va_end:aa(), _sysconf:function(a) {
  switch(a) {
    case 8:
      return 4096;
    case 54:
    ;
    case 56:
    ;
    case 21:
    ;
    case 61:
    ;
    case 63:
    ;
    case 22:
    ;
    case 67:
    ;
    case 23:
    ;
    case 24:
    ;
    case 25:
    ;
    case 26:
    ;
    case 27:
    ;
    case 69:
    ;
    case 28:
    ;
    case 101:
    ;
    case 70:
    ;
    case 71:
    ;
    case 29:
    ;
    case 30:
    ;
    case 199:
    ;
    case 75:
    ;
    case 76:
    ;
    case 32:
    ;
    case 43:
    ;
    case 44:
    ;
    case 80:
    ;
    case 46:
    ;
    case 47:
    ;
    case 45:
    ;
    case 48:
    ;
    case 49:
    ;
    case 42:
    ;
    case 82:
    ;
    case 33:
    ;
    case 7:
    ;
    case 108:
    ;
    case 109:
    ;
    case 107:
    ;
    case 112:
    ;
    case 119:
    ;
    case 121:
      return 200809;
    case 13:
    ;
    case 104:
    ;
    case 94:
    ;
    case 95:
    ;
    case 34:
    ;
    case 35:
    ;
    case 77:
    ;
    case 81:
    ;
    case 83:
    ;
    case 84:
    ;
    case 85:
    ;
    case 86:
    ;
    case 87:
    ;
    case 88:
    ;
    case 89:
    ;
    case 90:
    ;
    case 91:
    ;
    case 94:
    ;
    case 95:
    ;
    case 110:
    ;
    case 111:
    ;
    case 113:
    ;
    case 114:
    ;
    case 115:
    ;
    case 116:
    ;
    case 117:
    ;
    case 118:
    ;
    case 120:
    ;
    case 40:
    ;
    case 16:
    ;
    case 79:
    ;
    case 19:
      return-1;
    case 92:
    ;
    case 93:
    ;
    case 5:
    ;
    case 72:
    ;
    case 6:
    ;
    case 74:
    ;
    case 92:
    ;
    case 93:
    ;
    case 96:
    ;
    case 97:
    ;
    case 98:
    ;
    case 99:
    ;
    case 102:
    ;
    case 103:
    ;
    case 105:
      return 1;
    case 38:
    ;
    case 66:
    ;
    case 50:
    ;
    case 51:
    ;
    case 4:
      return 1024;
    case 15:
    ;
    case 64:
    ;
    case 41:
      return 32;
    case 55:
    ;
    case 37:
    ;
    case 17:
      return 2147483647;
    case 18:
    ;
    case 1:
      return 47839;
    case 59:
    ;
    case 57:
      return 99;
    case 68:
    ;
    case 58:
      return 2048;
    case 0:
      return 2097152;
    case 3:
      return 65536;
    case 14:
      return 32768;
    case 73:
      return 32767;
    case 39:
      return 16384;
    case 60:
      return 1E3;
    case 106:
      return 700;
    case 52:
      return 256;
    case 62:
      return 255;
    case 2:
      return 100;
    case 65:
      return 64;
    case 36:
      return 20;
    case 100:
      return 16;
    case 20:
      return 6;
    case 53:
      return 4;
    case 10:
      return 1
  }
  M(N.A);
  return-1
}, ___cxa_throw:rc, _strerror:zc, _abort:function() {
  s.abort()
}, _fprintf:mc, _llvm_eh_exception:U, ___cxa_free_exception:sc, _fflush:aa(), ___buildEnvironment:wc, __reallyNegative:jc, _strchr:function(a, b) {
  a--;
  do {
    a++;
    var c = A[a];
    if(c == b) {
      return a
    }
  }while(c);
  return 0
}, _fputc:Bc, ___setErrNo:M, _fwrite:hc, _send:fc, _write:gc, _exit:function(a) {
  Ac(a)
}, ___cxa_find_matching_catch:function(a, b) {
  -1 == a && (a = B[U.m >> 2]);
  -1 == b && (b = B[U.m + 4 >> 2]);
  var c = Array.prototype.slice.call(arguments, 2);
  0 != b && !pc(b) && 0 == B[B[b >> 2] - 8 >> 2] && (a = B[a >> 2]);
  for(var d = 0;d < c.length;d++) {
    if(qc(c[d], b, a)) {
      return(V.setTempRet0(c[d]), a) | 0
    }
  }
  return(V.setTempRet0(b), a) | 0
}, ___cxa_allocate_exception:function(a) {
  return Oa(a)
}, _isspace:function(a) {
  return 32 == a || 9 <= a && 13 >= a
}, __formatString:kc, ___resumeException:function(a) {
  0 == B[U.m >> 2] && (B[U.m >> 2] = a);
  g(a + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.")
}, _llvm_uadd_with_overflow_i32:function(a, b) {
  a >>>= 0;
  b >>>= 0;
  return(V.setTempRet0(4294967295 < a + b), a + b >>> 0) | 0
}, ___cxa_does_inherit:qc, _getenv:xc, _vfprintf:function(a, b, c) {
  return mc(a, b, B[c >> 2])
}, ___cxa_begin_catch:function(a) {
  oc.ta--;
  return a
}, __ZSt18uncaught_exceptionv:oc, _pwrite:function(a, b, c, d) {
  a = R[a];
  if(!a) {
    return M(N.$), -1
  }
  try {
    return Ib(a, A, b, c, d)
  }catch(e) {
    return Zb(e), -1
  }
}, ___cxa_call_unexpected:function(a) {
  s.P("Unexpected exception thrown, this is not properly supported - aborting");
  za = l;
  g(a)
}, _sbrk:nc, _strerror_r:yc, ___errno_location:function() {
  return rb
}, ___gxx_personality_v0:aa(), ___cxa_is_number_type:pc, _time:function(a) {
  var b = Math.floor(Date.now() / 1E3);
  a && (B[a >> 2] = b);
  return b
}, __exit:Ac, ___cxa_end_catch:uc, STACKTOP:u, STACK_MAX:Ta, tempDoublePtr:qb, ABORT:za, cttz_i8:Wc, ctlz_i8:Vc, NaN:NaN, Infinity:Infinity, _stderr:nb, __ZTVN10__cxxabiv120__si_class_type_infoE:ob, __ZTVN10__cxxabiv117__class_type_infoE:pb, ___progname:k}, I);
s._crypto_scrypt = V._crypto_scrypt;
var ic = s._strlen = V._strlen, tc = s._free = V._free;
s._realloc = V._realloc;
var tb = s._memset = V._memset, Oa = s._malloc = V._malloc, sb = s._memcpy = V._memcpy;
s._calloc = V._calloc;
var mb = s.runPostSets = V.runPostSets;
s.dynCall_vi = V.dynCall_vi;
s.dynCall_vii = V.dynCall_vii;
s.dynCall_ii = V.dynCall_ii;
s.dynCall_viii = V.dynCall_viii;
s.dynCall_v = V.dynCall_v;
s.dynCall_iii = V.dynCall_iii;
var qa = function(a) {
  return V.stackAlloc(a)
}, ja = function() {
  return V.stackSave()
}, ka = function(a) {
  V.stackRestore(a)
}, lc;
function X(a, b) {
  a != m && ("number" == typeof a ? this.p(a) : b == m && "string" != typeof a ? this.k(a, 256) : this.k(a, b))
}
function Yc() {
  return new X(m)
}
function Zc(a, b) {
  var c = $c[a.charCodeAt(b)];
  return c == m ? -1 : c
}
function ad(a) {
  var b = Yc();
  b.D(a);
  return b
}
function Y(a, b) {
  this.h = a | 0;
  this.j = b | 0
}
Y.Ca = {};
Y.D = function(a) {
  if(-128 <= a && 128 > a) {
    var b = Y.Ca[a];
    if(b) {
      return b
    }
  }
  b = new Y(a | 0, 0 > a ? -1 : 0);
  -128 <= a && 128 > a && (Y.Ca[a] = b);
  return b
};
Y.p = function(a) {
  return isNaN(a) || !isFinite(a) ? Y.ZERO : a <= -Y.Ea ? Y.MIN_VALUE : a + 1 >= Y.Ea ? Y.MAX_VALUE : 0 > a ? Y.p(-a).i() : new Y(a % Y.B | 0, a / Y.B | 0)
};
Y.v = function(a, b) {
  return new Y(a, b)
};
Y.k = function(a, b) {
  0 == a.length && g(Error("number format error: empty string"));
  var c = b || 10;
  (2 > c || 36 < c) && g(Error("radix out of range: " + c));
  if("-" == a.charAt(0)) {
    return Y.k(a.substring(1), c).i()
  }
  0 <= a.indexOf("-") && g(Error('number format error: interior "-" character: ' + a));
  for(var d = Y.p(Math.pow(c, 8)), e = Y.ZERO, f = 0;f < a.length;f += 8) {
    var h = Math.min(8, a.length - f), i = parseInt(a.substring(f, f + h), c);
    8 > h ? (h = Y.p(Math.pow(c, h)), e = e.multiply(h).add(Y.p(i))) : (e = e.multiply(d), e = e.add(Y.p(i)))
  }
  return e
};
Y.ea = 65536;
Y.Od = 16777216;
Y.B = Y.ea * Y.ea;
Y.Pd = Y.B / 2;
Y.Qd = Y.B * Y.ea;
Y.eb = Y.B * Y.B;
Y.Ea = Y.eb / 2;
Y.ZERO = Y.D(0);
Y.ONE = Y.D(1);
Y.Da = Y.D(-1);
Y.MAX_VALUE = Y.v(-1, 2147483647);
Y.MIN_VALUE = Y.v(0, -2147483648);
Y.cb = Y.D(16777216);
q = Y.prototype;
q.Z = function() {
  return this.j * Y.B + this.ob()
};
q.toString = function(a) {
  a = a || 10;
  (2 > a || 36 < a) && g(Error("radix out of range: " + a));
  if(this.G()) {
    return"0"
  }
  if(this.n()) {
    if(this.o(Y.MIN_VALUE)) {
      var b = Y.p(a), c = this.F(b), b = c.multiply(b).R(this);
      return c.toString(a) + b.h.toString(a)
    }
    return"-" + this.i().toString(a)
  }
  for(var c = Y.p(Math.pow(a, 6)), b = this, d = "";;) {
    var e = b.F(c), f = b.R(e.multiply(c)).h.toString(a), b = e;
    if(b.G()) {
      return f + d
    }
    for(;6 > f.length;) {
      f = "0" + f
    }
    d = "" + f + d
  }
};
q.ob = function() {
  return 0 <= this.h ? this.h : Y.B + this.h
};
q.G = function() {
  return 0 == this.j && 0 == this.h
};
q.n = function() {
  return 0 > this.j
};
q.Pa = function() {
  return 1 == (this.h & 1)
};
q.o = function(a) {
  return this.j == a.j && this.h == a.h
};
q.Ra = function() {
  return 0 > this.ja(Y.cb)
};
q.qb = function(a) {
  return 0 < this.ja(a)
};
q.rb = function(a) {
  return 0 <= this.ja(a)
};
q.ja = function(a) {
  if(this.o(a)) {
    return 0
  }
  var b = this.n(), c = a.n();
  return b && !c ? -1 : !b && c ? 1 : this.R(a).n() ? -1 : 1
};
q.i = function() {
  return this.o(Y.MIN_VALUE) ? Y.MIN_VALUE : this.xb().add(Y.ONE)
};
q.add = function(a) {
  var b = this.j >>> 16, c = this.j & 65535, d = this.h >>> 16, e = a.j >>> 16, f = a.j & 65535, h = a.h >>> 16, i;
  i = 0 + ((this.h & 65535) + (a.h & 65535));
  a = 0 + (i >>> 16);
  a += d + h;
  d = 0 + (a >>> 16);
  d += c + f;
  c = 0 + (d >>> 16);
  c = c + (b + e) & 65535;
  return Y.v((a & 65535) << 16 | i & 65535, c << 16 | d & 65535)
};
q.R = function(a) {
  return this.add(a.i())
};
q.multiply = function(a) {
  if(this.G() || a.G()) {
    return Y.ZERO
  }
  if(this.o(Y.MIN_VALUE)) {
    return a.Pa() ? Y.MIN_VALUE : Y.ZERO
  }
  if(a.o(Y.MIN_VALUE)) {
    return this.Pa() ? Y.MIN_VALUE : Y.ZERO
  }
  if(this.n()) {
    return a.n() ? this.i().multiply(a.i()) : this.i().multiply(a).i()
  }
  if(a.n()) {
    return this.multiply(a.i()).i()
  }
  if(this.Ra() && a.Ra()) {
    return Y.p(this.Z() * a.Z())
  }
  var b = this.j >>> 16, c = this.j & 65535, d = this.h >>> 16, e = this.h & 65535, f = a.j >>> 16, h = a.j & 65535, i = a.h >>> 16, a = a.h & 65535, j, n, y, v;
  v = 0 + e * a;
  y = 0 + (v >>> 16);
  y += d * a;
  n = 0 + (y >>> 16);
  y = (y & 65535) + e * i;
  n += y >>> 16;
  y &= 65535;
  n += c * a;
  j = 0 + (n >>> 16);
  n = (n & 65535) + d * i;
  j += n >>> 16;
  n &= 65535;
  n += e * h;
  j += n >>> 16;
  n &= 65535;
  j = j + (b * a + c * i + d * h + e * f) & 65535;
  return Y.v(y << 16 | v & 65535, j << 16 | n)
};
q.F = function(a) {
  a.G() && g(Error("division by zero"));
  if(this.G()) {
    return Y.ZERO
  }
  if(this.o(Y.MIN_VALUE)) {
    if(a.o(Y.ONE) || a.o(Y.Da)) {
      return Y.MIN_VALUE
    }
    if(a.o(Y.MIN_VALUE)) {
      return Y.ONE
    }
    var b = this.Db().F(a).shiftLeft(1);
    if(b.o(Y.ZERO)) {
      return a.n() ? Y.ONE : Y.Da
    }
    var c = this.R(a.multiply(b));
    return b.add(c.F(a))
  }
  if(a.o(Y.MIN_VALUE)) {
    return Y.ZERO
  }
  if(this.n()) {
    return a.n() ? this.i().F(a.i()) : this.i().F(a).i()
  }
  if(a.n()) {
    return this.F(a.i()).i()
  }
  for(var d = Y.ZERO, c = this;c.rb(a);) {
    for(var b = Math.max(1, Math.floor(c.Z() / a.Z())), e = Math.ceil(Math.log(b) / Math.LN2), e = 48 >= e ? 1 : Math.pow(2, e - 48), f = Y.p(b), h = f.multiply(a);h.n() || h.qb(c);) {
      b -= e, f = Y.p(b), h = f.multiply(a)
    }
    f.G() && (f = Y.ONE);
    d = d.add(f);
    c = c.R(h)
  }
  return d
};
q.xb = function() {
  return Y.v(~this.h, ~this.j)
};
q.shiftLeft = function(a) {
  a &= 63;
  if(0 == a) {
    return this
  }
  var b = this.h;
  return 32 > a ? Y.v(b << a, this.j << a | b >>> 32 - a) : Y.v(0, b << a - 32)
};
q.Db = function() {
  var a;
  a = 1;
  if(0 == a) {
    return this
  }
  var b = this.j;
  return 32 > a ? Y.v(this.h >>> a | b << 32 - a, b >> a) : Y.v(b >> a - 32, 0 <= b ? 0 : -1)
};
q = X.prototype;
q.ga = function(a, b, c, d) {
  for(var e = 0, f = 0;0 <= --d;) {
    var h = a * this[e++] + b[c] + f, f = Math.floor(h / 67108864);
    b[c++] = h & 67108863
  }
  return f
};
q.f = 26;
q.u = 67108863;
q.K = 67108864;
q.bb = Math.pow(2, 52);
q.Aa = 26;
q.Ba = 0;
var $c = [], bd, Z;
bd = 48;
for(Z = 0;9 >= Z;++Z) {
  $c[bd++] = Z
}
bd = 97;
for(Z = 10;36 > Z;++Z) {
  $c[bd++] = Z
}
bd = 65;
for(Z = 10;36 > Z;++Z) {
  $c[bd++] = Z
}
q = X.prototype;
q.copyTo = function(a) {
  for(var b = this.b - 1;0 <= b;--b) {
    a[b] = this[b]
  }
  a.b = this.b;
  a.c = this.c
};
q.D = function(a) {
  this.b = 1;
  this.c = 0 > a ? -1 : 0;
  0 < a ? this[0] = a : -1 > a ? this[0] = a + DV : this.b = 0
};
q.k = function(a, b) {
  var c;
  if(16 == b) {
    c = 4
  }else {
    if(8 == b) {
      c = 3
    }else {
      if(256 == b) {
        c = 8
      }else {
        if(2 == b) {
          c = 1
        }else {
          if(32 == b) {
            c = 5
          }else {
            if(4 == b) {
              c = 2
            }else {
              this.nb(a, b);
              return
            }
          }
        }
      }
    }
  }
  this.c = this.b = 0;
  for(var d = a.length, e = p, f = 0;0 <= --d;) {
    var h = 8 == c ? a[d] & 255 : Zc(a, d);
    0 > h ? "-" == a.charAt(d) && (e = l) : (e = p, 0 == f ? this[this.b++] = h : f + c > this.f ? (this[this.b - 1] |= (h & (1 << this.f - f) - 1) << f, this[this.b++] = h >> this.f - f) : this[this.b - 1] |= h << f, f += c, f >= this.f && (f -= this.f))
  }
  8 == c && 0 != (a[0] & 128) && (this.c = -1, 0 < f && (this[this.b - 1] |= (1 << this.f - f) - 1 << f));
  this.C();
  e && X.ZERO.t(this, this)
};
q.C = function() {
  for(var a = this.c & this.u;0 < this.b && this[this.b - 1] == a;) {
    --this.b
  }
};
q.la = function(a, b) {
  var c;
  for(c = this.b - 1;0 <= c;--c) {
    b[c + a] = this[c]
  }
  for(c = a - 1;0 <= c;--c) {
    b[c] = 0
  }
  b.b = this.b + a;
  b.c = this.c
};
q.jb = function(a, b) {
  for(var c = a;c < this.b;++c) {
    b[c - a] = this[c]
  }
  b.b = Math.max(this.b - a, 0);
  b.c = this.c
};
q.Qa = function(a, b) {
  var c = a % this.f, d = this.f - c, e = (1 << d) - 1, f = Math.floor(a / this.f), h = this.c << c & this.u, i;
  for(i = this.b - 1;0 <= i;--i) {
    b[i + f + 1] = this[i] >> d | h, h = (this[i] & e) << c
  }
  for(i = f - 1;0 <= i;--i) {
    b[i] = 0
  }
  b[f] = h;
  b.b = this.b + f + 1;
  b.c = this.c;
  b.C()
};
q.zb = function(a, b) {
  b.c = this.c;
  var c = Math.floor(a / this.f);
  if(c >= this.b) {
    b.b = 0
  }else {
    var d = a % this.f, e = this.f - d, f = (1 << d) - 1;
    b[0] = this[c] >> d;
    for(var h = c + 1;h < this.b;++h) {
      b[h - c - 1] |= (this[h] & f) << e, b[h - c] = this[h] >> d
    }
    0 < d && (b[this.b - c - 1] |= (this.c & f) << e);
    b.b = this.b - c;
    b.C()
  }
};
q.t = function(a, b) {
  for(var c = 0, d = 0, e = Math.min(a.b, this.b);c < e;) {
    d += this[c] - a[c], b[c++] = d & this.u, d >>= this.f
  }
  if(a.b < this.b) {
    for(d -= a.c;c < this.b;) {
      d += this[c], b[c++] = d & this.u, d >>= this.f
    }
    d += this.c
  }else {
    for(d += this.c;c < a.b;) {
      d -= a[c], b[c++] = d & this.u, d >>= this.f
    }
    d -= a.c
  }
  b.c = 0 > d ? -1 : 0;
  -1 > d ? b[c++] = this.K + d : 0 < d && (b[c++] = d);
  b.b = c;
  b.C()
};
q.vb = function(a) {
  var b = $.Xa, c = this.abs(), d = b.abs(), e = c.b;
  for(a.b = e + d.b;0 <= --e;) {
    a[e] = 0
  }
  for(e = 0;e < d.b;++e) {
    a[e + c.b] = c.ga(d[e], a, e, c.b)
  }
  a.c = 0;
  a.C();
  this.c != b.c && X.ZERO.t(a, a)
};
q.Ja = function(a, b, c) {
  var d = a.abs();
  if(!(0 >= d.b)) {
    var e = this.abs();
    if(e.b < d.b) {
      b != m && b.D(0), c != m && this.copyTo(c)
    }else {
      c == m && (c = Yc());
      var f = Yc(), h = this.c, a = a.c, i = d[d.b - 1], j = 1, n;
      if(0 != (n = i >>> 16)) {
        i = n, j += 16
      }
      if(0 != (n = i >> 8)) {
        i = n, j += 8
      }
      if(0 != (n = i >> 4)) {
        i = n, j += 4
      }
      if(0 != (n = i >> 2)) {
        i = n, j += 2
      }
      0 != i >> 1 && (j += 1);
      i = this.f - j;
      0 < i ? (d.Qa(i, f), e.Qa(i, c)) : (d.copyTo(f), e.copyTo(c));
      d = f.b;
      e = f[d - 1];
      if(0 != e) {
        n = e * (1 << this.Aa) + (1 < d ? f[d - 2] >> this.Ba : 0);
        j = this.bb / n;
        n = (1 << this.Aa) / n;
        var y = 1 << this.Ba, v = c.b, C = v - d, D = b == m ? Yc() : b;
        f.la(C, D);
        0 <= c.U(D) && (c[c.b++] = 1, c.t(D, c));
        X.ONE.la(d, D);
        for(D.t(f, f);f.b < d;) {
          f[f.b++] = 0
        }
        for(;0 <= --C;) {
          var K = c[--v] == e ? this.u : Math.floor(c[v] * j + (c[v - 1] + y) * n);
          if((c[v] += f.ga(K, c, C, d)) < K) {
            f.la(C, D);
            for(c.t(D, c);c[v] < --K;) {
              c.t(D, c)
            }
          }
        }
        b != m && (c.jb(d, b), h != a && X.ZERO.t(b, b));
        c.b = d;
        c.C();
        0 < i && c.zb(i, c);
        0 > h && X.ZERO.t(c, c)
      }
    }
  }
};
q.toString = function(a) {
  if(0 > this.c) {
    return"-" + this.i().toString(a)
  }
  if(16 == a) {
    a = 4
  }else {
    if(8 == a) {
      a = 3
    }else {
      if(2 == a) {
        a = 1
      }else {
        if(32 == a) {
          a = 5
        }else {
          if(4 == a) {
            a = 2
          }else {
            return this.Fb(a)
          }
        }
      }
    }
  }
  var b = (1 << a) - 1, c, d = p, e = "", f = this.b, h = this.f - f * this.f % a;
  if(0 < f--) {
    if(h < this.f && 0 < (c = this[f] >> h)) {
      d = l, e = "0123456789abcdefghijklmnopqrstuvwxyz".charAt(c)
    }
    for(;0 <= f;) {
      h < a ? (c = (this[f] & (1 << h) - 1) << a - h, c |= this[--f] >> (h += this.f - a)) : (c = this[f] >> (h -= a) & b, 0 >= h && (h += this.f, --f)), 0 < c && (d = l), d && (e += "0123456789abcdefghijklmnopqrstuvwxyz".charAt(c))
    }
  }
  return d ? e : "0"
};
q.i = function() {
  var a = Yc();
  X.ZERO.t(this, a);
  return a
};
q.abs = function() {
  return 0 > this.c ? this.i() : this
};
q.U = function(a) {
  var b = this.c - a.c;
  if(0 != b) {
    return b
  }
  var c = this.b, b = c - a.b;
  if(0 != b) {
    return 0 > this.c ? -b : b
  }
  for(;0 <= --c;) {
    if(0 != (b = this[c] - a[c])) {
      return b
    }
  }
  return 0
};
X.ZERO = ad(0);
X.ONE = ad(1);
q = X.prototype;
q.nb = function(a, b) {
  this.D(0);
  b == m && (b = 10);
  for(var c = this.S(b), d = Math.pow(b, c), e = p, f = 0, h = 0, i = 0;i < a.length;++i) {
    var j = Zc(a, i);
    0 > j ? "-" == a.charAt(i) && 0 == this.ra() && (e = l) : (h = b * h + j, ++f >= c && (this.Ia(d), this.Ha(h), h = f = 0))
  }
  0 < f && (this.Ia(Math.pow(b, f)), this.Ha(h));
  e && X.ZERO.t(this, this)
};
q.S = function(a) {
  return Math.floor(Math.LN2 * this.f / Math.log(a))
};
q.ra = function() {
  return 0 > this.c ? -1 : 0 >= this.b || 1 == this.b && 0 >= this[0] ? 0 : 1
};
q.Ia = function(a) {
  this[this.b] = this.ga(a - 1, this, 0, this.b);
  ++this.b;
  this.C()
};
q.Ha = function(a) {
  var b = 0;
  if(0 != a) {
    for(;this.b <= b;) {
      this[this.b++] = 0
    }
    for(this[b] += a;this[b] >= this.K;) {
      this[b] -= this.K, ++b >= this.b && (this[this.b++] = 0), ++this[b]
    }
  }
};
q.Fb = function(a) {
  a == m && (a = 10);
  if(0 == this.ra() || 2 > a || 36 < a) {
    return"0"
  }
  var b = this.S(a), b = Math.pow(a, b), c = ad(b), d = Yc(), e = Yc(), f = "";
  for(this.Ja(c, d, e);0 < d.ra();) {
    f = (b + e.Oa()).toString(a).substr(1) + f, d.Ja(c, d, e)
  }
  return e.Oa().toString(a) + f
};
q.Oa = function() {
  if(0 > this.c) {
    if(1 == this.b) {
      return this[0] - this.K
    }
    if(0 == this.b) {
      return-1
    }
  }else {
    if(1 == this.b) {
      return this[0]
    }
    if(0 == this.b) {
      return 0
    }
  }
  return(this[1] & (1 << 32 - this.f) - 1) << this.f | this[0]
};
q.fa = function(a, b) {
  for(var c = 0, d = 0, e = Math.min(a.b, this.b);c < e;) {
    d += this[c] + a[c], b[c++] = d & this.u, d >>= this.f
  }
  if(a.b < this.b) {
    for(d += a.c;c < this.b;) {
      d += this[c], b[c++] = d & this.u, d >>= this.f
    }
    d += this.c
  }else {
    for(d += this.c;c < a.b;) {
      d += a[c], b[c++] = d & this.u, d >>= this.f
    }
    d += a.c
  }
  b.c = 0 > d ? -1 : 0;
  0 < d ? b[c++] = d : -1 > d && (b[c++] = this.K + d);
  b.b = c;
  b.C()
};
var $ = {abs:function(a, b) {
  var c = new Y(a, b), c = c.n() ? c.i() : c;
  B[qb >> 2] = c.h;
  B[qb + 4 >> 2] = c.j
}, Ka:function() {
  $.kb || ($.kb = l, $.Xa = new X, $.Xa.k("4294967296", 10), $.sa = new X, $.sa.k("18446744073709551616", 10), $.xe = new X, $.ye = new X)
}, me:function(a, b) {
  var c = new X;
  c.k(b.toString(), 10);
  var d = new X;
  c.vb(d);
  c = new X;
  c.k(a.toString(), 10);
  var e = new X;
  c.fa(d, e);
  return e
}, stringify:function(a, b, c) {
  a = (new Y(a, b)).toString();
  c && "-" == a[0] && ($.Ka(), c = new X, c.k(a, 10), a = new X, $.sa.fa(c, a), a = a.toString(10));
  return a
}, k:function(a, b, c, d, e) {
  $.Ka();
  var f = new X;
  f.k(a, b);
  a = new X;
  a.k(c, 10);
  c = new X;
  c.k(d, 10);
  e && 0 > f.U(X.ZERO) && (d = new X, f.fa($.sa, d), f = d);
  d = p;
  0 > f.U(a) ? (f = a, d = l) : 0 < f.U(c) && (f = c, d = l);
  f = Y.k(f.toString());
  B[qb >> 2] = f.h;
  B[qb + 4 >> 2] = f.j;
  d && g("range error")
}};
lc = $;
var cd, dd;
s.callMain = s.$d = function(a) {
  function b() {
    for(var a = 0;3 > a;a++) {
      d.push(0)
    }
  }
  w(0 == L, "cannot call main when async dependencies remain! (listen on __ATMAIN__)");
  w(0 == Wa.length, "cannot call main when preRun functions remain to be called");
  a = a || [];
  ab || (ab = l, Va(Xa));
  var c = a.length + 1, d = [F(J("/bin/this.program"), "i8", Ka)];
  b();
  for(var e = 0;e < c - 1;e += 1) {
    d.push(F(J(a[e]), "i8", Ka)), b()
  }
  d.push(0);
  d = F(d, "i32", Ka);
  cd = u;
  dd = l;
  var f;
  try {
    f = s._main(c, d, 0)
  }catch(h) {
    if(h && "object" == typeof h && "ExitStatus" == h.type) {
      return s.print("Exit Status: " + h.value), h.value
    }
    "SimulateInfiniteLoop" == h ? s.noExitRuntime = l : g(h)
  }finally {
    dd = p
  }
  s.noExitRuntime || ed(f)
};
function lb(a) {
  function b() {
    ab || (ab = l, Va(Xa));
    Va(Ya);
    gb = l;
    s._main && kb && s.callMain(a);
    if(s.postRun) {
      for("function" == typeof s.postRun && (s.postRun = [s.postRun]);s.postRun.length;) {
        cb(s.postRun.shift())
      }
    }
    Va($a)
  }
  a = a || s.arguments;
  if(0 < L) {
    s.P("run() called, but dependencies remain, so not running")
  }else {
    if(s.preRun) {
      for("function" == typeof s.preRun && (s.preRun = [s.preRun]);s.preRun.length;) {
        bb(s.preRun.shift())
      }
    }
    Va(Wa);
    0 < L || (s.setStatus ? (s.setStatus("Running..."), setTimeout(function() {
      setTimeout(function() {
        s.setStatus("")
      }, 1);
      za || b()
    }, 1)) : b())
  }
}
s.run = s.we = lb;
function ed(a) {
  za = l;
  u = cd;
  Va(Za);
  dd && g({type:"ExitStatus", value:a})
}
s.exit = s.de = ed;
function wa(a) {
  a && s.print(a);
  za = l;
  g("abort() at " + Error().stack)
}
s.abort = s.abort = wa;
if(s.preInit) {
  for("function" == typeof s.preInit && (s.preInit = [s.preInit]);0 < s.preInit.length;) {
    s.preInit.pop()()
  }
}
var kb = l;
s.noInitialRun && (kb = p);
lb();
var scrypt = (function () {
    var exports = {};

    //---------------------------------------------------------------------------
    // Horrifying UTF-8 and hex codecs

    function encode_utf8(s) {
	return encode_latin1(unescape(encodeURIComponent(s)));
    }

    function encode_latin1(s) {
	var result = new Uint8Array(s.length);
	for (var i = 0; i < s.length; i++) {
	    var c = s.charCodeAt(i);
	    if ((c & 0xff) !== c) throw {message: "Cannot encode string in Latin1", str: s};
	    result[i] = (c & 0xff);
	}
	return result;
    }

    function decode_utf8(bs) {
	return decodeURIComponent(escape(decode_latin1(bs)));
    }

    function decode_latin1(bs) {
	var encoded = [];
	for (var i = 0; i < bs.length; i++) {
	    encoded.push(String.fromCharCode(bs[i]));
	}
	return encoded.join('');
    }

    function to_hex(bs) {
	var encoded = [];
	for (var i = 0; i < bs.length; i++) {
	    encoded.push("0123456789abcdef"[(bs[i] >> 4) & 15]);
	    encoded.push("0123456789abcdef"[bs[i] & 15]);
	}
	return encoded.join('');
    }

    //---------------------------------------------------------------------------

    function injectBytes(bs, leftPadding) {
	var p = leftPadding || 0;
	var address = scrypt_raw._malloc(bs.length + p);
	scrypt_raw.HEAPU8.set(bs, address + p);
	for (var i = address; i < address + p; i++) {
	    scrypt_raw.HEAPU8[i] = 0;
	}
	return address;
    }

    function check_injectBytes(function_name, what, thing, expected_length, leftPadding) {
	check_length(function_name, what, thing, expected_length);
	return injectBytes(thing, leftPadding);
    }

    function extractBytes(address, length) {
	var result = new Uint8Array(length);
	result.set(scrypt_raw.HEAPU8.subarray(address, address + length));
	return result;
    }

    //---------------------------------------------------------------------------

    function check(function_name, result) {
	if (result !== 0) {
	    throw {message: "scrypt_raw." + function_name + " signalled an error"};
	}
    }

    function check_length(function_name, what, thing, expected_length) {
	if (thing.length !== expected_length) {
	    throw {message: "scrypt." + function_name + " expected " +
	           expected_length + "-byte " + what + " but got length " + thing.length};
	}
    }

    function Target(length) {
	this.length = length;
	this.address = scrypt_raw._malloc(length);
    }

    Target.prototype.extractBytes = function (offset) {
	var result = extractBytes(this.address + (offset || 0), this.length - (offset || 0));
	scrypt_raw._free(this.address);
	this.address = null;
	return result;
    };

    function free_all(addresses) {
	for (var i = 0; i < addresses.length; i++) {
	    scrypt_raw._free(addresses[i]);
	}
    }

    //---------------------------------------------------------------------------

    function crypto_scrypt(passwd, salt, n, r, p, buflen) {
	var buf = new Target(buflen);
	var pa = injectBytes(passwd);
	var sa = injectBytes(salt);
	check("_crypto_scrypt",
	      scrypt_raw._crypto_scrypt(pa, passwd.length,
					sa, salt.length,
					n, 0, // 64 bits; zero upper half
					r,
					p,
					buf.address, buf.length));
	free_all([pa, sa]);
	return buf.extractBytes();
    }

    //---------------------------------------------------------------------------

    exports.encode_utf8 = encode_utf8;
    exports.encode_latin1 = encode_latin1;
    exports.decode_utf8 = decode_utf8;
    exports.decode_latin1 = decode_latin1;
    exports.to_hex = to_hex;

    exports.crypto_scrypt = crypto_scrypt;

    return exports;
})();
    return scrypt;
});
/* WEBPACK VAR INJECTION */}.call(exports, "/", __webpack_require__(27)(module)))

/***/ }),
/* 117 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(119);

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);
var bind = __webpack_require__(42);
var Axios = __webpack_require__(121);
var defaults = __webpack_require__(22);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(52);
axios.CancelToken = __webpack_require__(143);
axios.isCancel = __webpack_require__(51);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(144);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 120 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(22);
var utils = __webpack_require__(2);
var InterceptorManager = __webpack_require__(138);
var dispatchRequest = __webpack_require__(139);
var isAbsoluteURL = __webpack_require__(141);
var combineURLs = __webpack_require__(142);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);
var settle = __webpack_require__(43);
var buildURL = __webpack_require__(45);
var parseHeaders = __webpack_require__(124);
var isURLSameOrigin = __webpack_require__(125);
var createError = __webpack_require__(23);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(126);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(127);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);
var settle = __webpack_require__(43);
var buildURL = __webpack_require__(45);
var http = __webpack_require__(46);
var https = __webpack_require__(47);
var httpFollow = __webpack_require__(48).http;
var httpsFollow = __webpack_require__(48).https;
var url = __webpack_require__(49);
var zlib = __webpack_require__(136);
var pkg = __webpack_require__(137);
var createError = __webpack_require__(23);
var enhanceError = __webpack_require__(44);

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolve, reject) {
    var data = config.data;
    var headers = config.headers;
    var timer;
    var aborted = false;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/mzabriskie/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = new Buffer(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = new Buffer(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var parsed = url.parse(config.url);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttps = protocol === 'https:';
    var agent = isHttps ? config.httpsAgent : config.httpAgent;

    var options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method,
      headers: headers,
      agent: agent,
      auth: auth
    };

    var proxy = config.proxy;
    if (!proxy) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        proxy = {
          host: parsedProxyUrl.hostname,
          port: parsedProxyUrl.port
        };

        if (parsedProxyUrl.auth) {
          var proxyUrlAuth = parsedProxyUrl.auth.split(':');
          proxy.auth = {
            username: proxyUrlAuth[0],
            password: proxyUrlAuth[1]
          };
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = new Buffer(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    if (config.maxRedirects === 0) {
      transport = isHttps ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttps ? httpsFollow : httpFollow;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (aborted) return;

      // Response has been received so kill timer that handles request timeout
      clearTimeout(timer);
      timer = null;

      // uncompress the response body transparently if required
      var stream = res;
      switch (res.headers['content-encoding']) {
      /*eslint default-case:0*/
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream = stream.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString('utf8');
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout && !timer) {
      timer = setTimeout(function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
        aborted = true;
      }, config.timeout);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (aborted) {
          return;
        }

        req.abort();
        reject(cancel);
        aborted = true;
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};


/***/ }),
/* 129 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(131);
} else {
  module.exports = __webpack_require__(133);
}


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(50);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 132 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(134);
var util = __webpack_require__(29);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(50);
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(41);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(135);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),
/* 135 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 136 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 137 */
/***/ (function(module, exports) {

module.exports = {"_args":[[{"raw":"axios@^0.16.2","scope":null,"escapedName":"axios","name":"axios","rawSpec":"^0.16.2","spec":">=0.16.2 <0.17.0","type":"range"},"/Users/ethanfast/Desktop/Code/NEO/neo-wallet-js"]],"_from":"axios@>=0.16.2 <0.17.0","_id":"axios@0.16.2","_inCache":true,"_location":"/axios","_nodeVersion":"6.10.1","_npmOperationalInternal":{"host":"s3://npm-registry-packages","tmp":"tmp/axios-0.16.2.tgz_1496518163672_0.8309127793181688"},"_npmUser":{"name":"nickuraltsev","email":"nick.uraltsev@gmail.com"},"_npmVersion":"3.10.10","_phantomChildren":{},"_requested":{"raw":"axios@^0.16.2","scope":null,"escapedName":"axios","name":"axios","rawSpec":"^0.16.2","spec":">=0.16.2 <0.17.0","type":"range"},"_requiredBy":["/"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.16.2.tgz","_shasum":"ba4f92f17167dfbab40983785454b9ac149c3c6d","_shrinkwrap":null,"_spec":"axios@^0.16.2","_where":"/Users/ethanfast/Desktop/Code/NEO/neo-wallet-js","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/mzabriskie/axios/issues"},"dependencies":{"follow-redirects":"^1.2.3","is-buffer":"^1.1.5"},"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"coveralls":"^2.11.9","es6-promise":"^4.0.5","grunt":"^1.0.1","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.0.0","grunt-contrib-nodeunit":"^1.0.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^19.0.0","grunt-karma":"^2.0.0","grunt-ts":"^6.0.0-beta.3","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.0.0","karma-coverage":"^1.0.0","karma-firefox-launcher":"^1.0.0","karma-jasmine":"^1.0.2","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-phantomjs-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.1.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","phantomjs-prebuilt":"^2.1.7","sinon":"^1.17.4","typescript":"^2.0.3","url-search-params":"^0.6.1","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"directories":{},"dist":{"shasum":"ba4f92f17167dfbab40983785454b9ac149c3c6d","tarball":"https://registry.npmjs.org/axios/-/axios-0.16.2.tgz"},"gitHead":"46e275c407f81c44dd9aad419b6e861d8a936580","homepage":"https://github.com/mzabriskie/axios","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","maintainers":[{"name":"mzabriskie","email":"mzabriskie@gmail.com"},{"name":"nickuraltsev","email":"nick.uraltsev@gmail.com"}],"name":"axios","optionalDependencies":{},"readme":"ERROR: No README data found!","repository":{"type":"git","url":"git+https://github.com/mzabriskie/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","version":"0.16.2"}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);
var transformData = __webpack_require__(140);
var isCancel = __webpack_require__(51);
var defaults = __webpack_require__(22);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(52);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ })
/******/ ]);
});