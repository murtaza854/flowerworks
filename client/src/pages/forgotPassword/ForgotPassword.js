import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Col, Row, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import UserContext from '../../authenticatedUser';
import { Heading1, ParaText } from '../../components';
import './ForgotPassword.scss';

function ForgotPassword(props) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    const user = useContext(UserContext)
    const [email, setEmail] = useState({ value: '', disabled: true });
    const history = useHistory();

    useEffect(() => {
        if (user.userState) history.push('/');
    }, [history, user.userState])

    const handleSubmit = async e => {
        e.preventDefault();
        await fetch(`${api}/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ email: email.value })
        });
        history.push('/forgot-password/sent', { success: true, line1First: 'Email sent!', line1Third: 'Follow the instructions on your email to reset your password.' });
    }

    const changeEmail = event => {
        let disabled = false;
        if (event.target.value === '') disabled = true;
        setEmail(prevState => ({...prevState, value: event.target.value, disabled: disabled}));
    }

    return (
        <Container className="signin">
            <Heading1
                first="Forgot"
                bold="Password"
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
                    </Form.Group>
                </Row>
                <Row>
                    <div className="horizontal-center-margin">
                        <Button disabled={email.disabled} type="submit" onClick={handleSubmit}>Send</Button>
                    </div>
                </Row>
                <Row>
                    <Col>
                        <ParaText
                            text="Already remember your password? Click"
                            link="HERE"
                            href="/signin"
                            textAlign="center"
                            classes="margin-bottom-0"
                        />
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default ForgotPassword;