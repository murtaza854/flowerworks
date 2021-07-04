import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Card } from '../../../../components';
import './Addons.scss';
import api from '../../../../api';

function Addons(props) {
    const [items, setItems] = useState([]);

    useEffect(() => {
      (
        async () => {
          const response = await fetch(`${api}/addons/getAddonsThree`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
          });
          const content = await response.json();
          setItems(content.data);
        })();
    }, []);

    return (
        <Container className="addons">
            <Row className="justify-content-center">
                {
                    items.map((obj, index) => {
                        return (
                            <Col key={index} md={4} className="spacing">
                                <Card classes="center-relative fit-content" button1={<Button to="/" text="Add to cart" addonSlug={obj.slug} classes="text-uppercase" />} price={`PKR - ${obj.price}`} src={obj.imagePath} alt={obj.name} />
                            </Col>
                            );
                    })
                }
            </Row>
        </Container>
    );
}

export default Addons;