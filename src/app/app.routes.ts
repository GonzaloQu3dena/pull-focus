import { Routes } from '@angular/router';

const pomodoroRoutes = () => import('./pomodoro/presentation/timer.routes').then(m => m.TIMER_ROUTES);

export const routes: Routes = [
  { path: 'pomodoro', loadChildren: pomodoroRoutes},
  { path: '', redirectTo: 'pomodoro', pathMatch: 'full'},
];
