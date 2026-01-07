import { BaseResource } from '@shared/infrastructure/base-resource';

export interface TimerSettingsResource extends BaseResource {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  roundInterval: number;
  autoStart: boolean;
}

