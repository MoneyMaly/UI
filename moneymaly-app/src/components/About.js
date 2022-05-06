import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import desktopImage from '../images/MoneyLifecycle.png';
import mobileImage from '../images/MoneyLifecycle-mobile.png';
import bankImage from '../images/chart-banking.svg';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Card } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 20
    },
    title: {
        flexGrow: 1,
        align: 'center',
        paddingBottom: theme.spacing(4),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        color: '#209cee'
    },
    gird: {
        flexGrow: 1,
        spacing: 20,
        width: '100%',
        marginTop: '200px',
        alignItems: 'center',
        direction: 'column',
        padding: theme.spacing(3)
    },
    paper: {
        padding: theme.spacing(4),
        textalign: 'center',
        color: theme.palette.primary.dark,
        background: theme.palette.primary.contrastText
    },
    card: {
        width: '100%',
        paddingBottom: theme.spacing(10)
    },
    media: {
        height: 650
    },
    mediaMobile: {
        height: 200
    }
}));

const AboutText = ["We provide a world-class platform to over 200 million users in 190 countries, empowering everyone to take care of themselves and their Bank-accounts, and always looks, and watch for your – MoneyMaly", "You, probably manage your various accounts such as gas, electricity, cables, internet, telephone, insurance etc. through direct charges or alternatively with credit card charges.", "The problem arises when there is a change in the fixed charge, you have to pay, and you unaware that the amount you are paying has changed."]

export default function About() {
    const classes = useStyles();
    const moneyImage = window.innerWidth >= 650 ? desktopImage : mobileImage;
    return ( <div className={classes.root}>
            <Typography className={classes.title} variant='h4' noWrap >
            About Us
            </Typography>
            <Grid container className={classes.grid} justify="center">
                <Grid item xs={10} md={8}>
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="h2">
                                    {AboutText[0]}
                                </Typography>
                            </CardContent>
                            <CardMedia
                                className={window.innerWidth >= 500 ? classes.media : classes.mediaMobile}
                                image={moneyImage}
                                title="Contemplative Reptile"
                            />
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={10} md={8}>
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="h2">
                                    {AboutText[0]}
                                </Typography>
                            </CardContent>
                            <CardMedia
                                className={window.innerWidth >= 500 ? classes.media : classes.mediaMobile}
                                image={bankImage}
                                title="Contemplative Reptile"
                            />
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={10} md={8}>
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="h2">
                                    {AboutText[0]}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
