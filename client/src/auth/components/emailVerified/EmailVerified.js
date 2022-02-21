import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import verifyEmail from '../../functions/verifyEmail';
import './EmailVerified.scss';

function EmailVerified(props) {
    const [message, setMessage] = useState('');
    const [secondMessage, setSecondMessage] = useState('');
    const [link, setLink] = useState('/login');

    useEffect(() => {
        if (props.mode === 'emailNotVerified') {
            setMessage('Your email is not verified. An email has been sent to verify your email.');
            setSecondMessage('to go back to home page.');
            setLink('/');
        } else {
            Promise.resolve(verifyEmail(props.mode, props.actionCode)).then((value) => {
                if (value !== 'Email verified') {
                    setMessage('Your email has been successfully verified.');
                    setSecondMessage('to login.');
                    setLink('/login');
                } else {
                    setMessage('The provided link is either used or invalid.');
                    setSecondMessage('to go back to home page.');
                    setLink('/');
                }
            })
        }
    }, [props.mode, props.actionCode])
    return (
        <Container className="email-verified">
            <Row className="margin-global-top-2">
                <h1 style={{textTransform: 'uppercase'}}>Email Verification</h1>
                <p>{message}</p>
                <p className="text-uppercase">Please click <Link to={link}>here</Link> {secondMessage}</p>
            </Row>
        </Container>
    );
}

export default EmailVerified;