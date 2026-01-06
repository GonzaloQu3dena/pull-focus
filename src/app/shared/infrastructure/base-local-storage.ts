import { BaseEntity } from '@shared/domain/model/base-entity';

import { BaseResource } from './base-resource';
import { BaseAssembler } from './base-assembler';
import { ErrorHandlingEnabledBaseType } from './error-handling';

/**
 * Base Local Storage
 * @summary
 * Abstract base class for local storage operations.
 * @template TEntity - The entity type.
 * @template TResource - The resource type.
 * @template TAssembler - The assembler type.
 * @implements {ErrorHandlingEnabledBaseType} implements the ErrorHandlingEnabledBaseType interface.
 */
export abstract class BaseLocalStorage<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TAssembler extends BaseAssembler<TEntity, TResource>
> extends ErrorHandlingEnabledBaseType {
  /**
   * The storage key for the local storage.
   */
  protected abstract get storageKey(): string;

  /**
   * Create a new BaseLocalStorage instance.
   * @param assembler - The assembler to use for converting between entities and resources.
   */
  protected constructor(protected assembler: TAssembler) {
    super();
  }

  /**
   * Save an entity to local storage.
   * @param entity - The entity to save.
   */
  save(entity: TEntity): void {
    try {
      const resource = this.assembler.toResourceFromEntity(entity);
      localStorage.setItem(this.storageKey, JSON.stringify(resource));
    } catch (error) {
      this.handleError('Save', error);
    }
  }

  /**
   * Get an entity from local storage.
   * @returns The entity or null if not found.
   */
  get(): TEntity | null {
    try {
      const item = localStorage.getItem(this.storageKey);
      if (!item) {
        return null;
      }
      const resource: TResource = JSON.parse(item);
      return this.assembler.toEntityFromResource(resource);
    } catch (error) {
      this.handleError('Read', error);
      return null;
    }
  }

  /**
   * Remove the entity from local storage.
   */
  remove(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      this.handleError('Remove', error);
    }
  }

  /**
   * Clear all items from local storage.
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      this.handleError('Clear', error);
    }
  }
}
