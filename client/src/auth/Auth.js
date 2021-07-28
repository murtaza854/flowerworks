import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './Auth.scss';
import { ConfirmationMessage, Heading1 } from '../components';
import resetPasswordCheck from './functions/resetPasswordCheck';
import resetPassword from './functions/resetPassword';
import recoverEmail from './functions/recoverEmail';
import verifyEmail from './functions/verifyEmail';

function Auth(props) {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') || null;
    const actionCode = params.get('oobCode') || null;
    const [heading, setHeading] = useState('');
    const [headingAuth, setHeadingAuth] = useState({first: '', bold: ''});
    const [line1First, setline1First] = useState('');
    const [line1Third, setline1Third] = useState('');
    const [line1Bold3, setline1Bold3] = useState('');
    const [line1Fourth, setline1Fourth] = useState('');
    const [iconClass, setIconClass] = useState('');

    const [password, setPassword] = useState({ value: '', errorText: '', show: false, error: false, showText: 'Show Password' });
    const [confirmPassword, setConfirmPassword] = useState({ value: '', errorText: '', show: false, error: false, showText: 'Show Password' });

    const [buttonState, setButtonState] = useState({ disabled: true });

    const [codeCheck, setCodeCheck] = useState('Loading');

    useEffect(() => {
        (
            () => {
                if (confirmPassword.value !== password.value) setConfirmPassword(prevState => ({ ...prevState, errorText: 'Password does not match', error: true }));
                else setConfirmPassword(prevState => ({ ...prevState, errorText: '', error: false }));
            })();
    }, [confirmPassword.value, password.value]);

    useEffect(() => {
        let flag = true;
        if (password.error === true) flag = true;
        else if (password.value.length === 0) flag = true;
        else if (confirmPassword.error === true) flag = true;
        else flag = false;
        if (!flag) setButtonState({ disabled: false });
        else setButtonState({ disabled: true });
    }, [password, confirmPassword]);

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

    useEffect(() => {
        (
            async () => {
                if (mode === 'resetPassword') {
                    setHeading('Reset Password')
                    const flag = await resetPasswordCheck(actionCode);
                    if (flag) {
                        setCodeCheck('Form');
                        setHeadingAuth({first: 'Forgot', bold: 'Password'})
                    } else {
                        setline1First("Invalid link!");
                        setline1Third("Please contact support if this issue persists.");
                        setline1Bold3('');
                        setline1Fourth('');
                        setIconClass('fa fa-times');
                        setCodeCheck('ConfirmationMessage')
                    }
                } else if (mode === 'recoverEmail') {
                    setHeading('Email Recovery');
                    const flag = await recoverEmail(actionCode);
                    if (flag) {
                        setline1First("Email recovered successfully!");
                        setline1Third("Please change your password immediately if your account was compromised.");
                        setline1Bold3('');
                        setline1Fourth('An email has been sent to you with instructions to reset your password.');
                        setIconClass('fa fa-check');
                        setCodeCheck('ConfirmationMessage');
                    } else {
                        setline1First("Invalid link!");
                        setline1Third("Please contact support if this issue persists.");
                        setline1Bold3('');
                        setline1Fourth('');
                        setIconClass('fa fa-times');
                        setCodeCheck('ConfirmationMessage');
                    }
                } else if (mode === 'verifyEmail') {
                    setHeading('Email Verification')
                    const flag = await verifyEmail(actionCode)
                    if (flag) {
                        setline1First("Your email has been successfully verified");
                        setline1Third("");
                        setline1Bold3('');
                        setline1Fourth('');
                        setIconClass('fa fa-check');
                        setCodeCheck('ConfirmationMessage')
                    } else {
                        setline1First("Invalid link!");
                        setline1Third("Please contact support if this issue persists.");
                        setline1Bold3('');
                        setline1Fourth('');
                        setIconClass('fa fa-times');
                        setCodeCheck('ConfirmationMessage');
                    }
                }
            })();
    }, [mode, actionCode]);

    const handleSubmit = async e => {
        e.preventDefault();
        const flag = await resetPassword(actionCode, password);
        if (flag) {
            setline1First("Your password has been changed!");
            setline1Third("You may login now.");
            setline1Bold3('');
            setline1Fourth('');
            setIconClass('fa fa-check');
            setCodeCheck('ConfirmationMessage')
        } else {
            setline1First("Invalid link!");
            setline1Third("Please contact support if this issue persists.");
            setline1Bold3('');
            setline1Fourth('');
            setIconClass('fa fa-times');
            setCodeCheck('ConfirmationMessage')
        }
        // try {
        //     const getUser = content.data;
        //     if (getUser) user.setUserState(getUser);
        //     else throw new Error();
        // } catch (error) {
        //     user.setUserState(null);
        //     setEmail({ value: '', errorText: 'Invalid credentials!' });
        //     setPassword({ value: '', errorText: 'Invalid credentials!' });
        // }
    }

    return (
        <Container fluid>
            {
                codeCheck === 'Loading' ? null : (
                    <div>
                        {
                            codeCheck === 'Form' ? (
                                <Container>
                                    <Heading1
                                        first={headingAuth.first}
                                        bold={headingAuth.bold}
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
                                                <Button disabled={buttonState.disabled} type="submit" onClick={handleSubmit}>Reset</Button>
                                            </div>
                                        </Row>
                                    </Form>
                                </Container>
                            ) :
                                <ConfirmationMessage
                                    first=""
                                    data={true}
                                    bold={heading}
                                    line1First={line1First}
                                    line1Third={line1Third}
                                    line1Bold3={line1Bold3}
                                    line1Fourth={line1Fourth}
                                    iconClass={iconClass}
                                    second=""
                                />
                        }
                    </div>
                )
            }
        </Container>
    );
}

export default Auth;