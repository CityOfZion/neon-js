import { u } from "@cityofzion/neon-core";
import * as abi from "../src/abi";

const name = 'test';

test("resolve", () => {
  const resultFunction = abi.resolve(name);
  const resultScript = resultFunction().str;
  expect(resultScript).toEqual('0020d38e19c187c0eb277533f1657ba284e1967c9b09a8027536d6ee469f21d382b1046164647253c1077265736f6c766567c72871904920c0d977326620e4754a6c11878334');
});
