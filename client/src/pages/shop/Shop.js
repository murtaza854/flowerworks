import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Banner, Button, Heading1 } from '../../components';
import { Products, Other } from './components';
import './Shop.scss'

function Shop(props) {
    const [otherProductsLength, setOtherProductsLength] = useState(0);
    const { category } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <Container>
            <Heading1
                first="Shop"
                bold={category}
                classes="text-uppercase text-center"
            />
            <div className="global-mt-2"></div>
            <Products />
            <div className="global-mt-2"></div>
            <Banner
                button={<Button to="/do-it-yourself" text="DIY" classes="text-uppercase" classes1="btn-center-991" />}
                heading={
                    <Heading1
                        first="Want to try our"
                        bold="DIY"
                        second="feature?"
                        classes="text-uppercase text-center"
                    />
                }
            />
            {otherProductsLength > 0 && (
                <>
                    <div className="global-mt-1"></div>
                    <Heading1
                        first="Shop"
                        bold="Other"
                        classes="text-uppercase text-center"
                    />
                    <div className="global-mt-2"></div>
                    <Other setOtherProductsLength={setOtherProductsLength} />
                </>
            )}
        </Container>
    );
}

export default Shop;