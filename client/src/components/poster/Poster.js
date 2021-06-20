import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Poster.scss'

function Poster(props) {
    return (
        <Container className="poster p-0">
            <Row>
                <Col>
                    <img
                        src="/images/background.png"
                        alt="Flowers Poster"
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Poster;