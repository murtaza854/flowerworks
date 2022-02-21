import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SendResetLink.scss';

function SendResetLink(props) {
    return (
        <Container className="account-creation">
            <Row className="margin-global-top-2">
                <h1 style={{textTransform: 'uppercase'}}>Email Sent</h1>
                <p>Please check your email to reset your password.</p>
                <p className="text-uppercase">Please click <Link to="/">here</Link> to go back to home page.</p>
            </Row>
        </Container>
    );
}

export default SendResetLink;