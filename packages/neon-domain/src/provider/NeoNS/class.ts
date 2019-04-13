import { logging } from "../../../../neon-core/src";
import { DomainProvider } from "../common";
import { resolveDomain } from "./core";

const log = logging.default("neon-domain");

export class NeoNS implements DomainProvider {
  private contract: string;

  public get name() {
    return `NeoNs[${this.contract}]`;
  }

  constructor(contract: string) {
    this.contract = contract;
    log.info(`Created NeoNS Provider: ${this.contract}`);
  }

  public resolveDomain(url: string, domain: string): Promise<string> {
    return resolveDomain(url, this.contract, domain);
  }
}

export default NeoNS;
