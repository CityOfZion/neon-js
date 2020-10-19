import { HexString } from "@cityofzion/neon-core/lib/u";
import { CONST } from "@cityofzion/neon-core";

export interface CommonConfig {
  networkMagic: number;
  rpcAddress: string;
  prioritisationFee?: number;
  blocksTillExpiry?: number;
}

export class Nep5Contract {
  public contractHash: HexString;
  protected config: CommonConfig;

  public constructor(contractHash: HexString, config: CommonConfig) {
    this.contractHash = contractHash;
    this.config = config;
  }
}

export class NEOContract extends Nep5Contract {
  constructor(config: CommonConfig) {
    super(HexString.fromHex(CONST.ASSET_ID.NEO), config);
  }
  public async claimGas(address: string): Promise<void> {
  }
  public async getUnclaimedGas(address: string): Promise<number> {
    return 0;
  }
}
export class GASContract extends Nep5Contract {
  constructor(config: CommonConfig) {
    super(HexString.fromHex(CONST.ASSET_ID.GAS), config);
  }
}
