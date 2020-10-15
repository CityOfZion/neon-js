import {isSignatureContract, isMultisigContract} from "../../helpers/signatureVerification";

function testIsSignatureContract(){
    /* 
    
    A valid signature contract script looks as follows
    - PUSHDATA1 (0xC) ()
    - LEN PUBLIC KEY (33)
    - PUBLIC KEY data 
    - PUSHNULL (0xB) ()
    - SYSCALL (0x41) ()
    - "Neo.Crypto.VerifyWithECDsaSecp256r1" identifier ()

    */
    console.log("TESTING SINGLE SIG CONTRACT ...");
    //LENGTH
    if(!isSignatureContract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78")){
        console.log("Length Test: [Pass]");
    } else { console.log("Length Test: [Fail]");}
    //FIRST BYTE should be PUSHDATA1
    if(!isSignatureContract("XX21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78")){
        console.log("FirstByte is PUSHDATA1 Test: [Pass]");
    } else { console.log("FirstByte is PUSHDATA1 Test: [Fail]");}
    //2nd BYTE should be 33
    if(!isSignatureContract("0CXXaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78")){
        console.log("2nd Byte is 33 Test: [Pass]");
    } else { console.log("2nd Byte is 33 Test: [Fail]");}
    //index 35 should be PUSHNULL
    if(!isSignatureContract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaXX4195440d78")){
        console.log("Index 35 is PUSHNULL Test: [Pass]");
    } else { console.log("Index 35 is PUSHNULL Test: [Fail]");}
    //index 36 should be SYSCALL
    if(!isSignatureContract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0BXX95440d78")){
        console.log("Index 36 is SYSCALL Test: [Pass]");
    } else { console.log("Index 36 is SYSCALL Test: [Fail]");}
    //last 4 should be identifier
    if(!isSignatureContract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B41XXXXXXXX")){
        console.log("Correct Identifier Test: [Pass]");
    } else { console.log("Correct identifier Test: [Fail]");}
    //correct script
    if(isSignatureContract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78")){
        console.log("Correct Signature Test: [Pass]");
    } else { console.log("Correct Signature Test: [Fail]");}

}

function testIsMultisigContract(){
    const multiSigGood = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0103000b41138defaf";
    let multiSigTest = "01";
    console.log("TESTING MULTISIG CONTRACT ...");
    //Length
    if(!isMultisigContract(multiSigTest)){
        console.log("Correct Length Test: [Pass]");
    } else { console.log("Correct Length Test: [Fail]");}
    //Invalid Public Keys (2nd key too short)
    multiSigTest = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddXXdddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0103000b41138defaf";
    if(!isMultisigContract(multiSigTest)){
        console.log("Invalid Pub Key Test: [Pass]");
    } else { console.log("Invalid Pub Key Test: [Fail]");}
    //Invlie Public Keys (Invalid PUSHDATA)
    multiSigTest = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0XXXdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0103000b41138defaf"
    if(!isMultisigContract(multiSigTest)){
        console.log("Invalid Pub Key Test 2: [Pass]");
    } else { console.log("Invalid Pub Key Test 2: [Fail]");}
    //Key Count lower than given count (have 3 sigs claim 2)
    multiSigTest = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0102000b41138defaf"
    if(!isMultisigContract(multiSigTest)){
        console.log("Invalid Key Count Test: [Pass]");
    } else { console.log("Invalid Key Count Test: [Fail]");}
    //Invalid Tail
    multiSigTest = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0102000b41138defXf"
    if(!isMultisigContract(multiSigTest)){
        console.log("Invalid Tail Test: [Pass]");
    } else { console.log("Invalid Tail Test: [Fail]");}
    //correct script
    if(isMultisigContract(multiSigGood)){
        console.log("Correct Signature Test: [Pass]");
    } else { console.log("Correct Signature Test: [Fail]");}


};

testIsSignatureContract();
testIsMultisigContract();