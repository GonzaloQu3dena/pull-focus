import { Injectable } from '@angular/core';
import { Timer } from '../../domain/model/timer.entity';
import { TimerResource } from '../resources/timer-resource';
import { TimerAssembler } from '../assemblers/timer-assembler';
import { BaseLocalStorage } from '@shared/infrastructure/base-local-storage';


const TIMER_STORAGE_KEY = 'pull-focus-timer.v1';

/**
 * Timer Storage
 * @summary
 * The timer storage.
 * @implements {BaseLocalStorage<Timer, TimerResource, TimerAssembler>} implements the BaseLocalStorage interface for Timer domain objects.
 */
@Injectable({ providedIn: 'root' })
export class TimerStorage extends BaseLocalStorage<
  Timer,
  TimerResource,
  TimerAssembler
> {
  /**
   * The storage key for the timer storage.
   * @returns The storage key.
   */
  protected override get storageKey(): string {
    return TIMER_STORAGE_KEY;
  }

  /**
   * Create a new TimerStorage instance.
   * @param assembler - The assembler to use for converting between entities and resources.
   */
  constructor() {
    super(new TimerAssembler());
  }
}