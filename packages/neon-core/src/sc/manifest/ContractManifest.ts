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
  features: Record<string, unknown>;
  abi: ContractAbiLike;
  supportedStandards: string[];
  permissions: ContractPermissionLike[];
  trusts: "*" | string[];
  extra?: unknown;
}

export interface ContractManifestJson {
  name: string;
  groups: ContractGroupJson[];
  features: Record<string, unknown>;
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
  public features: Record<string, unknown>;
  public supportedStandards: string[];
  public abi: ContractAbi;
  public permissions: ContractPermission[];
  public trusts: "*" | string[];
  public extra: unknown;

  public static fromJson(json: ContractManifestJson): ContractManifest {
    if (Object.keys(json.features).length != 0) {
      throw new Error("Features is reserved for future use and must be empty");
    }
    return new ContractManifest({
      name: json.name,
      groups: json.groups.map((g) => ContractGroup.fromJson(g)),
      features: {},
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
      features = {},
      abi = {},
      supportedStandards = [],
      permissions = [],
      trusts = "*",
      extra,
    } = obj;
    this.name = name;
    this.groups = groups.map((group) => new ContractGroup(group));
    this.features = features;
    this.supportedStandards = supportedStandards;
    this.abi = new ContractAbi(abi);
    this.permissions = permissions.map(
      (permission) => new ContractPermission(permission)
    );
    this.trusts = trusts;
    this.extra = extra;
  }

  public toJson(): ContractManifestJson {
    return {
      name: this.name,
      groups: this.groups.map((g) => g.toJson()),
      features: this.features,
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
      features: this.features,
      supportedStandards: this.supportedStandards,
      abi: this.abi.export(),
      permissions: this.permissions.map((permission) => permission.export()),
      trusts: this.trusts,
      extra: this.extra,
    };
  }
}

export default ContractManifest;
