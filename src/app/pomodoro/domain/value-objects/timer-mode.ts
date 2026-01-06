/**
 * Timer Mode
 * @summary
 * The mode of the timer.
 */
export type TimerMode = 'focus' | 'short-break' | 'long-break';

/**
 * Timer Modes
 * @summary
 * The modes of the timer.
 */
export const TIMER_MODES: TimerMode[] = [
  'focus',
  'short-break',
  'long-break',
];

/**
 * Default Timer Mode
 * @summary
 * The default mode of the timer.
 */
export const DEFAULT_TIMER_MODE: TimerMode = 'focus';

/**
 * Timer Durations (in seconds)
 * @summary
 * The duration of each timer mode in seconds.
 */
export const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};
