/* 
Helper to check if signature is a single signature
*/
export function isSignatureContract(signature_script){
    const PUSHDATA1   = 12, //0x0C
          PUSHNULL    = 11, //0x0B,
          PUSHSYSCALL = 65,  //0x41
          SCRIPTLEN   = 41
   
    const script = Buffer.from(signature_script, "hex");
    if(script.length != SCRIPTLEN || script[0] != PUSHDATA1 || script[1] != 33 || script[35] != PUSHNULL || script[36] != PUSHSYSCALL || script.readUInt32LE(37) != 2014135445){
        return false;
    }    
    return true;
}

/* 
Helper to check if signatures are multi-sig
*/

interface SignParamsLike {
    publicKeyCount: number;
    signatureCount: number;
 }

export function isMultisigContract(signature_script, state?: SignParamsLike){
    const script = Buffer.from(signature_script, "hex");
    if(script.length < 43){ //First check length and return if failure to prevent indexing related errors.
        return false;
    }

    //Hard-coded sys calls
    const PUSHINT8 = 12, //0 //0x00
          PUSHINT16 = 1, //1 //0x01
          PUSH0 = 16, //16 //0x10
          PUSH1 = 17, //17 //0x11
          PUSH16 = 32, //32 //0x20
          PUSHDATA1 = 12, //12 //0x0C
          PUSHNULL = 11, //11 //0x0B
          SYSCALL = 65; //65 //0x41

    let signatureCount, i;
    if(script[0] == PUSHINT8){
        signatureCount = script[1];
        i = 2;
    } else if(script[0] == PUSHINT16){
        signatureCount = script.readUInt16LE(1);
        i = 3;
    } else if(signatureCount <= PUSH1 || signatureCount >= PUSH16){
        signatureCount = script[0] - PUSH0;
        i = 1;
    } else{
        return false;
    }

    if(signatureCount < 1 || signatureCount > 1024){
        return false;
    }

    let publicKeyCount = 0;
    while(script[i] == PUSHDATA1){
        if(script.length <= i + 35){
            return false;
        }
        if(script[i+1] != 33){
            return false;
        }
        i += 35
        publicKeyCount += 1;
    }

    if(publicKeyCount < signatureCount || publicKeyCount > 1024){
        return false;
    }

    let value = script[i];
    if(value == PUSHINT8){
        if(script.length <= i + 1 || publicKeyCount != script[i+1]){
            return false;
        }
        i += 2;
    } else if(value == PUSHINT16){
        if(script.length < i+3 || publicKeyCount != script.readUInt16LE(i+1)){
            return false;
        }
        i += 3;
    } else if(PUSH1 <= value && value <= PUSH16){
        if(publicKeyCount != (value - PUSH0)){
            return false;
        }
        i += 1;
    } else{
        return false;
    }

    if( (script.length != (i + 6)) || (script[i] != PUSHNULL) || (script[i+1] != SYSCALL) ){
        return false;
    }

    i += 2;
    
    /*
    AFEF8D13 || 2951712019
    */
    if(script.readUInt32LE(i) != 2951712019){  //Temp
        return false;
    }
     
     if (state) {
        state.publicKeyCount = publicKeyCount;
        state.signatureCount = signatureCount;
    }
    
    return true;
}

/* 
Useful notes:
-Single Sig end instruction = 2504265080 (HEX: 95440d78)
-Multi Sig end instruction  = 2951712019 (HEX: AFEF8D13)
*/
