import React, { useEffect, useState } from 'react'; import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import CachedIcon from '@material-ui/icons/Cached';
import { Redirect } from 'react-router-dom';
import { Paper, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { get_all_user_new_offers, reject_new_offer, accept_new_offer } from '../adapters/business_service_adapter';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: '#209CEE',
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
    acceptButton: {
        color: theme.palette.success.main,
        marginRight: theme.spacing(10),
    }
}));


export default function OffersNotifications(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [offers, setOffers] = useState({
        offers: [],
        count: 0
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRejectOffer = (offerObj) => {
        reject_new_offer(localStorage.getItem('token'), offerObj.username, offerObj.account_number, offerObj.company, offerObj.new_price, offerObj.business_phone)
            .then(data => {
                featch_offers_data();
                setAnchorEl(null);
            });
    };

    const handleAcceptOffer = (offerObj) => {
        accept_new_offer(localStorage.getItem('token'), offerObj.username, offerObj.account_number, offerObj.company, offerObj.new_price, offerObj.business_phone)
            .then(data => {
                featch_offers_data();
                var text = "Hey,%0AMy name is " + offerObj.username + ".%0AI'm highly interested in your offer.%0A%0A*Offer Details*: %0A%20%20%20%20Sector: " + offerObj.sector + '%0A%20%20%20%20Company: ' + offerObj.company + '%0A%20%20%20%20*Deal Info*: %0A%20%20%20%20' + offerObj.extra_info_key + " - " + offerObj.extra_info_value + " %0A%20%20%20%20Price: " + offerObj.new_price + "%0A%0APlease Contact with me as soon as you can :)";
                var phoneNumber = offerObj.business_phone.replace('+', '');
                window.open("https://wa.me/" + phoneNumber + "?text=" + text, "_blank");
                setAnchorEl(null);
            });
    };

    const offerObject = (offerObj, index_key) => {
        return (
            <Card key={index_key} className={classes.accountCardData}>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="span">
                        <b>{"Sector: " + offerObj.sector}<br />
                            {"Company: " + offerObj.company}<br />
                            {"Bank Account: " + offerObj.account_number}<br />
                            {"Business Phone: " + offerObj.business_phone}</b><br />
                        <br /><b><u>Deal Info</u>:
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{offerObj.extra_info_key} - {offerObj.extra_info_value}</li></b>
                        <b><u>New Price</u>: {offerObj.new_price}$</b>
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button variant="outlined" className={classes.acceptButton} onClick={() => handleAcceptOffer(offerObj)}>
                        Accept
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleRejectOffer(offerObj)}>
                        Reject
                    </Button>
                </CardActions>
            </Card>
        );
    };

    async function featch_offers_data() {
        const username = localStorage.getItem('username');
        const {data: accounts} = await axios.get(
            `http://vmedu246.mtacloud.co.il:8083/users/${username}/bankaccounts`
        );
        const accountOfferPromises = accounts.map(account => {
            const {account_number} = account;
            return get_all_user_new_offers(localStorage.getItem('token'), username, account_number);
        });
        const allAccountOffers = await Promise.all(accountOfferPromises);
        const offerList = allAccountOffers.reduce(
            (allOfferList, accountResponse) =>([...allOfferList, ...accountResponse]),
            []
        );
        
        setOffers(prevState => ({ ...prevState, offers: offerList, count: offerList.length }))
    };

    useEffect(() => {
        featch_offers_data();
    }, []);


    function get_all_opend_offers() {
        return (
            offers.offers.map((offer, index) => {
                var extra_info_splited = Object.keys(offer.extra_info).map((key, i) => ({ key: key, value: offer.extra_info[key] }))[0];
                var offerObj = {
                    "company": offer.company,
                    "sector": offer.sector,
                    "extra_info_key": extra_info_splited.key,
                    "extra_info_value": extra_info_splited.value,
                    "username": offer.username,
                    "account_number": offer.account_number,
                    "new_price": offer.new_price,
                    "status": offer.status,
                    "business_phone": offer.business_phone
                };
                return offerObject(offerObj, index);
            })
        )
    };

        // ToDo: pulling theard
    // while (false){
    //     setTimeout(featch_offers_data, 2000)
    // }

    return (
        <div>
            <IconButton title={offers.count + " New Offers Waiting For You"} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="inherit" >
                <Badge badgeContent={offers.count} color="secondary">
                    <MailIcon />
                </Badge>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Paper className={classes.paper} elevation={0}>
                    <h3>{offers.count} Suggested New Offers: </h3>
                    {get_all_opend_offers()}
                    <Button variant="outlined" title={"Reload Offers"} onClick={featch_offers_data}>
                        <CachedIcon />
                    </Button>
                </Paper>
            </Menu>
        </div>
    );
} 