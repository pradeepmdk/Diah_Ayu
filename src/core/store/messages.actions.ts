import { createAction, props } from '@ngrx/store';
import { Message } from './messages.state';

export const loadMessages = createAction('[Messages] Load Messages');
export const loadMessagesSuccess = createAction(
  '[Messages] Load Messages Success',
  props<{ messages: Message[] }>()
);
export const loadMessagesFailure = createAction(
  '[Messages] Load Messages Failure',
  props<{ error: string }>()
);

export const submitMessage = createAction(
  '[Messages] Submit Message',
  props<{ message: Message }>()
);
export const submitMessageSuccess = createAction('[Messages] Submit Message Success');
export const submitMessageFailure = createAction(
  '[Messages] Submit Message Failure',
  props<{ error: string }>()
);

export const resetSuccess = createAction('[Messages] Reset Success');
export const resetError = createAction('[Messages] Reset Error');