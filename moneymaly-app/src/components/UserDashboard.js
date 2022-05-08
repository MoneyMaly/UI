import { Card, CardHeader, Avatar, IconButton, CardMedia, CardActions, CardContent, Button, Container, Grid, makeStyles, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import jwt_decode from "jwt-decode";
import filter from 'lodash/filter';
import React, { useEffect, useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { get_user_bank_accounts_list, get_user_monthly_balance, get_account_monthly_balance } from '../adapters/bank_service_adapter';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import { get_account_anomaly_by_date } from '../adapters/business_service_adapter';
import Alert from '@material-ui/lab/Alert';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ComparatorSortingGrid from './ExpensesAndIncome';
import moment from "moment";
import AnomalyChartTest from './AnomalyCharts';
import clsx from 'clsx';
import TimelineIcon from '@material-ui/icons/Timeline';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    expensesAndIncomePaper: {
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(5),
        textAlign: 'left',
        color: theme.palette.primary.main
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.primary.main
    },
    showResultButton: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        color: "#fff",
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.success.light,
            color: '#fff'
        },
    },
    closeResultButton: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(1)
    },
    anomalyChart: {
        marginRight: theme.spacing(8),
        marginTop: theme.spacing(4)
    },    
    paperAccounts: {
        padding: theme.spacing(2),
        textAlign: 'left',
        variant: 'outlined'
    },
    paperAccounts2: {
        padding: theme.spacing(2),
        marginLeft: theme.spacing(-1),
        textAlign: 'right',
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
    const [userAccountBalances, setUserAccountBalances] = useState({
        bankAccountsBalance: [],
        selectedBankAccountBalance: [],
        chartOpen: false
    });
    const [userBankAccountAnomaly, setUserBankAccountAnomaly] = useState({
        selectedBankAccountAnomaly: [],
        anomalySubjects: [],
        chartOpen: false
    });   
    const [selectedDates, setSelectedDates] = useState({
        month: 6,
        year: 2022
    });
    const [selectedAnomalyDates, setSelectedAnomalyDates] = useState({
        from_year: 2022,
        to_year: 2022,
        from_month: 4,
        to_month: 6
    });
    function get_bank_account_balance(month, year) {
        get_account_monthly_balance(localStorage.getItem('username'), localStorage.getItem('token'),
            userBankAccounts.selectedAccountData.account_number, userBankAccounts.selectedAccountData.ssn, userBankAccounts.selectedAccountData.owner, month, year)
            .then(data => {
                setUserAccountBalances(prevState => ({ ...prevState, selectedBankAccountBalance: data, chartOpen: true }));
            });
    };
    function get_bank_account_anomaly_by_date(accountNumber = null) {
        get_account_anomaly_by_date(localStorage.getItem('username'), localStorage.getItem('token'),
        accountNumber, selectedAnomalyDates.from_year, selectedAnomalyDates.to_year, selectedAnomalyDates.from_month,
        selectedAnomalyDates.to_month)
        .then(dataResult => {
            var result = [];
                var subjects = [];
                dataResult.map((item, index) => {
                    var subject = item.sector + " - " + item.company;
                    subjects.push(subject);
                    item.payments.map((payment, index) => {
                        var object = { 'date': moment(payment.date).toDate() };
                        object[subject] = payment.price + " $";
                        result.push(object);
                    })
                });
                result.sort((a, b) => b.date - a.date);
                setUserBankAccountAnomaly(prevState => ({ ...prevState, selectedBankAccountAnomaly: result, anomalySubjects: subjects, chartOpen: true }));
            });
    };

    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'))
                .then(data => {
                    setUserProfileData(data);
                });
            get_user_bank_accounts_list(localStorage.getItem('username'), localStorage.getItem('token'))
                .then(data => {
                    setUserBankAccounts(prevState => ({ ...prevState, account_list: data, selectedAccountData: data[0], selectedAccount: data[0].account_number }));
                    if (data[0].account_number != null) {
                        get_bank_account_anomaly_by_date(data[0].account_number);
                    }
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
            setUserAccountBalances(prevState => ({ ...prevState, selectedBankAccountBalance: [], chartOpen: false }));
            setUserBankAccountAnomaly(prevState => ({ ...prevState, chartOpen: false }));
        };

        return (
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <TextField
                        id="outlined-select-user-account"
                        select
                        label="Bank Account"
                        value={userBankAccounts.selectedAccount}
                        onChange={handleAccountChange}
                        helperText="Please select your bank account"
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
                <CardContent className={classes.expensesAndIncomePaper}>
                    <h2><SwapHorizIcon fontSize="small" /> Expenses & Income</h2>
                    <DisplayExpensesAndIncome />              
                </CardContent>
                {/* <CardActions disableSpacing>
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
                    <Paper className={classes.expensesAndIncomePaper}>
                        <DisplayExpensesAndIncome />
                    </Paper>
                    </CardContent>
                    </Collapse>*/}
            </Card>
        );
    };
    const months = [
        {
            value: '1',
            label: 'January'
        },
        {
            value: '2',
            label: 'February'
        },
        {
            value: '3',
            label: 'March'
        },
        {
            value: '4',
            label: 'April'
        },
        {
            value: '5',
            label: 'May'
        },
        {
            value: '6',
            label: 'June'
        },
        {
            value: '7',
            label: 'July'
        },
        {
            value: '8',
            label: 'August'
        },
        {
            value: '9',
            label: 'September'
        },
        {
            value: '10',
            label: 'October',
        },
        {
            value: '11',
            label: 'November'
        },
        {
            value: '12',
            label: 'December'
        }
    ];
    const years = Array.apply(null, Array(7)).map(function (_, i) { return { 'value': i + 2015, 'label': i + 2015 }; })    
    
    function DisplayExpensesAndIncome() {
        const handleDateChange = (e) => {
            const { id, value } = e.target
            setSelectedDates(prevState => ({ ...prevState, [id]: value }));
        };

        const handelSearchExpensesAndIncome = (e) => {
            get_bank_account_balance(selectedDates.month, selectedDates.year);
        };

        function ExpensesAndIncomeObjects() {
            return (
                !userAccountBalances.chartOpen ? (
                    <div>
                        <br />
                    </div>
                ) : (
                    userAccountBalances.selectedBankAccountBalance.length === 0 ? (
                        <div>
                            <Alert severity="warning">No Data Avialabe for this date</Alert>
                        </div>
                    ) :
                        (<div>
                            <ComparatorSortingGrid accountData={userBankAccounts.selectedAccountData} data={userAccountBalances.selectedBankAccountBalance.map((item, index) =>
                                ({ price: item.price, subject: item.subject, date: moment(item.date).format("DD-MM-YYYY"), id: index }))} />
                        </div>
                        ))
            );
        };
        
        const monthAndYearListTextField = (
            <div>
                <TextField
                    id="year"
                    name="year"
                    select
                    label="Year"
                    value={selectedDates.year}
                    helperText="Please select Year"
                    variant="outlined"
                    onChange={handleDateChange}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {years.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>               
                <TextField
                    id="month"
                    name="month"
                    select
                    label="Month"
                    value={selectedDates.month}
                    helperText="Please select Month"
                    variant="outlined"
                    onChange={handleDateChange}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {months.map((option) => {
                        var current_date = new Date;
                        if (selectedDates.year < current_date.getFullYear() || option.value <= current_date.getMonth() + 1) {
                            return (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            );
                        };
                    })}
                </TextField>
                <Button className={classes.showResultButton} onClick={handelSearchExpensesAndIncome} variant="contained">GO!</Button>
                <Button className={classes.closeResultButton} disabled={!userAccountBalances.chartOpen}
                    onClick={() => setUserAccountBalances(prevState => ({ ...prevState, chartOpen: false }))} variant="contained">Close</Button>
            </div>
        );
        return (
            <div>
                {monthAndYearListTextField}
                {ExpensesAndIncomeObjects()}
            </div>
        );
    };

    function DisplayAnomalyGraphs() {
        const handleAnomalyDateChange = (e) => {
            const { id, value } = e.target
            setSelectedAnomalyDates(prevState => ({ ...prevState, [id]: value }));
        };

        function AnomalyDataObjects() {
            return (
                !userBankAccountAnomaly.chartOpen ? (
                    <div>
                        <h3><br /></h3>
                    </div>
                ) :
                    (
                        <div className={classes.anomalyChart}>
                            {(userBankAccountAnomaly.anomalySubjects.length > 0) ?
                                (
                                    <div>
                                        <Alert severity="warning"><b>Warning</b> - {userBankAccountAnomaly.anomalySubjects.length} Anomalies Detected For Selected Dates</Alert>
                                        <AnomalyChartTest subjects={userBankAccountAnomaly.anomalySubjects} data={userBankAccountAnomaly.selectedBankAccountAnomaly} />
                                    </div>
                                ) :
                                (<Alert severity="success">No Anomalies Detected For Selected Dates</Alert>)}
                        </div>
                    )                
            );
        };

        const monthAndYearListTextField = (
            <div>          
                <TextField
                    id="from_year"
                    name="from_year"
                    select
                    label="From Year"
                    value={selectedAnomalyDates.from_year}
                    helperText="Select From Year"
                    variant="outlined"
                    onChange={handleAnomalyDateChange}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {years.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>-
                <TextField
                    id="to_year"
                    name="to_year"
                    select
                    label="To Year"
                    value={selectedAnomalyDates.to_year}
                    helperText="Select To Year"
                    variant="outlined"
                    onChange={handleAnomalyDateChange}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {years.map((option) => {
                        if (option.value >= selectedAnomalyDates.from_year) {
                            return (<option key={option.value} value={option.value}>{option.label}</option>);
                        }
                    })}
                </TextField>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <TextField
                    id="from_month"
                    name="from_month"
                    select
                    label="From Month"
                    value={selectedAnomalyDates.from_month}
                    helperText="Select From Month"
                    variant="outlined"
                    onChange={handleAnomalyDateChange}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {months.map((option) => {
                        var current_date = new Date;
                        if (selectedAnomalyDates.from_year < current_date.getFullYear() || option.value <= current_date.getMonth() + 1) {
                            return (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            );
                        };
                    })}
                </TextField>-
                <TextField
                    id="to_month"
                    name="to_month"
                    select
                    label="To Month"
                    value={selectedAnomalyDates.to_month}
                    helperText="Select To Month"
                    variant="outlined"
                    onChange={handleAnomalyDateChange}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {months.map((option) => {
                        var current_date = new Date;
                        if (selectedAnomalyDates.to_year < current_date.getFullYear() || option.value <= current_date.getMonth() + 1) {
                            return (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            );
                        };
                    })}                    
                </TextField>
                <Button className={classes.showResultButton} onClick={() => get_bank_account_anomaly_by_date(userBankAccounts.selectedAccount)} variant="contained">GO!</Button>
                <Button className={classes.closeResultButton} disabled={!userBankAccountAnomaly.chartOpen}
                    onClick={() => setUserBankAccountAnomaly(prevState => ({ ...prevState, chartOpen: false }))} variant="contained">Close</Button>
            </div>
        );
        return (
            <div>
                {monthAndYearListTextField}
                {AnomalyDataObjects()}
            </div>
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
            <h5 className="center">You are not logged in!</h5>
            <h5 className="center">Please Login First <NavLink to="/Login">Login</NavLink></h5>
            <Redirect to="/Login" />
        </Container>
    );
   
    return (
        IsUserTokenValid() ? (
            <div className={classes.root}>
                <Grid container spacing={0}>
                    <Grid item xs={9}>
                        <Paper className={classes.paper}>
                            <h1>MoneyMaly Dashboard</h1>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paperAccounts2} elevation={0}>
                            {renderSelectBankAccount()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paperAccounts} elevation={0}>
                            {DisplaySelectedAccount()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.expensesAndIncomePaper}>
                        <h1><TimelineIcon fontSize='large' />Anomaly Dedector</h1>
                            <DisplayAnomalyGraphs />
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