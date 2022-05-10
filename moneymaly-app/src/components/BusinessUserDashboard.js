import { Card, CardHeader, Avatar, IconButton, CardMedia, CardActions, CardContent, Button, Container, Grid, makeStyles, MenuItem, Paper, TextField, Typography, DialogActions } from '@material-ui/core';
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { get_all_users_deals } from '../adapters/bank_service_adapter';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import WidgetsIcon from '@material-ui/icons/Widgets';
import SendIcon from '@material-ui/icons/Send';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.info.main
    },
    paperUsersDeals: {
        padding: theme.spacing(2),
        textAlign: 'left',
        color: theme.palette.info.main
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
    paperCardData: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.info.main
    },
    dealCardData: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        textAlign: 'left'
    },
    sendNewOffer: {
        color: "#fff",
        backgroundColor: theme.palette.info.main,
        '&:hover': {
            backgroundColor: theme.palette.info.light,
            color: '#fff'
        },
    },
    sendIcon: {
        marginLeft: theme.spacing(1)
    },
    searchIcon: {
        marginLeft: theme.spacing(1)        
    }
}));


export default function BussinessUserDashboard() {
    const classes = useStyles();

    const [userProfileData, setUserProfileData] = useState({
        username: "",
        role: "",
        email: "",
        full_name: ""
    });

    const [usersDeals, setUsersDeals] = useState({
        deals: []
    });

    const companySectors = ['', 'TV', 'Network', 'Cellular', 'Fitness', 'Car Insurenncae', 'Health Insurenncae'];

    const [sectors, setSectors] = useState({
        selectedSector: "",
        isSelected: true
    });
   
    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'))
                .then(data => {
                    setUserProfileData(data);
                });
        }
    }, []);

    function renderSelectSector() {
        const handleSectorChanged = (event) => {
            setSectors(prevState => ({ ...prevState, selectedSector: event.target.value, isSelected: true }))
        };

        function get_all_users_deals_by_sector() {
            if (sectors.selectedSector != "" && sectors.selectedSector !== null) {
                get_all_users_deals(localStorage.getItem("token"), sectors.selectedSector)
                    .then(data => {
                        setUsersDeals(prevState => ({ ...prevState, deals: data }));
                    });
            } else {
                setSectors(prevState => ({ ...prevState, isSelected: false }));
            }

        };

        return (
            <div>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                        id="outlined-select-user-account"
                        select
                        label="Deals Sector"
                        value={sectors.selectedSector}
                        onChange={handleSectorChanged}
                        helperText="Please select sector"
                        error={!sectors.isSelected}
                        variant="outlined"
                    >
                        {companySectors.map((item, index) => (
                            <MenuItem key={index} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button className={classes.showResultButton} onClick={get_all_users_deals_by_sector} variant="contained" title={"Search For Deals"}>
                        search <SearchIcon className={classes.searchIcon} />
                    </Button>
                </form>
            </div>
        );
    };

    function renderDealsResult() {
        const userDealComponent = (key_index, sector, company, id, price, extra_info_key, extra_info_value) => {
            return (
                <Grid key={key_index} item xs={4}>
                    <Card className={classes.dealCardData}>
                        <CardHeader
                            avatar={<WidgetsIcon fontSize="large" style={{ color: "#209CEE" }} />}
                            title={"Company: " + company}
                            subheader={sector + " sector"}
                        />
                        <CardContent>
                            <Typography variant="body2" component="p">
                                id:  {id}<br />
                                <u>Deal Info</u>: <br />
                                <li>{extra_info_key} - {extra_info_value}</li><br />
                                <u>Price</u>:  {price * -1}$<br />
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" title={"Send Offer to client"} className={classes.sendNewOffer}>Send Offer <SendIcon className={classes.sendIcon} /></Button>
                        </CardActions>
                    </Card>
                </Grid>
            );
        };
    
        return (
            usersDeals.deals.map((deal, index) => {
                var extra_info_splited = Object.keys(deal.extra_info).map((key, i) => ({ key: key, value: deal.extra_info[key] }))[0];
                return (userDealComponent(index, deal.sector, deal.company, deal._id, deal.price, extra_info_splited.key, extra_info_splited.value));
            })
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
            <h5 className="center">You are not logged in !</h5>
            <h5 className="center">Please Login First <NavLink to="/Login">Login</NavLink></h5>
            <Redirect to="/Login" />
        </Container>
    );

    return (
        IsUserTokenValid() ? (
            <div className={classes.root}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                        <h1>Bussiness Dashboard</h1>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paperUsersDeals}>
                            <h1>Users Deals</h1>
                            {renderSelectSector()}
                        </Paper>
                    </Grid>
                    {renderDealsResult()}
                    {renderDealsResult()}
                    {renderDealsResult()}
                    {renderDealsResult()}
                    <Grid item xs={12}>
                        <div>ddd</div>
                    </Grid>
                </Grid>
            </div>
        ) :
            (
                renderUserNotLoggedIn
            )
    );

};