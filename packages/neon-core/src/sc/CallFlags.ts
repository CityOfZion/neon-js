export enum CallFlags {
  None = 0,
  ReadStates = 1 << 0,
  WriteStates = 1 << 1,
  AllowCall = 1 << 2,
  AllowNotify = 1 << 3,
  States = ReadStates | WriteStates,
  ReadOnly = ReadStates | AllowCall,
  All = States | AllowCall | AllowNotify,
}

export default CallFlags;
