import { Card, CardHeader, Avatar, IconButton, CardMedia, CardActions, CardContent, Button, Container, Grid, makeStyles, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import jwt_decode from "jwt-decode";
import filter from 'lodash/filter';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { get_user_bank_accounts_list } from '../adapters/bank_service_adapter';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    expensesAndIncomePaper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.info.main
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.info.main
    },
    paperAccounts: {
        padding: theme.spacing(10),
        paddingBottom: theme.spacing(4),
        textAlign: 'left',
        variant: 'outlined'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',       
    }
}));

export default function UserDashboard() {
    const [userProfileData, setUserProfileData] = useState({
        username: "",
        role: "",
        email: "",
        full_name: ""
    });
    const [userBankAccounts, setUserBankAccounts] = useState({
        account_list: [],
        selectedAccount: "",
        selectedAccountData: {}
    });
    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'))
                .then(data => {
                    setUserProfileData(data);
                });
            get_user_bank_accounts_list(localStorage.getItem('username'), localStorage.getItem('token'))
                .then(data => {
                    setUserBankAccounts(prevState => ({ ...prevState, account_list: data, selectedAccountData: data[0], selectedAccount: data[0].account_number }));
                });
        }
    }, []);

    const classes = useStyles();

    function renderSelectBankAccount() {
        if (userBankAccounts.account_list.length <= 0) {
            return (
                <div>
                    <h3>Please add your bank accounts via your Profile Page</h3>
                    <Button variant="contained" color="primary" href="/UserProfile">
                        My Profile
                    </Button>
                </div>
            );
        };

        const handleAccountChange = (event) => {
            var selectedAccountData = filter(userBankAccounts.account_list, { 'account_number': event.target.value })[0]
            setUserBankAccounts(prevState => ({ ...prevState, selectedAccount: event.target.value, selectedAccountData: selectedAccountData }));
        };

        return (
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <TextField
                        id="outlined-select-user-account"
                        select
                        label="Select Account"
                        value={userBankAccounts.selectedAccount}
                        onChange={handleAccountChange}
                        helperText="Please select your account"
                        variant="outlined"
                    >
                        {userBankAccounts.account_list.map((account) => (
                            <MenuItem key={account.account_number} value={account.account_number}>
                                {account.account_number} - {account.owner}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
            </form>
        );
    };

    function DisplaySelectedAccount() {
        const [expanded, setExpanded] = React.useState(false);

        const handleExpandClick = () => {
            setExpanded(!expanded);
        };

        if (userBankAccounts.selectedAccount === "") {
            return;
        }

        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <AccountBalanceIcon style={{ paddingRight: '6px' }} />
                    }
                    title={'Account Number:  ' + userBankAccounts.selectedAccount}
                    subheader={"Owner: " + userBankAccounts.selectedAccountData.owner}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        This Bank Account own by <b>{userBankAccounts.selectedAccountData.owner}</b>, <b> ssn: {userBankAccounts.selectedAccountData.ssn}</b>
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>
                            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                            without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                            medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                            again without stirring, until mussels have opened and rice is just tender, 5 to 7
                            minutes more. (Discard any mussels that don’t open.)
                            </Typography>
                        <Typography>
                            Set aside off of the heat to let rest for 10 minutes, and then serve.
                            </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        );
    };

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
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <h1>MoneyMaly Dashboard</h1>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className={classes.paperAccounts} elevation={0}>
                            <h2>Your Bank Accounts</h2>
                            {renderSelectBankAccount()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Paper className={classes.paperAccounts} elevation={0}>
                            {DisplaySelectedAccount()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.expensesAndIncomePaper}>
                            <h1>Expenses & Income</h1>
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