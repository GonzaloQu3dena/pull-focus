import { Routes } from '@angular/router';

const pomodoroRoutes = () => import('./pomodoro/presentation/timer.routes').then(m => m.TIMER_ROUTES);
const sessionsRoutes = () => import('./pomodoro/presentation/sessions.routes').then(m => m.SESSIONS_ROUTES);

export const routes: Routes = [
  { path: 'pomodoro', loadChildren: pomodoroRoutes },
  { path: 'sessions', loadChildren: sessionsRoutes },
  { path: '', redirectTo: 'pomodoro', pathMatch: 'full' },
];
