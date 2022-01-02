import { BaseQueryFn, createApi, QueryDefinition } from "@reduxjs/toolkit/query/react";

import { Entity, EntityId, Punch, StoreEntity, Task } from './types';
import { getPunchById, getPunches, getTasks } from "./database";

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
type PgBaseQuery = BaseQueryFn<string | Partial<Entity>, Entity, Error>;
type PgEndpoints = {
    getTasks: QueryDefinition<void, PgBaseQuery, PgTagTypes, StoreEntity<Task>[]>,
    getPunches: QueryDefinition<void, PgBaseQuery, PgTagTypes, StoreEntity<Punch>[]>,
    getPunchById: QueryDefinition<EntityId, PgBaseQuery, PgTagTypes, StoreEntity<Punch> | undefined>
}

export const pgApi = createApi<PgBaseQuery, PgEndpoints, 'perago', PgTagTypes>({
    tagTypes: ["Punches", "Tasks", "Projects"],
    reducerPath: "perago",
    baseQuery(args, api?, extra?) {
        return Promise.resolve({data: {id:1}});
    },
    endpoints: (build) => ({
        getTasks: build.query<StoreEntity<Task>[],void>({
            queryFn(_args?) {
                return wrapReturnValue(getTasks());
            },
            providesTags: ["Tasks"]
        }),
        getPunches: build.query<StoreEntity<Punch>[],void>({
            queryFn() {
                return wrapReturnValue(getPunches());
            },
            providesTags: ["Punches"]
        }),
        getPunchById: build.query({
            queryFn(punchId: EntityId) {
                return wrapReturnValue(getPunchById(punchId));
            },
            providesTags: (punch) => ([{type: "Punches", id: punch?.id}])
        })
    })
})

export const {
    middleware,
    reducer,
    reducerPath,
    useGetTasksQuery,
    useGetPunchesQuery,
    useGetPunchByIdQuery
} = pgApi;
