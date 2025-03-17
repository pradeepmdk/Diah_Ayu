import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, addDoc, collection, query, orderBy, onSnapshot, doc } from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import * as MessagesActions from './messages.actions';

@Injectable()
export class MessagesEffects {
  private unsubscribe: (() => void) | null = null;
  private actions$ = inject(Actions);
  
  constructor(
    private store: Store,
    private firestore: Firestore,
    private snackBar: MatSnackBar
  ) {}

  loadMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MessagesActions.loadMessages),
      switchMap(() => {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
        
        return new Observable<{ messages: any[] }>(observer => {
          const messagesCollection = collection(this.firestore, 'messages');
          const q = query(messagesCollection, orderBy('date', 'desc'));
          
          this.unsubscribe = onSnapshot(q, 
            (snapshot) => {
              try {
                const messages = snapshot.docs.map(doc => {
                  const data = doc.data();
                  return {
                    id: doc.id,
                    ...data,
                    date: data['date'] ? data['date'].toDate() : new Date()
                  };
                });
                observer.next({ messages });
              } catch (error: any) {
                observer.error(error);
              }
            },
            (error) => {
              console.error('Error loading messages:', error);
              observer.error(error);
            }
          );
          
          return () => {
            if (this.unsubscribe) {
              this.unsubscribe();
              this.unsubscribe = null;
            }
          };
        }).pipe(
          map(result => MessagesActions.loadMessagesSuccess(result)),
          catchError(error => of(MessagesActions.loadMessagesFailure({ 
            error: error.message || 'Failed to load messages' 
          })))
        );
      })
    );
  });

  submitMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MessagesActions.submitMessage),
      switchMap(({ message }) => {
        const messageData = {
          ...message,
          date: serverTimestamp()
        };

        return from(addDoc(collection(this.firestore, 'messages'), messageData)).pipe(
          map(() => MessagesActions.submitMessageSuccess()),
          catchError(error => of(MessagesActions.submitMessageFailure({ 
            error: error.message || 'Failed to send message' 
          })))
        );
      })
    );
  });

  showSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MessagesActions.submitMessageSuccess),
      tap(() => {
        this.snackBar.open('Message sent successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        
        setTimeout(() => this.store.dispatch(MessagesActions.resetSuccess()), 3000);
      })
    );
  }, { dispatch: false });

  showError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        MessagesActions.submitMessageFailure, 
        MessagesActions.loadMessagesFailure
      ),
      tap(({ error }) => {
        this.snackBar.open(`Error: ${error}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });

        setTimeout(() => this.store.dispatch(MessagesActions.resetError()), 3000);
      })
    );
  }, { dispatch: false });

  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}