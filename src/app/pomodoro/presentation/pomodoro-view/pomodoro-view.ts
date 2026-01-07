import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TimerStore } from '../../application/timer.store';
import { SettingsStore } from '../../application/settings.store';
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
  /**
   * The store for the pomodoro timer.
   */
  protected readonly store = inject(TimerStore);

  /**
   * The store for the settings.
   */
  private readonly settingsStore = inject(SettingsStore);

  /**
   * The number of sessions until the long break.
   */
  protected readonly sessionsUntilLongBreak = computed(() => {
    const cycles = this.store.cyclesCount();
    const roundInterval = this.settingsStore.roundInterval();
    const remaining = roundInterval - (cycles % roundInterval);
    return remaining === roundInterval && cycles > 0 ? 0 : remaining;
  });
}
