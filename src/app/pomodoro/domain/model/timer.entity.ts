import { TimerMode } from '../value-objects/timer-mode';
import { TimerStatus } from '../value-objects/timer-status';
import { BaseEntity } from '@shared/domain/model/base-entity';

/**
 * Timer Entity
 * @summary
 * The timer entity.
 * @implements {BaseEntity}
 * @property {number} id - The id of the timer.
 * @property {TimerMode} mode - The mode of the timer.
 * @property {TimerStatus} status - The status of the timer.
 * @property {Date} startedAt - The date and time the timer was started.
 * @property {Date} _pausedAt - The date and time the timer was paused.
 * @property {Date} _completedAt - The date and time the timer was completed.
 * @property {number} _cyclesCount - The number of cycles the timer has completed.
 */
export class Timer implements BaseEntity {
  private _id: number;

  private _mode: TimerMode;
  private _status: TimerStatus;

  private _startedAt: Date | null;
  private _pausedAt: Date | null;
  private _completedAt: Date | null;

  private _remainingSeconds: number;
  private _cyclesCount: number;

  /**
   * Create a new Timer instance.
   * @param timer - An object containing the timer data.
   */
  constructor(timer: {
    id: number;
    mode: TimerMode;
    status: TimerStatus;
    startedAt: number | null;
    pausedAt: number | null;
    completedAt: number | null;
    remainingSeconds: number;
    cyclesCount: number;
  }) {
    this._id = timer.id;
    this._mode = timer.mode;
    this._status = timer.status;
    this._startedAt = timer.startedAt ? new Date(timer.startedAt) : null;
    this._pausedAt = timer.pausedAt ? new Date(timer.pausedAt) : null;
    this._completedAt = timer.completedAt ? new Date(timer.completedAt) : null;
    this._remainingSeconds = timer.remainingSeconds;
    this._cyclesCount = timer.cyclesCount;
  }

  /**
   * Get the id of the timer.
   * @returns The id of the timer.
   */
  get id(): number {
    return this._id;
  }

  /**
   * Get the mode of the timer.
   * @returns The mode of the timer.
   */
  get mode(): TimerMode {
    return this._mode;
  }

  /**
   * Get the status of the timer.
   * @returns The status of the timer.
   */
  get status(): TimerStatus {
    return this._status;
  }

  /**
   * Get the date and time the timer was started.
   * @returns The date and time the timer was started.
   */
  get startedAt(): Date | null {
    return this._startedAt;
  }

  /**
   * Get the date and time the timer was paused.
   * @returns The date and time the timer was paused.
   */
  get pausedAt(): Date | null {
    return this._pausedAt;
  }

  /**
   * Get the date and time the timer was completed.
   * @returns The date and time the timer was completed.
   */
  get completedAt(): Date | null {
    return this._completedAt;
  }

  /**
   * Get the number of cycles the timer has completed.
   * @returns The number of cycles the timer has completed.
   */
  get cyclesCount(): number {
    return this._cyclesCount;
  }

  /**
   * Get the remaining seconds of the timer.
   * @returns The remaining seconds of the timer.
   */
  get remainingSeconds(): number {
    return this._remainingSeconds;
  }

  /**
   * Set the mode of the timer.
   * @param mode - The mode to set.
   */
  set mode(mode: TimerMode) {
    this._mode = mode;
  }

  /**
   * Set the status of the timer.
   * @param status - The status to set.
   */
  set status(status: TimerStatus) {
    this._status = status;
  }

  /**
   * Set the date and time the timer was started.
   * @param startedAt - The date and time to set.
   */
  set startedAt(startedAt: Date | null) {
    this._startedAt = startedAt;
  }

  /**
   * Set the date and time the timer was paused.
   * @param pausedAt - The date and time to set.
   */
  set pausedAt(pausedAt: Date | null) {
    this._pausedAt = pausedAt;
  }

  /**
   * Set the date and time the timer was completed.
   * @param completedAt - The date and time to set.
   */
  set completedAt(completedAt: Date | null) {
    this._completedAt = completedAt;
  }

  /**
   * Set the number of cycles the timer has completed.
   * @param cyclesCount - The number of cycles to set.
   */
  set cyclesCount(cyclesCount: number) {
    this._cyclesCount = cyclesCount;
  }

  /**
   * Set the remaining seconds of the timer.
   * @param remainingSeconds - The remaining seconds to set.
   */
  set remainingSeconds(remainingSeconds: number) {
    this._remainingSeconds = remainingSeconds;
  }
}
