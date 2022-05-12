import React, { useEffect, useState } from 'react'; import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import TimelineIcon from '@material-ui/icons/Timeline';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import CachedIcon from '@material-ui/icons/Cached';
import { Redirect } from 'react-router-dom';
import { Paper, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { get_all_user_anomalies } from '../adapters/business_service_adapter';
import Alert from '@material-ui/lab/Alert';

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


export default function AnomalyNotifications(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anomaly, setAnomaly] = useState({
        accounts_anomaly: [],
        count: 0
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    function featch_anomaly_data() {
        get_all_user_anomalies(localStorage.getItem('token'), localStorage.getItem('username'))
            .then(data => {
                var current_count = 0;
                data.accounts_anomaly.map((accountAnomaly) => {
                    current_count += accountAnomaly.anomalies_count;
                });
                setAnomaly(prevState => ({ ...prevState, accounts_anomaly: data.accounts_anomaly, count: current_count }))
            });
    };

    useEffect(() => {
        featch_anomaly_data();
    }, []);


    return (
        <div>
            <IconButton title={anomaly.count + " Anomaly Detected"} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="inherit" >
                <Badge badgeContent={anomaly.count} color="secondary">
                    <TimelineIcon fontSize='large' />
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
                    <h3>{anomaly.count} Anomalies Detected (Last 3 Months): </h3>
                    {anomaly.accounts_anomaly.map((accountAnomaly, index) => {
                        return (
                            <div key={index}>
                                {(accountAnomaly.anomalies_count === 0) ? (
                                    <Alert severity="success">Found {accountAnomaly.anomalies_count} Anomalies! ,  Bank Account: {accountAnomaly.account_number} (Owner: {accountAnomaly.owner})</Alert>
                                ) : (
                                    <Alert severity="warning">Found {accountAnomaly.anomalies_count} Anomalies! ,  Bank Account: {accountAnomaly.account_number} (Owner: {accountAnomaly.owner})</Alert>
                                )}
                                <br />
                            </div>)
                    })}

                    <Button variant="outlined" title={"Reload Offers"} onClick={featch_anomaly_data}>
                        <CachedIcon />
                    </Button>
                </Paper>
            </Menu>
        </div>
    );
} 