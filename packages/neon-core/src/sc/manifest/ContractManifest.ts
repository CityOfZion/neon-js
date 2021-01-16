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
  name: string;
  groups: ContractGroupLike[];
  abi: ContractAbiLike;
  supportedStandards: string[];
  permissions: ContractPermissionLike[];
  trusts: "*" | string[];
  extra?: unknown;
}

export interface ContractManifestJson {
  name: string;
  groups: ContractGroupJson[];
  supportedstandards: string[];
  abi: ContractAbiJson;
  permissions: ContractPermissionJson[];
  trusts: "*" | string[];
  extra?: unknown;
}

export class ContractManifest {
  public static readonly MAX_LENGTH = 0xffff;
  public name: string;
  public groups: ContractGroup[];
  public supportedStandards: string[];
  public abi: ContractAbi;
  public permissions: ContractPermission[];
  public trusts: "*" | string[];
  public extra: unknown;

  public static fromJson(json: ContractManifestJson): ContractManifest {
    return new ContractManifest({
      name: json.name,
      groups: json.groups.map((g) => ContractGroup.fromJson(g)),
      abi: ContractAbi.fromJson(json.abi),
      supportedStandards: json.supportedstandards,
      permissions: json.permissions,
      trusts: json.trusts,
      extra: json.extra,
    });
  }

  public constructor(obj: Partial<ContractManifestLike>) {
    const {
      name = "",
      groups = [],
      abi = {},
      supportedStandards = [],
      permissions = [],
      trusts = "*",
      extra,
    } = obj;
    this.name = name;
    this.groups = groups.map((group) => new ContractGroup(group));
    this.supportedStandards = supportedStandards;
    this.abi = new ContractAbi(abi);
    this.permissions = permissions.map(
      (permission) => new ContractPermission(permission)
    );
    this.trusts = trusts;
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
      name: this.name,
      groups: this.groups.map((g) => g.toJson()),
      supportedstandards: this.supportedStandards,
      abi: this.abi.toJson(),
      permissions: this.permissions.map((p) => p.toJson()),
      trusts: this.trusts,
      extra: this.extra,
    };
  }

  public export(): ContractManifestLike {
    return {
      name: this.name,
      groups: this.groups.map((group) => group.export()),
      supportedStandards: this.supportedStandards,
      abi: this.abi.export(),
      permissions: this.permissions.map((permission) => permission.export()),
      trusts: this.trusts,
      extra: this.extra,
    };
  }
}

export default ContractManifest;
