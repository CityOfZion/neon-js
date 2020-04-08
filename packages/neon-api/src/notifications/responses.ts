interface EventParam {
  type: string;
  value: string;
}

interface NotificationMessage {
  contract: string;
  txid: string;
  event: EventParam[];
}

type CallbackFunction = (message: NotificationMessage) => void;

export { EventParam, NotificationMessage, CallbackFunction };
