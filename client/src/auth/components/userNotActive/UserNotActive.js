import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './UserNotActive.scss';

function UserNotActive(props) {
    return (
        <Container className="account-creation">
            <Row className="margin-global-top-2">
                <h1 style={{textTransform: 'uppercase'}}>User Blocked</h1>
                <p>Please contact support to access your dashboard.</p>
                <p className="text-uppercase">Please click <Link to="/">here</Link> to go back to home page.</p>
            </Row>
        </Container>
    );
}

export default UserNotActive;