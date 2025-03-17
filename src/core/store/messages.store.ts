import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, addDoc, collection, query, orderBy, onSnapshot } from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { catchError, from, of, tap, map } from 'rxjs';

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
  unsubscribe?: () => void;
}

const initialState: MessagesState = {
  loading: false,
  submitting: false,
  success: false,
  error: null,
  messages: [],
  unsubscribe: undefined
};

@Injectable({ providedIn: 'root' })
export class MessagesStore extends signalStore(
  withState(initialState),
  withMethods(
    (store, firestore = inject(Firestore), snackBar = inject(MatSnackBar)) => ({
      submitMessage(message: Message) {
        patchState(store, { submitting: true, error: null, success: false });

        const messageData = {
          ...message,
          date: serverTimestamp()
        };

        from(addDoc(collection(firestore, 'messages'), messageData)).pipe(
          tap(docRef => {
            patchState(store, {
              submitting: false,
              success: true
            });
            
            snackBar.open('Message sent successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          }),
          catchError(error => {
            patchState(store, {
              submitting: false,
              error: error.message || 'Failed to send message',
              success: false
            });
            
            snackBar.open(`Error: ${error.message || 'Failed to send message'}`, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            
            return of(null);
          })
        ).subscribe();
      },
      
      loadMessages(): void {
        const currentState = store.unsubscribe;
        if (currentState) {
          currentState();
        }
        
        patchState(store, { loading: true, error: null });
        
        const messagesCollection = collection(firestore, 'messages');
        const q = query(messagesCollection, orderBy('date', 'desc'));
        
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const messages: any = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              date: doc.data()['date'].toDate()
            }));
            console.log(messages)
            patchState(store, { 
              messages: messages,
              loading: false 
            });
          },
          (error) => {
            console.error('Error loading messages:', error);
            patchState(store, { 
              loading: false, 
              error: error.message || 'Failed to load messages' 
            });
          }
        );
        
        patchState(store, { unsubscribe });
      },
      
      cleanup(): void {
        const currentState = store.unsubscribe;
        if (currentState) {
          currentState();
          patchState(store, { unsubscribe: undefined });
        }
      },
      resetSuccess(): void {    
        patchState(store, { success: false });
      }
    })
  )
) {}