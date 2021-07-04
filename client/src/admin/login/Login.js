import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Card, IconButton, CardContent, Button, CardMedia, InputAdornment, InputLabel , Input, FormControl, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Email, Visibility, VisibilityOff, Lock } from '@material-ui/icons';
import PropTypes from 'prop-types';
import loginUser from '../../loginUser';
import './Login.scss';

function Login(props) {
    document.title = props.title
    const [darkState, setDarkState] = useState(false);
    const darkTheme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
              main: '#000000',
            },
            secondary: {
              main: '#f9f9f9',
            },
            error: {
              main: '#ff1500',
            },
            typography: {
            fontFamily: 'Raleway',
            },
          },
    });
    const lightTheme = createMuiTheme({
        palette: {
            type: "light",
            primary: {
              main: '#f9f9f9',
            },
            secondary: {
              main: '#000000',
            },
            error: {
              main: '#ff1500',
            },
            typography: {
            fontFamily: 'Raleway',
            },
          },
    });
    const currentTheme = darkState ? darkTheme : lightTheme;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = _ => {
        setShowPassword(!showPassword);
    }
    const handleMouseDownPassword = event => {
        event.preventDefault();
    }
    const handleSubmit = async e => {
        // console.log(123);
        e.preventDefault();
        setDarkState(false);
        const token = await loginUser({
            email,
          password
        });
        props.setToken(token.loggedIn);
    }

    return (
        <ThemeProvider theme={currentTheme}>
            <Container fluid className="admin-login-container">
                <Row>
                    <Col className="admin-login-card">
                        <Card className="admin-login-base">
                            <CardMedia
                                className="login-logo"
                                component="img"
                                image={'images/Flowerworks_Logo-Website.png'}
                                title="Flowerworks"
                            />
                            <CardContent>
                                <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                    <FormControl className="admin-card-formcontrol">
                                        <InputLabel htmlFor="email-admin">Email</InputLabel>
                                        <Input
                                            autoComplete="off"
                                            autoFocus
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            id="email-admin"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Email/>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <FormControl className="admin-card-formcontrol">
                                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                        <Input
                                            autoComplete="off"
                                            id="standard-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Lock/>
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <input 
                                        type="text" 
                                        autoComplete="on" 
                                        value="" 
                                        style={{display: 'none'}} 
                                        readOnly={true}
                                    />
                                    <Button type="submit" variant="contained" color="primary" className="admin-login-button">
                                        Login
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {/* <Container fluid className="admin-login-container">
                <Row>
                    <Col className="admin-login-card">
                        <Card>
                            <CardMedia
                                className="login-logo"
                                component="img"
                                image={'images/Flowerworks_Logo-Website.png'}
                                title="Flowerworks"
                            />
                            <CardContent>
                                <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                    <FormControl>
                                        <InputLabel htmlFor="email-admin">Email</InputLabel>
                                        <Input
                                            autoComplete="off"
                                            autoFocus
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            id="email-admin"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Email/>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                        <Input
                                            autoComplete="off"
                                            id="standard-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Lock/>
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <input 
                                        type="text" 
                                        autoComplete="on" 
                                        value="" 
                                        style={{display: 'none'}} 
                                        readOnly={true}
                                    />
                                    <Button type="submit" variant="contained" color="primary" className="admin-login-button">
                                        Login
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </Col>
                </Row>
            </Container> */}
        </ThemeProvider>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login;