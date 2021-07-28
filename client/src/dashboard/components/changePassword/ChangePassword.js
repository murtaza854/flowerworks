import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import api from '../../../api';
import { Divider, Heading1, ParaText } from '../../../components';
import './ChangePassword.scss'

function ChangePassword(props) {
    const [oldPassword, setOldPassword] = useState({ value: '', errorText: '', show: false, showText: 'Show Password' });
    const [password, setPassword] = useState({ value: '', errorText: '', show: false, error: false, showText: 'Show Password', readOnly: true });
    const [confirmPassword, setConfirmPassword] = useState({ value: '', errorText: '', show: false, error: false, showText: 'Show Password', readOnly: true });

    const [showEditButton, setShowEditButton] = useState(true);
    const [saveButton, setSaveButton] = useState({ show: false, disabled: false });
    const [showCancelEditButton, setShowCancelEditButton] = useState(false);

    const [profileChange, setProfileChange] = useState(<div></div>);

    const setEdit = e => {
        e.preventDefault();
        setPassword(prevState => ({ ...prevState, readOnly: false }));
        setConfirmPassword(prevState => ({ ...prevState, readOnly: false }));
        setShowEditButton(false);
        setSaveButton({ show: true, disabled: false });
        setShowCancelEditButton(true);
        setProfileChange(<Row>
            <div className="global-mt-3"></div>
            <ParaText
                text="Please enter password to confirm changes"
                textAlign="center"
            />
        </Row>)
    }

    const cancelEdit = e => {
        e.preventDefault();
        setPassword(prevState => ({ ...prevState, value: '', errorText: '', error: false, readOnly: true, showText: 'Show Password' }));
        setConfirmPassword(prevState => ({ ...prevState, value: '', errorText: '', error: false, readOnly: true, showText: 'Show Password' }));
        setOldPassword(prevState => ({ ...prevState, value: '', errorText: '' }));
        setShowEditButton(true);
        setSaveButton({ show: false, disabled: false });
        setShowCancelEditButton(false);
        setProfileChange(<div></div>);
    }

    useEffect(() => {
        let flag = true;
        if (oldPassword.error === true) flag = true;
        else if (oldPassword.value.length === 0) flag = true;
        else if (password.error === true) flag = true;
        else if (password.value.length === 0) flag = true;
        else if (confirmPassword.error === true) flag = true;
        else flag = false;
        if (!flag) {
            setSaveButton(prevState => ({ ...prevState, disabled: false }));
        } else setSaveButton(prevState => ({ ...prevState, disabled: true }));
    }, [oldPassword, password, confirmPassword]);

    const changeOldPassword = event => {
        setOldPassword(prevState => ({ ...prevState, value: event.target.value }));
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

    useEffect(() => {
        (
            () => {
                if (confirmPassword.value !== password.value) setConfirmPassword(prevState => ({ ...prevState, errorText: 'Password does not match', error: true }));
                else setConfirmPassword(prevState => ({ ...prevState, errorText: '', error: false }));
            })();
    }, [confirmPassword.value, password.value]);

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`${api}/users/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ oldPassword: oldPassword.value, password: password.value, confirmPassword: confirmPassword.value })
        });
        const content = await response.json();
        setPassword(prevState => ({ ...prevState, value: '', errorText: '', error: false, readOnly: true, showText: 'Show Password' }));
        setConfirmPassword(prevState => ({ ...prevState, value: '', errorText: '', error: false, readOnly: true, showText: 'Show Password' }));
        setOldPassword(prevState => ({ ...prevState, value: '', errorText: '' }));
        if (content.data === true) {
            setProfileChange(<Row>
                <div className="global-mt-2"></div>
                <ParaText
                    text="Your password has been changed."
                    textAlign="center"
                />
            </Row>)
            setTimeout(() => {
                setProfileChange(<div></div>)
            }, 3000)
            setShowEditButton(true);
            setSaveButton({ show: false, disabled: false });
            setShowCancelEditButton(false);
        } else {
            setProfileChange(<Row>
                <div className="global-mt-2"></div>
                <ParaText
                    text="Invalid Password. Please try again."
                    textAlign="center"
                />
            </Row>)
            setTimeout(() => {
                setProfileChange(<div></div>)
            }, 3000)
            setShowEditButton(true);
            setSaveButton({ show: false, disabled: false });
            setShowCancelEditButton(false);
        }
    }

    return (
        <Container className="change-password">
            <Form className="form-style">
                <Heading1
                    first="Change"
                    bold="Password"
                    classes="text-uppercase"
                />
                <div className="global-mt-2"></div>
                <input
                    type="password"
                    autoComplete="on"
                    value=""
                    style={{ display: 'none' }}
                    readOnly={true}
                />
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="password">
                        <Form.Label>New Password:</Form.Label>
                        <Form.Control readOnly={password.readOnly} value={password.value} onChange={changePassword} autoComplete="off" type={password.show ? 'text' : 'password'} />
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
                        <Form.Control readOnly={confirmPassword.readOnly} value={confirmPassword.value} onChange={changeConfirmPassword} autoComplete="off" type={confirmPassword.show ? 'text' : 'password'} />
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
                {
                    saveButton.show ? (
                        <>
                            <Row className="justify-content-center">
                                <Divider md={4} classes="margin-specified" />
                            </Row>
                            <Row className="justify-content-center">
                                <Form.Group className="input-form-group" as={Col} md={5} controlId="password">
                                    <Form.Label>Old Password:</Form.Label>
                                    <Form.Control autoComplete="off" value={oldPassword.value} onChange={changeOldPassword} type="password" />
                                    <div className="error-text">{oldPassword.errorText}</div>
                                </Form.Group>
                            </Row>
                        </>
                    ) : null
                }
                {profileChange}
                <div className="global-mt-3"></div>
                <Row>
                    <div className="horizontal-center-margin change-password-btns">
                        {
                            showEditButton ? (
                                <Button type="text" onClick={setEdit}>Edit</Button>
                            ) : null
                        }
                        {
                            saveButton.show ? (
                                <Button disabled={saveButton.disabled} type="submit" onClick={handleSubmit}>Save</Button>
                            ) : null
                        }
                        {
                            showCancelEditButton ? (
                                <Button type="text" onClick={cancelEdit}>Cancel Edit</Button>
                            ) : null
                        }
                    </div>
                </Row>
                <div className="global-mt-3"></div>
            </Form>
        </Container>
    );
}

export default ChangePassword;