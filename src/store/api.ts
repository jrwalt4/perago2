import { BaseQueryFn, createApi, QueryDefinition } from "@reduxjs/toolkit/query/react";

import { Entity, EntityId, Punch, StoreEntity, Task } from './types';
import { getPunchById, getPunches, getTaskById, getTasks } from "./database";

async function wrapReturnValue<TR>(p: Promise<TR>) {
    try {
        return {
            data: await p
        };
    } catch (e) {
        return {
            error: e as Error
        };
    }
}

type PgTagTypes = "Tasks" | "Punches" | "Projects";
type PgBaseQuery = BaseQueryFn<string | Partial<Entity>, unknown, Error>;
type PgEndpointDefinition<TResult, TArg = void, TTag extends string = PgTagTypes> =
    QueryDefinition<
        TArg,
        PgBaseQuery,
        TTag,
        TResult extends Array<infer U> ?
        U extends Entity ? StoreEntity<U>[] : never :
        NonNullable<TResult> extends Entity ? StoreEntity<NonNullable<TResult>> | Extract<TResult, undefined> : never
    >;
type PgEndpoints = {
    getTasks: PgEndpointDefinition<Task[]>,
    getTaskById: PgEndpointDefinition<Task | undefined, EntityId>,
    getPunches: PgEndpointDefinition<Punch[]>,
    getPunchById: PgEndpointDefinition<Punch | undefined, EntityId>
}

export const pgApi = createApi<PgBaseQuery, PgEndpoints, 'perago', PgTagTypes>({
    tagTypes: ["Punches", "Tasks", "Projects"],
    reducerPath: "perago",
    baseQuery(args, api?, extra?) {
        return Promise.resolve({ data: { id: 1 } });
    },
    endpoints: (build) => ({
        getTasks: build.query<StoreEntity<Task>[], void>({
            queryFn(_args?) {
                return wrapReturnValue(getTasks());
            },
            providesTags: ["Tasks"]
        }),
        getTaskById: build.query({
            queryFn(taskId: EntityId) {
                return wrapReturnValue(getTaskById(taskId));
            },
            providesTags: (_result, _error, id) => ([{ type: "Tasks", id }])
        }),
        getPunches: build.query<StoreEntity<Punch>[], void>({
            queryFn() {
                return wrapReturnValue(getPunches());
            },
            providesTags: ["Punches"]
        }),
        getPunchById: build.query({
            queryFn(punchId: EntityId) {
                return wrapReturnValue(getPunchById(punchId));
            },
            providesTags: (_result, _error, id) => ([{ type: "Punches", id }])
        })
    })
})

export const {
    middleware,
    reducer,
    reducerPath,
    useGetTasksQuery,
    useGetPunchesQuery,
    useGetPunchByIdQuery,
    useGetTaskByIdQuery
} = pgApi;
