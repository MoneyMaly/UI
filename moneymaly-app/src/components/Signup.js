import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { FormControl, FormLabel } from '@material-ui/core';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.        
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundcolor: theme.palette.primary.main
    },
}));

export default function Signup() {
    const [state, setState] = useState({
        username: null,
        full_name: null,
        email: null,
        password: null,
        password_repeat: null,
        role: "private",
        user_signed_up: false
    });

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const create_new_user = () => {
        axios.post('http://192.116.98.107:8081/users', state)
            .then(res => {
                if (res.status === 201) {
                    setState(prevState => ({ ...prevState, user_signed_up: true }));
                    setTimeout(null, 1000);
                }
                else {
                    console.log("status_code: " + res.status, "msg: " + res.data)
                }
            })
            .catch(err => {
                console.log(err);
            });
        };

    const handleSubmitClick = (e) => {
        e.preventDefault();
    
        console.log(state);
        create_new_user();
        // TODO: run validation on form data 
    };

    const handleRoleChange = (event) => {
        setState(prevState => ({ ...prevState, role: event.target.value }));
    };

    const classes = useStyles();

    return (
        localStorage.getItem('token') ? (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        You'r already Signed in ...
                    </Typography>
                    <Redirect to="/" />
                </div>
            </Container>
        ) :
            (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <AssignmentIndIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="full_name"
                                label="Full Name"
                                name="full_name"
                                autoFocus
                                onChange={handleChange}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoFocus
                                onChange={handleChange}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                autoFocus
                                onChange={handleChange}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={handleChange}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password_repeat"
                                label="Repeat Password"
                                type="password"
                                id="password_repeat"
                                onChange={handleChange}
                            />
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Account Role</FormLabel>
                                <RadioGroup aria-label="role" name="role" id="role" value={state.role} onChange={handleRoleChange}>
                                    <FormControlLabel value="private" control={<Radio />} label="Private" />
                                    <FormControlLabel value="business" control={<Radio />} label="Business" />
                                </RadioGroup>
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleSubmitClick}
                            >
                                Sign Up
                            </Button>
                        </form>

                    </div>
                    {state.user_signed_up ? (<Redirect to="/Login" />) : (' ')}
                </Container>
            )
    );
};
