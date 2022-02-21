import React, { useEffect, useState } from 'react';
import { Container, Form, Col, Row } from 'react-bootstrap';
import { Button, Heading1, Divider } from '../../components';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import { RadioGroup, Radio, FormControlLabel, FormControl } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Subscribe.scss';
import api from '../../api';

function Subscribe(props) {
    const [firstName, setFirstName] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [lastName, setLastName] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [phoneNumber, setPhoneNumber] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [email, setEmail] = useState({ value: '', errorText: '', error: false, readOnly: false });

    const [area, setArea] = useState({ value: '', errorText: '', error: false });
    const [addressLine1, setAddressLine1] = useState({ value: '', errorText: '', error: false });
    const [landmark, setLandmark] = useState({ value: '' });
    const [addressLine2, setAddressLine2] = useState({ value: '' });

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

    const changeArea = event => {
        if (event.target.value === '') setArea({ value: event.target.value, errorText: 'Area is required!', error: true });
        else setArea({ value: event.target.value, errorText: '', error: false });
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
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
    const [valueRadio1, setValueRadio1] = React.useState('1 Month - 4 Boxes (PKR.0000)');
    const [subscribePackages, setSubscribePackages] = useState([]);
    const [valueRadio2, setValueRadio2] = React.useState('Mixed Flowers');

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(`${api}/subscribe/getAll-client`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const content = await response.json();
            setSubscribePackages(content.data);
            try {
                const obj = content.data[0];
                setValueRadio1(obj._id);
            } catch (error) {

            }
        }
        getData();
    }, [])

    const handleChangeRadioGroup1 = (event) => {
        setValueRadio1(event.target.value);
    };
    const handleChangeRadioGroup2 = (event) => {
        setValueRadio2(event.target.value);
    };

    const onClick = async event => {
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
        else if (area.error === true) flag = false;
        else if (area.value === '') flag = false;
        else if (addressLine1.error === true) flag = false;
        else if (addressLine1.value === '') flag = false;
        if (flag) {
            const response = await fetch(`${api}/subscribedUser/user-subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName.value,
                    lastName: lastName.value,
                    phoneNumber: phoneNumber.value,
                    email: email.value,
                    area: area.value,
                    addressLine1: addressLine1.value,
                    addressLine2: addressLine2.value,
                    landmark: landmark.value,
                    subscribePackage: valueRadio1,
                    subscribeType: valueRadio2,
                }),
            });
            const content = await response.json();
            if (content.data) {
                alert("You have successfully subscribed! You will receive a confirmation email shortly. If you do not receive the email, please check your spam folder.");
            } else {
                alert("Error occured! Please try again later.");
            }
        } else alert('Fill all the required fields!');
    }

    return (
        <Container className="subscribe">
            <Heading1
                first="Flower"
                bold="Subscription"
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
                    <Form.Group as={Col} md={5} controlId="firstName-your">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName.value}
                            readOnly={firstName.readOnly}
                            onChange={changeFirstName}
                            onBlur={changeFirstName}
                        />
                        <div className="error-text">{firstName.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="lastName-your">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName.value}
                            readOnly={lastName.readOnly}
                            onChange={changeLastName}
                            onBlur={changeLastName}
                        />
                        <div className="error-text">{lastName.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="phoneNumber-your">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control
                            type="text"
                            value={phoneNumber.value}
                            readOnly={phoneNumber.readOnly}
                            onChange={changePhoneNumber}
                            onBlur={changePhoneNumber}
                        />
                        <div className="error-text">{phoneNumber.errorText}</div>
                    </Form.Group>
                    <Form.Group as={Col} md={5} controlId="email-your">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control
                            type="text"
                            value={email.value}
                            readOnly={email.readOnly}
                            onChange={changeEmail}
                            onBlur={changeEmail}
                        />
                        <div className="error-text">{email.errorText}</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group as={Col} md={5} controlId="area">
                        <Form.Label>Area:</Form.Label>
                        <Form.Control
                            type="text"
                            value={area.value}
                            onChange={changeArea}
                            onBlur={changeArea}
                        />
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
                <div className="margin-global-top-1 hide-991"></div>
                <Row className="justify-content-center">
                    <Divider md={4} classes="margin-specified" />
                </Row>
                <Row className="justify-content-center">
                    <Col md={5} className="checkbox-form-group">
                        <FormControl component="fieldset">
                            <ThemeProvider theme={theme}>
                                <RadioGroup aria-label="months" name="months" value={valueRadio1} onChange={handleChangeRadioGroup1}>
                                    {
                                        subscribePackages.map((obj, index) => {
                                            let string = `${obj.packageLength} ${obj.packageLengthUnit} - ${obj.baseAmount} ${obj.base} (PKR.${obj.price} per ${obj.packageLengthUnit})`;
                                            return (
                                                <FormControlLabel
                                                    key={index}
                                                    value={obj._id}
                                                    control={
                                                        <Radio
                                                            disableRipple={true}
                                                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                            checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                                    }
                                                    label={string}
                                                    labelPlacement="end"
                                                />
                                            )
                                        })
                                    }
                                    {/* <FormControlLabel
                                        value="1 Month - 4 Boxes (PKR.0000)"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="1 Month - 4 Boxes (PKR.0000)"
                                    />
                                    <FormControlLabel
                                        value="3 Months - 12 Boxes (PKR.0000)"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="3 Months - 12 Boxes (PKR.0000)"
                                    />
                                    <FormControlLabel
                                        value="6 Months - 26 Boxes (PKR.0000)"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="6 Months - 26 Boxes (PKR.0000)"
                                    />
                                    <FormControlLabel
                                        value="12 Months - 52 Boxes (PKR.0000)"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="12 Months - 52 Boxes (PKR.0000)"
                                    /> */}
                                </RadioGroup>
                            </ThemeProvider>
                        </FormControl>
                    </Col>
                    <Row className="justify-content-center unhide-991">
                        <Divider md={4} classes="margin-specified horizontal-center-relative" />
                    </Row>
                    <Col md={3} className="checkbox-form-group">
                        <FormControl component="fieldset">
                            <ThemeProvider theme={theme}>
                                <RadioGroup aria-label="months" name="months" value={valueRadio2} onChange={handleChangeRadioGroup2}>
                                    <FormControlLabel
                                        value="Mixed Flowers"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="Mixed Flowers"
                                    />
                                    <FormControlLabel
                                        value="One Type"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="One Type"
                                    />
                                </RadioGroup>
                            </ThemeProvider>
                        </FormControl>
                    </Col>
                </Row>
                <Row>
                    <div className="horizontal-center-margin">
                        <Button onClick={onClick} to="/" text="Subscribe" classes="text-uppercase" />
                    </div>
                </Row>
            </Form>
        </Container>
    );
}

export default Subscribe;