import React from 'react';
import { Container } from 'react-bootstrap';
import { Poster, Banner, Button, Heading } from '../../components';
import { Category } from './components';
import './Home.scss';

function Home(props) {
    return (
        <Container fluid>
            <Poster />
            <div className="global-mt-2" />
            <Banner 
                button={<Button to="/" text="Subscribe" classes="text-uppercase" />}
                heading={          
                    <Heading
                    first="Want fresh flowers"
                    bold="every"
                    second="month?"
                    classes="text-uppercase text-center"
                />
                }
            />
            <div className="global-mt-1"></div>
            <Heading
                first="Shop by"
                bold="category"
                classes="text-uppercase text-center"
            />
            <div className="global-mt-3"></div>
            <Category />
        </Container>
    );
}

export default Home;