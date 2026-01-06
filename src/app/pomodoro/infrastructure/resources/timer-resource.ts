import { Timer } from '../../domain/model/timer.entity';
import { BaseResource } from '@shared/infrastructure/base-resource';
import { TimerMode } from '../../domain/value-objects/timer-mode';
import { TimerStatus } from '../../domain/value-objects/timer-status';

/**
 * Timer Resource
 * @summary
 * The timer resource.
 * @implements {BaseResource}
 * @property {TimerMode} mode - The mode of the timer.
 * @property {TimerStatus} status - The status of the timer.
 * @property {string} startedAt - The date and time the timer was started.
 * @property {string} pausedAt - The date and time the timer was paused.
 * @property {string} completedAt - The date and time the timer was completed.
 * @property {number} cyclesCount - The number of cycles the timer has completed.
 */
export interface TimerResource extends BaseResource {
  mode: TimerMode;
  status: TimerStatus;
  startedAt: number | null;
  pausedAt: number | null;
  completedAt: number | null;
  remainingSeconds: number;
  cyclesCount: number;
}
