import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { AnalyticsComponent } from './analytics/analytics.component';

export const routes: Routes = [
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'analytics',
    component: AnalyticsComponent
  },
  {
    path: '',
    loadComponent: () => import('./today/today.component').then(m => m.TodayComponent)
  }
];
