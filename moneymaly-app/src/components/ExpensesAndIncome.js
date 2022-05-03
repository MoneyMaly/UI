import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';

export default function ComparatorSortingGrid(props) {

    const columns = [
        {
            field: 'id', headerName: "ID", type: 'number', hide: false, width: 120,
            renderCell: (params) => (
                <strong>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={() => alert('subject: ' + props.data[params.value].subject + ' price: ' + props.data[params.value].price + ' date: ' + props.data[params.value].date + ' id: ' + props.data[params.value].id + ' username: ' + props.accountData.usernamne + ' account_number: ' + props.accountData.account_number + ' owner: ' + props.accountData.owner + ' ssn: ' + props.accountData.ssn)}
                    >
                        Deal Info
                </Button>
                </strong>
            ),
        },
        { field: 'subject', headerName: "Subject", width: 140 },
        {
            field: 'price', headerName: "Price (USD)", type: 'number', width: 190,
            renderCell: (params) => (
                <strong>
                    <p style={{ color: params.value < 0 ? "red" : "green" }}>{params.value}</p>
                </strong>
            )
        },
        { field: 'date', headerName: 'Date', type: 'date', width: 200 }
    ];
    const sortModel = [
        {
            field: 'date',
            sort: 'asc'
        }
    ];

    //ToDO: add button for set sector, update or insert new one
    //ToDo: fix onChange selected date the table is changed
    //ToDo: fix No Data Avialabe for this date if i dont already click GO button
    return (
        <div style={{ flex: 1, flexDirection: 'row', textAlign: "center" }}>
            <DataGrid autoHeight disableSelectionOnClick rowsPerPageOptions={[5, 10, 20, 50, 100]} sortModel={sortModel} rows={props.data} columns={columns} />
        </div>
    );
}

