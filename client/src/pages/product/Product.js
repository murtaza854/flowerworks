import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Heading1 } from '../../components';
import './Product.scss';
import { ProductCard, Addons } from './components';

function Product(props) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    return (
        <Container fluid>
            <ProductCard />
            <div className="global-mt-1"></div>
            <Heading1
                first="Shop"
                bold="Add-ons"
                classes="text-uppercase text-center"
            />
            <div className="global-mt-2"></div>
            <Addons />
        </Container>
    );
}

export default Product;