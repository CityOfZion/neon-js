import apiPlugin from "@cityofzion/neon-api";
import * as neonCore from "@cityofzion/neon-core";
import nepPlugin from "@cityofzion/neon-nep5";

let neonJs = apiPlugin(neonCore);
neonJs = nepPlugin(neonCore);


export default neonJs;
