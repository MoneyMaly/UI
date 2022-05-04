import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Dialog, DialogTitle } from '@material-ui/core';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardActions, CardContent, Button, Container, Grid, makeStyles, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import { get_user_bank_accounts_list, delete_user_bank_accounts_list, add_user_bank_accounts_list } from '../adapters/bank_service_adapter';
import { NavLink } from 'react-router-dom';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Draggable from 'react-draggable';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.primary.main,
        variant: 'outlined'
    },
    form: {
        marginTop: theme.spacing(4),
    }
}));

export default function ComparatorSortingGrid(props) {
    const classes = useStyles();

    function DealPopupDialog(props) {
        const [open, setOpen] = React.useState(false);
        const handleClickOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        function PaperComponent(props) {
            return (
                <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                    <Paper {...props} />
                </Draggable>
            );
        }
        const companySectors = [null, 'TV', 'Network', 'Cellular', 'Fitness', 'Car Insurenncae', 'Health Insurenncae'];
        const companySectorsDict = { 'TV': "Sports Channels", 'Network': "Speed", 'Cellular': 'Data Package', 'Fitness': 'Number Of Days Per Week', 'Car Insurenncae': 'Driver Age', 'Health Insurenncae': 'Insured Age' };
        const [selectedRowData, setSelectedRowData] = useState({
            id: null,
            sector: null,
        });
        const [selectedExtraInfo, setselectedExtraInfo] = useState({
            extra_info: null
        });

        const handleChange = (e) => {
            const { id, value } = e.target
            setSelectedRowData(prevState => ({
                ...prevState,
                [id]: value
            }));
        };

        const handleExtraInfoChange = (e) => {
            const { id, value } = e.target
            setselectedExtraInfo(prevState => ({
                ...prevState,
                [id]: value
            }));
        };

        return (
            <div>
                {/* ('token: ' + localStorage.getItem('token') + 'subject: ' + props.data[params.value].subject + ' price: ' + props.data[params.value].price + ' date: ' + props.data[params.value].date + ' id: ' + props.data[params.value].id + ' username: ' + props.accountData.usernamne + ' account_number: ' + props.accountData.account_number + ' owner: ' + props.accountData.owner + ' ssn: ' + props.accountData.ssn)} */}
                <Button variant="outlined" color="primary" size="small" style={{ marginLeft: 16 }} onClick={handleClickOpen} title={"Deal Information"}>
                    Deal Info
                </Button>
                <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        <CardGiftcardIcon style={{ paddingRight: '6px' }} /> Deal Information
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Add this Expenses as Deal of account : <b>{props.accountData.account_number} ({props.accountData.owner})</b><br />
                            Company: <b>{props.subject}</b>
                        </DialogContentText>
                        <form className={classes.form} noValidate>
                            <TextField
                                id="sector"
                                name="sector"
                                select
                                label="Expenses Sector"
                                value={selectedRowData.sector}
                                helperText="Please select expenses sector"
                                variant="outlined"
                                onChange={handleChange}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {companySectors.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </TextField>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="text"
                                value={selectedExtraInfo.extra_info}
                                id="extra_info"
                                label={companySectorsDict[selectedRowData.sector]}
                                name="extra_info"
                                onChange={handleExtraInfoChange}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained">
                            Cancel
                        </Button>
                        <Button >
                            Add Bank Account
                            <AddCircleIcon style={{ paddingLeft: '6px' }} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    const columns = [
        { field: 'subject', headerName: "Company", width: 140 },
        {
            field: 'price', headerName: "Price (USD)", type: 'number', width: 190,
            renderCell: (params) => (
                <strong>
                    <p style={{ color: params.value < 0 ? "red" : "green" }}>{params.value}</p>
                </strong>
            )
        },
        { field: 'date', headerName: 'Date', type: 'date', width: 200 },
        {
            field: 'id', headerName: " ", type: 'number', hide: false, width: 120,
            renderCell: (params) => (
                <strong>
                    <DealPopupDialog accountData={props.accountData} subject={props.data[params.value].subject} price={props.data[params.value].price} date={props.data[params.value].date} />
                </strong>
            ),
        }
    ];
    const sortModel = [
        {
            field: 'date',
            sort: 'asc'
        }
    ];

    //ToDO: add button for set sector, update or insert new one
    //ToDo: Show user deal in my profile page
    //ToDo: Add anomaly - get last 3 month by default
    return (
        <div style={{ flex: 1, flexDirection: 'row', textAlign: "center", marginRight: "5%" }}>
            <DataGrid disableSelectionOnClick autoHeight autoPageSize rowsPerPageOptions={[10, 20, 50, 100]} sortModel={sortModel} rows={props.data} columns={columns} />
        </div>
    );
}

