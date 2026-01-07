import { BaseAssembler } from '@shared/infrastructure/base-assembler';
import { TimerSettings } from '../../domain/model/timer-settings.entity';
import { TimerSettingsResource } from '../resources/timer-settings-resource';

export class TimerSettingsAssembler implements BaseAssembler<TimerSettings, TimerSettingsResource> {
  toEntityFromResource(resource: TimerSettingsResource): TimerSettings {
    return new TimerSettings({
      id: resource.id,
      focusDuration: resource.focusDuration,
      shortBreakDuration: resource.shortBreakDuration,
      longBreakDuration: resource.longBreakDuration,
      roundInterval: resource.roundInterval,
      autoStart: resource.autoStart,
    });
  }

  toResourceFromEntity(entity: TimerSettings): TimerSettingsResource {
    return {
      id: entity.id,
      focusDuration: entity.focusDuration,
      shortBreakDuration: entity.shortBreakDuration,
      longBreakDuration: entity.longBreakDuration,
      roundInterval: entity.roundInterval,
      autoStart: entity.autoStart,
    };
  }
}

