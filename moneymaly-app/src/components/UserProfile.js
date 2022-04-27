import { Redirect } from 'react-router';
import React, { useState, useEffect } from 'react';
import { Button, Container, Fab, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import { get_user_bank_accounts_list, delete_user_bank_accounts_list } from '../adapters/bank_service_adapter';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import AddIcon from '@material-ui/icons/Add';

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
        backgroundColor: theme.palette.success.main
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
                    Remove
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        Remove Bank Account
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove this bank account number {props.account_number} ? To remove click Remove Bank Account, else click Cancel.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose} variant="contained" color="secondary.light">
                            Cancel
                        </Button>
                        <Button onClick={() => HandleRemoveBankAccount(props.account_number)} variant="contained" color="secondary">
                            Remove Bank Account
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
        if (bank_account_list.account_list.length == 0) {
            return (
                <div>
                    <h1>Bank Accounts</h1>
                    <h3>Please add your bank account</h3>
                </div>
            );
        }
        return (
            <div>
                <h1>Bank Accounts</h1>
                <Button >
                    <Fab className={classes.addButton} size="medium" aria-label="scroll back to top">
                        <AddIcon />
                    </Fab>
                </Button>
                {bank_account_list.account_list.map((account) =>
                    bank_account_object(account, classes))}
            </div>
        );
    };

    function render_user_logged_in(data) {
        if (data.full_name) {
            return (
                <Paper className={classes.paper}>
                    <h1>Account Information</h1>
                    <h3>Full Name: {data.full_name}</h3>
                    <h3>Username: {data.username}</h3>
                    <h3>Role: {data.role}</h3>
                    <h3>Email: {data.email}</h3>
                    <Button variant="contained" color="primary">Edit</Button>
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
    
    return (
        localStorage.getItem('token') ? (
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
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            You Are Not Logged In ...
                       </Typography>
                        <Redirect to="/Login" />
                    </div>
                    </Container>
            )
    );
};