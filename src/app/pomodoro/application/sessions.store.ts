import { Injectable, computed, inject, signal } from '@angular/core';
import { Session } from '../domain/model/session.entity';
import { SessionsStorage } from '../infrastructure/persistence/sessions-storage';
import { SessionStatus } from '../domain/value-objects/session-status';
import { SessionType } from '../domain/value-objects/session-type';

export interface GroupedSessions {
  date: Date;
  label: string;
  sessions: Session[];
}

/**
 * Sessions Store
 * @summary
 * Manages session history and logging.
 */
@Injectable({ providedIn: 'root' })
export class SessionsStore {
  private _storage = inject(SessionsStorage);
  private _sessions = signal<Session[]>(this._storage.getAll());

  readonly sessions = computed(() => this._sessions());

  readonly todaySessions = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this._sessions().filter(s => {
      const sessionDate = new Date(s.startedAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
  });

  readonly totalHoursToday = computed(() => {
    const totalMinutes = this.todaySessions()
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  });

  readonly groupedByDate = computed((): GroupedSessions[] => {
    const sessions = this._sessions();
    const groups = new Map<string, { date: Date; sessions: Session[] }>();

    for (const session of sessions) {
      const date = new Date(session.startedAt);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString();

      if (!groups.has(key)) {
        groups.set(key, { date, sessions: [] });
      }
      groups.get(key)!.sessions.push(session);
    }

    return Array.from(groups.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(g => ({
        date: g.date,
        label: this._formatDateLabel(g.date),
        sessions: g.sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime()),
      }));
  });

  /**
   * Log a new session.
   */
  logSession(params: {
    type: SessionType;
    status: SessionStatus;
    startedAt: Date;
    endedAt: Date;
    durationMinutes: number;
    description?: string;
  }): void {
    const session = new Session({
      id: Date.now(),
      type: params.type,
      status: params.status,
      startedAt: params.startedAt,
      endedAt: params.endedAt,
      durationMinutes: params.durationMinutes,
      description: params.description ?? null,
    });

    this._sessions.update(sessions => [session, ...sessions]);
    this._storage.add(session);
  }

  /**
   * Remove a session by ID.
   */
  removeSession(id: number): void {
    this._sessions.update(sessions => sessions.filter(s => s.id !== id));
    this._storage.remove(id);
  }

  /**
   * Clear all sessions.
   */
  clearAll(): void {
    this._sessions.set([]);
    this._storage.clear();
  }

  private _formatDateLabel(date: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.getTime() === today.getTime()) {
      return `Today, ${this._formatMonthDay(date)}`;
    } else if (date.getTime() === yesterday.getTime()) {
      return `Yesterday, ${this._formatMonthDay(date)}`;
    } else {
      return this._formatMonthDay(date);
    }
  }

  private _formatMonthDay(date: Date): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }
}


