import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../../../api';
import { Button, Card } from '../../../../components';
import './Other.scss'

function Other(props) {
    const [productsArray, setProductsArray] = useState([]);
    const { category } = useParams();

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/product/getThree?categorySlug=${category}`, {
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
                });
                props.setOtherProductsLength(htmlData.length);
                setProductsArray(htmlData);
            })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    return (
        <Container className="products">
            <Row className="justify-content-center">
                {productsArray}
                {/* <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="box" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.jpg" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.jpg" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card classes="center-relative fit-content" classes1="spacing-between" button={<Button to="/" text="Quick view" classes="text-uppercase" />} button1={<Button to="box" text="Add to cart" classes="text-uppercase" />} price="PKR - 0000.00" src="/images/box.jpg" alt="box" text="box" />
                </Col> */}
            </Row>
        </Container>
    );
}

export default Other;