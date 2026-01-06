import { Routes } from '@angular/router';

export const TIMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pomodoro-view/pomodoro-view').then((m) => m.PomodoroView),
  },
];