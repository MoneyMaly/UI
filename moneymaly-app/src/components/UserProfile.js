import React, { useState, useEffect } from 'react';
import { Button, Container, Fab, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import { get_user_bank_accounts_list, delete_user_bank_accounts_list, add_user_bank_accounts_list } from '../adapters/bank_service_adapter';
import { NavLink } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.secondary.main,
        variant: 'outlined'
    },
    paperData: {
        textAlign: 'center',
        color: theme.palette.primary.main
    },
    addButton: {
        color: "#fff",
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.success.light,
            color: '#fff'
        },
    }
}));

export default function UserProfile() {
    const [userProfileData, setUserProfileData] = useState({
        username: "",
        role: "",
        email: "",
        full_name: ""
    });

    const [userBankAccountsList, setUserBankAccountsList] = useState({
        account_list: []
    });

    const classes = useStyles();

    function PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }
    function DraggableAddBankAccountDialog(props) {
        const [open, setOpen] = React.useState(false);
        const handleClickOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };

        const [AddBankDataState, setAddBankDataState] = useState({
            owner_name: null,
            account_number: null,
            ssn: null
        });

        const handleChange = (e) => {
            const { id, value } = e.target
            setAddBankDataState(prevState => ({
                ...prevState,
                [id]: value
            }));
        };

        const handleSubmitNewBankAccount = () => {
            localStorage.getItem('username')
            console.log(AddBankDataState)
            add_user_bank_accounts_list(localStorage.getItem('username'), AddBankDataState.owner_name, AddBankDataState.ssn,
                AddBankDataState.account_number, localStorage.getItem('token'))
                .then(data => {
                    get_user_bank_accounts_list(localStorage.getItem('username'), localStorage.getItem('token'))
                        .then(data => {
                            setUserBankAccountsList(prevState => ({ ...prevState, account_list: data }));
                        });
                });
            setOpen(false);
        };

        const values_not_empty = AddBankDataState.owner_name && AddBankDataState.account_number && AddBankDataState.ssn

        const name_error = (AddBankDataState.owner_name === null || AddBankDataState.owner_name === '') ? true : isNaN(AddBankDataState.owner_name);
        const account_number_error = (AddBankDataState.account_number === null || AddBankDataState.account_number === '') ? false : isNaN(AddBankDataState.account_number);
        const ssn_error = (AddBankDataState.ssn === null || AddBankDataState.ssn === '') ? false : isNaN(AddBankDataState.ssn);

        return (
            <div>
                <Button variant="contained" className={props.classes.addButton} onClick={handleClickOpen}>
                    Add Bank Account
                    <AddCircleIcon style={{ paddingLeft: '6px' }} />
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        <AccountBalanceIcon style={{ paddingRight: '6px' }} /> Add Bank Account
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Add bank account to your usernamme: <b>{localStorage.getItem('username')}</b>.
                            <form className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="owner_name"
                                    label="Owner Name"
                                    name="owner_name"
                                    autoFocus
                                    helperText={name_error ? "" : "String only"}
                                    error={!name_error}
                                    onChange={handleChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="account_number"
                                    label="Account Number"
                                    name="account_number"
                                    helperText={account_number_error ? "Number only" : ""}
                                    error={account_number_error}
                                    onChange={handleChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="ssn"
                                    label="Ssn Numberr"
                                    name="ssn"
                                    helperText={ssn_error ? "Number only" : ""}
                                    error={ssn_error}
                                    onChange={handleChange}
                                />
                            </form>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose} variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitNewBankAccount} disabled={(!name_error || account_number_error || ssn_error) || !values_not_empty} variant="contained" className={props.classes.addButton}>
                            Add Bank Account
                            <AddCircleIcon style={{ paddingLeft: '6px' }} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    function DraggableRemoveBankAccountDialog(props) {
        const [open, setOpen] = React.useState(false);
        const handleClickOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        const HandleRemoveBankAccount = (account_number) => {
            delete_user_bank_accounts_list(localStorage.getItem('username'), account_number, localStorage.getItem('token'))
                .then(data => {
                    get_user_bank_accounts_list(localStorage.getItem('username'), localStorage.getItem('token'))
                        .then(data => {
                            setUserBankAccountsList(prevState => ({ ...prevState, account_list: data }));
                        });
                });
            setOpen(false);
        };

        return (
            <div>
                <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                Remove <DeleteTwoToneIcon style={{ paddingLeft: '6px' }} />
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <AccountBalanceIcon style={{ paddingRight: '10px' }} />Remove Bank Account
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Are you sure you want to remove this bank account number <b>{props.account_number}</b> ? To remove click Remove Bank Account, else cilck Cancel.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button autoFocus onClick={handleClose} variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={() => HandleRemoveBankAccount(props.account_number)} variant="contained" color="secondary">
                            Remove Bank Account
                            <DeleteTwoToneIcon style={{ paddingLeft: '6px' }} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    function bank_account_object(bank_account, classes) {
        return (
            <Paper className={classes.paperData}>
                <h3>owner: {bank_account.owner}</h3>
                <h4>account_number: {bank_account.account_number}</h4>
                <h4>ssn: {bank_account.ssn}</h4>
                <h4>username: {bank_account.username}</h4>
                <DraggableRemoveBankAccountDialog account_number={bank_account.account_number} />
            </Paper>
        )
    };

    function render_user_bank_accounts_list(bank_account_list) {
        if (bank_account_list.account_list === null || bank_account_list.account_list.length === 0) {
            return (
                <div>
                    <h1>Bank Accounts</h1>
                    <h3>Please add your bank account</h3>
                    <DraggableAddBankAccountDialog classes={classes} />
                </div>
            );
        }
        return (
            <div>
                <h1>Bank Accounts</h1>
                <DraggableAddBankAccountDialog classes={classes} />
                {bank_account_list.account_list.map((account) =>
                    bank_account_object(account, classes))}
            </div>
        );
    };

    function render_user_logged_in(data) {
        if (data != null && data.full_name) {
            return (
                <Paper className={classes.paper}>
                    <h1>Account Information</h1>
                    <h3>Full Name: {data.full_name}</h3>
                    <h3>Username: {data.username}</h3>
                    <h3>Role: {data.role}</h3>
                    <h3>Email: {data.email}</h3>
                </Paper>
            )
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'))
            .then(data => {
                setUserProfileData(data);
            });
        get_user_bank_accounts_list(localStorage.getItem('username'), localStorage.getItem('token'))
            .then(data => {
                setUserBankAccountsList(prevState => ({ ...prevState, account_list: data }));
            });
    } 
}, []);
    const IsUserTokenValid = () => {
        try {
            var tokenExp = jwt_decode(localStorage.getItem('token')).exp;
            if (tokenExp < Date.now() / 1000) {
                return false;
            }
            return true;
        } catch (InvalidTokenError) {
            console.warn('Invalid User Token')
            return false;
        }
    };

    const renderUserNotLoggedIn = (
        <Container component="main" maxWidth="xs">
            <h4 className="center">Home</h4>
            <h5 className="center">you are not logged in !</h5>
            <h5 className="center">Please Login First <NavLink to="/Login">Login</NavLink></h5>
        </Container>
    );

    return (
        IsUserTokenValid() ? (
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}><h1>User Profile</h1></Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {render_user_logged_in(userProfileData)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            {render_user_bank_accounts_list(userBankAccountsList)}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        ) :
            (
                renderUserNotLoggedIn
            )
    );
};