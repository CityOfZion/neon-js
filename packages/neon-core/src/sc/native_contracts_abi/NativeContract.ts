export abstract class NativeContract {
  public constructor(name = "Native") {
    console.log(`Initiating ${name} contract`);
  }

  abstract buildScript(method: string, args?: any[]): string;

  public supportedStandards(): string {
    return this.buildScript("supportedStandards");
  }
}
