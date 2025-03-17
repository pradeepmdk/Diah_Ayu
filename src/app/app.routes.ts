import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [{
    path: '',
    component: HomeComponent
},
{ 
    path: '', 
    loadChildren: () => import('./pages/features/messages/messages.module').then(m => m.MessagesModule) 
  },

];
