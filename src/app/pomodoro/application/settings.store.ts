import { Injectable, computed, inject, signal, effect } from '@angular/core';
import { TimerSettings } from '../domain/model/timer-settings.entity';
import { TimerSettingsStorage } from '../infrastructure/persistence/timer-settings-storage';

/**
 * Settings Store
 * @summary
 * Store to manage the settings of the timer.
 */
@Injectable({ providedIn: 'root' })
export class SettingsStore {
  /**
   * The storage to save the settings.
   */
  private _storage = inject(TimerSettingsStorage);

  /**
   * The settings of the timer.
   */
  private _settings = signal<TimerSettings>(this._initialSettings());

  /**
   * The settings of the timer.
   */
  readonly settings = computed(() => this._settings());

  /**
   * The focus duration of the timer.
   */
  readonly focusDuration = computed(() => this._settings().focusDuration);

  /**
   * The short break duration of the timer.
   */
  readonly shortBreakDuration = computed(() => this._settings().shortBreakDuration);

  /**
   * The long break duration of the timer.
   */
  readonly longBreakDuration = computed(() => this._settings().longBreakDuration);

  /**
   * The round interval of the timer.
   */
  readonly roundInterval = computed(() => this._settings().roundInterval);

  /**
   * The auto start of the timer.
   */
  readonly autoStart = computed(() => this._settings().autoStart);

  /**
   * Constructor of the SettingsStore.
   */
  constructor() {
    /**
     * Effect to save the settings when they change.
     */
    effect(() => {
      this._storage.save(this._settings());
    });
  }

  /**
   * Update the settings of the timer.
   * @param partial - The partial settings to update.
   */
  updateSettings(partial: Partial<TimerSettings>): void {
    this._settings.update(current => new TimerSettings({
      ...current,
      ...partial
    }));
  }

  /**
   * The initial settings of the timer.
   */
  private _initialSettings(): TimerSettings {
    const saved = this._storage.get();
    if (saved) return saved;

    return new TimerSettings({
      id: 1,
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      roundInterval: 4,
      autoStart: false
    });
  }
}

