import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Button, Heading1 } from '../../../../components';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './DeliveryForm.scss';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import api from '../../../../api';

function DeliveryForm(props) {
    const theme = createMuiTheme({
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
    const todayDate = new Date();

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

    const changeFirstName = event => {
        props.setFirstName(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setFirstName(prevState => ({ ...prevState, errorText: 'First name is required!', error: true }));
        else props.setFirstName(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLastName = event => {
        props.setLastName(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setLastName(prevState => ({ ...prevState, errorText: 'Last name is required!', error: true }));
        else props.setLastName(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changePhoneNumber = event => {
        const phoneReg = /^\d{11}$/;
        props.setPhoneNumber(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setPhoneNumber(prevState => ({ ...prevState, errorText: 'Phone number is required!', error: true }));
        else if (!event.target.value.match(phoneReg)) props.setPhoneNumber(prevState => ({ ...prevState, errorText: 'Must contain 11 digits!', error: true }));
        else props.setPhoneNumber(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeEmail = event => {
        props.setEmail(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setEmail(prevState => ({ ...prevState, errorText: 'Email is required!', error: true }));
        else if (!event.target.value.includes('@')) props.setEmail(prevState => ({ ...prevState, errorText: 'Email must be valid!', error: true }));
        else props.setEmail(prevState => ({ ...prevState, errorText: '', error: false }));
    }

    const changeFirstName1 = event => {
        props.setFirstName1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setFirstName1(prevState => ({ ...prevState, errorText: 'First name is required!', error: true }));
        else props.setFirstName1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLastName1 = event => {
        props.setLastName1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setLastName1(prevState => ({ ...prevState, errorText: 'Last name is required!', error: true }));
        else props.setLastName1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changePhoneNumber1 = event => {
        const phoneReg = /^\d{11}$/;
        props.setPhoneNumber1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setPhoneNumber1(prevState => ({ ...prevState, errorText: 'Phone number is required!', error: true }));
        else if (!event.target.value.match(phoneReg)) props.setPhoneNumber1(prevState => ({ ...prevState, errorText: 'Must contain 11 digits!', error: true }));
        else props.setPhoneNumber1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeEmail1 = event => {
        props.setEmail1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setEmail1(prevState => ({ ...prevState, errorText: 'Email is required!', error: true }));
        else if (!event.target.value.includes('@')) props.setEmail1(prevState => ({ ...prevState, errorText: 'Email must be valid!', error: true }));
        else props.setEmail1(prevState => ({ ...prevState, errorText: '', error: false }));
    }

    const changeArea = event => {
        props.setArea(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '-') props.setArea(prevState => ({ ...prevState, errorText: 'Area is required!', error: true }));
        else props.setArea(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeAddressLine1 = event => {
        props.setAddressLine1(prevState => ({ ...prevState, value: event.target.value }));
        if (event.target.value === '') props.setAddressLine1(prevState => ({ ...prevState, errorText: 'Address line 1 is required!', error: true }));
        else props.setAddressLine1(prevState => ({ ...prevState, errorText: '', error: false }));
    }
    const changeLandmark = event => {
        props.setLandmark(prevState => ({ ...prevState, value: event.target.value }));
    }
    const changeAddressLine2 = event => {
        props.setAddressLine2(prevState => ({ ...prevState, value: event.target.value }));
    }

    const changeDateError = (date) => {
        try {
            if (date.target.value === '') props.setDate(prevState => ({ ...prevState, errorText: 'Date is required!', error: true }));
        } catch (error) {
            props.setDate({ value: date, errorText: '', error: false });
        }
    }
    const changeMessage = event => {
        props.setMessage({ value: event.target.value });
    }

    const changeReceiverCheckbox = event => {
        props.setCheckboxes(prevState => ({ ...prevState, receiver: !props.checkBoxes.receiver }));
    }
    const changeCallMeCheckbox = event => {
        props.setCheckboxes(prevState => ({ ...prevState, callMe: !props.checkBoxes.callMe }));
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
                            value={props.firstName.value}
                            readOnly={props.firstName.readOnly}
                            onChange={changeFirstName}
                            onBlur={changeFirstName}
                        />
                        <div className="error-text">{props.firstName.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control type="text"
                            value={props.lastName.value}
                            readOnly={props.lastName.readOnly}
                            onChange={changeLastName}
                            onBlur={changeLastName}
                        />
                        <div className="error-text">{props.lastName.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="phoneNumber">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control type="text"
                            value={props.phoneNumber.value}
                            readOnly={props.phoneNumber.readOnly}
                            onChange={changePhoneNumber}
                            onBlur={changePhoneNumber}
                        />
                        <div className="error-text">{props.phoneNumber.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control type="text"
                            value={props.email.value}
                            readOnly={props.email.readOnly}
                            onChange={changeEmail}
                            onBlur={changeEmail}
                        />
                        <div className="error-text">{props.email.errorText}</div>
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
                    <Form.Group as={Col} md={5} controlId="firstName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control type="text"
                            value={props.firstName1.value}
                            readOnly={props.firstName1.readOnly}
                            onChange={changeFirstName1}
                            onBlur={changeFirstName1}
                        />
                        <div className="error-text">{props.firstName1.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control type="text"
                            value={props.lastName1.value}
                            readOnly={props.lastName1.readOnly}
                            onChange={changeLastName1}
                            onBlur={changeLastName1}
                        />
                        <div className="error-text">{props.lastName1.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="phoneNumber">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control type="text"
                            value={props.phoneNumber1.value}
                            readOnly={props.phoneNumber1.readOnly}
                            onChange={changePhoneNumber1}
                            onBlur={changePhoneNumber1}
                        />
                        <div className="error-text">{props.phoneNumber1.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control type="text"
                            value={props.email1.value}
                            readOnly={props.email1.readOnly}
                            onChange={changeEmail1}
                            onBlur={changeEmail1}
                        />
                        <div className="error-text">{props.email1.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="global-mt-2 justify-content-between">
                    <Form.Group as={Col} md={5} controlId="area">
                        <Form.Label>Area:</Form.Label>
                        <Form.Control
                            value={props.area.value}
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
                        <div className="error-text">{props.area.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="addressLine1">
                        <Form.Label>Address Line 1:</Form.Label>
                        <Form.Control type="text"
                            value={props.addressLine1.value}
                            onChange={changeAddressLine1}
                            onBlur={changeAddressLine1}
                        />
                        <div className="error-text">{props.addressLine1.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="landmark">
                        <Form.Label>Nearest Landmark (Optional):</Form.Label>
                        <Form.Control type="text"
                            value={props.landmark.value}
                            onChange={changeLandmark}
                            onBlur={changeLandmark}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="addressLine2">
                        <Form.Label>Address Line 2 (Optional):</Form.Label>
                        <Form.Control type="text"
                            value={props.addressLine2.value}
                            onChange={changeAddressLine2}
                            onBlur={changeAddressLine2}
                        />
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Col md={5}>
                        <ThemeProvider theme={theme}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={changeReceiverCheckbox}
                                        disableRipple={true}
                                        value={props.checkBoxes.receiver}
                                        icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                        checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                }
                                label="I am the receiver"
                            />
                        </ThemeProvider>
                    </Col>
                </Row>
                <Row className="global-mt-3 justify-content-between">
                    <Col md={5}>
                        <Row>
                            <Form.Group as={Col} controlId="date">
                                <Form.Label>Delivery Date:</Form.Label>
                                <DatePicker
                                    selected={props.date.value}
                                    minDate={todayDate.setDate(todayDate.getDate() + 2)}
                                    onChange={(date) => changeDateError(date)}
                                    onBlur={changeDateError}
                                />
                                <div className="error-text">{props.date.errorText}</div>
                            </Form.Group>
                        </Row>
                        <Row className="global-mt-3">
                            <ThemeProvider theme={theme}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={changeCallMeCheckbox}
                                            disableRipple={true}
                                            value={props.checkBoxes.callMe}
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
                                <textarea value={props.message.value} onChange={changeMessage} style={{ resize: 'none' }} rows={5} />
                            </Form.Group>
                        </Row>
                    </Col>
                </Row>
                <div className="global-mt-2"></div>
                <Row>
                    <div className="horizontal-center-margin">
                        <Button cartForm={3} setActive={props.setActive} setActiveCompClass={props.setActiveCompClass} to="/" text="Proceed" classes="text-uppercase" />
                    </div>
                </Row>
                <div className="global-mt-3"></div>
            </Form>
        </Container>
    );
}

export default DeliveryForm;