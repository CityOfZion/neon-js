export function setAll(lvl: string): void {}

const fackLoger = {
  info: (...args: any) => {},
  warn: (...args: any) => {},
  debug: (...args: any) => {},
  error: (...args: any) => {},
  default: (...args: any) => {}
}


const fn = (level: string, name?: string, timestamp?: Date) => {
  const ts = timestamp ? timestamp : new Date().toUTCString();
  level = level.toUpperCase();
  return `[${ts}] (${name}) ${level}: `;
};

export default (label: string) => {
  return fackLoger
};
export const logger = fackLoger;
