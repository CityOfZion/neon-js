import { ContractGroup, ContractGroupLike } from "./ContractGroup";
import { ContractFeatures, ContractFeaturesLike } from "./ContractFeatures";
import { ContractAbi, ContractAbiLike } from "./ContractAbi";
import {
  ContractPermission,
  ContractPermissionLike
} from "./ContractPermission";
import { WildCardContainer } from "./WildCardContainer";
import { ContractMethodDescriptor } from "./ContractMethodDescriptor";
import { ContractEventDescriptor } from "./ContractEventDescriptor";

export interface ContractManifestLike {
  groups: ContractGroupLike[];
  features: ContractFeaturesLike;
  abi: ContractAbiLike;
  permissions: ContractPermissionLike[];
  trusts: "*" | string[];
  safeMethods: "*" | string[];
}

export class ContractManifest {
  public static readonly MAX_LENGTH = 2048;
  public hash: string;
  public groups: ContractGroup[];
  public features: ContractFeatures;
  public abi: ContractAbi;
  public permissions: ContractPermission[];
  public trusts: WildCardContainer;
  public safeMethods: WildCardContainer;

  public constructor(obj: Partial<ContractManifestLike>) {
    const {
      groups = [],
      features: { payable, storage } = { payable: false, storage: false },
      abi = {},
      permissions = [],
      trusts = "*",
      safeMethods = "*"
    } = obj;
    this.groups = groups.map(group => new ContractGroup(group));
    this.features = new ContractFeatures(storage, payable);
    this.abi = new ContractAbi(abi);
    this.permissions = permissions.map(
      permission => new ContractPermission(permission)
    );
    this.trusts = WildCardContainer.fromSerialized(trusts);
    this.safeMethods = WildCardContainer.fromSerialized(safeMethods);
    this.hash = this.abi.hash;
  }

  public static createDefault(hash: string): ContractManifest {
    const manifest = new ContractManifest({});
    manifest.permissions = [ContractPermission.defaultPermission];
    manifest.hash = hash;
    manifest.abi = new ContractAbi({
      hash,
      entryPoint: ContractMethodDescriptor.DEFAULT_ENTRY_POINT,
      events: [new ContractEventDescriptor({})],
      methods: [new ContractMethodDescriptor({})]
    });
    manifest.features = new ContractFeatures();
    manifest.groups = [new ContractGroup({})];
    manifest.safeMethods = WildCardContainer.from();
    manifest.trusts = WildCardContainer.from();
    return manifest;
  }

  public canCall(manifest: ContractManifest, method: string): boolean {
    return this.permissions.some(permission => {
      const { contract, methods } = permission;
      if (contract.isHash) {
        if (contract.hash! !== manifest.hash) {
          return false;
        }
      } else if (contract.isGroup) {
        if (manifest.groups.every(group => group.pubKey !== contract.group)) {
          return false;
        }
      }
      return methods.isWildcard || methods.export().includes(method);
    });
  }

  public static parse(json: string): ContractManifest {
    return new ContractManifest(JSON.parse(json));
  }

  public export(): ContractManifestLike {
    return {
      groups: this.groups.map(group => group.export()),
      features: this.features.export(),
      abi: this.abi.export(),
      permissions: this.permissions.map(permission => permission.export()),
      trusts: this.trusts.export(),
      safeMethods: this.safeMethods.export()
    };
  }

  public toString(): string {
    return JSON.stringify(this.export());
  }

  // TODO
  public isValid(): boolean {
    return true;
  }
}
