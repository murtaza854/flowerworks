import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Button, Heading1 } from '../../../../components';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './DeliveryForm.scss';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import {
    useHistory,
  } from "react-router-dom";
import api from '../../../../api';
import UserContext from '../../../../authenticatedUser';

function DeliveryForm(props) {
    const theme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#000000',
            },
            secondary: {
                main: '#000000',
            },
        },
        typography: {
            fontFamily: 'Raleway',
        },
    });
    const user = useContext(UserContext);
    const todayDate = new Date();
    // const location = useLocation();
    // const query = new URLSearchParams(location.search);
    // console.log(query.get("h"));
    const history = useHistory();

    const [areas, setAreas] = useState([]);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/areas/getAreas`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                setAreas(content.data);
            })();
    }, []);

    const [firstName, setFirstName] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [lastName, setLastName] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [phoneNumber, setPhoneNumber] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [email, setEmail] = useState({ value: '', errorText: '', error: false, readOnly: false });

    const [firstName1, setFirstName1] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [lastName1, setLastName1] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [phoneNumber1, setPhoneNumber1] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [email1, setEmail1] = useState({ value: '', errorText: '', error: false, readOnly: false });

    const [area, setArea] = useState({ value: '-', errorText: '', error: false });
    const [addressLine1, setAddressLine1] = useState({ value: '', errorText: '', error: false });
    const [landmark, setLandmark] = useState({ value: '' });
    const [addressLine2, setAddressLine2] = useState({ value: '' });

    const [date, setDate] = useState({ value: undefined, errorText: '', error: false });
    const [message, setMessage] = useState({ value: '' });

    const [checkBoxes, setCheckboxes] = useState({ receiver: false, callMe: false });

    const changeFirstName = event => {
        setFirstName(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setFirstName(prevState => ({ ...prevState, errorText: 'First name is required!', error: true }));
        else setFirstName(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLastName = event => {
        setLastName(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setLastName(prevState => ({ ...prevState, errorText: 'Last name is required!', error: true }));
        else setLastName(prevState => ({ ...prevState, errorText: '', error: false }));
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

    const changeFirstName1 = event => {
        setFirstName1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setFirstName1(prevState => ({ ...prevState, errorText: 'First name is required!', error: true }));
        else setFirstName1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLastName1 = event => {
        setLastName1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setLastName1(prevState => ({ ...prevState, errorText: 'Last name is required!', error: true }));
        else setLastName1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changePhoneNumber1 = event => {
        const phoneReg = /^\d{11}$/;
        setPhoneNumber1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setPhoneNumber1(prevState => ({ ...prevState, errorText: 'Phone number is required!', error: true }));
        else if (!event.target.value.match(phoneReg)) setPhoneNumber1(prevState => ({ ...prevState, errorText: 'Must contain 11 digits!', error: true }));
        else setPhoneNumber1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeEmail1 = event => {
        setEmail1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setEmail1(prevState => ({ ...prevState, errorText: 'Email is required!', error: true }));
        else if (!event.target.value.includes('@')) setEmail1(prevState => ({ ...prevState, errorText: 'Email must be valid!', error: true }));
        else setEmail1(prevState => ({ ...prevState, errorText: '', error: false }));
    }

    const changeArea = event => {
        setArea(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '-') setArea(prevState => ({ ...prevState, errorText: 'Area is required!', error: true }));
        else setArea(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeAddressLine1 = event => {
        setAddressLine1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') setAddressLine1(prevState => ({ ...prevState, errorText: 'Address line 1 is required!', error: true }));
        else setAddressLine1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLandmark = event => {
        setLandmark(prevState => ({ ...prevState, value: event.target.value }));
    }
    const changeAddressLine2 = event => {
        setAddressLine2(prevState => ({ ...prevState, value: event.target.value }));
    }

    const changeDateError = (date) => {
        try {
            if (date.target.value === '') setDate(prevState => ({ ...prevState, errorText: 'Date is required!', error: true }));
        } catch (error) {
            setDate({ value: date, errorText: '', error: false });
        }
    }
    const changeMessage = event => {
        setMessage({ value: event.target.value });
    }

    const changeReceiverCheckbox = event => {
        setCheckboxes(prevState => ({ ...prevState, receiver: !checkBoxes.receiver }));
    }
    const changeCallMeCheckbox = event => {
        setCheckboxes(prevState => ({ ...prevState, callMe: !checkBoxes.callMe }));
    }

    useEffect(() => {
        console.log(user);
        try {
            setFirstName({ value: user.firstName, errorText: '', error: false, readOnly: true });
            setLastName({ value: user.lastName, errorText: '', error: false, readOnly: true });
            setPhoneNumber({ value: user.contactNumber, errorText: '', error: false, readOnly: true });
            setEmail({ value: user.email, errorText: '', error: false, readOnly: true });
        } catch (error) {
            setFirstName({ value: '', errorText: '', error: false, readOnly: false });
            setLastName({ value: '', errorText: '', error: false, readOnly: false });
            setPhoneNumber({ value: '', errorText: '', error: false, readOnly: false });
            setEmail({ value: '', errorText: '', error: false, readOnly: false });
        }
    }, [user]);

    useEffect(() => {
        if (checkBoxes.receiver) {
            setFirstName1({ value: firstName.value, errorText: '', error: false, readOnly: true });
            setLastName1({ value: lastName.value, errorText: '', error: false, readOnly: true });
            setPhoneNumber1({ value: phoneNumber.value, errorText: '', error: false, readOnly: true });
            setEmail1({ value: email.value, errorText: '', error: false, readOnly: true });
        } else {
            setFirstName1({ value: '', errorText: '', error: false, readOnly: false });
            setLastName1({ value: '', errorText: '', error: false, readOnly: false });
            setPhoneNumber1({ value: '', errorText: '', error: false, readOnly: false });
            setEmail1({ value: '', errorText: '', error: false, readOnly: false });
        }
    }, [firstName, lastName, phoneNumber, email, checkBoxes.receiver]);

    const onClick = event => {
        event.preventDefault();
        let flag = true;
        if (firstName.error === true) flag = false;
        else if (firstName.value === '') flag = false;
        else if (lastName.error === true) flag = false;
        else if (lastName.value === '') flag = false;
        else if (phoneNumber.error === true) flag = false;
        else if (phoneNumber.value === '') flag = false;
        else if (email.error === true) flag = false;
        else if (email.value === '') flag = false;
        else if (firstName1.error === true) flag = false;
        else if (firstName1.value === '') flag = false;
        else if (lastName1.error === true) flag = false;
        else if (lastName1.value === '') flag = false;
        else if (phoneNumber1.error === true) flag = false;
        else if (phoneNumber1.value === '') flag = false;
        else if (email1.error === true) flag = false;
        else if (email1.value === '') flag = false;
        else if (area.error === true) flag = false;
        else if (area.value === '') flag = false;
        else if (addressLine1.error === true) flag = false;
        else if (addressLine1.value === '') flag = false;
        else if (date.error === true) flag = false;
        else if (date.value === '') flag = false;
        else if (date.value === undefined) flag = false;
        if (flag) {
            history.push('/cart/pay-send', {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                firstName1: firstName1,
                lastName1: lastName1,
                phoneNumber1: phoneNumber1,
                email1: email1,
                area: area,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                date: date,
                landmark: landmark,
                message: message,
                checkBoxes: checkBoxes
            })
        } else alert('Fill Delivery Form!')
    }

    return (
        <Container className="delivery-form">
            <Form className="form-style">
                <input
                    type="password"
                    autoComplete="on"
                    value=""
                    style={{ display: 'none' }}
                    readOnly={true}
                />
                <Row className="form-heading">
                    <Heading1
                        first="Your"
                        bold="Information"
                        classes="text-uppercase"
                    />
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="firstName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control type="text"
                            value={firstName.value}
                            readOnly={firstName.readOnly}
                            onChange={changeFirstName}
                            onBlur={changeFirstName}
                        />
                        <div className="error-text">{firstName.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control type="text"
                            value={lastName.value}
                            readOnly={lastName.readOnly}
                            onChange={changeLastName}
                            onBlur={changeLastName}
                        />
                        <div className="error-text">{lastName.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="phoneNumber">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control type="text"
                            value={phoneNumber.value}
                            readOnly={phoneNumber.readOnly}
                            onChange={changePhoneNumber}
                            onBlur={changePhoneNumber}
                        />
                        <div className="error-text">{phoneNumber.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control type="text"
                            value={email.value}
                            readOnly={email.readOnly}
                            onChange={changeEmail}
                            onBlur={changeEmail}
                        />
                        <div className="error-text">{email.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="form-heading global-mt-2">
                    <Heading1
                        first="Receiver's"
                        bold="Information"
                        classes="text-uppercase"
                    />
                </Row>
                <Row className="justify-content-between">
                    <Col md={5}>
                        <ThemeProvider theme={theme}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={changeReceiverCheckbox}
                                        disableRipple={true}
                                        value={checkBoxes.receiver}
                                        icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                        checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                }
                                label="I am the receiver"
                            />
                        </ThemeProvider>
                    </Col>
                </Row>
                <div className="global-mt-3"></div>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="firstName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control type="text"
                            value={firstName1.value}
                            readOnly={firstName1.readOnly}
                            onChange={changeFirstName1}
                            onBlur={changeFirstName1}
                        />
                        <div className="error-text">{firstName1.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control type="text"
                            value={lastName1.value}
                            readOnly={lastName1.readOnly}
                            onChange={changeLastName1}
                            onBlur={changeLastName1}
                        />
                        <div className="error-text">{lastName1.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="phoneNumber">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control type="text"
                            value={phoneNumber1.value}
                            readOnly={phoneNumber1.readOnly}
                            onChange={changePhoneNumber1}
                            onBlur={changePhoneNumber1}
                        />
                        <div className="error-text">{phoneNumber1.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control type="text"
                            value={email1.value}
                            readOnly={email1.readOnly}
                            onChange={changeEmail1}
                            onBlur={changeEmail1}
                        />
                        <div className="error-text">{email1.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="global-mt-2 justify-content-between">
                    <Form.Group as={Col} md={5} controlId="area">
                        <Form.Label>Area:</Form.Label>
                        <Form.Control
                            value={area.value}
                            onChange={changeArea}
                            onBlur={changeArea}
                            as="select" type="text">
                            <option value="-">-</option>
                            {areas.map((obj, index) => {
                                return (
                                    <option key={index} value={obj.name}>{obj.name}</option>
                                )
                            })}
                        </Form.Control>
                        <div className="error-text">{area.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="addressLine1">
                        <Form.Label>Address Line 1:</Form.Label>
                        <Form.Control type="text"
                            value={addressLine1.value}
                            onChange={changeAddressLine1}
                            onBlur={changeAddressLine1}
                        />
                        <div className="error-text">{addressLine1.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="landmark">
                        <Form.Label>Nearest Landmark (Optional):</Form.Label>
                        <Form.Control type="text"
                            value={landmark.value}
                            onChange={changeLandmark}
                            onBlur={changeLandmark}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="addressLine2">
                        <Form.Label>Address Line 2 (Optional):</Form.Label>
                        <Form.Control type="text"
                            value={addressLine2.value}
                            onChange={changeAddressLine2}
                            onBlur={changeAddressLine2}
                        />
                    </Form.Group>
                </Row>
                <Row className="global-mt-3 justify-content-between">
                    <Col md={5}>
                        <Row>
                            <Form.Group as={Col} controlId="date">
                                <Form.Label>Delivery Date:</Form.Label>
                                <DatePicker
                                    selected={date.value}
                                    minDate={todayDate.setDate(todayDate.getDate() + 2)}
                                    onChange={(date) => changeDateError(date)}
                                    onBlur={changeDateError}
                                />
                                <div className="error-text">{date.errorText}</div>
                            </Form.Group>
                        </Row>
                        <Row className="global-mt-3">
                            <ThemeProvider theme={theme}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={changeCallMeCheckbox}
                                            disableRipple={true}
                                            value={checkBoxes.callMe}
                                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                    }
                                    label="Call me incase of unavailable items to confirm my next best preferences"
                                />
                            </ThemeProvider>
                        </Row>
                    </Col>
                    <Col md={5}>
                        <Row>
                            <Form.Group as={Col} controlId="message">
                                <Form.Label>Message (Optional):</Form.Label>
                                <textarea value={message.value} onChange={changeMessage} style={{ resize: 'none' }} rows={5} />
                            </Form.Group>
                        </Row>
                    </Col>
                </Row>
                <div className="global-mt-2"></div>
                <Row>
                    <div className="horizontal-center-margin">
                        <Button
                            // cartForm={3}
                            // canSubmit={props.canSubmit}
                            // setActive={props.setActive}
                            // setActiveCompClass={props.setActiveCompClass}
                            onClick={onClick}
                            to="/"
                            text="Proceed"
                            classes="text-uppercase"
                        />
                    </div>
                </Row>
                <div className="global-mt-3"></div>
            </Form>
        </Container>
    );
}

export default DeliveryForm;