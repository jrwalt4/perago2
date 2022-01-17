/**
 * DateTable
 */
import React, { useCallback, useMemo, useState } from "react";
import type { Key as ReactKey, ReactText, ReactNode, MouseEventHandler, MouseEvent } from "react";
import MTable from "@mui/material/Table";
import type { TableProps as MTableProps } from '@mui/material/Table';
import MTableBody from '@mui/material/TableBody';
import MTableRow from "@mui/material/TableRow";
import type { TableRowProps as MTableRowProps } from "@mui/material/TableRow";
import MTableCell from "@mui/material/TableCell";
import MTableHead from "@mui/material/TableHead";
import MIconButton from "@mui/material/IconButton";
import MMenu from "@mui/material/Menu";
import type { MenuProps } from "@mui/material/Menu";
import MMenuItem from "@mui/material/MenuItem";

import MMoreVertIcon from '@mui/icons-material/MoreVert';

import { TableCellProps as ColumnRenderProps } from '@mui/material/TableCell';

export type RenderFn<T, V> = (value: V, item: T) => ReactNode;

export type AccessorFn<T, V> = (item: T) => V;

interface DataColumnDefCommon<T, V> {
    title?: ReactNode;
    render?: RenderFn<T, V>;
    hidden?: boolean;
    props?: ColumnRenderProps;
    cellElement?: React.ReactElement;
}

export interface DataColumnDefAccessor<T, V> extends DataColumnDefCommon<T, V> {
    accessor: AccessorFn<T, V>;
    id: string;
}

export interface DataColumnDefField<T, V> extends DataColumnDefCommon<T, V> {
    accessor: Extract<keyof T, string>;
}

export type DataColumnDef<T, V> = DataColumnDefAccessor<T, V> | DataColumnDefField<T, V>;

export type DataColumnsProp<T> = DataColumnDef<T, any>[];

function isColumnDefField<T, V>(
    colDef: DataColumnDef<T, V>
): colDef is DataColumnDefField<T, V> {
    return typeof colDef.accessor === 'string';
}

function identity<T>(t: T) {
    return t;
}

class DataColumn<T, V> {
    private _id: string;
    private _title: string | React.ReactNode;
    private _accessor: AccessorFn<T, V>;
    private _hidden: boolean;
    private _cellProps: ColumnRenderProps;

    private _renderCell: (value: V, item: T) => React.ReactNode;

    constructor(def: DataColumnDef<T, V>) {
        this._hidden = Boolean(def.hidden);
        this._cellProps = def.props || {};
        if (isColumnDefField(def)) {
            this._id = def.accessor;
            this._accessor = (d: T) => (d[def.accessor] as unknown) as V;
        } else {
            this._id = def.id;
            this._accessor = def.accessor as AccessorFn<T, V>;
        }
        this._title = typeof def.title === 'string' ? def.title : this._id;
        if (typeof def.render === 'function') {
            this._renderCell = def.render;
        } else {
            this._renderCell = identity;
        }
    }

    get isHidden(): boolean {
        return this._hidden;
    }

    get id() {
        return this._id;
    }

    get cellProps(): ColumnRenderProps {
        return this._cellProps;
    }

    getValue(item: T): V {
        return this._accessor(item);
    }

    renderTitle() {
        return this._title;
    }

    renderCell(item: T) {
        return this._renderCell(this._accessor(item), item);
    }
}


type UserRowProps<T> = MTableRowProps<'tr'> | ((item: T) => MTableRowProps<'tr'>);

interface DataTableRowProps<T> {
    rowData: T;
    // tslint:disable-next-line: no-any
    columns: DataColumn<T, any>[];
    rowId: ReactKey;
    onClick: MTableRowProps['onClick'];
    userProps?: UserRowProps<T>;
}

function DataTableRow<T>(props: DataTableRowProps<T>) {
    const { rowData, rowId, columns, onClick, userProps } = props;
    const rowProps = typeof userProps === 'function' ? userProps(rowData) : userProps;
    return (
        <MTableRow
            {...rowProps}
            data-id={rowId}
            onClick={onClick}
            hover
        >
            {columns.map(col => (
                (
                    <MTableCell
                        key={col.id}
                        {...col.cellProps}
                    >
                        {col.renderCell(rowData)}
                    </MTableCell>
                )
            ))}
        </MTableRow>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DataTableRowClickHandler<T> = (rowId: string, ev: MouseEvent<HTMLTableRowElement>) => void;

interface DataTableBodyProps<T> {
    data: T[];
    // tslint:disable-next-line: no-any
    columns: DataColumn<T, any>[];
    rowProps?: UserRowProps<T>;
    rowActions?: UserRowAction<T>[];
    getRowKey: (item: T) => ReactText;
    onRowClick?: DataTableRowClickHandler<T>;
}

function DataTableBody<T>(props: DataTableBodyProps<T>) {
    const getRowProps = typeof props.rowProps === 'function' ? props.rowProps : (_item: T) => props.rowProps;
    const { onRowClick } = props;
    const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
        if (typeof onRowClick === 'function') {
            const id = event.currentTarget.dataset.id!;
            onRowClick(id, event); // pass event too
        }
    };
    return (
        <MTableBody>
            {props.data.map((item, index) => {
                let id = props.getRowKey?.(item) || index;
                return (
                    <DataTableRow<T>
                        columns={props.columns}
                        rowData={item}
                        rowId={id}
                        key={id}
                        onClick={handleClick}
                        userProps={getRowProps(item)}
                    />
                );
            })}
        </MTableBody>
    );
}

interface TableHeadProps {
    // tslint:disable-next-line: no-any
    columns: DataColumn<any, any>[];
}

function DataTableHead(props: TableHeadProps) {
    const { columns } = props;
    return (
        <MTableHead>
            <MTableRow>
                {columns.map(col => (
                    <MTableCell key={col.id}>{col.renderTitle()}</MTableCell>
                ))}
            </MTableRow>
        </MTableHead>
    );
}

export interface UserRowAction<T> {
    icon: ReactNode;
    onClick: (item: T) => void;
}

export interface DataTableRowActionsProps<T> {
    item: T;
    actions: UserRowAction<T>[];
}

function DataTableRowActions<T>(props: DataTableRowActionsProps<T>) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleClick: MouseEventHandler<HTMLElement> = useCallback((event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }, [setAnchorEl]);
    const handleClose: MenuProps['onClose'] = useCallback((event, reason) => {
        setAnchorEl(null);
    }, [setAnchorEl]);
    return (
        <>
            <MIconButton onClick={handleClick}><MMoreVertIcon /></MIconButton>
            <MMenu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
            >
                {props.actions.map(({ onClick: onActionClick, icon }, index) => (
                    <MMenuItem
                        key={index}
                        onClick={() => onActionClick(props.item)}
                    >
                        {icon}
                    </MMenuItem>
                )
                )}
            </MMenu>
        </>);
}

export interface DataTableProps<T> extends MTableProps {
    data: T[];
    // tslint:disable-next-line: no-any
    columns: DataColumnDef<T, any>[];
    rowProps?: UserRowProps<T>;
    rowActions?: UserRowAction<T>[];
    getRowKey: (item: T) => ReactText;
    onRowClick?: DataTableRowClickHandler<T>
}

export default function DataTable<T>(props: DataTableProps<T>) {
    const columns = useMemo(() => {
        let columns = props.columns.filter((colDef) => !colDef.hidden).map((colDef) => {
            return new DataColumn(colDef);
        });
        const rowActions = props.rowActions;
        if (null != rowActions) {
            columns.push(new DataColumn<T, {}>({
                title: '',
                id: '$$row_actions$$',
                accessor: identity,
                props: { padding: 'none' },
                render: (_value: {}, item: T) => <DataTableRowActions item={item} actions={rowActions} />
            }));
        }
        return columns;
    }, [props.columns, props.rowActions]);

    return (
        <MTable>
            <DataTableHead columns={columns} />
            <DataTableBody columns={columns} getRowKey={props.getRowKey} data={props.data} onRowClick={props.onRowClick}/>
        </MTable>
    );
}
