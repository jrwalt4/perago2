/**
 * Punchlist
 * Punchlist component that shows table of Punches by week, day, or other filter
 */
import { useDispatch } from "react-redux";

import DataTable from "components/DataTable";
import type { DataColumnsProp } from "components/DataTable";

import { useGetPunchesQuery, useGetTaskByIdQuery } from 'store/api';
import { Punch, EntityId } from "store/types";
import { selectionSlice } from "store/reducers/selectionReducer";
import React from "react";

type PunchListTaskCellProps = React.PropsWithoutRef<{
    id: EntityId
}>;

function PunchListTaskCell({ id }: PunchListTaskCellProps) {
    const { data: task } = useGetTaskByIdQuery(id);
    if (task) {
        return <span>{task.name}</span>;
    }
    return <span>... loading {id}</span>;
}

const punchListColumns: DataColumnsProp<Punch> = [
    {
        accessor: 'taskId',
        title: "Task",
        render: (taskId, punch) => <PunchListTaskCell id={taskId} />
    },
    {
        accessor: 'start',
        title: "Start"
    },
    {
        accessor: 'end',
        title: "End"
    }
];

const getRowKey = (item: Punch) => item.id;

const Punchlist: React.FunctionComponent = () => {
    const dispatch = useDispatch();
    function onRowClick(rowId: string, ev: React.MouseEvent) {
        const punchId = parseInt(rowId);
        console.log(rowId);
        dispatch(selectionSlice.actions.selectPunch(punchId, ev.ctrlKey || ev.shiftKey))
    }
    const { data: punches, error } = useGetPunchesQuery();
    if (punches) {
        return (
            <DataTable data={punches} columns={punchListColumns} getRowKey={getRowKey} onRowClick={onRowClick}/>
        );
    }
    if (error) {
        return <b>Error</b>;
    }
    return <i>Loading...</i>
};

export default Punchlist;
