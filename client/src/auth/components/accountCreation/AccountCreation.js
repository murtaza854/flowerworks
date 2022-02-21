import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AccountCreation.scss';

function AccountCreation(props) {
    return (
        <Container className="account-creation">
            <Row className="margin-global-top-2">
                <h1 style={{textTransform: 'uppercase'}}>Account Created</h1>
                <p>Please verify your email to access your dashboard. If you did not receive the email, please check your spam folder.</p>
                <p className="text-uppercase">Please click <Link to="/">here</Link> to go back to home page.</p>
            </Row>
        </Container>
    );
}

export default AccountCreation;