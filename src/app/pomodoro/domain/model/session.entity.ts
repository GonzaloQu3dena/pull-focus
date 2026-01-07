import { BaseEntity } from '@shared/domain/model/base-entity';
import { SessionStatus } from '../value-objects/session-status';
import { SessionType } from '../value-objects/session-type';

/**
 * Session Entity
 * @summary
 * Represents a single session record (pomodoro, break, etc.).
 */
export class Session implements BaseEntity {
  private _id: number;
  private _type: SessionType;
  private _status: SessionStatus;
  private _startedAt: Date;
  private _endedAt: Date;
  private _durationMinutes: number;
  private _description: string | null;

  constructor(session: {
    id: number;
    type: SessionType;
    status: SessionStatus;
    startedAt: Date | number;
    endedAt: Date | number;
    durationMinutes: number;
    description: string | null;
  }) {
    this._id = session.id;
    this._type = session.type;
    this._status = session.status;
    this._startedAt = session.startedAt instanceof Date 
      ? session.startedAt 
      : new Date(session.startedAt);
    this._endedAt = session.endedAt instanceof Date 
      ? session.endedAt 
      : new Date(session.endedAt);
    this._durationMinutes = session.durationMinutes;
    this._description = session.description;
  }

  get id(): number {
    return this._id;
  }

  get type(): SessionType {
    return this._type;
  }

  get status(): SessionStatus {
    return this._status;
  }

  get startedAt(): Date {
    return this._startedAt;
  }

  get endedAt(): Date {
    return this._endedAt;
  }

  get durationMinutes(): number {
    return this._durationMinutes;
  }

  get description(): string | null {
    return this._description;
  }
}


