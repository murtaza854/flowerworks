import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Card } from '../../../../components';
import './Products.scss';

function Products(props) {
    const [page, setPage] = React.useState(1);

    // const data = [

    // ];

    // const itemsPerRow = 3;
    // const itemsPerPage = 6;

    const handleChange = (value) => {
        setPage(value);
    };


    return (
        <Container className="products">
            <Row className="justify-content-center">
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" button={<Button to="box" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00"  src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.png" alt="box" text="box" />
                </Col>
            </Row>
            <div className="global-mt-2"></div>
            <Row>
                <Col className="paginate justify-content-center">
                <div className="pag-item"><i className="fa fa-caret-left" aria-hidden="true"></i></div>
                <div onClick={_ => handleChange(1)} className="active pag-item pag-number">1</div>
                <div onClick={_ => handleChange(2)} className="pag-item pag-number">2</div>
                <div onClick={_ => handleChange(3)} className="pag-item pag-number">3</div>
                <div onClick={_ => handleChange(4)} className="pag-item pag-number">4</div>
                <div onClick={_ => handleChange(5)} className="pag-item pag-number">5</div>
                <div className="pag-item"><i className="fa fa-caret-right" aria-hidden="true"></i></div>
                </Col>
            </Row>
        </Container>
    );
}

export default Products;