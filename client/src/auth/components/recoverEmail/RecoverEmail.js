import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import recoverEmail from '../../functions/recoverEmail';
import './RecoverEmail.scss';

function RecoverEmail(props) {
    const [message, setMessage] = useState('');
    const [secondMessage, setSecondMessage] = useState('');
    const [link, setLink] = useState('/login');

    useEffect(() => {
        Promise.resolve(recoverEmail(props.mode, props.actionCode)).then((value) => {
            if (value === 'Email recovery success') {
                setMessage('Your email has been successfully recovered. Please check your email to reset your password.');
                setSecondMessage('to login.');
                setLink('/login');
            } else {
                setMessage('The provided link is either used or invalid.');
                setSecondMessage('to go back to home page.');
                setLink('/');
            }
        })
    }, [props.mode, props.actionCode])
    return (
        <Container className="email-verified">
            <Row className="margin-global-top-2">
                <h1 style={{ textTransform: 'uppercase' }}>Email Recovery</h1>
                <p>{message}</p>
                <p className="text-uppercase">Please click <Link to={link}>here</Link> {secondMessage}</p>
            </Row>
        </Container>
    );
}

export default RecoverEmail;