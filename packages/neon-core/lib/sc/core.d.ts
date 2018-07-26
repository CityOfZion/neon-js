import ScriptBuilder, { ScriptIntent } from "./ScriptBuilder";
export declare function createScript(...intents: Array<ScriptIntent | string>): string;
export interface DeployParams {
    script: string;
    name: string;
    version: string;
    author: string;
    email: string;
    description: string;
    needsStorage: boolean;
    returnType: string;
    parameterList: string;
}
/**
 * Generates script for deploying contract
 */
export declare function generateDeployScript(params: DeployParams): ScriptBuilder;
//# sourceMappingURL=core.d.ts.map