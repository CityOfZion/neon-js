import { NeonObject } from "../model";

export interface ProtocolLike {
  magic: number;
  addressVersion: number;
  standbyValidators: string[];
  seedList: string[];
}

/**
 * This is the ProtocolConfiguration field found in protocol.json
 */
export interface ProtocolJSON {
  Magic: number;
  AddressVersion: number;
  StandbyValidators: string[];
  SeedList: string[];
}

function compareStrings(current: string[], other: string[]): boolean {
  if (current.length !== other.length) {
    return false;
  }
  for (let i = 0; i < current.length; i++) {
    if (current[i] !== other[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Model of the protocol configuration file used by the C# implementation.
 */
export class Protocol implements NeonObject<ProtocolLike> {
  public magic: number;
  public addressVersion: number;
  public standbyValidators: string[];
  public seedList: string[];

  public constructor(config: Partial<ProtocolLike & ProtocolJSON> = {}) {
    this.magic = config.magic ?? config.Magic ?? 0;
    this.addressVersion = config.addressVersion ?? config.AddressVersion ?? 53;
    this.standbyValidators =
      config.standbyValidators ?? config.StandbyValidators ?? [];
    this.seedList = config.seedList ?? config.SeedList ?? [];
  }

  public get [Symbol.toStringTag](): string {
    return "Protocol";
  }

  public export(): ProtocolLike {
    return {
      magic: this.magic,
      addressVersion: this.addressVersion,
      standbyValidators: this.standbyValidators,
      seedList: this.seedList,
    };
  }

  public toConfiguration(): ProtocolJSON {
    return {
      Magic: this.magic,
      AddressVersion: this.addressVersion,
      StandbyValidators: this.standbyValidators,
      SeedList: this.seedList,
    };
  }

  public equals(other: Partial<ProtocolLike & ProtocolJSON>): boolean {
    return (
      this.magic === (other.magic ?? other.Magic) &&
      this.addressVersion === (other.addressVersion ?? other.AddressVersion) &&
      compareStrings(this.seedList, other.seedList ?? other.SeedList ?? []) &&
      compareStrings(
        this.standbyValidators,
        other.standbyValidators ?? other.StandbyValidators ?? [],
      )
    );
  }
}

export default Protocol;
