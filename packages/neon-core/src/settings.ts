import { Network } from "./rpc";
import { defaultCalculationStrategy } from "./tx";

export const networks: { [net: string]: Network } = {};

export { defaultCalculationStrategy };

export const timeout = {
  ping: 2000,
  rpc: 30000,
};
