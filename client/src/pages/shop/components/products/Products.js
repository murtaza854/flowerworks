import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Card } from '../../../../components';
import './Products.scss';
import api from '../../../../api';
import { useParams } from 'react-router-dom';

function Products(props) {
    const [productsArray, setProductsArray] = useState([]);
    const [paginationData, setPaginationData] = useState([]);
    const [page, setPage] = useState(1);
    const { category } = useParams();

    useEffect(() => {(
        async () => {
            const response = await fetch(`${api}/products/count`, {
                headers: {'Content-Type': 'application/json'},
            });
            const content = await response.json();
            const numberOfPages = Math.ceil(content.data / 9);
            const htmlData = [];
            const handleChange = (value) => {
                document.getElementById(`page-${page}`).classList.remove('active');
                document.getElementById(`page-${value}`).classList.add('active');
                setPage(value);
            };
            for (let i = 1; i <= numberOfPages; i++) {
                if (i === 1) {
                    htmlData.push(
                        <div key={i} id={`page-${i}`} onClick={_ => handleChange(i)} className="active pag-item pag-number">{i}</div>
                    );
                } else {
                    htmlData.push(
                        <div key={i} id={`page-${i}`} onClick={_ => handleChange(i)} className="pag-item pag-number">{i}</div>
                    );
                }
            }
            setPaginationData(htmlData);
        })();
    }, [page]);

    useEffect(() => {(
        async () => {
            const response = await fetch(`${api}/products/shop?page=${page}`, {
                headers: {'Content-Type': 'application/json'},
            });
            const content = await response.json();
            const data = content.data;
            const htmlData = [];
            // const onClick = e => {
            //     e.preventDefault();
            //     cart.setCartCount(cart.cartCount + 1);
            // }
            data.forEach(obj => {
                htmlData.push(
                    <Col key={obj.slug} md={4} className="spacing">
                        <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to={`${category}/${obj.slug}`} text="Quick view" classes="text-uppercase" />} button1={<Button to="/" productSlug={obj.slug} text="Add to cart" classes="text-uppercase" />} price={`PKR - ${obj.price}`}  src={obj.imagePath} alt="box" />
                    </Col>
                );
            });
            setProductsArray(htmlData);
        })();
    }, [page, category]);


    return (
        <Container className="products">
            <Row className="justify-content-center">
                {productsArray}
                {/* <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="box/flower" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00"  src="/images/box.png" alt="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.png" alt="box" text="box" />
                </Col> */}
            </Row>
            <div className="global-mt-2"></div>
            <Row>
                <Col className="paginate justify-content-center">
                <div className="pag-item"><i className="fa fa-caret-left" aria-hidden="true"></i></div>
                {paginationData}
                {/* <div className="active pag-item pag-number">1</div>
                <div className="pag-item pag-number">2</div>
                <div className="pag-item pag-number">3</div>
                <div className="pag-item pag-number">4</div>
                <div className="pag-item pag-number">5</div> */}
                <div className="pag-item"><i className="fa fa-caret-right" aria-hidden="true"></i></div>
                </Col>
            </Row>
        </Container>
    );
}

export default Products;