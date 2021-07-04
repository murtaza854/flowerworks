import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Heading1, ParaText, Button } from '../../../../components';
import './ProductCard.scss';
import api from '../../../../api';

function ProductCard(props) {
    const { product } = useParams();
    
    const [item, setItem] = useState({name: '', imagePath: '', price: '', slug: '', description: ''});

    useEffect(() => {
      (
        async () => {
          const response = await fetch(`${api}/products/getProduct?slug=${product}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
          });
          const content = await response.json();
          setItem(content.data);
        })();
    }, [product]);

    return (
        <Container className="product-card">
            <Row className="justify-content-center">
                <Col className="product-image" lg={4}>
                    <img src={item.imagePath} alt={item.name} />
                </Col>
                <Col lg={7} className="product-col">
                    <div className="product-heading">
                        <Heading1
                            bold={item.name}
                            classes="text-uppercase"
                        />
                    </div>
                    <div className="product-price">
                        <Heading1
                            bold={`PKR.${item.price}`}
                            classes="text-uppercase"
                        />
                        {/* <Heading1
                            bold={`PKR.${item.price}`}
                            classes="text-uppercase"
                        /> */}
                    </div>
                    <div className="product-text">
                        <ParaText
                            text="Description:"
                            classes="bold margin-bottom-0"
                        />
                        <ParaText
                            text={item.description}
                        />
                    </div>
                    <div className="product-button">
                        <Button to="/" productSlug={item.slug} text="Shop it" classes="text-uppercase" classes1="btn-center-991" />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductCard;