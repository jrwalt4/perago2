/**
 * Entity types and backing data shape
 */

export type EntityId = number;

export type Timestamp = number;

export const IdProp = "id";
export type IdPropType = typeof IdProp;

/**
 * Each object in the database is an `Entity` with a unique identifier
 * provided by the backing datastore
 */
export interface Entity {
    id: EntityId;
}

/**
 * The shape of the actual data stored on the backend
 */
export type StoreEntity<E extends Entity> = E & {
    pg_created: Timestamp;
    pg_modified: Timestamp;
}

/**
 * Utility type to make an Entity's `id` type optional. Used when
 * sending data to the backend to create a new Entity when the `id`
 * is not known yet.
 */
export type DraftEntity<E extends Entity> = {
    [Props in keyof E as Exclude<Props, IdPropType>]: E[Props];
} & Partial<Pick<E, IdPropType>>

/**
 * A timecard/timesheet is a collection of Punchcard entries that
 * represent punchin/punchout times, or `Punch`es.
 */
export interface Punch extends Entity {
    taskId: EntityId;
    start: Timestamp;
    end?: Timestamp;
    comment?: string;
}

/**
 * Each punch has an associated `Task`
 */
export interface Task extends Entity {
    /**
     * a default 'null' project and task is provided for 'free' tasks,
     * but the id must be defined for indexedDB index to work
     */
    projectId: EntityId;
    parentId: EntityId;
    name: string;
}

/**
 * A collection of Tasks is represented as a `Project`
 */
export interface Project extends Entity {
    name: string;
    number: string;
}
