import { Card, CardHeader, Avatar, IconButton, CardMedia, CardActions, CardContent, Button, Container, Grid, makeStyles, MenuItem, Paper, TextField, Typography, DialogActions } from '@material-ui/core';
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { get_all_users_deals } from '../adapters/bank_service_adapter';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import WidgetsIcon from '@material-ui/icons/Widgets';
import SendIcon from '@material-ui/icons/Send';
import SearchIcon from '@material-ui/icons/Search';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import { send_new_offer_to_client_by_deal_id } from '../adapters/business_service_adapter';
import Alert from '@material-ui/lab/Alert';

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
    },
    dialogOffer: {
        padding: theme.spacing(2),
        color: 'black'       
    }
}));


export default function BussinessUserDashboard() {
    const classes = useStyles();

    const [userProfileData, setUserProfileData] = useState({
        username: "",
        role: "",
        email: "",
        full_name: "",
        phone: ""  
    });

    const [usersDeals, setUsersDeals] = useState({
        deals: null
    });

    const companySectors = ['', 'TV', 'Network', 'Cellular', 'Fitness', 'Car Insurenncae', 'Health Insurenncae'];

    const [sectors, setSectors] = useState({
        selectedSector: "",
        isSelectedValidation: true
    });
   
    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'))
                .then(data => {
                    setUserProfileData(data);
                });
        }
    }, []);
    function PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    function DraggableSendOfferToClientDialog(props) {
        const [open, setOpen] = React.useState(false);
        const [newOffer, setNewOffer] = useState({
            price: ''
        });
        const handleClickOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        const price_error = (newOffer.price === null || newOffer.price === '') ? false : isNaN(newOffer.price);
        const handleChange = (e) => {
            const { id, value } = e.target
            setNewOffer(prevState => ({
                ...prevState,
                [id]: value
            }));
        };
        const HandleSendOffer = (account_number) => {
            send_new_offer_to_client_by_deal_id(localStorage.getItem('token'), props.id, newOffer.price, userProfileData.phone)
                .then(data => {
                    setOpen(!data);
                });
        };

        return (
            <div>
                <Button variant="contained" title={"Send Offer to client"} onClick={handleClickOpen} className={classes.sendNewOffer}>Send Offer <SendIcon className={classes.sendIcon} /></Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        <WidgetsIcon fontSize="large" style={{ color: "#209CEE", paddingRight: '10px' }} />Send Offer To Client
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText component={'span'} className={classes.dialogOffer}>
                            Send New offer to client for <b>{props.sector} sector</b>:
                            <br /><u>Deal Info</u>:
                            <li><b>{props.extra_info_key} - {props.extra_info_value}</b></li><br />
                            <br /><u>Current Price: <b>{-1 * props.price}$</b></u>:
                            <form noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="price"
                                    label="Price (USD)"
                                    name="price"
                                    autoFocus
                                    helperText={price_error ? "" : "Numbers only"}
                                    error={price_error}
                                    onChange={handleChange}
                                />
                            </form>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className={classes.dialogOffer}>
                        <Button autoFocus onClick={handleClose} variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={HandleSendOffer} disabled={price_error || newOffer.price === ''} variant="contained"  className={classes.sendNewOffer}>
                            Send Offer
                            <SendIcon style={{ paddingLeft: '6px' }} />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    function renderSelectSector() {
        const handleSectorChanged = (event) => {
            setSectors(prevState => ({ ...prevState, selectedSector: event.target.value, isSelectedValidation: true }))
            setUsersDeals(prevState => ({ ...prevState, deals: null }))        
        };

        function get_all_users_deals_by_sector() {
            if (sectors.selectedSector != "" && sectors.selectedSector !== null) {
                get_all_users_deals(localStorage.getItem("token"), sectors.selectedSector)
                    .then(data => {
                        setUsersDeals(prevState => ({ ...prevState, deals: data }));
                    });
            } else {
                setSectors(prevState => ({ ...prevState, isSelectedValidation: false }));
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
                        error={!sectors.isSelectedValidation}
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
                            <Typography variant="body2" component="span">
                                id:  {id}<br />
                                <u>Deal Info</u>: <br />
                                <li>{extra_info_key} - {extra_info_value}</li><br />
                                <u>Price</u>:  {price * -1}$<br />
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <DraggableSendOfferToClientDialog id={id} company={company} sector={sector} price={price} extra_info_key={extra_info_key} extra_info_value={extra_info_value} />
                        </CardActions>
                    </Card>
                </Grid>
            );
        };
        if (usersDeals.deals === null)
        return
    
        return (
            usersDeals.deals.map((deal, index) => {
                var extra_info_splited = Object.keys(deal.extra_info).map((key, i) => ({ key: key, value: deal.extra_info[key] }))[0];
                return (userDealComponent(index, deal.sector, deal.company, deal._id, deal.price, extra_info_splited.key, extra_info_splited.value));
            })
        );
    };   
    function renderDealsResultWithAlert() {
        if (usersDeals.deals === null)
            return null
        if (usersDeals.deals === null && sectors.selectedSector === '')
            return
        return (
            (usersDeals.deals.length === 0 && sectors.selectedSector != '') ? (
                <div>
                    <Alert severity="warning">No Users Deals Found For Selected Sector: {sectors.selectedSector}</Alert>
                </div>
            ) : (
                <div>
                    <Alert severity="success">Found {usersDeals.deals.length} Users Deals For {sectors.selectedSector} Sector</Alert>
                </div>
            )
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
                            {renderDealsResultWithAlert()}
                        </Paper>
                    </Grid>
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