import { Network } from "./rpc";

export const networks: { [net: string]: Network } = {};

export let timeout = {
  ping: 2000,
  rpc: 30000
};
