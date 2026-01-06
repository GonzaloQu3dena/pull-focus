import { BaseAssembler } from '@shared/infrastructure/base-assembler';
import { TimerResource } from '../resources/timer-resource';
import { Timer } from '../../domain/model/timer.entity';

/**
 * Assembler for converting between Timer entities and resources.
 * @implements {BaseAssembler<Timer, TimerResource>} implements the BaseAssembler interface for Timer domain objects.
 */
export class TimerAssembler implements BaseAssembler<Timer, TimerResource> {
  /**
   * Converts a Timer entity to a Timer resource.
   * @param entity - The Timer entity to convert.
   * @returns The Timer resource.
   */
  toResourceFromEntity(entity: Timer): TimerResource {
    return {
      id: entity.id,
      mode: entity.mode,
      status: entity.status,
      startedAt: entity.startedAt ? entity.startedAt.getTime() : null,
      pausedAt: entity.pausedAt ? entity.pausedAt.getTime() : null,
      completedAt: entity.completedAt ? entity.completedAt.getTime() : null,
      remainingSeconds: entity.remainingSeconds,
      cyclesCount: entity.cyclesCount,
    };
  }

  /**
   * Converts a Timer resource to a Timer entity.
   * @param resource - The Timer resource to convert.
   * @returns The Timer entity.
   */
  toEntityFromResource(resource: TimerResource): Timer {
    return new Timer({
      id: resource.id,
      mode: resource.mode,
      status: resource.status,
      startedAt: resource.startedAt,
      pausedAt: resource.pausedAt,
      completedAt: resource.completedAt,
      remainingSeconds: resource.remainingSeconds,
      cyclesCount: resource.cyclesCount,
    });
  }
}
