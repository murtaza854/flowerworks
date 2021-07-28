import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import api from '../../../api';
import UserContext from '../../../authenticatedUser';
import { Heading1, Divider, ParaText } from '../../../components';
import './Profile.scss'

function Profile(props) {
    const user = useContext(UserContext);

    const [firstName, setFirstName] = useState({ value: '', errorText: '', error: false, readOnly: true });
    const [lastName, setlastName] = useState({ value: '', errorText: '', error: false, readOnly: true });
    const [phoneNumber, setPhoneNumber] = useState({ value: '', errorText: '', error: false, readOnly: true });
    const [email, setEmail] = useState({ value: '', errorText: '', error: false, readOnly: true });
    const [password, setPassword] = useState({ value: '', errorText: '' });

    const [showEditButton, setShowEditButton] = useState(true);
    const [saveButton, setSaveButton] = useState({ show: false, disabled: false });
    const [showCancelEditButton, setShowCancelEditButton] = useState(false);

    const [profileChange, setProfileChange] = useState(<div></div>);

    const setEdit = e => {
        e.preventDefault();
        setFirstName(prevState => ({ ...prevState, readOnly: false }));
        setlastName(prevState => ({ ...prevState, readOnly: false }));
        setPhoneNumber(prevState => ({ ...prevState, readOnly: false }));
        setEmail(prevState => ({ ...prevState, readOnly: false }));
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
        setFirstName({ value: user.userState.firstName, errorText: '', error: false, readOnly: true });
        setlastName({ value: user.userState.lastName, errorText: '', error: false, readOnly: true });
        setPhoneNumber({ value: user.userState.contactNumber, errorText: '', error: false, readOnly: true });
        setEmail({ value: user.userState.email, errorText: '', error: false, readOnly: true });
        setPassword({ value: '', errorText: '' });
        setShowEditButton(true);
        setSaveButton({ show: false, disabled: false });
        setShowCancelEditButton(false);
        setProfileChange(<div></div>);
    }

    useEffect(() => {
        if (user.userState) {
            setFirstName(prevState => ({ ...prevState, value: user.userState.firstName }));
            setlastName(prevState => ({ ...prevState, value: user.userState.lastName }));
            setPhoneNumber(prevState => ({ ...prevState, value: user.userState.contactNumber }));
            setEmail(prevState => ({ ...prevState, value: user.userState.email }));
        } else {
            setFirstName(prevState => ({ ...prevState, value: '' }));
            setlastName(prevState => ({ ...prevState, value: '' }));
            setPhoneNumber(prevState => ({ ...prevState, value: '' }));
            setEmail(prevState => ({ ...prevState, value: '' }));
        }
    }, [user])

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
        else flag = false;
        if (!flag) {
            setSaveButton(prevState => ({ ...prevState, disabled: false }));
        } else setSaveButton(prevState => ({ ...prevState, disabled: true }));
    }, [firstName, lastName, phoneNumber, email, password]);

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
        setPassword({ value: event.target.value, errorText: '' });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`${api}/users/change-profile`, {
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
                password: password.value
            })
        });
        const content = await response.json();
        if (content.data === 'success') {
            user.setUserState(content.user);
            if (content.emailChange) {
                setProfileChange(<Row>
                    <div className="global-mt-2"></div>
                    <ParaText
                        text="Your changes have been confirmed. Please verify your email from the link that was emailed to you."
                        textAlign="center"
                    />
                </Row>)
                setTimeout(() => {
                    setProfileChange(<div></div>)
                }, 3000)
            } else {
                setProfileChange(<Row>
                    <div className="global-mt-2"></div>
                    <ParaText
                        text="Your changes have been confirmed."
                        textAlign="center"
                    />
                </Row>)
                setTimeout(() => {
                    setProfileChange(<div></div>)
                }, 3000)
            }
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
        <Container className="profile">
            <Form className="form-style">
                <Heading1
                    first="Your"
                    bold="Information"
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
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="firstName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control readOnly={firstName.readOnly} value={firstName.value} onChange={changeFirstName} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{firstName.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control readOnly={lastName.readOnly} value={lastName.value} onChange={changeLastName} type="text" />
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
                        <Form.Control readOnly={phoneNumber.readOnly} value={phoneNumber.value} onChange={changePhoneNumber} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{phoneNumber.errorText}</div>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control readOnly={email.readOnly} value={email.value} onChange={changeEmail} type="text" />
                        <Row>
                            <Col xs={8}>
                                <div className="error-text">{email.errorText}</div>
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
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control autoComplete="off" value={password.value} onChange={changePassword} type="password" />
                                    <div className="error-text">{password.errorText}</div>
                                </Form.Group>
                            </Row>
                        </>
                    ) : null
                }
                {profileChange}
                <div className="global-mt-3"></div>
                <Row>
                    <div className="horizontal-center-margin profile-btns">
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

export default Profile;