import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Banner, Button, Heading } from '../../components';
import { Products, Other } from './components';
import './Shop.scss'

function Shop(props) {
    const { category } = useParams();
    return (
        <Container>
            <div className="global-mt-1"></div>
            <Heading
                first="Shop"
                bold={category}
                classes="text-uppercase text-center"
            />
            <div className="global-mt-3"></div>
            <Products />
            <div className="global-mt-2"></div>
            <Banner 
                button={<Button to="/" text="DIY" classes="text-uppercase" />}
                heading={          
                    <Heading
                    first="Want to try our"
                    bold="DIY"
                    second="feature?"
                    classes="text-uppercase text-center"
                />
                }
            />
            <div className="global-mt-1"></div>
            <Heading
                first="Shop"
                bold="Other"
                classes="text-uppercase text-center"
            />
            <div className="global-mt-3"></div>
            <Other />
        </Container>
    );
}

export default Shop;