import ecurve from 'ecurve';
import BigInteger from 'bigi';
import secp256k1 from 'secp256k1/elliptic';
import { ec } from 'elliptic';
import CryptoJS from 'crypto-js';
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
import { ab2str,
  str2ab,
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes } from './utils';

var base58 = require('base-x')(BASE58)

import buffer from 'buffer';
import SQL from 'sql.js';


class Wallet {
  constructor(passwordHash, iv, masterKey, publicKeyHash, privateKeyEncrypted) {
    this.passwordHash = passwordHash;
  	this.iv = iv;
  	this.masterKey = masterKey;
  	this.publicKeyHash = publicKeyHash;
  	this.privateKeyEncrypted = privateKeyEncrypted;
  }

  generateWalletFileBlob($privateKey, $password) {
    //console.log( "privateKey: ", $privateKey );
    //console.log( "password: ", $password );

    var publicKey = this.getPublicKey($privateKey, false);
    //console.log( "publicKey: ", publicKey.toString('hex') );

    var publicKeyEncoded = this.getPublicKey($privateKey, true);
    //console.log( "publicKeyEncoded: ", publicKeyEncoded.toString('hex') );

    var scriptCode = this.createSignatureScript(publicKeyEncoded);
    //console.log( "scriptCode: ", scriptCode );

    var scriptHash = this.getHash(scriptCode);
    //console.log( "scriptHash: ", scriptHash.toString() );

    var publicKeyHash = this.getHash(publicKeyEncoded.toString('hex'));
    //console.log( "publicKeyHash: ", publicKeyHash.toString() );

    var passwordKey = CryptoJS.SHA256(CryptoJS.SHA256($password));
    var passwordHash = CryptoJS.SHA256(passwordKey);
    //console.log( "passwordHash: ", passwordHash.toString() );

    var iv = this.generateRandomArray(16);
    //console.log( "iv: ", ab2hexstring(iv) );

    var masterKey = this.generateRandomArray(32);
    //console.log( "masterKey: ", ab2hexstring(masterKey) );

    // Encrypt MasterKey
    var masterKeyPlain = CryptoJS.enc.Hex.parse(ab2hexstring(masterKey));
    var key = CryptoJS.enc.Hex.parse(passwordKey.toString());
    var ivData = CryptoJS.enc.Hex.parse(ab2hexstring(iv));
    var masterKeyEncrypt = CryptoJS.AES.encrypt(masterKeyPlain, key, {
      iv: ivData,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding
    });
    //console.log( "masterKeyEncrypt: ", masterKeyEncrypt.ciphertext.toString() );

    // PrivateKey Data
    var privateKeyData = publicKey.slice(1, 65).toString('hex') + $privateKey;
    //console.log( "privateKeyData: ", privateKeyData );

    // Encrypt PrivateKey Data
    var privateKeyDataPlain = CryptoJS.enc.Hex.parse(privateKeyData);
    var privateKeyDataEncrypted = CryptoJS.AES.encrypt(privateKeyDataPlain, masterKeyPlain, {
      iv: ivData,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding
    });
    //console.log( "privateKeyDataEncrypted: ", privateKeyDataEncrypted.ciphertext.toString() );

    var db = new SQL.Database();

    var sqlstr = "CREATE TABLE Account ( PublicKeyHash BINARY NOT NULL CONSTRAINT PK_Account PRIMARY KEY, PrivateKeyEncrypted VARBINARY NOT NULL );";
    sqlstr += "CREATE TABLE Address ( ScriptHash BINARY NOT NULL CONSTRAINT PK_Address PRIMARY KEY );"
    sqlstr += "CREATE TABLE Coin ( TxId BINARY  NOT NULL, [Index] INTEGER NOT NULL, AssetId BINARY NOT NULL, ScriptHash BINARY  NOT NULL, State INTEGER NOT NULL, Value INTEGER NOT NULL, CONSTRAINT PK_Coin PRIMARY KEY ( TxId, [Index] ), CONSTRAINT FK_Coin_Address_ScriptHash FOREIGN KEY ( ScriptHash ) REFERENCES Address (ScriptHash) ON DELETE CASCADE );"
    sqlstr += "CREATE TABLE Contract ( ScriptHash BINARY NOT NULL CONSTRAINT PK_Contract PRIMARY KEY, PublicKeyHash BINARY NOT NULL, RawData VARBINARY NOT NULL, CONSTRAINT FK_Contract_Account_PublicKeyHash FOREIGN KEY ( PublicKeyHash ) REFERENCES Account (PublicKeyHash) ON DELETE CASCADE, CONSTRAINT FK_Contract_Address_ScriptHash FOREIGN KEY ( ScriptHash ) REFERENCES Address (ScriptHash) ON DELETE CASCADE );"
    sqlstr += "CREATE TABLE [Key] ( Name VARCHAR NOT NULL CONSTRAINT PK_Key PRIMARY KEY, Value VARBINARY NOT NULL );"
    sqlstr += "CREATE TABLE [Transaction] ( Hash BINARY NOT NULL CONSTRAINT PK_Transaction PRIMARY KEY, Height INTEGER, RawData VARBINARY NOT NULL, Time TEXT NOT NULL, Type INTEGER NOT NULL );"
    db.run(sqlstr);

    // Account table
    var stmtAccount = db.prepare("INSERT INTO Account(PublicKeyHash,PrivateKeyEncrypted) VALUES (?,?)");
    stmtAccount.run([hexstring2ab(publicKeyHash.toString()), hexstring2ab(privateKeyDataEncrypted.ciphertext.toString())]);
    stmtAccount.free();

    // Address table
    var stmtAddress = db.prepare("INSERT INTO Address(ScriptHash) VALUES (?)");
    stmtAddress.run([hexstring2ab(scriptHash.toString())]);
    stmtAddress.free();

    // Contract table
    var stmtContract = db.prepare("INSERT INTO Contract(ScriptHash,PublicKeyHash,RawData) VALUES (?,?,?)");
    stmtContract.run([hexstring2ab(scriptHash.toString()), hexstring2ab(publicKeyHash.toString()), hexstring2ab(publicKeyHash.toString() + "010023" + scriptCode)]);
    stmtContract.free();

    // Key table
    var stmtKey = db.prepare("INSERT INTO Key(Name,Value) VALUES (?,?)");
    stmtKey.run(['PasswordHash', hexstring2ab(passwordHash.toString())]);
    stmtKey.free();

    stmtKey = db.prepare("INSERT INTO Key(Name,Value) VALUES (?,?)");
    stmtKey.run(['IV', iv]);
    stmtKey.free();

    stmtKey = db.prepare("INSERT INTO Key(Name,Value) VALUES (?,?)");
    stmtKey.run(['MasterKey', hexstring2ab(masterKeyEncrypt.ciphertext.toString())]);
    stmtKey.free();

    stmtKey = db.prepare("INSERT INTO Key(Name,Value) VALUES (?,?)");
    stmtKey.run(['Version', hexstring2ab("01000000060000000000000000000000")]);
    stmtKey.free();

    stmtKey = db.prepare("INSERT INTO Key(Name,Value) VALUES (?,?)");
    stmtKey.run(['Height', hexstring2ab("00000000")]);
    stmtKey.free();

    var binaryArray = db.export();

    return binaryArray;
  }


  Sha256($data) {
  	var DataHexString = CryptoJS.enc.Hex.parse($data);
  	var DataSha256 = CryptoJS.SHA256(DataHexString);

  	return DataSha256.toString();
  }

  SM3($data) {
  	var x = sm3();
  	var DataHexString = hexstring2ab( $data );
  	return ab2hexstring( x.sum(DataHexString) );
  }

  MD5($data) {
  	var DataHexString = CryptoJS.enc.Hex.parse($data);
  	return CryptoJS.MD5(DataHexString).toString();
  }

  GetTxHash($data) {
  	var DataHexString = CryptoJS.enc.Hex.parse($data);
  	var DataSha256 = CryptoJS.SHA256(DataHexString);
  	var DataSha256_2 = CryptoJS.SHA256(DataSha256);

  	return DataSha256_2.toString();
  }

  GetInputData($coin, $amount) {
  	// sort
  	var coin_ordered = $coin['list'];
  	for (let i = 0; i < coin_ordered.length - 1; i++) {
  		for (let j = 0; j < coin_ordered.length - 1 - i; j++) {
  			if (parseFloat(coin_ordered[j].value) < parseFloat(coin_ordered[j + 1].value)) {
  				var temp = coin_ordered[j];
  				coin_ordered[j] = coin_ordered[j + 1];
  				coin_ordered[j + 1] = temp;
  			}
  		}
  	}

  	//console.log( coin_ordered );

  	// calc sum
  	var sum = 0;
  	for (let i = 0; i < coin_ordered.length; i++) {
  		sum = sum + parseFloat(coin_ordered[i].value);
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
  	var inputNum = numStoreInMemory((k + 1).toString(16), 2);
  	data.set(hexstring2ab(inputNum));

  	// input coins
  	for (var x = 0; x < k + 1; x++) {

  		// txid
  		var pos = 1 + (x * 34);
  		data.set(reverseArray(hexstring2ab(coin_ordered[x]['txid'])),pos);
  		//data.set(hexstring2ab(coin_ordered[x]['txid']), pos);

  		// index
  		pos = 1 + (x * 34) + 32;
  		let inputIndex = numStoreInMemory(coin_ordered[x]['n'].toString(16),4);
  		//inputIndex = numStoreInMemory(coin_ordered[x]['n'].toString(16), 2);
  		data.set(hexstring2ab(inputIndex), pos);
  	}

  	/////////////////////////////////////////////////////////////////////////

  	// calc coin_amount
  	var coin_amount = 0;
  	for (let i = 0; i < k + 1; i++) {
  		coin_amount = coin_amount + parseFloat(coin_ordered[i].value);
  	}

  	/////////////////////////////////////////////////////////////////////////

  	return {
  		amount: coin_amount,
  		data: data
  	}
  }

  IssueTransaction($issueAssetID, $issueAmount, $publicKeyEncoded) {
  	var signatureScript = this.createSignatureScript($publicKeyEncoded);
  	//console.log( signatureScript.toString('hex') );

  	var myProgramHash = this.getHash(signatureScript);
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
  	data = data + $issueAssetID

  	// Outputs[0] Amount
  	const num1 = $issueAmount * 100000000;
  	const num1str = numStoreInMemory(num1.toString(16), 16);
  	data = data + num1str;

  	// Outputs[0] ProgramHash
  	data = data + myProgramHash.toString()

  	//console.log(data);

  	return data;
  }

  RegisterTransaction($assetName, $assetAmount, $publicKeyEncoded) {
  	console.log( "publicKeyEncoded:", $publicKeyEncoded );

  	var ecparams = ecurve.getCurveByName('secp256r1');
  	var curvePt = ecurve.Point.decodeFrom(ecparams,new Buffer($publicKeyEncoded,"hex"));
  	var curvePtX = curvePt.affineX.toBuffer(32);
  	var curvePtY = curvePt.affineY.toBuffer(32);
  	var publicKey = buffer.concat([new Buffer([0x04]), curvePtX, curvePtY]);

  	var signatureScript = this.createSignatureScript($publicKeyEncoded);
  	console.log( signatureScript.toString('hex') );

  	var myProgramHash = this.getHash(signatureScript);
  	console.log( myProgramHash.toString() );

  	// data
  	var data = "40";

  	// version
  	data = data + "00";

  	// asset name
  	var assetName = ab2hexstring(stringToBytes($assetName));
  	var assetNameLen = (assetName.length / 2).toString()
  	if (assetNameLen.length == 1) assetNameLen = "0" + assetNameLen;
  	data = data + assetNameLen + assetName;

  	// asset precision
  	data = data + "00";

  	// asset type
  	data = data + "01";

  	// asset recordtype
  	data = data + "00";

  	// asset amount
  	const num1 = $assetAmount * 100000000;
  	const num1str = numStoreInMemory(num1.toString(16), 16);
  	data = data + num1str;

  	// publickey
  	var publicKeyXStr = curvePtX.toString('hex');
  	var publicKeyYStr = curvePtY.toString('hex');

  	data = data + "20" + publicKeyXStr + "20" + publicKeyYStr;
  	data = data + myProgramHash.toString();
  	data = data + "000000";

  	console.log(data);

  	return data;
  }

  AddContract( $txData, $sign, $publicKeyEncoded ) {
  	var signatureScript = this.createSignatureScript($publicKeyEncoded);
    console.log(signatureScript);
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
    console.log(data);
  	return data;
  }

  VerifyAddress( $toAddress ) {
  	var ProgramHash = base58.decode($toAddress);
  	var ProgramHexString = CryptoJS.enc.Hex.parse(ab2hexstring(ProgramHash.slice(0, 21)));
  	var ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  	var ProgramSha256_2 = CryptoJS.SHA256(ProgramSha256);
  	var ProgramSha256Buffer = hexstring2ab(ProgramSha256_2.toString());

  	if (ab2hexstring(ProgramSha256Buffer.slice(0, 4)) != ab2hexstring(ProgramHash.slice(21, 25))) {
  		//address verify failed.
  		return false;
  	}

  	return true;
  }


  VerifyPublicKeyEncoded( $publicKeyEncoded ) {
  	var publicKeyArray = hexstring2ab( $publicKeyEncoded );
  	if ( publicKeyArray[0] != 0x02 && publicKeyArray[0] != 0x03 ) {
  		return false;
  	}

  	var ecparams = ecurve.getCurveByName('secp256r1');
  	var curvePt = ecurve.Point.decodeFrom(ecparams,new Buffer($publicKeyEncoded,"hex"));
  	var curvePtX = curvePt.affineX.toBuffer(32);
  	var curvePtY = curvePt.affineY.toBuffer(32);

  	// console.log( "publicKeyArray", publicKeyArray );
  	// console.log( "curvePtX", curvePtX );
  	// console.log( "curvePtY", curvePtY );

  	if ( publicKeyArray[0] == 0x02 && curvePtY[31] % 2 == 0 ) {
  		return true;
  	}

  	if ( publicKeyArray[0] == 0x03 && curvePtY[31] % 2 == 1 ) {
  		return true;
  	}

  	return false;
  }

  TransferTransaction($coin, $publicKeyEncoded, $toAddress, $Amount) {

  	var ProgramHash = base58.decode($toAddress);
  	var ProgramHexString = CryptoJS.enc.Hex.parse(ab2hexstring(ProgramHash.slice(0, 21)));
  	var ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  	var ProgramSha256_2 = CryptoJS.SHA256(ProgramSha256);
  	var ProgramSha256Buffer = hexstring2ab(ProgramSha256_2.toString());

  	if (ab2hexstring(ProgramSha256Buffer.slice(0, 4)) != ab2hexstring(ProgramHash.slice(21, 25))) {
  		//address verify failed.
  		return -1;
  	}

  	ProgramHash = ProgramHash.slice(1, 21)

  	var signatureScript = this.createSignatureScript($publicKeyEncoded);
  	var myProgramHash = this.getHash(signatureScript);

  	// INPUT CONSTRUCT
  	var inputData = this.GetInputData($coin, $Amount);
  	if (inputData == -1) return null;
  	//console.log( inputData );

  	var inputLen = inputData.data.length;
  	var inputAmount = inputData.amount;

  	// Set SignableData Len
  	var signableDataLen = 124 + inputLen;
  	if (inputAmount == $Amount) {
  		signableDataLen = 64 + inputLen;
  	}

  	// CONSTRUCT
  	var data = new Uint8Array(signableDataLen);

  	// type
  	data.set(hexstring2ab("80"), 0);

  	// version
  	data.set(hexstring2ab("00"), 1);

  	// Attributes
  	data.set(hexstring2ab("00"), 2);

  	// INPUT
  	data.set(inputData.data, 3);

  	// OUTPUT
  	if (inputAmount == $Amount) {
  		// only one output

  		// output num
  		data.set(hexstring2ab("01"), inputLen + 3);

  		////////////////////////////////////////////////////////////////////
  		// OUTPUT - 0

  		// output asset
  		data.set(reverseArray(hexstring2ab($coin['assetid'])),inputLen+4);
  		//data.set(hexstring2ab($coin['assetid']), inputLen + 4);

  		// output value
  		const num1 = $Amount * 100000000;
  		const num1str = numStoreInMemory(num1.toString(16), 16);
  		data.set(hexstring2ab(num1str), inputLen + 36);

  		// output ProgramHash
  		data.set(ProgramHash, inputLen + 44);

  		////////////////////////////////////////////////////////////////////

  	} else {

  		// output num
  		data.set(hexstring2ab("02"), inputLen + 3);

  		////////////////////////////////////////////////////////////////////
  		// OUTPUT - 0

  		// output asset
  		data.set(reverseArray(hexstring2ab($coin['assetid'])),inputLen+4);
  		//data.set(hexstring2ab($coin['assetid']), inputLen + 4);

  		// output value
  		const num1 = $Amount * 100000000;
  		const num1str = numStoreInMemory(num1.toString(16), 16);
  		data.set(hexstring2ab(num1str), inputLen + 36);

  		// output ProgramHash
  		data.set(ProgramHash, inputLen + 44);

  		////////////////////////////////////////////////////////////////////
  		// OUTPUT - 1

  		// output asset
  		data.set(reverseArray(hexstring2ab($coin['assetid'])),inputLen+64);
  		//data.set(hexstring2ab($coin['assetid']), inputLen + 64);

  		// output value
  		const num2 = inputAmount * 100000000 - num1;
  		const num2str = numStoreInMemory(num2.toString(16), 16);
  		data.set(hexstring2ab(num2str), inputLen + 96);

  		// output ProgramHash
  		data.set(hexstring2ab(myProgramHash.toString()), inputLen + 104);

  		////////////////////////////////////////////////////////////////////

  		//console.log( "Signature Data:", ab2hexstring(data) );
  	}

  	return ab2hexstring(data);
  };

  ClaimTransaction ($claims, $publicKeyEncoded, $toAddress, $Amount) {

  	var signatureScript = this.createSignatureScript($publicKeyEncoded);
  	//console.log( signatureScript.toString('hex') );

  	var myProgramHash = this.getHash(signatureScript);
  	//console.log( myProgramHash.toString() );

  	////////////////////////////////////////////////////////////////////////
  	// data
  	var data = "02";

  	// version
  	data = data + "00";

  	// claim
  	// TODO: !!! var int
  	len = $claims['claims'].length
  	lenstr = numStoreInMemory(len.toString(16), 2);
  	data = data + lenstr

  	//console.log("len: ", len);
  	for ( var k=0; k<len; k++ ) {
  		txid = $claims['claims'][k]['txid'];
  		data = data + ab2hexstring(reverseArray(hexstring2ab(txid)));

  		vout = $claims['claims'][k]['vout'].toString(16);
  		data = data + numStoreInMemory(vout, 4);
  	}

  	// attribute
  	data = data + "00";

  	// Inputs
  	data = data + "00";

  	// Outputs len
  	data = data + "01";

  	// Outputs[0] AssetID
  	data = data + ab2hexstring(reverseArray(hexstring2ab($claims['assetid'])))

  	// Outputs[0] Amount
  	const num1 = parseInt($Amount);
  	const num1str = numStoreInMemory(num1.toString(16), 16);
  	data = data + num1str;

  	// Outputs[0] ProgramHash
  	data = data + myProgramHash.toString()

  	//console.log(data);

  	return data;
  };

  ToAddress($ProgramHash) {
  	var data = new Uint8Array(1 + $ProgramHash.length);
  	data.set([23]);
  	data.set($ProgramHash, 1);
  	//console.log(ab2hexstring(data));

  	var ProgramHexString = CryptoJS.enc.Hex.parse(ab2hexstring(data));
  	var ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  	var ProgramSha256_2 = CryptoJS.SHA256(ProgramSha256);
  	var ProgramSha256Buffer = hexstring2ab(ProgramSha256_2.toString());
  	//console.log(ab2hexstring(ProgramSha256Buffer));

  	var datas = new Uint8Array(1 + $ProgramHash.length + 4);
  	datas.set(data);
  	datas.set(ProgramSha256Buffer.slice(0, 4), 21);
  	//console.log(ab2hexstring(datas));

  	return base58.encode(datas);
  };

  generateRandomArray($arrayLen) {
    var randomArray = new Uint8Array($arrayLen);
  	for (let i = 0; i < $arrayLen; i++) {
  		randomArray[i] = Math.floor(Math.random() * 256);
  	}

  	return randomArray;
  }

  generatePrivateKey() {
  	var privateKey = new Uint8Array(32);
  	for (let i = 0; i < 32; i++) {
  		privateKey[i] = Math.floor(Math.random() * 256);
  	}

  	return privateKey;
  }

  getPrivateKeyFromWIF($wif) {
  	var data = base58.decode($wif);

  	if (data.length != 38 || data[0] != 0x80 || data[33] != 0x01) {
  		return -1;
  	}

  	var dataHexString = CryptoJS.enc.Hex.parse(ab2hexstring(data.slice(0, data.length - 4)));
  	var dataSha256 = CryptoJS.SHA256(dataHexString);
  	var dataSha256_2 = CryptoJS.SHA256(dataSha256);
  	var dataSha256Buffer = hexstring2ab(dataSha256_2.toString());

  	if (ab2hexstring(dataSha256Buffer.slice(0, 4)) != ab2hexstring(data.slice(data.length - 4, data.length))) {
  		//wif verify failed.
  		return -2;
  	}

  	return data.slice(1, 33).toString("hex");
  };

  getPublicKey($privateKey, $encode) {
  	var ecparams = ecurve.getCurveByName('secp256r1');
  	var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(hexstring2ab($privateKey)));
  	return curvePt.getEncoded($encode);
  };

  getPublicKeyEncoded($publicKey) {
  	var publicKeyArray = hexstring2ab($publicKey);
  	if ( publicKeyArray[64] % 2 == 1 ) {
  		return "03" + ab2hexstring(publicKeyArray.slice(1, 33));
  	} else {
  		return "02" + ab2hexstring(publicKeyArray.slice(1, 33));
  	}
  }

  createSignatureScript($publicKeyEncoded) {
  	return "21" + $publicKeyEncoded.toString('hex') + "ac";
  };

  getHash($SignatureScript) {
  	var ProgramHexString = CryptoJS.enc.Hex.parse($SignatureScript);
  	var ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  	return CryptoJS.RIPEMD160(ProgramSha256);
  };

  signatureData($data, $privateKey) {
  	var msg = CryptoJS.enc.Hex.parse($data);
  	var msgHash = CryptoJS.SHA256(msg);
    const msgHashHex = new Buffer(msgHash.toString(), "hex")
    const privateKeyHex = new Buffer($privateKey, "hex");
  	// console.log( "msgHash:", msgHashHex.toString('hex'));
    // console.log('buffer', privateKeyHex.toString('hex'));

    var elliptic = new ec('p256');
    const sig = elliptic.sign(msgHashHex, $privateKey, null);
    const signature = {
      signature: Buffer.concat([
        sig.r.toArrayLike(Buffer, 'be', 32),
        sig.s.toArrayLike(Buffer, 'be', 32)
      ])
    }
  	return signature.signature.toString('hex');
  };

  GetAccountsFromPublicKeyEncoded($publicKeyEncoded) {
  	if ( !this.VerifyPublicKeyEncoded( $publicKeyEncoded ) ) {
  		// verify failed.
  		return -1
  	}

  	var accounts = [];

  	var publicKeyHash = this.getHash($publicKeyEncoded);
  	//console.log( publicKeyHash );

  	var script = this.createSignatureScript($publicKeyEncoded);
  	//console.log( script );

  	var programHash = this.getHash(script);
  	//console.log( programHash );

  	var address = this.ToAddress(hexstring2ab(programHash.toString()));
  	//console.log( address );

  	accounts[0] = {
  		privatekey: '',
  		publickeyEncoded: $publicKeyEncoded,
  		publickeyHash: publicKeyHash.toString(),
  		programHash: programHash.toString(),
  		address: address,
  	};

  	return accounts;
  }

  GetAccountsFromPrivateKey($privateKey) {
  	if ($privateKey.length != 64) {
  		return -1;
  	}

  	var accounts = [];
  	var publicKeyEncoded = this.getPublicKey($privateKey, true);
  	//console.log( publicKeyEncoded );

  	var publicKeyHash = this.getHash(publicKeyEncoded.toString('hex'));
  	//console.log( publicKeyHash );

  	var script = this.createSignatureScript(publicKeyEncoded);
  	//console.log( script );

  	var programHash = this.getHash(script);
  	//console.log( programHash );

  	var address = this.ToAddress(hexstring2ab(programHash.toString()));
  	//console.log( address );

  	accounts[0] = {
  		privatekey: $privateKey,
  		publickeyEncoded: publicKeyEncoded.toString('hex'),
  		publickeyHash: publicKeyHash.toString(),
  		programHash: programHash.toString(),
  		address: address,
  	};

  	return accounts;
  }

  GetAccountsFromWIFKey($WIFKey) {
  	var privateKey = this.getPrivateKeyFromWIF($WIFKey);
  	if (privateKey == -1 || privateKey == -2) {
  		return privateKey;
  	}

  	return this.GetAccountsFromPrivateKey(privateKey);
  }

  decryptWallet(wallet, password) {
  	var accounts = [];
  	var passwordhash1 = CryptoJS.SHA256(password);
  	var passwordhash2 = CryptoJS.SHA256(passwordhash1);
  	var passwordhash3 = CryptoJS.SHA256(passwordhash2);
  	if (passwordhash3.toString() != ab2hexstring(wallet.passwordHash)) {
  		//PASSWORD WRONG
  		return -1;
  	}

  	console.log("password verify success.");

  	// Decrypt MasterKey
  	var data = CryptoJS.enc.Hex.parse(ab2hexstring(wallet.masterKey));
  	var dataBase64 = CryptoJS.enc.Base64.stringify(data);
  	var key = CryptoJS.enc.Hex.parse(passwordhash2.toString());
  	var iv = CryptoJS.enc.Hex.parse(ab2hexstring(wallet.iv));
  	//console.log( "MasterKey:", ab2hexstring(wallet.masterKey) );
  	//console.log(data);
  	//console.log( "Password:", passwordhash2.toString() );
  	//console.log(key);
  	//console.log( "IV:",ab2hexstring(wallet.iv) );
  	//console.log(iv);

  	var plainMasterKey = CryptoJS.AES.decrypt(dataBase64, key, {
  		iv: iv,
  		mode: CryptoJS.mode.CBC,
  		padding: CryptoJS.pad.NoPadding
  	});

  	//console.log( "plainMasterKey:", plainMasterKey.toString());

  	for (k = 0; k < wallet.privateKeyEncrypted.length; k++) {

  		// Decrypt PrivateKey
  		var privateKeyEncrypted = CryptoJS.enc.Hex.parse(ab2hexstring(wallet.privateKeyEncrypted[k]));
  		var privateKeyBase64 = CryptoJS.enc.Base64.stringify(privateKeyEncrypted);
  		var plainprivateKey = CryptoJS.AES.decrypt(privateKeyBase64, plainMasterKey, {
  			iv: iv,
  			mode: CryptoJS.mode.CBC,
  			padding: CryptoJS.pad.NoPadding
  		});

  		//console.log( "plainprivateKey:", plainprivateKey.toString() );

  		var privateKeyHexString = plainprivateKey.toString().slice(128, 192);
  		//console.log( "privateKeyHexString:", privateKeyHexString);

  		// Verify PublicKeyHash
  		var ecparams = ecurve.getCurveByName('secp256r1');
  		var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(hexstring2ab(privateKeyHexString)));

  		// Get PublicKey
  		//var x = curvePt.affineX.toBuffer(32);
  		//var y = curvePt.affineY.toBuffer(32);
  		//var publicKey = new Uint8Array(1+x.length+y.length);
  		//publicKey.set([0x04]);
  		//publicKey.set(x,1);
  		//publicKey.set(y,1+x.length);
  		//console.log(publicKey.toString('hex'));

  		// Get PublicKeyEncoded
  		var publicKeyEncoded = curvePt.getEncoded(true);
  		//console.log( "publicKeyEncoded:", publicKeyEncoded.toString('hex') );

  		// Get PublicKeyHash
  		var publicKeyEncodedHexString = CryptoJS.enc.Hex.parse(publicKeyEncoded.toString('hex'));
  		var publicKeyEncodedSha256 = CryptoJS.SHA256(publicKeyEncodedHexString);
  		var publicKeyHash = CryptoJS.RIPEMD160(publicKeyEncodedSha256);

  		// Get ProgramHash
  		var ProgramHexString = CryptoJS.enc.Hex.parse("21" + publicKeyEncoded.toString('hex') + "ac");
  		var ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  		var ProgramHash = CryptoJS.RIPEMD160(ProgramSha256);
  		//console.log( "ProgramHexString:", ProgramHexString.toString() );
  		//console.log( "ProgramHash:", ProgramHash.toString() );

  		// Get Address
  		var address = Wallet.ToAddress(hexstring2ab(ProgramHash.toString()));
  		console.log("address:", address);

  		//console.log( "k=", k );
  		//console.log( "publicKeyHash:", publicKeyHash.toString() );
  		//console.log( ab2hexstring(wallet.publicKeyHash[k]) );
  		if (publicKeyHash.toString() != ab2hexstring(wallet.publicKeyHash[k])) {
  			return -2;
  		}

  		accounts[k] = {
  			privatekey: privateKeyHexString,
  			publickeyEncoded: publicKeyEncoded.toString('hex'),
  			publickeyHash: publicKeyHash.toString(),
  			programHash: ProgramHash.toString(),
  			address: address,
  		};
  	}

  	return accounts
  };
}

export default Wallet;
