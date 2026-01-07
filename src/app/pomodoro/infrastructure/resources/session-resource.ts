import { BaseResource } from '@shared/infrastructure/base-resource';
import { SessionStatus } from '../../domain/value-objects/session-status';
import { SessionType } from '../../domain/value-objects/session-type';

/**
 * Session Resource
 * @summary
 * DTO for session persistence.
 */
export interface SessionResource extends BaseResource {
  type: SessionType;
  status: SessionStatus;
  startedAt: number;
  endedAt: number;
  durationMinutes: number;
  description: string | null;
}


