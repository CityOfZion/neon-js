/// <reference types="loglevel" />
import log from "loglevel";
declare module "loglevel" {
  interface Logger {
    getLoggers(): { [name: string]: log.Logger };
  }
}
