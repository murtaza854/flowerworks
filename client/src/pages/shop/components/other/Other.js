import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Card } from '../../../../components';
import './Other.scss'

function Other(props) {
    return (
        <Container className="products">
            <Row className="justify-content-center">
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" button={<Button to="box" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.png" alt="box" text="box" />
                </Col>
            </Row>
        </Container>
    );
}

export default Other;