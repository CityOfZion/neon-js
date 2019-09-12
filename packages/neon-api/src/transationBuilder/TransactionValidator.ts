export function validate(): Promise<boolean> {}

export function validateProps(): Promise<boolean> {}

export async function validateIntents(): Promise<boolean> {
  return false;
}

export async function validateSystemFee(
  autoFix: boolean = false
): Promise<boolean> {
  const { state, gas_consumed } = await this._rpc.invokeScript(
    this.transactionProps.script!
  );
  if (state.indexOf("HALT") >= 0) {
    log.info(
      `transaction script will be excuted successfullyd: ${this.transactionProps.script}`
    );
  } else {
  }
  const systemFee = new Fixed8(parseFloat(gas_consumed));
  const assignedSystemFee = new Fixed8(this.transactionProps.systemFee || 0);
  if (autoFix && !assignedSystemFee.equals(systemFee)) {
    log.info(
      `Will change systemFee from ${assignedSystemFee || 0} to ${systemFee}`
    );
    this.transactionProps.systemFee = systemFee;
    return true;
  }
  if (systemFee.isGreaterThan(assignedSystemFee)) {
    log.error(
      `Need systemFee at least ${systemFee}, only ${assignedSystemFee} is assigned`
    );
    return false;
  }
  return true;
}

export function validateNetworkFee(): Promise<boolean> {}

export function validateSigning(): Promise<boolean> {}
