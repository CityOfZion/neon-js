/** Sets the API switch to the provided value */
export function setApiSwitch(newSetting: number): void

/**
 * Sets the freeze setting for the API switch. A frozen switch will not dynamically shift towards the other provider when the main provider fails.
 *  This does not mean that we do not use the other provider. This only means that we will not change our preference for the main provider.
 */
export function setSwitchFreeze(newSetting: boolean): void
