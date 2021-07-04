import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Poster, Banner, Button, Heading1 } from '../../components';
import { Category } from './components';
import './Home.scss';

function Home(props) {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [])
    return (
        <Container fluid>
            <Poster />
            <div className="global-mt-2" />
            <Banner 
                button={<Button to="/subscribe" text="Subscribe" classes="text-uppercase" classes1="btn-center-991" />}
                heading={          
                    <Heading1
                    first="Want fresh flowers"
                    bold="every"
                    second="month?"
                    classes="text-uppercase text-center"
                />
                }
            />
            <div className="global-mt-1"></div>
            <Heading1
                first="Shop by"
                bold="category"
                classes="text-uppercase text-center"
            />
            <div className="global-mt-2"></div>
            <Category />
        </Container>
    );
}

export default Home;