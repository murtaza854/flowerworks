import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Card } from '../../../../components';
import './Addons.scss';
import api from '../../../../api';
import CartContext from '../../../../share';

function Addons(props) {
    const [items, setItems] = useState([]);
    const cart = useContext(CartContext);

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

    const onClick = async (event, addonSlug) => {
        event.preventDefault();
        const response = await fetch(`${api}/cart/addToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ addonSlug: addonSlug })
        });
        const content = await response.json();
        cart.setCart(content.data);
    }

    return (
        <Container className="addons">
            <Row className="justify-content-center">
                {
                    items.map((obj, index) => {
                        return (
                            <Col key={index} md={4} className="spacing">
                                <Card classes="center-relative fit-content" button1={<Button to="/" text="Add to cart" onClick={event => onClick(event, obj.slug)} classes="text-uppercase" />} price={`PKR - ${obj.price}`} src={obj.imagePath} alt={obj.name} />
                            </Col>
                            );
                    })
                }
            </Row>
        </Container>
    );
}

export default Addons;