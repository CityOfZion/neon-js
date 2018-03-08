export interface scriptParams {
  scriptHash: string,
  operation?: string,
  args?: Array<any> | string | number | boolean,
  useTailCall?: boolean
}

/** A wrapper method around ScripBuilder for creating a VM script. */
export function createScript({ scriptHash, operation, args, useTailCall }: scriptParams): string

interface DeployScriptConfig {
  script: string,
  name: string,
  version: string,
  author: string,
  email: string,
  description: string,
  needsStorage?: boolean,
  returnType?: string,
  paramaterList?: string
}

/** Generates script for deploying contract */
export function generateDeployScript({
  script,
  name,
  version,
  author,
  email,
  description,
  needsStorage,
  returnType,
  paramaterList
}: DeployScriptConfig): string
