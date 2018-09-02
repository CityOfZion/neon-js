import loglevel from "loglevel";

declare module "loglevel" {
  interface Logger {
    getLoggers(): { [name: string]: Logger };
  }
}
