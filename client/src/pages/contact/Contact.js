import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import { Heading1 } from '../../components';
import './Contact.scss';

function Contact(props) {

    const [firstName, setFirstName] = useState({ name: '', errorText: '', error: false });
    const [lastName, setLastName] = useState({ name: '', errorText: '', error: false });
    const [email, setEmail] = useState({ name: '', errorText: '', error: false });
    const [contactNumber, setContactNumber] = useState({ name: '', errorText: '', error: false });
    const [message, setMessage] = useState({ name: '', errorText: '', error: false });

    // eslint-disable-next-line no-unused-vars
    const [disable, setDisable] = useState(true);

    const changeFirstName = event => {
        if (event.target.value === '') setFirstName({ name: event.target.value, errorText: 'First name is required!', error: true });
        else setFirstName({ name: event.target.value, errorText: '', error: false });
    }
    const changeLastName = event => {
        if (event.target.value === '') setLastName({ name: event.target.value, errorText: 'Last name is required!', error: true });
        else setLastName({ name: event.target.value, errorText: '', error: false });
    }
    const changeEmail = event => {
        const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (event.target.value === '') setEmail({ name: '', errorText: 'Email address is required!', error: true });
        else if (!event.target.value.match(mailformat)) setEmail({ name: event.target.value, errorText: 'Please enter a valid email address!', error: true });
        else setEmail({ name: event.target.value, errorText: '', error: false });
    }

    function formatPhoneNumber(phoneNumberString) {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        if (cleaned.length !== 11) {
            return null;
        }
        var match = cleaned.match(/^(0|)?(\d{3})(\d{3})((\d{4}))$/);
        if (match) {
            return ['(', match[1], match[2], ') ', match[3], '', match[4]].join('');
        }
        return null;
    }

    const changeContactNumber = event => {
        const phoneNumber = formatPhoneNumber(event.target.value);
        if (phoneNumber === null) setContactNumber({ name: event.target.value, errorText: 'Please enter a valid contact number!', error: true });
        else setContactNumber({ name: phoneNumber, errorText: '', error: false });
    }

    const changeMessage = event => {
        if (event.target.value === '') setMessage({ name: event.target.value, errorText: 'Message is required!', error: true });
        else setMessage({ name: event.target.value, errorText: '', error: false });
    }

    const onSubmit = event => {
        event.preventDefault();
    }

    // useEffect(() => {
    //     let flag = true;
    //     if (firstName.error === true) flag = true;
    //     else if (firstName.name.length === 0) flag = true;
    //     else if (lastName.error === true) flag = true;
    //     else if (lastName.name.length === 0) flag = true;
    //     else if (email.error === true) flag = true;
    //     else if (email.name.length === 0) flag = true;
    //     else if (contactNumber.error === true) flag = true;
    //     else if (contactNumber.name.length === 0) flag = true;
    //     else if (message.error === true) flag = true;
    //     else if (message.name.length === 0) flag = true;
    //     else flag = false;
    //     setDisable(flag);
    // }, [firstName, lastName, email, contactNumber, message]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Contact Us | Flowerworks';
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <Heading1
                        first="Contact"
                        bold="Us"
                        classes="text-uppercase text-center"
                    />
                </Col>
            </Row>
            <Row>
                <Form onSubmit={onSubmit} className="form-style margin-global-top-1">
                    <input
                        type="password"
                        autoComplete="on"
                        value=""
                        style={{ display: 'none' }}
                        readOnly={true}
                    />
                    <Row className="justify-content-between">
                        <Form.Group className="form-group-rght" as={Col} md={6} controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={changeFirstName}
                                onBlur={changeFirstName}
                                value={firstName.name}
                            />
                            <div className="error-text">{firstName.errorText}</div>
                        </Form.Group>
                        <div className="margin-global-top-2 unhide-768" />
                        <Form.Group className="form-group-lft" as={Col} md={6} controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={changeLastName}
                                onBlur={changeLastName}
                                value={lastName.name}
                            />
                            <div className="error-text">{lastName.errorText}</div>
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-between">
                        <Form.Group className="form-group-rght" as={Col} md={6} controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                onChange={changeEmail}
                                onBlur={changeEmail}
                                value={email.name}
                            />
                            <div className="error-text">{email.errorText}</div>
                        </Form.Group>
                        <div className="margin-global-top-2 unhide-768" />
                        <Form.Group className="form-group-rght" as={Col} md={6} controlId="contactNumber">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={changeContactNumber}
                                onBlur={changeContactNumber}
                                value={contactNumber.name}
                            />
                            <div className="error-text">{contactNumber.errorText}</div>
                        </Form.Group>
                    </Row>
                    <div className="margin-global-top-2" />
                    <Row className="justify-content-between">
                        <Form.Group className="form-group-rght" as={Col} md={6} controlId="message">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="3"
                                onChange={changeMessage}
                                onBlur={changeMessage}
                                value={message.name}
                            />
                            <div className="error-text">{message.errorText}</div>
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

export default Contact;