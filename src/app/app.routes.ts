import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';

export const routes: Routes = [
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: '',
    loadComponent: () => import('./today/today.component').then(m => m.TodayComponent)
  }
];
