import React from 'react';
import { Container, Form, Col, Row } from 'react-bootstrap';
import { Button, Heading1, Divider, ParaText } from '../../components';
import './Signup.scss';

function Signup(props) {
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
                    style={{display: 'none'}} 
                    readOnly={true}
                />
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="firstName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control type="text" />
                        <div className="error-text">Error text</div>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control type="text" />
                        <div className="error-text">Error text</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="phoneNumber">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control type="text" />
                        <div className="error-text">Error text</div>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control type="text" />
                        <div className="error-text">Error text</div>
                    </Form.Group>
                </Row>
                <Row className="justify-content-center">
                    <Divider md={4} classes="margin-specified" />
                </Row>
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="password">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control autoComplete="off" type="password" />
                        <div className="error-text">Error text</div>
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="confirmPassword">
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control autoComplete="off" type="password" />
                        <div className="error-text">Error text</div>
                    </Form.Group>
                </Row>
                <Row>
                    <div className="horizontal-center-margin">
                        <Button to="/" text="Sign up" classes="text-uppercase" />
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