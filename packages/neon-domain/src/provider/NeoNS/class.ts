import { logging } from "@cityofzion/neon-core";
import { DomainProvider } from "../common";
import {
    resolveDomain 
} from "./core";

const log = logging.default("neon-domain");

export class NeonNS implements DomainProvider {
  private contract: string;

  public get name() {
      return `NeonNs[${this.contract}]`;
  }

  constructor(contract: string) {
    this.contract = contract;
    log.info(`Created NeonNS DomainProvider: ${this.contract}`);
  }

  public resolveDomain(url: string, domain: string, tld: string): Promise<string> {
    return resolveDomain(url, this.contract, domain, tld);
  }
}

export default NeonNS;
