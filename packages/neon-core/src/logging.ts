import loglevel from "loglevel";
import prefix from "loglevel-plugin-prefix";

prefix.reg(loglevel);
loglevel.setDefaultLevel("silent");

export function setAll(lvl: loglevel.LogLevelDesc): void {
  Object.keys(loglevel.getLoggers()).map((key) => {
    const lg = loglevel.getLogger(key);
    lg.setLevel(lvl as loglevel.LogLevelDesc);
  });
}

const fn = (level: string, name?: string, timestamp?: Date): string => {
  const ts = timestamp ? timestamp : new Date().toUTCString();
  level = level.toUpperCase();
  return `[${ts}] (${name}) ${level}: `;
};

export default (label: string): loglevel.Logger => {
  const l = loglevel.getLogger(label);
  prefix.apply(l, { format: fn });
  return l;
};
export const logger = loglevel;
