var test = require("../../helpers/signatureVerification.ts");

function test_is_signature_contract(){
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
    if(!test.is_signature_contract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78")){
        console.log("Length Test: [Pass]");
    } else { console.log("Length Test: [Fail]");}
    //FIRST BYTE should be PUSHDATA1
    if(!test.is_signature_contract("XX21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78")){
        console.log("FirstByte is PUSHDATA1 Test: [Pass]");
    } else { console.log("FirstByte is PUSHDATA1 Test: [Fail]");}
    //2nd BYTE should be 33
    if(!test.is_signature_contract("0CXXaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78")){
        console.log("2nd Byte is 33 Test: [Pass]");
    } else { console.log("2nd Byte is 33 Test: [Fail]");}
    //index 35 should be PUSHNULL
    if(!test.is_signature_contract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaXX4195440d78")){
        console.log("Index 35 is PUSHNULL Test: [Pass]");
    } else { console.log("Index 35 is PUSHNULL Test: [Fail]");}
    //index 36 should be SYSCALL
    if(!test.is_signature_contract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0BXX95440d78")){
        console.log("Index 36 is SYSCALL Test: [Pass]");
    } else { console.log("Index 36 is SYSCALL Test: [Fail]");}
    //last 4 should be identifier
    if(!test.is_signature_contract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B41XXXXXXXX")){
        console.log("Correct Identifier Test: [Pass]");
    } else { console.log("Correct identifier Test: [Fail]");}
    //correct script
    if(test.is_signature_contract("0C21aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0B4195440d78")){
        console.log("Correct Signature Test: [Pass]");
    } else { console.log("Correct Signature Test: [Fail]");}

}

function test_is_multisig_contract(){
    const multi_sig_good = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0103000b41138defaf";
    let multi_sig_test = "01";
    console.log("TESTING MULTISIG CONTRACT ...");
    //Length
    if(!test.is_multisig_contract(multi_sig_test)){
        console.log("Correct Length Test: [Pass]");
    } else { console.log("Correct Length Test: [Fail]");}
    //Invalid Public Keys (2nd key too short)
    multi_sig_test = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddXXdddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0103000b41138defaf";
    if(!test.is_multisig_contract(multi_sig_test)){
        console.log("Invalid Pub Key Test: [Pass]");
    } else { console.log("Invalid Pub Key Test: [Fail]");}
    //Invlie Public Keys (Invalid PUSHDATA)
    multi_sig_test = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0XXXdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0103000b41138defaf"
    if(!test.is_multisig_contract(multi_sig_test)){
        console.log("Invalid Pub Key Test 2: [Pass]");
    } else { console.log("Invalid Pub Key Test 2: [Fail]");}
    //Key Count lower than given count (have 3 sigs claim 2)
    multi_sig_test = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0102000b41138defaf"
    if(!test.is_multisig_contract(multi_sig_test)){
        console.log("Invalid Key Count Test: [Pass]");
    } else { console.log("Invalid Key Count Test: [Fail]");}
    //Invalid Tail
    multi_sig_test = "0102000c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0c21dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd0102000b41138defXf"
    if(!test.is_multisig_contract(multi_sig_test)){
        console.log("Invalid Tail Test: [Pass]");
    } else { console.log("Invalid Tail Test: [Fail]");}
    //correct script
    if(test.is_multisig_contract(multi_sig_good)){
        console.log("Correct Signature Test: [Pass]");
    } else { console.log("Correct Signature Test: [Fail]");}


};

test_is_signature_contract();
test_is_multisig_contract();
