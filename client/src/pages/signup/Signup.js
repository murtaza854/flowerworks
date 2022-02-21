import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Col, Row, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import UserContext from '../../authenticatedUser';
import { Heading1, Divider, ParaText } from '../../components';
import './Signup.scss';

function Signup(props) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    const user = useContext(UserContext)
    const history = useHistory();
    const [buttonState, setButtonState] = useState({ disabled: true, onClick: e => e.preventDefault() });

    const [firstName, setFirstName] = useState({ value: '', errorText: '', error: false });
    const [lastName, setlastName] = useState({ value: '', errorText: '', error: false });
    const [phoneNumber, setPhoneNumber] = useState({ value: '', errorText: '', error: false });
    const [email, setEmail] = useState({ value: '', errorText: '', error: false });
    const [password, setPassword] = useState({ value: '', errorText: '', show: false, error: false, showText: 'Show Password' });
    const [confirmPassword, setConfirmPassword] = useState({ value: '', errorText: '', show: false, error: false, showText: 'Show Password' });

    useEffect(() => {
        let flag = true;
        if (firstName.error === true) flag = true;
        else if (firstName.value.length === 0) flag = true;
        else if (lastName.error === true) flag = true;
        else if (lastName.value.length === 0) flag = true;
        else if (phoneNumber.error === true) flag = true;
        else if (phoneNumber.value.length === 0) flag = true;
        else if (email.error === true) flag = true;
        else if (email.value.length === 0) flag = true;
        else if (password.error === true) flag = true;
        else if (password.value.length === 0) flag = true;
        else if (confirmPassword.error === true) flag = true;
        else flag = false;
        if (!flag) setButtonState({
            disabled: false, onClick: async e => {
                e.preventDefault();
                const response = await fetch(`${api}/user/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({
                        firstName: firstName.value.trim(),
                        lastName: lastName.value.trim(),
                        contactNumber: phoneNumber.value.trim(),
                        email: email.value.trim(),
                        password: password.value,
                    })
                });
                const content = await response.json();
                if (content.success) history.push("/__/auth/action?mode=accountCreation");
                else if (content.error.code === 'auth/email-already-in-use') alert(content.error.message);
                else alert("Error creating account, please contact support if this issue persists.");
            }
        });
        else setButtonState({
            disabled: true, onClick: e => e.preventDefault()
        });
    }, [firstName, lastName, phoneNumber, email, password, confirmPassword, history]);

    // const handleSubmit = async e => {
    //     e.preventDefault();
    //     const response = await fetch(`${api}/users/login`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         credentials: 'include',
    //         withCredentials: true,
    //         body: JSON.stringify({ email: email.value, password: password.value })
    //     });
    //     const content = await response.json();
    //     try {
    //         const getUser = content.data;
    //         if (getUser) user.setUserState(getUser);
    //         else throw new Error();
    //     } catch (error) {
    //         user.setUserState(null);
    //         setEmail({ value: '', errorText: 'Invalid credentials!' });
    //         setPassword({ value: '', errorText: 'Invalid credentials!' });
    //     }
    // }

    useEffect(() => {
        if (user.userState) history.push('/');
    }, [history, user.userState])

    useEffect(() => {
        (
            () => {
                if (confirmPassword.value !== password.value) setConfirmPassword(prevState => ({ ...prevState, errorText: 'Password does not match', error: true }));
                else setConfirmPassword(prevState => ({ ...prevState, errorText: '', error: false }));
            })();
    }, [confirmPassword.value, password.value]);

    const changeFirstName = event => {
        const { value } = event.target;
        setFirstName(prevState => ({ ...prevState, value: value }));
        if (value === '') setFirstName(prevState => ({ ...prevState, errorText: 'First name is required!', error: true }));
        else setFirstName(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLastName = event => {
        const { value } = event.target;
        setlastName(prevState => ({ ...prevState, value: value }));
        if (value === '') setlastName(prevState => ({ ...prevState, errorText: 'Last name is required!', error: true }));
        else setlastName(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changePhoneNumber = event => {
        const phoneReg = /^\d{11}$/;
        setPhoneNumber(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setPhoneNumber(prevState => ({ ...prevState, errorText: 'Phone number is required!', error: true }));
        else if (!event.target.value.match(phoneReg)) setPhoneNumber(prevState => ({ ...prevState, errorText: 'Must contain 11 digits!', error: true }));
        else setPhoneNumber(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeEmail = event => {
        setEmail(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setEmail(prevState => ({ ...prevState, errorText: 'Email is required!', error: true }));
        else if (!event.target.value.includes('@')) setEmail(prevState => ({ ...prevState, errorText: 'Email must be valid!', error: true }));
        else setEmail(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changePassword = event => {
        const { value } = event.target;
        const passwReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/;
        setPassword(prevState => ({ ...prevState, value: value }));
        if (!value.match(passwReg)) setPassword(prevState => ({ ...prevState, errorText: 'Password must contain atleast 1 lowercase alhpabetical character, atleast 1 uppercase alhpabetical character, atleast 1 numerical character, 1 special character and must be of atleast 8 characters', error: true }));
        else setPassword(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeConfirmPassword = event => {
        setConfirmPassword(prevState => ({ ...prevState, value: event.target.value }));
    }

    const handleClickShowPassword = () => {
        let text = 'Show Password';
        if (!password.show) text = 'Hide Password';
        setPassword(prevState => ({ ...prevState, show: !password.show, showText: text }));
    };
    const handleClickShowPassword1 = () => {
        let text = 'Show Password';
        if (!confirmPassword.show) text = 'Hide Password';
        setConfirmPassword(prevState => ({ ...prevState, show: !confirmPassword.show, showText: text }));
    };

    return (
        <Container className="signup">
            <Heading1
                first="Sign"
                bold="up"
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
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="firstName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control value={firstName.value} onChange={changeFirstName} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{firstName.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control value={lastName.value} onChange={changeLastName} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{lastName.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="phoneNumber">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control value={phoneNumber.value} onChange={changePhoneNumber} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{phoneNumber.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control value={email.value} onChange={changeEmail} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{email.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <Row className="justify-content-center">
                    <Divider md={4} classes="margin-specified" />
                </Row>
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="password">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control value={password.value} onChange={changePassword} autoComplete="off" type={password.show ? 'text' : 'password'} />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{password.errorText}</div>
                            </Col>
                            <Col>
                                <div className="show-password" onClick={handleClickShowPassword}><strong>{password.showText}</strong></div>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="confirmPassword">
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control value={confirmPassword.value} onChange={changeConfirmPassword} autoComplete="off" type={confirmPassword.show ? 'text' : 'password'} />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{confirmPassword.errorText}</div>
                            </Col>
                            <Col>
                                <div className="show-password" onClick={handleClickShowPassword1}><strong>{confirmPassword.showText}</strong></div>
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <Row>
                    <div className="horizontal-center-margin">
                        <Button disabled={buttonState.disabled} type="submit" onClick={buttonState.onClick}>Sign up</Button>
                    </div>
                </Row>
                <Row>
                    <Col>
                        <ParaText
                            text="Already have an Account? Sign In"
                            link="HERE"
                            href="/signin"
                            textAlign="center"
                        />
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default Signup;