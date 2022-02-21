import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Card } from '../../../../components';
import './Products.scss';
import api from '../../../../api';
import { useParams } from 'react-router-dom';
import CartContext from '../../../../share';
import DiscountContext from '../../../../discountContext';

function Products(props) {
    const [productsArray, setProductsArray] = useState([]);
    const [paginationData, setPaginationData] = useState([]);
    const [page, setPage] = useState(1);
    const { category } = useParams();
    const cart = useContext(CartContext);
    const discount = useContext(DiscountContext);
    const [discountedProducts, setDiscountedProducts] = useState([]);

    useEffect(() => {
        if (discount && discount.type === 'Product') setDiscountedProducts(discount.products);
        else setDiscountedProducts([]);
    }, [discount])

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/product/count`, {
                    headers: { 'Content-Type': 'application/json' },
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

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/product/shop?page=${page}&category=${category}`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                const coupons = content.coupons;
                const htmlData = [];
                let coupon = null;
                for (let i = 0; i < coupons.length; i++) {
                    const couponFromArray = coupons[i];
                    if (couponFromArray.redeemBy && new Date(couponFromArray.redeemBy) >= new Date()) {
                        coupon = couponFromArray;
                        break;
                    }
                }
                if (!coupon && coupons.length > 0) coupon = coupons[0];
                let productCouponSlugs = [];
                if (coupon && coupon.products.length > 0) productCouponSlugs = coupon.products.map((prod) => prod.slug);
                data.forEach(obj => {
                    let pricesArray = [];
                    let minPrice = 0;
                    let maxPrice = 0;
                    let minDiscountedPrice = null;
                    let maxDiscountedPrice = null;
                    // let value = null;
                    if (obj.sizes && obj.sizes.length > 0) {
                        obj.sizes.forEach(size => {
                            pricesArray.push(size.price);
                        });
                        minPrice = Math.min(...pricesArray);
                        maxPrice = Math.max(...pricesArray);
                    }
                    if (coupon) {
                        let flag = true;
                        if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                        if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                        if (flag && !coupon.hasPromotionCodes) {
                            if (coupon.appliedToProducts && productCouponSlugs.includes(obj.slug)) {
                                if (coupon.type === 'Fixed Amount Discount') {
                                    minDiscountedPrice = (minPrice - coupon.amountOff) < 0 ? 0 : minPrice - coupon.amountOff;
                                    maxDiscountedPrice = (maxPrice - coupon.amountOff) < 0 ? 0 : maxPrice - coupon.amountOff;
                                    // value = `PKR.${coupon.amountOff}`;
                                } else {
                                    minDiscountedPrice = (minPrice - (minPrice * (coupon.percentOff / 100))).toFixed(2);
                                    maxDiscountedPrice = (maxPrice - (maxPrice * (coupon.percentOff / 100))).toFixed(2);
                                    // value = `${coupon.percentOff}%`;
                                }
                            }
                        }
                    }
                    let price = '';
                    let discountedPrice = null;
                    let discountClass = '';
                    if (minPrice === maxPrice) {
                        price = `PKR.${minPrice}`;
                    } else {
                        price = `PKR.${minPrice} to PKR.${maxPrice}`;
                    }
                    if (minDiscountedPrice !== null) {
                        discountClass = 'discounted';
                        if (minDiscountedPrice === maxDiscountedPrice) {
                            discountedPrice = `PKR.${minDiscountedPrice}`;
                        } else {
                            discountedPrice = `PKR.${minDiscountedPrice} to PKR.${maxDiscountedPrice}`;
                        }
                    }
                    htmlData.push(
                        <Col key={obj.slug} md={4} className="spacing">
                            <Card classes="center-relative fit-content"
                                classes1="spacing-between"
                                button={
                                    <Button to={`${category}/${obj.slug}`}
                                        text="Quick view" classes="text-uppercase" />}
                                discountedPrice={discountedPrice}
                                discountClass={discountClass}
                                button1=""
                                price={price}
                                src={obj.image}
                                alt="box"
                            />
                        </Col>
                    );
                    // }
                });
                setProductsArray(htmlData);
            })();
    }, [page, category, cart, discountedProducts]);

    return (
        <Container className="products">
            <Row className="justify-content-center">
                {productsArray}
                {/* <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="box/flower" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00"  src="/images/box.jpg" alt="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.jpg" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.jpg" alt="box" text="box" />
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