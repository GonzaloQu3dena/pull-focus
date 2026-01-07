import { Injectable, computed, inject, signal, effect, DestroyRef } from '@angular/core';

import { Timer } from '../domain/model/timer.entity';
import { TimerStatus } from '../domain/value-objects/timer-status';
import { TimerStorage } from '../infrastructure/persistence/timer-storage';
import { TimerMode, TIMER_DURATIONS } from '../domain/value-objects/timer-mode';

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
    const duration = TIMER_DURATIONS[this.mode()];
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
      remainingSeconds: TIMER_DURATIONS[this.mode()],
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
      remainingSeconds: TIMER_DURATIONS[mode],
    });
  }

  /**
   * Advance to the next Pomodoro mode automatically.
   */
  nextMode(): void {
    const currentMode = this.mode();
    const cycles = this.cyclesCount();
    let nextMode: TimerMode;

    if (currentMode === 'focus') {
      nextMode = cycles % 4 === 0 && cycles > 0 ? 'long-break' : 'short-break';
    } else {
      nextMode = 'focus';
    }

    this.changeMode(nextMode);
  }

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
      remainingSeconds: TIMER_DURATIONS['focus'],
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
    this._updateTimer({
      status: 'completed',
      completedAt: new Date(),
      cyclesCount: isFocus ? this.cyclesCount() + 1 : this.cyclesCount(),
    });
  }

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
