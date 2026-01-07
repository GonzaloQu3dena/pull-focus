import { Injectable, computed, inject, signal, effect, DestroyRef } from '@angular/core';

import { Timer } from '../domain/model/timer.entity';
import { TimerStatus } from '../domain/value-objects/timer-status';
import { TimerStorage } from '../infrastructure/persistence/timer-storage';
import { TimerMode } from '../domain/value-objects/timer-mode';
import { SettingsStore } from './settings.store';
import { SessionsStore } from './sessions.store';
import { SessionType } from '../domain/value-objects/session-type';

/**
 * Timer Store
 * @summary
 * Handles the timer state and logic.
 * @implements {Injectable} implements the Injectable interface.
 */
@Injectable({ providedIn: 'root' })
export class TimerStore {
  // State
  private _storage = inject(TimerStorage);
  private _settingsStore = inject(SettingsStore);
  private _sessionsStore = inject(SessionsStore);
  private _destroyRef = inject(DestroyRef);
  private _timer = signal<Timer>(this._initialTimer());
  private _intervalId: any = null;

  // Selectors
  readonly id = computed(() => this._timer().id);
  readonly mode = computed(() => this._timer().mode);
  readonly status = computed(() => this._timer().status);
  readonly remainingSeconds = computed(() => this._timer().remainingSeconds);
  readonly cyclesCount = computed(() => this._timer().cyclesCount);

  readonly formattedTime = computed(() => {
    const totalSeconds = this.remainingSeconds();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  readonly progress = computed(() => {
    const duration = this._getDuration(this.mode());
    return ((duration - this.remainingSeconds()) / duration) * 100;
  });

  constructor() {
    // Resume countdown if it was running when saved
    if (this.status() === 'running') {
      this._startCountdown();
    }

    // Cleanup on destroy
    this._destroyRef.onDestroy(() => {
      this._stopCountdown();
    });

    // Auto-save timer state changes
    effect(() => {
      const timer = this._timer();
      this._storage.save(timer);
    });

    // Sync with settings when they change
    effect(() => {
      const status = this.status();
      const mode = this.mode();
      
      if (status === 'idle') {
        const newDuration = this._getDuration(mode);
        if (this.remainingSeconds() !== newDuration) {
          this._updateTimer({ remainingSeconds: newDuration });
        }
      }
    });
  }

  /**
   * Start or resume the timer.
   */
  start(): void {
    if (this.status() === 'running') return;

    this._updateTimer({
      status: 'running',
      startedAt: this._timer().startedAt || new Date(),
    });

    this._startCountdown();
  }

  /**
   * Pause the timer.
   */
  pause(): void {
    if (this.status() !== 'running') return;

    this._stopCountdown();
    this._updateTimer({
      status: 'paused',
      pausedAt: new Date(),
    });
  }

  /**
   * Reset the current timer to its initial duration.
   */
  reset(): void {
    this._stopCountdown();
    this._updateTimer({
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      completedAt: null,
      remainingSeconds: this._getDuration(this.mode()),
    });
  }

  /**
   * Full reset: timer, sessions and settings.
   */
  fullReset(): void {
    this._stopCountdown();
    this._sessionsStore.clearAll();
    this._settingsStore.resetToDefaults();
    this._updateTimer({
      mode: 'focus',
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      completedAt: null,
      remainingSeconds: this._getDuration('focus'),
      cyclesCount: 0,
    });
  }

  /**
   * Switch to a different mode.
   * @param mode - The mode to switch to.
   */
  changeMode(mode: TimerMode): void {
    this._stopCountdown();
    this._updateTimer({
      mode,
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      completedAt: null,
      remainingSeconds: this._getDuration(mode),
    });
  }

  /**
   * Advance to the next Pomodoro mode automatically.
   * @param logSkipped - Whether to log this as a skipped session.
   */
  nextMode(logSkipped = true): void {
    const currentMode = this.mode();
    const cycles = this.cyclesCount();
    const roundInterval = this._settingsStore.roundInterval();
    const wasRunningOrPaused = this.status() === 'running' || this.status() === 'paused';
    
    // Log skipped session if timer was active
    if (logSkipped && wasRunningOrPaused && this._timer().startedAt) {
      const startedAt = this._timer().startedAt!;
      const endedAt = new Date();
      const elapsedSeconds = Math.round((endedAt.getTime() - startedAt.getTime()) / 1000);
      
      this._sessionsStore.logSession({
        type: currentMode as SessionType,
        status: 'skipped',
        startedAt,
        endedAt,
        durationMinutes: Math.round(elapsedSeconds / 60) || 1,
      });
    }

    let nextMode: TimerMode;
    if (currentMode === 'focus') {
      nextMode = cycles % roundInterval === 0 && cycles > 0 ? 'long-break' : 'short-break';
    } else {
      nextMode = 'focus';
    }

    this.changeMode(nextMode);
  }

  /**
   * Reset the cycles count to zero.
   */
  resetCycles(): void {
    this._updateTimer({ cyclesCount: 0 });
  }

  private _getDuration(mode: TimerMode): number {
    switch (mode) {
      case 'focus':
        return this._settingsStore.focusDuration() * 60;
      case 'short-break':
        return this._settingsStore.shortBreakDuration() * 60;
      case 'long-break':
        return this._settingsStore.longBreakDuration() * 60;
    }
  }

  /**
   * The initial timer.
   * @returns The initial timer.
   */
  private _initialTimer(): Timer {
    const saved = this._storage.get();
    if (saved) return saved;

    return new Timer({
      id: Date.now(),
      mode: 'focus',
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      completedAt: null,
      remainingSeconds: this._settingsStore.focusDuration() * 60,
      cyclesCount: 0,
    });
  }

  private _startCountdown(): void {
    this._stopCountdown();
    this._intervalId = setInterval(() => {
      const currentRemaining = this.remainingSeconds();
      if (currentRemaining > 0) {
        this._updateTimer({ remainingSeconds: currentRemaining - 1 });
      } else {
        this._onTimerComplete();
      }
    }, 1000);
  }

  private _stopCountdown(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private _onTimerComplete(): void {
    this._stopCountdown();

    const isFocus = this.mode() === 'focus';
    const endedAt = new Date();
    const startedAt = this._timer().startedAt ?? endedAt;
    const mode = this.mode();

    this._updateTimer({
      status: 'completed',
      completedAt: endedAt,
      cyclesCount: isFocus ? this.cyclesCount() + 1 : this.cyclesCount(),
    });

    // Log the completed session
    this._sessionsStore.logSession({
      type: mode as SessionType,
      status: 'completed',
      startedAt,
      endedAt,
      durationMinutes: Math.round(this._getDuration(mode) / 60),
    });

    // Transition to the next mode so it doesn't stay at 00:00
    this.nextMode(false);

    // Auto-start next session if enabled
    if (this._settingsStore.autoStart()) {
      this.start();
    }
  }

  /**
   * Update the timer.
   * @param partial - The partial timer.
   */
  private _updateTimer(
    partial: Partial<{
      mode: TimerMode;
      status: TimerStatus;
      startedAt: Date | null;
      pausedAt: Date | null;
      completedAt: Date | null;
      remainingSeconds: number;
      cyclesCount: number;
    }>
  ): void {
    const current = this._timer();
    
    const updated = new Timer({
      id: current.id,
      mode: partial.mode ?? current.mode,
      status: partial.status ?? current.status,
      startedAt: partial.startedAt !== undefined ? partial.startedAt : current.startedAt,
      pausedAt: partial.pausedAt !== undefined ? partial.pausedAt : current.pausedAt,
      completedAt: partial.completedAt !== undefined ? partial.completedAt : current.completedAt,
      remainingSeconds: partial.remainingSeconds ?? current.remainingSeconds,
      cyclesCount: partial.cyclesCount ?? current.cyclesCount,
    });

    this._timer.set(updated);
  }
}
