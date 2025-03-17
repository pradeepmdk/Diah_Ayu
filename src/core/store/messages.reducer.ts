import { createReducer, on } from '@ngrx/store';
import { initialMessagesState } from './messages.state';
import * as MessagesActions from './messages.actions';

export const messagesFeatureKey = 'messages';

export const messagesReducer = createReducer(
  initialMessagesState,
  
  on(MessagesActions.loadMessages, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(MessagesActions.loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    loading: false,
    messages
  })),
  
  on(MessagesActions.loadMessagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(MessagesActions.submitMessage, state => ({
    ...state,
    submitting: true,
    error: null,
    success: false
  })),
  
  on(MessagesActions.submitMessageSuccess, state => ({
    ...state,
    submitting: false,
    success: true
  })),
  
  on(MessagesActions.submitMessageFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
    success: false
  })),

  
  on(MessagesActions.resetSuccess, state => ({
    ...state,
    success: false
  })),
  
  on(MessagesActions.resetError, state => ({
    ...state,
    error: null
  }))
);