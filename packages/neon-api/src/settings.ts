import { httpsOnly } from "./provider/common";
import * as neonDB from "./provider/neonDB";
import * as neoscan from "./provider/neoscan";
const settings = {
  httpsOnly
};

export const internalSettings = {
  apiSwitch: 0,
  switchFrozen: false,
  providers: [neonDB, neoscan]
};
export default settings;
