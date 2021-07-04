import React from 'react';
import { Container, Form, Col, Row } from 'react-bootstrap';
import { Button, Heading1, ParaText } from '../../components';
import './Signin.scss';

function Signin(props) {
    return (
        <Container className="signin">
            <Heading1
                first="Sign"
                bold="in"
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
                <Row className="justify-content-center">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control autoComplete="email" type="text" />
                        <div className="error-text">Error text</div>
                    </Form.Group>
                </Row>
                <div className="global-mt-3"></div>
                <Row className="justify-content-center">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="password">
                        <Form.Label>Password:</Form.Label>
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
                            text="Not a Registered Customer? Sign Up"
                            link="HERE"
                            href="/signup"
                            textAlign="center"
                        />
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default Signin;