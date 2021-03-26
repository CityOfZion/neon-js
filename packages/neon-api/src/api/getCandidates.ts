import { rpc, sc, u } from "@cityofzion/neon-core";

export interface Candidate {
  publicKey: string;
  votes: number;
}

type getCandidatesStack = [
  {
    type: "Array";
    value: {
      type: "Struct";
      value: [
        { type: "ByteArray"; value: string },
        { type: "Integer"; value: number }
      ];
    }[];
  }
];
export async function getCandidates(
  client: rpc.NeoServerRpcClient
): Promise<Candidate[]> {
  const script = new sc.ScriptBuilder()
    .emitContractCall(sc.NeoContract.INSTANCE.getCandidates())
    .build();

  const res = await client.invokeScript(u.HexString.fromHex(script));
  const arrayOfCandidates = res.stack as getCandidatesStack;
  return arrayOfCandidates[0].value.map((i) => {
    return {
      publicKey: u.HexString.fromBase64(i.value[0].value).toBigEndian(),
      votes: i.value[1].value,
    };
  });
}
