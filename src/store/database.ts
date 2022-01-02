import { DBSchema, openDB, OpenDBCallbacks } from "idb";
import { Entity, EntityId, IdProp, Punch, StoreEntity, Task } from "./types";

export const DB_NAME = "perago";
export const DB_VERSION = 1;
export enum StoreNames {
    PUNCHES = "punches",
    TASKS = "tasks"
};

interface EntityStoreSchema<E extends Entity, Idx extends keyof E> {
    key: EntityId,
    value: StoreEntity<E>,
    indexes: Pick<E, Idx>
}

export interface PgDBSchema extends DBSchema {
    [StoreNames.PUNCHES]: EntityStoreSchema<Punch, "taskId">;

    [StoreNames.TASKS]: EntityStoreSchema<Task, "parentId">;
}

type UpdateDBCallback = OpenDBCallbacks<PgDBSchema>['upgrade'];

const updateDB: UpdateDBCallback  = (db, vOld, vNew, tx) => {
    db.createObjectStore(StoreNames.PUNCHES, {keyPath: IdProp, autoIncrement: true})
        .createIndex('taskId', 'taskId', {unique: false});
    db.createObjectStore(StoreNames.TASKS, {keyPath: IdProp, autoIncrement: true})
        .createIndex('parentId', 'parentId', {unique: false});
}

export async function getDB() {
    return await openDB(DB_NAME, DB_VERSION, {
        upgrade: updateDB
    });
}

export async function getPunches() {
    const db = await getDB();
    return await db.getAll(StoreNames.PUNCHES);
}

export async function getPunchById(pId: EntityId) {
    return (await getDB()).get(StoreNames.PUNCHES, pId);
}

export async function getTasks() {
    const db = await getDB();
    return await db.getAll(StoreNames.TASKS);
}

export async function getTaskById(tId: EntityId) {
    return (await getDB()).get(StoreNames.TASKS, tId);
}
