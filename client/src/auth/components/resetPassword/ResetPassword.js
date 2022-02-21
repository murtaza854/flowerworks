import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Heading1 } from '../../../components';
import UserContext from '../../../authenticatedUser';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import './ResetPassword.scss';
import resetPassword from '../../functions/resetPassword';
import resetPasswordCheck from '../../functions/resetPasswordCheck';

function ResetPassword(props) {
    const history = useHistory();
    const user = useContext(UserContext);

    useEffect(() => {
        if (user.userState) history.push('/');
    }, [history, user]);

    useEffect(() => {
        Promise.resolve(resetPasswordCheck(props.actionCode)).then((value) => {
            if (!value) {
                history.push("/__/auth/action?mode=resetFailed");
            }
        })
    }, [props.mode, props.actionCode, history])

    const [password, setPassword] = useState({ name: '', errorText: '', error: false, showPassword: false });
    const [confirmPassword, setConfirmPassword] = useState({ name: '', errorText: '', error: false, showPassword: false });

    const [disable, setDisable] = useState(true);

    const handleClickShowPassword = _ => {
        setPassword(prevState => ({ ...prevState, showPassword: !password.showPassword }));
    }
    const handleMouseDownPassword = event => {
        event.preventDefault();
    }
    const changePassword = event => {
        const { value } = event.target;
        const passwReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        setPassword(prevState => ({ ...prevState, name: value }));
        if (!value.match(passwReg)) setPassword(prevState => ({ ...prevState, errorText: 'Password must contain atleast 1 lowercase alhpabetical character, atleast 1 uppercase alhpabetical character, atleast 1 numericical character, 1 special character and must be of atleast 8 characters', error: true }));
        else setPassword(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const handleClickShowConfirmPassword = _ => {
        setConfirmPassword(prevState => ({ ...prevState, showPassword: !confirmPassword.showPassword }));
    }
    const handleMouseDownConfirmPassword = event => {
        event.preventDefault();
    }
    const changeConfirmPassword = event => {
        setConfirmPassword(prevState => ({ ...prevState, name: event.target.value }));
    }

    const onSubmit = async e => {
        e.preventDefault();
        setDisable(true);
        try {
            Promise.resolve(resetPassword(props.mode, props.actionCode, password.name)).then((value) => {
                if (value === 'Reset Failed') {
                    history.push("/__/auth/action?mode=resetFailed");
                } else {
                    history.push("/__/auth/action?mode=resetSuccessful");
                }
            })
        } catch (error) {
            alert("Error creating account, please contact support if this issue persists.");
        }
    };

    useEffect(() => {
        let flag = true;
        if (password.error === true) flag = true;
        else if (password.name.length === 0) flag = true;
        else if (confirmPassword.error === true) flag = true;
        else if (confirmPassword.name.length === 0) flag = true;
        else flag = false;
        setDisable(flag);
    }, [password, confirmPassword]);

    useEffect(() => {
        (
            () => {
                if (confirmPassword.name !== password.name) setConfirmPassword(prevState => ({ ...prevState, errorText: 'Password does not match', error: true }));
                else setConfirmPassword(prevState => ({ ...prevState, errorText: '', error: false }));
            })();
    }, [confirmPassword.name, password.name]);

    return (
        <Container>
            <div className="margin-global-top-5" />
            <Row>
                <Col>
                    <Heading1
                        text="Password Reset"
                        className="text-center margin-global-top-3"
                    />
                </Col>
            </Row>
            <Row>
                <Form onSubmit={onSubmit} className="form-style margin-global-top-1">
                    <Row className="justify-content-between">
                        <Form.Group className="form-group-right" as={Col} md={6} controlId="password">
                            <Form.Label style={{ textAlign: 'left' }}>Password</Form.Label>
                            <InputGroup size="lg">
                                <Form.Control
                                    type={password.showPassword ? 'text' : 'password'}
                                    onChange={changePassword}
                                    value={password.name}
                                />
                                <InputGroup.Text>
                                    {
                                        password.showPassword ? (
                                            <IoMdEye
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                className="icon" />
                                        ) : (
                                            <IoMdEyeOff
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                className="icon" />
                                        )
                                    }
                                </InputGroup.Text>
                            </InputGroup>
                            <div className="error-text">{password.errorText}</div>
                        </Form.Group>
                        <div className="margin-global-top-2 unhide-768" />
                        <Form.Group className="form-group-left" as={Col} md={6} controlId="confirmPassword">
                            <Form.Label style={{ textAlign: 'left' }}>Confirm Password</Form.Label>
                            <InputGroup size="lg">
                                <Form.Control
                                    type={confirmPassword.showPassword ? 'text' : 'password'}
                                    onChange={changeConfirmPassword}
                                    value={confirmPassword.name}
                                />
                                <InputGroup.Text>
                                    {
                                        confirmPassword.showPassword ? (
                                            <IoMdEye
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownConfirmPassword}
                                                className="icon" />
                                        ) : (
                                            <IoMdEyeOff
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownConfirmPassword}
                                                className="icon" />
                                        )
                                    }
                                </InputGroup.Text>
                            </InputGroup>
                            <div className="error-text">{confirmPassword.errorText}</div>
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-center">
                        <Button disabled={disable} type="submit">
                            Submit
                        </Button>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
}

export default ResetPassword;