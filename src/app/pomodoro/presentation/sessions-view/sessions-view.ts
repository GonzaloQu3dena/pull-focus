import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SessionsStore } from '../../application/sessions.store';
import { MainLayout } from '@core/layouts/main-layout/main-layout';
import { Session } from '../../domain/model/session.entity';

@Component({
  selector: 'app-sessions-view',
  imports: [MainLayout],
  templateUrl: './sessions-view.html',
  styleUrl: './sessions-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsView {
  /**
   * The sessions store.
   */
  protected readonly store = inject(SessionsStore);

  /**
   * Formats the time range of a session.
   * @param session - The session to format.
   * @returns The formatted time range.
   */
  formatTimeRange(session: Session): string {
    const start = session.startedAt;
    const end = session.endedAt;
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }

  /**
   * Formats the time of a date.
   * @param date - The date to format.
   * @returns The formatted time.
   */
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Gets the label of a session type.
   * @param type - The session type.
   * @returns The label of the session type.
   */
  getTypeLabel(type: string): string {
    switch (type) {
      case 'focus':
        return 'Pomodoro';
      case 'short-break':
        return 'Short break';
      case 'long-break':
        return 'Long break';
      default:
        return type;
    }
  }

  /**
   * Gets the icon of a session type.
   * @param type - The session type.
   * @returns The icon of the session type.
   */
  getTypeIcon(type: string): 'focus' | 'short-break' | 'long-break' {
    return type as 'focus' | 'short-break' | 'long-break';
  }
}
