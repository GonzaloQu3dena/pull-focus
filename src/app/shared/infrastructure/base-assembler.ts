import { BaseEntity } from '@shared/domain/model/base-entity';
import { BaseResource } from './base-resource';

/**
 * Base Assembler interface for converting between entities and resources.
 * @template TEntity - The entity type.
 * @template TResource - The resource type.
 */
export interface BaseAssembler<TEntity extends BaseEntity, TResource extends BaseResource> {
  /**
   * Converts an entity to a resource.
   * @param entity - The entity to convert.
   * @returns The resource.
   */
  toResourceFromEntity(entity: TEntity): TResource;

  /**
   * Converts a resource to an entity.
   * @param resource - The resource to convert.
   * @returns The entity.
   */
  toEntityFromResource(resource: TResource): TEntity;
}
