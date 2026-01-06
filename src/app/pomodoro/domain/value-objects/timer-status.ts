/**
 * Timer Status
 * @summary
 * The status of the timer.
 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Timer Statuses
 * @summary
 * The statuses of the timer.
 */
export const TIMER_STATUSES: TimerStatus[] = [
  'idle',
  'running',
  'paused',
  'completed',
];

/**
 * Default Timer Status
 * @summary
 * The default status of the timer.
 */
export const DEFAULT_TIMER_STATUS: TimerStatus = 'idle';