import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ResetPasswordCheck.scss';

function ResetPasswordCheck(props) {
    return (
        <Container className="account-creation">
            <Row className="margin-global-top-2">
                <h1 style={{textTransform: 'uppercase'}}>{props.title}</h1>
                <p>{props.message}</p>
                <p className="text-uppercase">Please click <Link to="/login">here</Link> to login.</p>
            </Row>
        </Container>
    );
}

export default ResetPasswordCheck;