import React, { useState, useEffect } from 'react';
import { Avatar, Button, CardActions, Container, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { get_user_data_with_token, update_user_data_with_token } from '../adapters/user_service_adapter';
import { get_user_bank_accounts_list, delete_user_bank_accounts_list, add_user_bank_accounts_list } from '../adapters/bank_service_adapter';
import { NavLink, Redirect } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import SendIcon from '@material-ui/icons/Send';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import jwt_decode from "jwt-decode";
import ContactMailIcon from '@material-ui/icons/ContactMail';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import { Card, CardHeader, IconButton, CardContent } from '@material-ui/core';

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
    paperData: {
        textAlign: 'center',
        color: theme.palette.primary.main
    },
    accountCardData: {
        padding: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        marginBottom: "5%",
        textAlign: 'left'
    },
    expand: {
        marginLeft: "90%",
        marginTop: "-10%",
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },   
    deleteButton: {
        padding: theme.spacing(0)
    },
    addButtonPopup: {
        color: "#fff",
        backgroundColor: theme.palette.success.main,
        '&:hover': {
            backgroundColor: theme.palette.success.light,
            color: '#fff'
        },
    },
    addButton: {
        padding: theme.spacing(0),
        color: theme.palette.success.main,
        '&:hover': {
            color: theme.palette.success.light
        }
    },
    EditButton: {
        padding: theme.spacing(1),
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        backgroundColor: theme.palette.info.main,
        color: "#fff",
        '&:hover': {
            backgroundColor: theme.palette.info.light,
            color: "#fff"
        }
    },
    EditButtonIcon: {
        marginLeft: theme.spacing(1)               
    }
}));

export default function UserProfile() {
    const [userProfileData, setUserProfileData] = useState({
        username: "",
        role: "",
        email: "",
        full_name: "",
        phone: ""
    });

    const [userBankAccountsList, setUserBankAccountsList] = useState({
        account_list: []
    });
    const [expanded] = React.useState(false);
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
            deal_id: "",
            price: "",
            business_phone: ""
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
            add_user_bank_accounts_list(localStorage.getItem('username'), AddBankDataState.owner_name, AddBankDataState.ssn,
                AddBankDataState.account_number, localStorage.getItem('token'))
                .then(data => {
                    get_user_bank_accounts_list(localStorage.getItem('username'), localStorage.getItem('token'))
                        .then(data => {
                            setUserBankAccountsList(prevState => ({ ...prevState, account_list: data }));
                        });
                })
            setOpen(false);
        };

        const values_not_empty = AddBankDataState.owner_name && AddBankDataState.account_number && AddBankDataState.ssn

        const name_error = (AddBankDataState.owner_name === null || AddBankDataState.owner_name === '') ? true : isNaN(AddBankDataState.owner_name);
        const account_number_error = (AddBankDataState.account_number === null || AddBankDataState.account_number === '') ? false : isNaN(AddBankDataState.account_number);
        const ssn_error = (AddBankDataState.ssn === null || AddBankDataState.ssn === '') ? false : isNaN(AddBankDataState.ssn);

        return (
            <div>
                <IconButton className={props.classes.addButton} onClick={handleClickOpen} title={"Add Bank Account"}>
                    <AddCircleIcon style={{ fontSize: 60 }} />
                </IconButton>
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
                                    label="Ssn Number"
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
                        <Button onClick={handleSubmitNewBankAccount} disabled={(!name_error || account_number_error || ssn_error) || !values_not_empty} variant="contained" className={props.classes.addButtonPopup}>
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
                <IconButton onClick={handleClickOpen} color="secondary" title={"Remove Bank Account"} className={classes.deleteButton}>
                    <DeleteTwoToneIcon />
                </IconButton>
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

    function DisplayBankAccount(bank_account) {
        return (
            <Card key={bank_account.account_number} className={classes.accountCardData}>
            <CardHeader
                    avatar={
                        <AccountBalanceIcon style={{ paddingRight: '6px' }} />
                    }
                    title={'Account Number:  ' + bank_account.account_number}
                    subheader={"Owner: " + bank_account.owner}
                />
                <CardContent>
                <Typography variant="body2" color="textSecondary" component="p" >
                        <b>Account Owner: {bank_account.owner}</b><br />
                        <b>ssn: {bank_account.ssn}</b><br />
                        <b>Username: {bank_account.username}</b><br />
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component={'span'}>
                        <div className={clsx(classes.expand, { [classes.expandOpen]: expanded })}>
                            <DraggableRemoveBankAccountDialog account_number={bank_account.account_number} />
                        </div>
                    </Typography>
                </CardContent>
            </Card>
        );
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
                {bank_account_list.account_list.map((account) => DisplayBankAccount(account))}
                <DraggableAddBankAccountDialog classes={classes} />
            </div>
        );
    };
    function update_user_data() {
        get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'))
            .then(data => {
                setUserProfileData(data);
            });
    }

    function DraggableEditUserInfo(props) {
        const [open, setOpen] = React.useState(false);
        const [userNewInfo, setUserNewInfo] = useState({
            email: '',
            phone: ''
        });
        const handleClickOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        const phone_error = (userNewInfo.phone === null || userNewInfo.phone === '') ? false : isNaN(userNewInfo.phone.replace('+', '0'));
        const handleChange = (e) => {
            const { id, value } = e.target
            setUserNewInfo(prevState => ({
                ...prevState,
                [id]: value
            }));
        };
        const HandleNewUserInfo = () => {
            update_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'), userNewInfo.phone, userNewInfo.email)
                .then(data => {
                    setOpen(!data);
                    update_user_data();
                });
        };

        return (
            <div>
                <Button className={classes.EditButton} variant="contained" title={"Update Your Account Info"} onClick={handleClickOpen}>
                    Edit<EditIcon className={classes.EditButtonIcon} />
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        <ContactMailIcon fontSize="large" style={{ color: "black", paddingRight: '20px' }} />Update Your Account Info
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText component={'span'} className={classes.dialogOffer}>
                            <form noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    value={userNewInfo.email}
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoFocus
                                    onChange={handleChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    value={userNewInfo.phone}
                                    fullWidth
                                    id="phone"
                                    label="Phone"
                                    name="phone"
                                    helperText={phone_error ? "" : "Numbers only"}
                                    error={phone_error}
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </form>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className={classes.dialogOffer}>
                        <Button autoFocus onClick={handleClose} variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={HandleNewUserInfo} variant="contained" disabled={phone_error || userNewInfo.phone === '' || userNewInfo.email === ''} className={classes.EditButton}>
                            Update
                            <SendIcon style={{ paddingLeft: '6px' }} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    function render_user_logged_in(data) {
        if (data != null && data.full_name) {
            return (
                <Paper className={classes.paper} elevation={0}>
                    <h1>Account Information</h1>
                    <Card className={classes.accountCardData}>
                        <CardHeader
                            avatar={<Avatar style={{ backgroundColor: "black" }} />}
                            title={data.full_name}
                            subheader={"Username: " + data.username}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Email:  <b>{data.email}</b>
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Phone:  <b>{data.phone}</b>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <DraggableEditUserInfo />
                        </CardActions>
                    </Card>
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
            <h5 className="center">You are not logged in !</h5>
            <h5 className="center">Please Login First <NavLink to="/Login">Login</NavLink></h5>
            <Redirect to="/Login" />        
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
                    {(localStorage.getItem('UserRole') === "private") ? (
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper} elevation={0}>
                                {render_user_bank_accounts_list(userBankAccountsList)}
                            </Paper>
                        </Grid>
                    ) : (
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper} elevation={0}>
                                <h1>Current Offers</h1>
                            </Paper>
                        </Grid>
                    )}                    
                </Grid>
            </div>
        ) :
            (
                renderUserNotLoggedIn
            )
    );
};