import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
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

export default function Login() {
    const [state, setState] = useState({
        username: "",
        password: "",
        user_logged_in: false
    });

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    };

    const fire_redirect = () => {
        state.setState({ user_logged_in: true });
    };

    const get_user_token = () => {
        const data = 'username=' + state.username + '&password=' + state.password;
        axios.post('http://192.116.98.107:8081/token', data)            .then(res => {
                localStorage.setItem('token', res.data.access_token);
                localStorage.setItem('username', state.username);
                console.log("user_logged_in: " + state.user_logged_in);
                setTimeout(() => fire_redirect, 1000);
            })
            .catch(err => {
                console.log(err);
            });
        };
    
    
        const handleSubmitClick = (e) => {
        e.preventDefault();
        console.log('username: ' + state.username + ' , password: ' + state.password);
        get_user_token();
        console.log('Token: ' + localStorage.getItem('token'));

        // this.get_login_token();
        // console.log(localStorage.getItem('token'));
        // setTimeout(() => this.setState({ fireRedirect: true }), 1000);

    };

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
              </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
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
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={handleSubmitClick}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            {state.user_logged_in ? (<Redirect to="/" />) : (' ')}
        </Container>
    );
}

// import { Component } from 'react';
// import React from 'react';
// import axios from 'axios';
// // import { Redirect } from 'react-router-dom';
// import { Typography, Container, Button, Checkbox, Link, Grid, Box, TextField, CssBaseline, FormControlLabel } from '@material-ui/core';
// import Avatar from '@material-ui/core/Avatar';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import { makeStyles, withTheme } from '@material-ui/core/styles';
// import SendIcon from '@material-ui/icons/Send';


// class CLogin extends Component {
//     constructor() {
//         super();
//         this.state = {
//             username: null,
//             password: null,
//             fireRedirect: false
//         };
//        
//     handleChange = (e) => {
//         this.setState({
//             [e.target.id]: e.target.value
//         });
//     }
//     get_login_token = () => {
//         const data = 'username=' + this.state.username + '&password=' + this.state.password;
//         axios.post('http://40.68.123.18:8081/token', data)
//             .then(res => {
//                 localStorage.setItem('token', res.data.access_token);
//                 localStorage.setItem('username', this.state.username);
//                 localStorage.setItem('user_logged_in', true);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//         return;
//     }
//     handleSubmit = (e) => {
//         e.preventDefault();
//         this.get_login_token();
//         console.log(localStorage.getItem('token'));
//         setTimeout(() => this.setState({ fireRedirect: true }), 1000);

//     }

//     render() {
//         return (
//             <Container component="main" maxWidth="xs">
//                 <CssBaseline />
//                 <div className={this.classes.paper}>
//                     <Avatar className={this.classes.avatar}>
//                         <LockOutlinedIcon />
//                     </Avatar>
//                     <Typography component="h1" variant="h5">
//                         Sign in
//                         </Typography>
//                     <form className={this.classes.form} noValidate>
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="username"
//                             label="Username"
//                             name="username"
//                             autoComplete="username"
//                             autoFocus
//                         />
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             name="password"
//                             label="Password"
//                             type="password"
//                             id="password"
//                             autoComplete="current-password"
//                         />
//                         <FormControlLabel
//                             control={<Checkbox value="remember" color="primary" />}
//                             label="Remember me"
//                         />
//                         <Button
//                             type='button'
//                             onClick={() => alert('ba ba')}
//                             fullWidth
//                             variant="contained"
//                             color="inherit"
//                             className={this.classes.submit}
//                             endIcon={<SendIcon />}
//                         >
//                             Sign In
//                         </Button>
//                         <Grid container>
//                             <Grid item xs>
//                                 <Link href="#" variant="body2">Forgot password?</Link>
//                             </Grid>
//                             <Grid item>
//                                 <Link href="/Signup" variant="body2">
//                                     {"Don't have an account? Sign Up"}
//                                 </Link>
//                             </Grid>
//                         </Grid>
//                     </form>
//                 </div>
//                 <Box mt={8}>
//                     <Copyright />
//                 </Box>
//                 {/* { this.state.fireRedirect ? (<Redirect to="/" />) : (' ')}        */}
//             </Container>
//         );
//     }
// };

// export default function Login() {
//     return Login();
// }; 