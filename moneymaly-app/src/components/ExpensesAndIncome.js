import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Dialog, DialogTitle, withStyles } from '@material-ui/core';
import { Button, makeStyles, Paper, TextField } from '@material-ui/core';
import { add_user_deal_by_account_number, remove_user_deals_by_account_number, get_user_deals_by_account_number } from '../adapters/bank_service_adapter';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Draggable from 'react-draggable';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import CachedIcon from '@material-ui/icons/Cached';
import Alert from '@material-ui/lab/Alert';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

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
    },
    addButtonPopup: {
        color: "#fff",
        backgroundColor: theme.palette.success.main,
        '&:hover': {
            backgroundColor: theme.palette.success.light,
            color: '#fff'
        },
    },
    deleteButtonPopup: {
        backgroundColor: theme.palette.error.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.error.light,
            color: '#fff'
        },
    },
    updateButtonPopup: {
        color: "#fff",
        backgroundColor: theme.palette.warning.main,
        '&:hover': {
            backgroundColor: theme.palette.warning.light,
            color: '#fff'
        },
    },
    stars: {
        width: 200,
        display: 'flex',
        alignItems: 'center',
    },
}));

const labels = {
    0.5: 'Very Ridiculous',
    1: 'Ridiculous',
    1.5: 'Very Expensive',
    2: 'Expensive',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};


function HoverRating(props) {
    const [value, setValue] = React.useState(props.ratio / 2);
    const [hover, setHover] = React.useState(-1);
    const classes = useStyles();

    return (
        <div className={classes.stars}>
            <Rating
                name="hover-feedback"
                value={value}
                precision={0.5}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                onChangeActive={(event, newHover) => {
                    setHover(newHover);
                }}
            />
            {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
        </div>
    );
}


export default function ComparatorSortingGrid(props) {
    const classes = useStyles();
    const companySectors = ['', 'TV', 'Network', 'Cellular', 'Fitness', 'Car Insurenncae', 'Health Insurenncae'];
    const companySectorsDict = { 'TV': "Number Of Sports Channels", 'Network': "Speed In Mb", 'Cellular': 'Data Package In GB', 'Fitness': 'Number Of Days Per Week', 'Car Insurenncae': 'Driver Age', 'Health Insurenncae': 'Insured Age' };
    const [accountDeals, setAccountDeals] = useState({
        deals: []
    });

    useEffect(() => {
        get_user_deals_by_account_number(props.accountData.username, localStorage.getItem('token'), props.accountData.account_number)
            .then(data => {
                setAccountDeals(prevState => ({ ...prevState, deals: data }));
            });
    }, []);

    function DealPopupDialog(props) {
        const [selectedRowData, setSelectedRowData] = useState({
            id: null,
            sector: "",
            extra_info: ""
        });
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
        };
        const handleChange = (e) => {
            const { id, value } = e.target
            setSelectedRowData(prevState => ({
                ...prevState,
                [id]: value
            }));
        };
        const handleSubmitAddDeal = () => {
            setOpen(false);
            var extra_info_json = {};
            extra_info_json[companySectorsDict[selectedRowData.sector]] = selectedRowData.extra_info;
            add_user_deal_by_account_number(props.accountData.username, localStorage.getItem('token'), props.accountData.account_number, props.subject, selectedRowData.sector, extra_info_json)
                .then(result => {
                    get_user_deals_by_account_number(props.accountData.username, localStorage.getItem('token'), props.accountData.account_number)
                        .then(data => {
                            setAccountDeals(prevState => ({ ...prevState, deals: data }));
                        });
                });
        };
    
        const handleSubmitRemoveDeal = () => {
            setOpen(false);
            var extra_info_json = {};
            extra_info_json[companySectorsDict[selectedRowData.sector]] = selectedRowData.extra_info;
            remove_user_deals_by_account_number(props.accountData.username, localStorage.getItem('token'), props.accountData.account_number, props.subject)
                .then(result => {
                    get_user_deals_by_account_number(props.accountData.username, localStorage.getItem('token'), props.accountData.account_number)
                        .then(data => {
                            setAccountDeals(prevState => ({ ...prevState, deals: data }));
                        });
                });
        };

        const extra_info_input_error = (selectedRowData.extra_info === null || selectedRowData.extra_info === '') ? false : isNaN(selectedRowData.extra_info);
        const AddDealDialogContent = () => {
            return (
                <div>
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
                                disabled={selectedRowData.sector === null || selectedRowData.sector === ""}
                                type="numbers"
                                autoFocus
                                value={selectedRowData.extra_info}
                                id="extra_info"
                                label={companySectorsDict[selectedRowData.sector]}
                                name="extra_info"
                                onChange={handleChange}
                                helperText={extra_info_input_error ? "Enter Number Only" : ""}
                                error={extra_info_input_error}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitAddDeal} disabled={extra_info_input_error || selectedRowData.extra_info === null || selectedRowData.extra_info === "" || selectedRowData.sector === null || selectedRowData.sector === ""} variant="contained" className={classes.addButtonPopup}>
                            Add Deal
                            <AddCircleIcon style={{ paddingLeft: '6px' }} />
                        </Button>
                    </DialogActions>
                </div>
            );
        };
        const ExistingDealDialogContent = (propss) => {
            return (
                <div>
                    <DialogContent>
                        <DialogContentText>
                            This Expenses <u>already marked as Deal</u> of account : <b>{propss.accountData.account_number} ({propss.accountData.owner})</b><br />
                            Company: <b>{propss.companyName}</b><br />
                            Sector: <b>{propss.sector}</b><br />
                            <u>Extra Info</u>: <br /><i><b>{propss.extraInfo['key']}</b>: <b>{propss.extraInfo['value']}</b></i>
                            <br />You can Update the deal information or Delete it.
                        </DialogContentText>
                        <form className={classes.form} noValidate>
                            <TextField id="sector" name="sector" select label="Expenses Sector" variant="outlined"
                                value={selectedRowData.sector}
                                helperText="Please select expenses sector" onChange={handleChange} SelectProps={{ native: true, }}>
                                {companySectors.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </TextField>
                            <TextField
                                variant="outlined" margin="normal" required fullWidth type="numbers" autoFocus value={selectedRowData.extra_info}
                                id="extra_info" label={companySectorsDict[selectedRowData.sector]} name="extra_info"
                                onChange={handleChange} helperText={extra_info_input_error ? "Enter Number Only" : ""}
                                error={extra_info_input_error}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitAddDeal} disabled={extra_info_input_error || selectedRowData.extra_info === null || selectedRowData.extra_info === "" || selectedRowData.sector === null || selectedRowData.sector === ""} variant="contained" className={classes.updateButtonPopup}>
                            Update
                            <CachedIcon style={{ paddingLeft: '6px' }} />
                        </Button>
                        <Button onClick={handleSubmitRemoveDeal} variant="contained" className={classes.deleteButtonPopup}>
                            Delete
                            <DeleteTwoToneIcon style={{ paddingLeft: '6px' }} />
                        </Button>
                    </DialogActions>
                    </div>
            );
        };
        const splitDealExtraInfo = (extra_info) => {
            var res = Object.keys(extra_info).map((key, i) => ({ key: key, value: extra_info[key] }))[0];
            return res;
        };

        return (
            <div>
                <Button variant="outlined" color="primary" size="small" style={{ marginLeft: 16 }} onClick={handleClickOpen} title={"Deal Information"}>
                    Deal 
                </Button>
                <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        <CardGiftcardIcon style={{ paddingRight: '6px' }} /> Deal Information
                    </DialogTitle>
                    {(accountDeals.deals.map((deal) => deal.company)).includes(props.subject) ?
                        (<ExistingDealDialogContent companyName={props.subject} accountData={props.accountData}
                            sector={accountDeals.deals.map((deal) => { if (deal.company === props.subject) { return deal.sector } })}
                            extraInfo={splitDealExtraInfo(
                                accountDeals.deals.filter((deal) => { if (deal.company === props.subject) { return deal.extra_info } })[0].extra_info
                            )} />) :
                        (<AddDealDialogContent />)}               
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
            field: 'ratio', headerName: 'Price Ratio', type: 'date', width: 260,
            renderCell: (params) => (
                <strong>
                    {(accountDeals.deals.map((deal) => deal.company)).includes(props.data[params.id].subject) ?
                        (
                            <HoverRating ratio={params.value} />
                        ) : (' ')}
                </strong>
            ),
        },        
        {
            field: 'id', headerName: "Deal Info", type: 'date', hide: false, width: 140,
            renderCell: (params) => (
                <strong>
                    <DealPopupDialog accountData={props.accountData}
                        subject={props.data[params.value].subject}
                        price={props.data[params.value].price}
                        date={props.data[params.value].date} />
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

    return (
        <div style={{ flex: 1, flexDirection: 'row', textAlign: "center", marginRight: "5%" }}>
            <Alert severity="success">{props.data.length} Expenses And Income Detected For Selected Dates</Alert><br />
            <DataGrid disableSelectionOnClick autoHeight autoPageSize rowsPerPageOptions={[10, 20, 50, 100]} sortModel={sortModel} rows={props.data} columns={columns} />
        </div>
    );
}