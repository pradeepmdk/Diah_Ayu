import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessagesState } from './messages.state';
import { messagesFeatureKey } from './messages.reducer';

export const selectMessagesState = createFeatureSelector<MessagesState>(messagesFeatureKey);

export const selectMessages = createSelector(
  selectMessagesState,
  state => state.messages
);

export const selectLoading = createSelector(
  selectMessagesState,
  state => state.loading
);

export const selectSubmitting = createSelector(
  selectMessagesState,
  state => state.submitting
);

export const selectSuccess = createSelector(
  selectMessagesState,
  state => state.success
);

export const selectError = createSelector(
  selectMessagesState,
  state => state.error
);