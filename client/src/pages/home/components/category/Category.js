import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, Button } from '../../../../components'
import './Category.scss';

function Category(props) {
    return (
        <Container className="category">
            <Row className="justify-content-center">
                <Col md={4} className="spacing">
                    <Card button={<Button to="box" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={4} className="spacing">
                        <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                    </Col>
                    <Col md={4} className="spacing">
                        <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                    </Col>
                    <Col md={4} className="spacing">
                        <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                    </Col>
                </Row>
        </Container>
    );
}

export default Category;