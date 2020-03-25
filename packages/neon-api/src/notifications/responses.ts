export interface EventParam {
  type: string;
  value: string;
}

export interface NotificationMessage {
  contract: string;
  txid: string;
  event: EventParam[];
}
