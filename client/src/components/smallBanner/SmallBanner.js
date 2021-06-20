import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './SmallBanner.scss';

function SmallBanner(props) {
    return (
        <Container className="small-banner" fluid>
            <Row>
                <Col>
                    Pay online | Same day delivery | Karachi only
                </Col>
            </Row>
        </Container>
    );
}

export default SmallBanner;