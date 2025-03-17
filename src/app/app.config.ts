import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'chaitechie-agre',
        appId: '1:721413957511:web:ed780a50e07f9899005522',
        storageBucket: 'chaitechie-agre.appspot.com',
        apiKey: 'AIzaSyAjSahgpny6QwkyUE7ZxMjMvz4jFQy_4Y8',
        authDomain: 'chaitechie-agre.firebaseapp.com',
        messagingSenderId: '721413957511',
        measurementId: 'G-ETVCH7NDM9',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
