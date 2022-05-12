import React, { useEffect, useState } from 'react'; import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import TimelineIcon from '@material-ui/icons/Timeline';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import CachedIcon from '@material-ui/icons/Cached';
import { Redirect } from 'react-router-dom';
import { Paper, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { get_all_business_offers } from '../adapters/business_service_adapter';
import Alert from '@material-ui/lab/Alert';
import { get_user_data_with_token } from '../adapters/user_service_adapter';

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


export default function CurrentOffers() {
    const classes = useStyles();

    const [phoneData, setPhoneData] = useState({
        phone: ""
    })
    const [offers, setOffers] = useState({
        offers: [],
        totalCountOfOffers: 0,
        OpenedOffersCount: 0,
        RejectedOffersCount: 0,
        AcceptedOffersCount: 0

    });

    function featch_offers_data(phone_number) {
        get_all_business_offers(localStorage.getItem('token'), phone_number)
            .then(data => {
                console.log(data);
                var count = 0;
                count = data.rejected_count + data.opened_count + data.accepted_count;
                setOffers(prevState => ({ ...prevState, offers: data.offers, totalCountOfOffers: count, OpenedOffersCount: data.opened_count, RejectedOffersCount: data.rejected_count, AcceptedOffersCount: data.accepted_count }))
            });
        console.log(offers)
    };

    function update_user_data() {
        get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'))
            .then(data => {
                setPhoneData(prevState => ({ ...prevState, phone: data.phone }))
                featch_offers_data(data.phone);
            });
    }

    useEffect(() => {
        update_user_data();
    }, []);


    return (
        <div>
            <Paper className={classes.paper} elevation={0}>
                <Alert severity="info">Opend {offers.OpenedOffersCount} Offers</Alert><br />
                <Alert severity="success">Accepted {offers.AcceptedOffersCount} Offers</Alert><br />
                <Alert severity="error">Rejected {offers.RejectedOffersCount} Offers</Alert><br />


                {/* {offers.offers.map((accountAnomaly, index) => {
                    return (
                        <div key={index}>
                            {(accountAnomaly.anomalies_count === 0) ? (
                                <Alert severity="success">Found {accountAnomaly.anomalies_count} Anomalies! ,  Bank Account: {accountAnomaly.account_number} (Owner: {accountAnomaly.owner})</Alert>
                            ) : (
                                <Alert severity="warning">Found {accountAnomaly.anomalies_count} Anomalies! ,  Bank Account: {accountAnomaly.account_number} (Owner: {accountAnomaly.owner})</Alert>
                            )}
                            <br />
                        </div>)
                })} */}
                <Button variant="outlined" title={"Reload Offers"} onClick={() => featch_offers_data(phoneData.phone)}>
                    <CachedIcon />
                </Button>
            </Paper>
        </div>
    );
} 