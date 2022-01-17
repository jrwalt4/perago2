/**
 * selectionReducer
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EntityId } from "store/types";

export interface SelectionState {
    punches: EntityId[];
    tasks: EntityId[]
}
const initialSelection: SelectionState = {
    punches: [],
    tasks: []
}

interface SelectActionMeta {
    addToSelection: boolean
}

export const selectionSlice = createSlice({
    name: 'selection',
    initialState: initialSelection,
    reducers: {
        selectPunch: {
            reducer: (state, action: PayloadAction<EntityId, string, SelectActionMeta>) => {
                if(action.meta.addToSelection) {
                    state.punches.push(action.payload);
                } else {
                    state.punches = [action.payload];
                    state.tasks = [];
                }
            },
            prepare: (id: EntityId, addToSelection: boolean = false) => ({
                payload: id,
                meta: {
                    addToSelection
                }
            })
        },
        selectTask: {
            reducer: (state, action: PayloadAction<EntityId, string, SelectActionMeta>) => {
                if(action.meta.addToSelection) {
                    state.tasks.push(action.payload);
                } else {
                    state.tasks = [action.payload];
                    state.punches = [];
                }
            },
            prepare: (id: EntityId, addToSelection: boolean = false) => ({
                payload: id,
                meta: {
                    addToSelection
                }
            })
        },
        clearSelection: () => initialSelection
    }
});
