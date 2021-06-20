import React from 'react';
import './Banner.scss';
import { Container, Row, Col } from 'react-bootstrap';

function Banner(props) {
    return (
        <Container className="banner">
            <Row>
                <Col md={9}>
                    {props.heading}
                </Col>
                <Col>
                    {props.button}
                </Col>
            </Row>
        </Container>
    );
}

export default Banner;