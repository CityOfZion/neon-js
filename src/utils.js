const ab2str = buf => { return String.fromCharCode.apply(null, new Uint8Array(buf)); }

const str2ab = str => {
  var bufView = new Uint8Array(str.length);
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return bufView;
}

const hexstring2ab = str => {
  var result = [];
	while (str.length >= 2) {
		result.push(parseInt(str.substring(0, 2), 16));
		str = str.substring(2, str.length);
	}

	return result;
}

const ab2hexstring = arr => {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i].toString(16);
    str = str.length == 0 ? "00" :
      str.length == 1 ? "0" + str :
        str;
    result += str;
  }
  return result;
}

const reverseArray = arr => {
  var result = new Uint8Array(arr.length);
  for (var i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i];
  }

  return result;
}

const numStoreInMemory = (num, length) => {
  for (var i = num.length; i < length; i++) {
    num = '0' + num;
  }
  var data = reverseArray(new Buffer(num, "HEX"));

  return ab2hexstring(data);
}

const stringToBytes = str => {
  var utf8 = unescape(encodeURIComponent(str));

  var arr = [];
  for (var i = 0; i < utf8.length; i++) {
    arr.push(utf8.charCodeAt(i));
  }

  return arr;
}

export {
  ab2str,
  str2ab,
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes
}
