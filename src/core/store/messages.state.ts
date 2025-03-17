export interface Message {
  id?: string;
  email: string;
  message: string;
  date?: any;
}

export interface MessagesState {
  submitting: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
  messages: Message[];
}

export const initialMessagesState: MessagesState = {
  loading: false,
  submitting: false,
  success: false,
  error: null,
  messages: []
};