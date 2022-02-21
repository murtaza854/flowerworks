import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './IconBanner.scss';

function IconBanner(props) {
    return (
        <Container fluid className="icon-banner">
            <Row className="justify-content-center">
                <Col md={1}>
                    <a className="icon-cont" target="_blank" rel="noreferrer" href="https://www.facebook.com/flowerworkspk">
                        <i className="center-relative fa fa-facebook-f"></i>
                    </a>
                </Col>
                <Col md={1}>
                    <a className="icon-cont" target="_blank" rel="noreferrer" href="https://www.instagram.com/flowerworkspk">
                        <i className="center-relative fa fa-instagram"></i>
                    </a>
                </Col>
                <Col md={1}>
                    <a className="icon-cont" target="_blank" rel="noreferrer" href="https://wa.me/+923343214311">
                        <i className="center-relative fa fa-whatsapp"></i>
                    </a>
                </Col>
            </Row>
        </Container>
    );
}

export default IconBanner;