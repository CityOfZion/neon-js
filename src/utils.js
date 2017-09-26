const ab2str = buf => String.fromCharCode.apply(null, new Uint8Array(buf));

const str2ab = str => {
  const bufView = new Uint8Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

const hexstring2ab = str => {
  const result = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }
  return result;
}

const ab2hexstring = arr => {
  let result = '';
  for (let i = 0; i < arr.length; i++) {
    let str = arr[i].toString(16);
    str = str.length == 0 ? '00' :
      str.length == 1 ? `0${str}` :
        str;
    result += str;
  }
  return result;
}

const hexXor = (str1, str2) => {
  console.log(str1, str2);
  if (str1.length !== str2.length) throw new Error()
  if (str1.length % 2 !== 0) throw new Error()
  const result = [];
  for (let i = 0; i < str1.length; i += 2) {
    result.push( parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16) );
  }
  return ab2hexstring(result);
}

const reverseArray = arr => {
  const result = new Uint8Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i];
  }
  return result;
}

const numStoreInMemory = (num, length) => {
  for (let i = num.length; i < length; i++) {
    num = `0${num}`;
  }
  return ab2hexstring(reverseArray(new Buffer(num, 'HEX')));
}

const stringToBytes = str => {
  const arr = [],
        utf8 = unescape(encodeURIComponent(str));
  for (let i = 0; i < utf8.length; i++) {
    arr.push(utf8.charCodeAt(i));
  }
  return arr;
}

const getTransferTxData = (txData) => {
  const ba = new Buffer(txData, 'hex'),
        Transaction = () => {
    this.type = 0;
    this.version = 0;
    this.attributes = '';
    this.inputs = [];
    this.outputs = [];
  },
        tx = new Transaction();

  // Transfer Type
  if (ba[0] != 0x80) return;
  tx.type = ba[0];

  // Version
  tx.version = ba[1];

  // Attributes
  let k = 2,
      len = ba[k];

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
}

const quickSort = (arr, left, right) => {
  let pivot, partitionIndex;

  if (left < right) {
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right);

    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }
  return arr;
};

const partition = ( arr, pivot, left, right) => {
  const pivotValue = arr[pivot];
  let partitionIndex = left;

  for(let i = left; i < right; i++) {
    if(arr[i] < pivotValue) {
      swap(arr, i, partitionIndex);
      partitionIndex++;
    }
  }

  swap(arr, right, partitionIndex);
  return partitionIndex;
};

const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

export {
  ab2str,
  str2ab,
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes,
  hexXor,
  quickSort
}
