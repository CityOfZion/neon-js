import { DEFAULT_SYSFEE } from "../consts";
import { compareObject } from "../helper";

export interface ProtocolLike {
  magic: number;
  addressVersion: number;
  standbyValidators: string[];
  seedList: string[];
  systemFee: { [key: string]: number };
}

export interface ProtocolJSON {
  Magic: number;
  AddressVersion: number;
  StandbyValidators: string[];
  SeedList: string[];
  SystemFee: { [key: string]: number };
}

function compareArrays(current: any[], other: any[]): boolean {
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
export class Protocol {
  public magic: number;
  public addressVersion: number;
  public standbyValidators: string[];
  public seedList: string[];
  public systemFee: { [key: string]: number };

  public constructor(config: Partial<ProtocolLike & ProtocolJSON> = {}) {
    this.magic = config.magic || config.Magic || 0;
    this.addressVersion = config.addressVersion || config.AddressVersion || 23;
    this.standbyValidators =
      config.standbyValidators || config.StandbyValidators || [];
    this.seedList = config.seedList || config.SeedList || [];
    this.systemFee = Object.assign(
      {},
      config.systemFee || config.SystemFee || DEFAULT_SYSFEE
    );
  }

  public get [Symbol.toStringTag](): string {
    return "Protocol";
  }

  public export(): ProtocolJSON {
    return {
      Magic: this.magic,
      AddressVersion: this.addressVersion,
      StandbyValidators: this.standbyValidators,
      SeedList: this.seedList,
      SystemFee: this.systemFee,
    };
  }

  public equals(other: Partial<ProtocolLike & ProtocolJSON>): boolean {
    return (
      this.magic === (other.magic || other.Magic) &&
      this.addressVersion === (other.addressVersion || other.AddressVersion) &&
      compareArrays(this.seedList, other.seedList || other.SeedList || []) &&
      compareArrays(
        this.standbyValidators,
        other.standbyValidators || other.StandbyValidators || []
      ) &&
      compareObject(this.systemFee, other.systemFee || other.SystemFee || {})
    );
  }
}

export default Protocol;
