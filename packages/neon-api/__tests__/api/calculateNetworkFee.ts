import { tx, u, wallet } from "@cityofzion/neon-core";
import { calculateNetworkFee } from "../../src/api";

describe("calculateNetworkFee", () => {
  // Test data was obtained by running a node, opening wallet and asking the node to construct the transaction.
  test("multisig", () => {
    const txn = new tx.Transaction({
      version: 0,
      nonce: 2100959157,
      validUntilBlock: 2102400,
      signers: [
        {
          account: "4120c7c8443dd30af91a8280d151fd38d1b9be91",
          scopes: "CalledByEntry",
        },
      ],
      script:
        "01e8030c141c6815c82911c88c285d6f09cf8a65c4a7e6a6360c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c1425059ecb4878d3a875f91c51ceded330d4575fde41627d5b523801e8030c14fca95e252be6a90b54546707e77dbc9b3ec361540c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c1425059ecb4878d3a875f91c51ceded330d4575fde41627d5b523801e8030c14534609aa7b15b0a527b79ea6e1ac36bb39b28da30c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c1425059ecb4878d3a875f91c51ceded330d4575fde41627d5b523801e8030c144d7c261bbc696c96d7e24af78e3654c4c7d81a8a0c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c1425059ecb4878d3a875f91c51ceded330d4575fde41627d5b523801e8030c149644ea72cecd5ff20e4e40445c03a59cef94436b0c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c1425059ecb4878d3a875f91c51ceded330d4575fde41627d5b52380300e87648170000000c141c6815c82911c88c285d6f09cf8a65c4a7e6a6360c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c14bcaf41d684c7d4ad6ee0d99da9707b9d1f0c8e6641627d5b52380300e87648170000000c14fca95e252be6a90b54546707e77dbc9b3ec361540c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c14bcaf41d684c7d4ad6ee0d99da9707b9d1f0c8e6641627d5b52380300e87648170000000c14534609aa7b15b0a527b79ea6e1ac36bb39b28da30c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c14bcaf41d684c7d4ad6ee0d99da9707b9d1f0c8e6641627d5b52380300e87648170000000c144d7c261bbc696c96d7e24af78e3654c4c7d81a8a0c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c14bcaf41d684c7d4ad6ee0d99da9707b9d1f0c8e6641627d5b52380300e87648170000000c149644ea72cecd5ff20e4e40445c03a59cef94436b0c1491beb9d138fd51d180821af90ad33d44c8c7204113c00c087472616e736665720c14bcaf41d684c7d4ad6ee0d99da9707b9d1f0c8e6641627d5b5238",
    });
    const feePerByte = u.BigInteger.fromNumber(1000);
    const signingAccounts = [
      new wallet.Account({
        address: "NZCbeSDnadGsacF69zVvfaB4zDKMioMHJV",
        label: "origin multisig",
        isdefault: false,
        lock: false,
        key: "6PYR6RrPk7JKXgv9ofCBtebsKSkUMMHJ1pk1tW235wTqVh4w6xahehZF9N",
        contract: {
          script:
            "EQwhAxGKK3li\u002BgIm\u002BjWs9dIkhVtpHH6peNGv4sU4Yx1fe\u002BheEQtBE43vrw==",
          parameters: [
            {
              name: "parameter0",
              type: "Signature",
            },
          ],
          deployed: false,
        },
        extra: {
          publicKey:
            "03118a2b7962fa0226fa35acf5d224855b691c7ea978d1afe2c538631d5f7be85e",
        },
      }),
    ];

    const result = calculateNetworkFee(txn, feePerByte, signingAccounts);

    expect(result.toString()).toBe("2063450");
  });
});
