import { Injectable } from '@angular/core';
import { BaseLocalStorage } from '@shared/infrastructure/base-local-storage';
import { TimerSettings } from '../../domain/model/timer-settings.entity';
import { TimerSettingsResource } from '../resources/timer-settings-resource';
import { TimerSettingsAssembler } from '../assemblers/timer-settings-assembler';

const SETTINGS_STORAGE_KEY = 'pull-focus-settings.v1';

@Injectable({ providedIn: 'root' })
export class TimerSettingsStorage extends BaseLocalStorage<
  TimerSettings,
  TimerSettingsResource,
  TimerSettingsAssembler
> {
  protected override get storageKey(): string {
    return SETTINGS_STORAGE_KEY;
  }

  constructor() {
    super(new TimerSettingsAssembler());
  }
}

