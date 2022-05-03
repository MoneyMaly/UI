import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { randomCreatedDate, randomUpdatedDate, } from '@material-ui/x-grid-data-generator';
import moment from "moment";


const columns = [
    { field: 'id', type: 'number', width: 90, hide: true },
    { field: 'subject', width: 140 },
    { field: 'price', type: 'number', width: 110 },
    { field: 'date', type: 'date', width: 200 }
];

const sortModel = [
    {
        field: 'date',
        sort: 'asc'
    }
];

export default function ComparatorSortingGrid(props) {
    //ToDO: message of no content , color of prices (red or green)
    //ToDO: add button for set sector, update or insert new one
    return (
        <div style={{ height: 400 }}>
            <DataGrid sortModel={sortModel} rows={props.data} columns={columns} />
        </div>
    );
}

