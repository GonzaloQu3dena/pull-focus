import { BaseAssembler } from '@shared/infrastructure/base-assembler';
import { SessionResource } from '../resources/session-resource';
import { Session } from '../../domain/model/session.entity';

/**
 * Session Assembler
 * @summary
 * Converts between Session entities and resources.
 */
export class SessionAssembler implements BaseAssembler<Session, SessionResource> {
  toResourceFromEntity(entity: Session): SessionResource {
    return {
      id: entity.id,
      type: entity.type,
      status: entity.status,
      startedAt: entity.startedAt.getTime(),
      endedAt: entity.endedAt.getTime(),
      durationMinutes: entity.durationMinutes,
      description: entity.description,
    };
  }

  toEntityFromResource(resource: SessionResource): Session {
    return new Session({
      id: resource.id,
      type: resource.type,
      status: resource.status,
      startedAt: resource.startedAt,
      endedAt: resource.endedAt,
      durationMinutes: resource.durationMinutes,
      description: resource.description,
    });
  }
}


