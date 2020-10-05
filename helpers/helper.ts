/* 
Helper callback to check if signature is a single signature
*/
function is_signature_contract(signature_script, callback){
    /*
    Check if signature is correct length (Hardcoded: 41)
    Check is current OpCodes are present within Signature
    script[1] should be Hardcoded: 33
    script [35] should be OpCode.PUSHNULL (Hardcoded: 11)
    script [36] should be OpCode.SYSCALL (Hardcoded: 65)
    */
    const script = Buffer.from(signature_script, "hex");
    if(script.length != 41 || script[1] != 33 || script[35] != 11 || script[36] != 65){
        callback(false);
        return; //You want to return right away to prevent indexing errors from next check
    }
    /*
    Next check:
    37:40 should equal ending instructions "95 44 0d 78" 
    Total should be 350
    */
    let ECDsaSecp256r1_total = script[37] + script[38] + script[39] + script [40];
    if((ECDsaSecp256r1_total != 350) || script[37] != 149 || script[38] != 68 || script[39] != 13 || script [40] !=120){
        callback(false);
        return;
    }
    callback(true);
    return;
}

/* 
Helper callback to check if signatures are multi-sig
*/
function is_multisig_contract(signature_script, callback){
    const script = Buffer.from(signature_script, "hex");
    //First check length and return if failure to prevent indexing related errors.
    if(script.length < 43){ 
        callback(false); 
        return;
    }

    //Hard-coded sys calls, these needs to be INT Values this is temp
    let PUSHINT8 = 0; //0 //0x00
    let PUSHINT16 = 1; //1 //0x01
    let PUSH0 = 16; //16 //0x10
    let PUSH1 = 17; //17 //0x11
    let PUSH16 = 32; //32 //0x20
    let PUSHDATA1 = 12; //12 //0x0C
    let PUSHNULL = 11; //11 //0x0B
    let SYSCALL = 65; //65 //0x41

    let signature_count;
    let i;

    if(script[0] == PUSHINT8){
        signature_count = script[1];
        i = 2;
    } else if(script[0] == PUSHINT16){
        signature_count = script[1] + script[2] + script [3]; //temp //signature_count = script[1:3],little,signed=false
        //The above will need to be the value of the bytes from i+1 to i+3 not individual int values.
        i = 3;
    } else if(signature_count <= PUSH1 || signature_count >= PUSH16){
        signature_count = script[0] - PUSH0;
        i = 1;
    } else{
        callback(false);
        return;
    }

    if(signature_count < 1 || signature_count > 1024){
        callback(false);
        return;
    }

    let pushdata1 = PUSHDATA1;
    let public_key_count = 0;
    while(script[i] == pushdata1){
        if(script.length <= i + 35){
            callback(false);
            return;
        }
        if(script[i+1] != 33){
            callback(false);
            return;
        }
        i += 35
        public_key_count += 1;
    }

    if(public_key_count < signature_count || public_key_count > 1024){
        callback(false);
        return;
    }

    let value = script[i];
    if(value == PUSHINT8){
        if(script.length <= i + 1 || public_key_count != script[i+1]){
            callback(false);
            return;
        }
        i += 2;
    } else if(value == PUSHINT16){
        if(script.length < i+3 || 
            (public_key_count != script[i+1] + script[i+2] + script[i+3]) ){ //TEMP  or public_key_count != int.from_bytes(script[i + 1:i + 3], 'little', signed=False)
            //The above will need to be the value of the bytes from i+1 to i+3 not individual int values.
            callback(false);
            return;
        }
        i += 3;
    } else if(PUSH1 <= value || value <= PUSH16){
        if(public_key_count != (value - PUSH0)){
            callback(false);
            return;
        }
        i += 1;
    } else{
        callback(false);
        return;
    }

    if( (script.length != (i + 6)) || (script[i] != PUSHNULL) || (script[i+1] != SYSCALL) ){
        callback(false);
        return;
    }

    i += 2;
    
    /*
    AFEF8D13 || 2951712019
    AF = 175
    EF = 239
    8D = 141
    13 = 19

    This may be off from the example because of i+4? //syscall_num = int.from_bytes(script[i:i + 4], 'little')
    */
    if(script[i] != 175 || script[i+1] != 239 || script[i+2] != 141 || script[i+3] != 19){  //Temp
        callback(false);
        return;
    }

    callback(true);
    return;
}


/* TEST CALLS */
let single_sig_1 = "0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78"; //Passes
let single_sig_2 = "0C33aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0b4195440d78"; //Fails

//NOTE: Multi_sig is not a correct multi-sig hash
let multi_sig_1 = "5221036245f426b4522e8a2901be6ccc1f71e37dc376726cc6665d80c5997e240568fb210303897394935bb5418b1c1c4cf35513e276c6bd313ddd1330f113ec3dc34fbd0d2102e2baf21e36df2007189d05b9e682f4192a101dcdf07eed7d6313625a930874b453ae";
let multi_sig_2 = "OC33"

/* Single sig example with callback */
is_signature_contract(single_sig_1, function(reply){
    console.log("Is\n%s\nSingle Sig?\nResult: %s", single_sig_1, reply);
    console.log("***********************");
})
/* Single sig call with multi-sig example with callback */
is_signature_contract(single_sig_2, function(reply){
    console.log("Is\n%s\nSingle Sig?\nResult: %s", single_sig_2, reply);
    console.log("***********************");
})

/* Multi Sig call with Single-Sig example with callback */
is_multisig_contract(single_sig_1, function(reply){
    console.log("Is\n%s\nMulti Sig?\nResult: %s", single_sig_1, reply);
    console.log("***********************");
}) 

/* 
Useful notes:
-Single Sig end instruction = 2504265080 (HEX: 95440d78)
-Multi Sig end instruction  = 2951712019 (HEX: AFEF8D13)
*/ 


/*
TO DO:
Find / make a multi sig (2x, 3x and 4x) to test with and fine-tune conditions for
*/