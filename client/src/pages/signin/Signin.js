import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Col, Row, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import UserContext from '../../authenticatedUser';
import { Heading1, ParaText } from '../../components';
import './Signin.scss';

function Signin(props) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    const user = useContext(UserContext)
    const [email, setEmail] = useState({ value: '', errorText: '' });
    const [password, setPassword] = useState({ value: '', errorText: '', show: false, showText: 'Show Password' });
    const history = useHistory();

    useEffect(() => {
        if (user.userState) history.push('/');
    }, [history, user.userState])

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`${api}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ email: email.value, password: password.value })
        });
        const content = await response.json();
        try {
            const getUser = content.data;
            if (getUser === false) history.push('/email-verification', { success: false, line1First: 'Email not verified!', line1Third: 'Please verify your email.' });
            else if (getUser) user.setUserState(getUser);
            else throw new Error();
        } catch (error) {
            user.setUserState(null);
            setEmail({ value: '', errorText: 'Invalid credentials!' });
            setPassword({ value: '', errorText: 'Invalid credentials!' });
        }
    }
    const handleClickShowPassword = () => {
        let text = 'Show Password';
        if (!password.show) text = 'Hide Password';
        setPassword(prevState => ({ ...prevState, show: !password.show, showText: text }));
    };

    const changeEmail = event => {
        setEmail({ value: event.target.value, errorText: '' });
    }

    const changePassword = event => {
        setPassword(prevState => ({ ...prevState, value: event.target.value, errorText: '' }));
    }

    return (
        <Container className="signin">
            <Heading1
                first="Sign"
                bold="in"
                classes="text-uppercase text-center"
            />
            <div className="global-mt-2"></div>
            <Form className="form-style">
                <input
                    type="password"
                    autoComplete="on"
                    value=""
                    style={{ display: 'none' }}
                    readOnly={true}
                />
                <Row className="justify-content-center">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control autoComplete="email" value={email.value} onChange={changeEmail} type="text" />
                        <div className="error-text">{email.errorText}</div>
                    </Form.Group>
                </Row>
                <div className="global-mt-3"></div>
                <Row className="justify-content-center">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="password">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control autoComplete="off" value={password.value} onChange={changePassword} type={password.show ? 'text' : 'password'} />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{password.errorText}</div>
                            </Col>
                            <Col>
                                <div className="show-password" onClick={handleClickShowPassword}><strong>{password.showText}</strong></div>
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <Row>
                    <div className="horizontal-center-margin">
                        <Button type="submit" onClick={handleSubmit}>Sign in</Button>
                    </div>
                </Row>
                <Row>
                    <Col>
                        <ParaText
                            text="Not a Registered Customer? Sign Up"
                            link="HERE"
                            href="/signup"
                            textAlign="center"
                            classes="margin-bottom-0"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ParaText
                            text="Forgot Password? Click"
                            link="HERE"
                            href="/forgot-password"
                            textAlign="center"
                        />
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default Signin;