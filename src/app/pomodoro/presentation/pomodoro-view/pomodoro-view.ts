import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimerStore } from '../../application/timer.store';
import { CustomBtn } from '@shared/presentation/components/custom-btn/custom-btn';
import { MainLayout } from '../../../core/layouts/main-layout/main-layout';

@Component({
  selector: 'app-pomodoro-view',
  imports: [CustomBtn, MainLayout],
  templateUrl: './pomodoro-view.html',
  styleUrl: './pomodoro-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroView {
  protected readonly store = inject(TimerStore);
}
