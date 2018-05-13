import { Network } from "./rpc";

import { strategyFunction } from "./transactions";

export var networks: { [key: string]: Network };

export var httpsOnly: boolean;

export var defaultCalculationStrategy: strategyFunction;

export var timeout: { [key: string]: number };

export function addNetwork(network: Network, override?: boolean): boolean;

export function removeNetwork(name: string): boolean;

declare const semantic: {
  add: {
    network: (network: Network, override?: boolean) => boolean;
  };

  remove: {
    network: (name: string) => boolean;
  };
};

export default semantic;
