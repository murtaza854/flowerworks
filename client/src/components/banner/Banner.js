import React from 'react';
import './Banner.scss';
import { Container, Row, Col } from 'react-bootstrap';

function Banner(props) {
    return (
        <Container className="banner">
            <Row>
                <Col lg={9}>
                    {props.heading}
                </Col>
                <Col className="banner-spacing">
                    {props.button}
                </Col>
            </Row>
        </Container>
    );
}

export default Banner;