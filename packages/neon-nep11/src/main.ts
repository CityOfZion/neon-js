import { wallet } from "@cityofzion/neon-core";

const log = logging.default("nep11");

/**
 * Creates a Iterator script for the tokensOf method of a NEP-11 contract
 * @param account The account to query.
 * @param contractHash The hash of the contract.
 * @param page The page to check.
 * @parap maxResults The maximum amount of items to retrieve at a time.
 */
export async function buildIteratorScript(
  account: wallet.Account,
  contractHash: string,
  page: int,
  maxResults: int
): Promise<string> {
  return new Promise((resolve) => {
    const { scriptHash } = account;

    const file = path.join(__dirname, 'load.py');
    const pythonProcess = spawn('python3', [file, contractHash, scriptHash, page, maxResults]);
    pythonProcess.stdout.on('data', (data) => {
      let script = data.toString('utf8');
      script = script.replace(/^\s+|\s+$/g, '');
      resolve(script);
    });

    setTimeout(() => {
      resolve('');
    }, 7000);
  }
}
