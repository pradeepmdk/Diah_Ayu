import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from './messages.state';
import * as MessagesActions from './messages.actions';
import * as MessagesSelectors from './messages.selectors';
import { MessagesEffects } from './messages.effects';

@Injectable({ providedIn: 'root' })
export class MessagesFacade {
  messages$: Observable<Message[]>;
  loading$: Observable<boolean>;
  submitting$: Observable<boolean>;
  success$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store,
    private messagesEffects: MessagesEffects
  ) {
    this.messages$ = this.store.select(MessagesSelectors.selectMessages);
    this.loading$ = this.store.select(MessagesSelectors.selectLoading);
    this.submitting$ = this.store.select(MessagesSelectors.selectSubmitting);
    this.success$ = this.store.select(MessagesSelectors.selectSuccess);
    this.error$ = this.store.select(MessagesSelectors.selectError);
  }

  loadMessages(): void {
    this.store.dispatch(MessagesActions.loadMessages());
  }

  submitMessage(message: Message): void {
    this.store.dispatch(MessagesActions.submitMessage({ message }));
  }

  resetSuccess(): void {
    this.store.dispatch(MessagesActions.resetSuccess());
  }

  resetError(): void {
    this.store.dispatch(MessagesActions.resetError());
  }

  cleanup(): void {
    this.messagesEffects.cleanup();
  }
}