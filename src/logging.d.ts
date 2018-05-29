import * as loglevel from "loglevel";

declare function label(label: string): loglevel.Logger;

export default label;

export { loglevel as logger };
