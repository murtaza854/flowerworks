import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Poster.scss'

function Poster(props) {
    return (
        <Container className="poster p-0">
            <Row>
                <Col>
                    <img
                        className="hide-991"
                        src="/images/background.jpg"
                        alt="Flowers Poster"
                    />
                    <img
                        className="unhide-991"
                        src="/images/background_small.jpg"
                        alt="Flowers Poster"
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Poster;