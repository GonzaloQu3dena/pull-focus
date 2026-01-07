import { BaseEntity } from '@shared/domain/model/base-entity';

export class TimerSettings implements BaseEntity {
  id: number;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  roundInterval: number;
  autoStart: boolean;

  constructor(settings: {
    id: number;
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    roundInterval: number;
    autoStart: boolean;
  }) {
    this.id = settings.id;
    this.focusDuration = settings.focusDuration;
    this.shortBreakDuration = settings.shortBreakDuration;
    this.longBreakDuration = settings.longBreakDuration;
    this.roundInterval = settings.roundInterval;
    this.autoStart = settings.autoStart;
  }
}

