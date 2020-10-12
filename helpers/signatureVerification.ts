/* 
Helper to check if signature is a single signature
*/
export function is_signature_contract(signature_script){
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
    public_key_count: number;
    signature_count: number;
 }

export function is_multisig_contract(signature_script, state?: SignParamsLike){
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

    let signature_count, i;
    if(script[0] == PUSHINT8){
        signature_count = script[1];
        i = 2;
    } else if(script[0] == PUSHINT16){
        signature_count = script.readUInt16LE(1);
        i = 3;
    } else if(signature_count <= PUSH1 || signature_count >= PUSH16){
        signature_count = script[0] - PUSH0;
        i = 1;
    } else{
        return false;
    }

    if(signature_count < 1 || signature_count > 1024){
        return false;
    }

    let public_key_count = 0;
    while(script[i] == PUSHDATA1){
        if(script.length <= i + 35){
            return false;
        }
        if(script[i+1] != 33){
            return false;
        }
        i += 35
        public_key_count += 1;
    }

    if(public_key_count < signature_count || public_key_count > 1024){
        return false;
    }

    let value = script[i];
    if(value == PUSHINT8){
        if(script.length <= i + 1 || public_key_count != script[i+1]){
            return false;
        }
        i += 2;
    } else if(value == PUSHINT16){
        if(script.length < i+3 || public_key_count != script.readUInt16LE(i+1)){
            return false;
        }
        i += 3;
    } else if(PUSH1 <= value && value <= PUSH16){
        if(public_key_count != (value - PUSH0)){
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
    tail should be 2951712019
    */
    if(script.readUInt32LE(i) != 2951712019){  //Temp
        return false;
    }
     
     if (state) {
        state.public_key_count = public_key_count;
        state.signature_count = signature_count;
    }
    
    return true;
}

/* 
Useful notes:
-Single Sig end instruction = 2504265080 (HEX: 95440d78)
-Multi Sig end instruction  = 2951712019 (HEX: AFEF8D13)
*/ 
