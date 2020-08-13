import {
  ContractGroup,
  ContractGroupLike,
  ContractGroupJson,
} from "./ContractGroup";
import { ContractAbi, ContractAbiLike, ContractAbiJson } from "./ContractAbi";
import {
  ContractPermission,
  ContractPermissionLike,
  ContractPermissionJson,
} from "./ContractPermission";

export interface ContractManifestLike {
  groups: ContractGroupLike[];
  abi: ContractAbiLike;
  supportedStandards: string[];
  permissions: ContractPermissionLike[];
  trusts: "*" | string[];
  safeMethods: "*" | string[];
  features: {
    storage: boolean;
    payable: boolean;
  };
  extra?: unknown;
}

export interface ContractManifestJson {
  groups: ContractGroupJson[];
  features: {
    storage: boolean;
    payable: boolean;
  };
  supportedstandards: string[];
  abi: ContractAbiJson;
  permissions: ContractPermissionJson[];
  trusts: "*" | string[];
  safemethods: "*" | string[];
  extra?: unknown;
}

export class ContractManifest {
  public static readonly MAX_LENGTH = 2048;
  public groups: ContractGroup[];
  // #region features
  public hasStorage: boolean;
  public payable: boolean;
  // #endregion
  public supportedStandards: string[];
  public abi: ContractAbi;
  public permissions: ContractPermission[];
  public trusts: "*" | string[];
  public safeMethods: "*" | string[];
  public extra: unknown;

  public static fromJson(json: ContractManifestJson): ContractManifest {
    return new ContractManifest({
      groups: json.groups.map((g) => ContractGroup.fromJson(g)),
      features: json.features,
      abi: ContractAbi.fromJson(json.abi),
      supportedStandards: json.supportedstandards,
      permissions: json.permissions,
      trusts: json.trusts,
      safeMethods: json.safemethods,
      extra: json.extra,
    });
  }

  public constructor(obj: Partial<ContractManifestLike>) {
    const {
      groups = [],
      features: { storage = false, payable = false } = {},
      abi = {},
      supportedStandards = [],
      permissions = [],
      trusts = "*",
      safeMethods = "*",
      extra,
    } = obj;
    this.groups = groups.map((group) => new ContractGroup(group));
    this.hasStorage = storage;
    this.payable = payable;
    this.supportedStandards = supportedStandards;
    this.abi = new ContractAbi(abi);
    this.permissions = permissions.map(
      (permission) => new ContractPermission(permission)
    );
    this.trusts = trusts;
    this.safeMethods = safeMethods;
    this.extra = extra;
  }

  public get hash(): string {
    return this.abi.hash;
  }

  public canCall(manifest: ContractManifest, method: string): boolean {
    return this.permissions.some((permission) => {
      const { contract, methods } = permission;
      if (permission.isHash) {
        if (contract !== manifest.hash) {
          return false;
        }
      } else if (permission.isGroup) {
        if (manifest.groups.every((group) => group.pubKey !== contract)) {
          return false;
        }
      }
      return (
        methods === "*" || methods.length === 0 || methods.includes(method)
      );
    });
  }

  public toJson(): ContractManifestJson {
    return {
      groups: this.groups.map((g) => g.toJson()),
      features: {
        storage: this.hasStorage,
        payable: this.payable,
      },
      supportedstandards: this.supportedStandards,
      abi: this.abi.toJson(),
      permissions: this.permissions.map((p) => p.toJson()),
      trusts: this.trusts,
      safemethods: this.safeMethods,
      extra: this.extra,
    };
  }

  public export(): ContractManifestLike {
    return {
      groups: this.groups.map((group) => group.export()),
      features: {
        storage: this.hasStorage,
        payable: this.payable,
      },
      supportedStandards: this.supportedStandards,
      abi: this.abi.export(),
      permissions: this.permissions.map((permission) => permission.export()),
      trusts: this.trusts,
      safeMethods: this.safeMethods,
      extra: this.extra,
    };
  }
}

export default ContractManifest;
