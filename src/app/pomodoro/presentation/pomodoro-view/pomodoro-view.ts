import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimerStore } from '../../application/timer.store';

@Component({
  selector: 'app-pomodoro-view',
  imports: [],
  templateUrl: './pomodoro-view.html',
  styleUrl: './pomodoro-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroView {
  protected readonly store = inject(TimerStore);
}
