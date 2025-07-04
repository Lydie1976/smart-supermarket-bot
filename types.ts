
export enum MessageSender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
}
