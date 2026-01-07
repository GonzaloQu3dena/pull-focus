import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from '../../domain/model/session.entity';
import { SessionResource } from '../resources/session-resource';
import { SessionAssembler } from '../assemblers/session-assembler';

const SESSIONS_STORAGE_KEY = 'pull-focus-sessions.v1';

/**
 * Sessions Storage
 * @summary
 * Handles storing and retrieving a list of sessions from localStorage.
 */
@Injectable({ providedIn: 'root' })
export class SessionsStorage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly assembler = new SessionAssembler();

  /**
   * Get all sessions from local storage.
   */
  getAll(): Session[] {
    if (!this.isBrowser) return [];

    try {
      const item = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (!item) return [];
      
      const resources: SessionResource[] = JSON.parse(item);
      return resources.map(r => this.assembler.toEntityFromResource(r));
    } catch {
      return [];
    }
  }

  /**
   * Save all sessions to local storage.
   */
  saveAll(sessions: Session[]): void {
    if (!this.isBrowser) return;

    try {
      const resources = sessions.map(s => this.assembler.toResourceFromEntity(s));
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(resources));
    } catch {
      // Silent fail
    }
  }

  /**
   * Add a new session to storage.
   */
  add(session: Session): void {
    const sessions = this.getAll();
    sessions.unshift(session);
    this.saveAll(sessions);
  }

  /**
   * Remove a session by ID.
   */
  remove(id: number): void {
    const sessions = this.getAll().filter(s => s.id !== id);
    this.saveAll(sessions);
  }

  /**
   * Clear all sessions.
   */
  clear(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
  }
}


