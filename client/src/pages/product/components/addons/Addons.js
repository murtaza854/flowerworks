import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Card } from '../../../../components';
import './Addons.scss';
import api from '../../../../api';
import CartContext from '../../../../share';

function Addons(props) {
    const [items, setItems] = useState([]);
    const cart = useContext(CartContext);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/addon/getAddonsThree`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                const coupons = content.coupons;
                let coupon = null;
                for (let i = 0; i < coupons.length; i++) {
                    const couponFromArray = coupons[i];
                    if (couponFromArray.redeemBy && new Date(couponFromArray.redeemBy) >= new Date()) {
                        coupon = couponFromArray;
                        break;
                    }
                }
                if (!coupon && coupons.length > 0) coupon = coupons[0];
                let addonCouponSlugs = [];
                if (coupon && coupon.addons.length > 0) addonCouponSlugs = coupon.addons.map((add) => add.slug);
                setItems([].map.call(content.data, obj => {
                    let price = obj.price;
                    let discountedPrice = null;
                    let discountClass = '';
                    if (coupon) {
                        let flag = true;
                        if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                        if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                        if (flag && !coupon.hasPromotionCodes) {
                            if (coupon.appliedToAddons && addonCouponSlugs.includes(obj.slug)) {
                                discountClass = 'discounted';
                                if (coupon.type === 'Fixed Amount Discount') {
                                    discountedPrice = (price - coupon.amountOff) < 0 ? 0 : price - coupon.amountOff;
                                } else {
                                    discountedPrice = (price - (price * (coupon.percentOff / 100))).toFixed(2);
                                }
                            }
                        }
                    }
                    return {
                        name: obj.name,
                        slug: obj.slug,
                        price: price,
                        discountedPrice,
                        discountClass,
                        image: obj.image,
                        buttonText: { text: 'Add to Cart', classes1: '' },
                    };
                }));
            })();
    }, []);

    const onClick = async (event, addon, index) => {
        event.preventDefault();
        setSubmitted(true);
        const newItems = [...items];
        newItems[index].buttonText = { text: 'Added', classes1: 'disabled' };
        setItems(newItems);
        const response = await fetch(`${api}/cart/addToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                name: addon.name,
                price: addon.price,
                addonSlug: addon.slug,
                image: addon.image,
                type: 'addon',
            })
        });
        const content = await response.json();
        cart.setCart(content.data);
        setTimeout(() => {
            setSubmitted(false);
        }, 1500);
    }

    useEffect(() => {
        if (submitted) {
            setTimeout(() => {
                const newItems = [...items];
                newItems.forEach((item, index) => {
                    newItems[index].buttonText = { text: 'Add to Cart', classes1: '' };
                });
                setItems(newItems);
            }, 1500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitted]);

    return (
        <Container className="addons">
            <Row className="justify-content-center">
                {
                    items.map((obj, index) => {
                        return (
                            <Col key={index} md={4} className="spacing">
                                <Card
                                    classes="center-relative fit-content"
                                    button1={<Button to="/" text={obj.buttonText.text}
                                        onClick={event => onClick(event, obj, index)}
                                        classes="text-uppercase" classes1={obj.buttonText.classes1} />}
                                    price={`PKR - ${obj.price}`}
                                    discountedPrice={obj.discountedPrice}
                                    discountClass={obj.discountClass}
                                    src={obj.image}
                                    alt={obj.name}
                                />
                            </Col>
                        );
                    })
                }
            </Row>
        </Container>
    );
}

export default Addons;