import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Heading1, Heading2, ParaText, Heading3, Button } from '../../../../components';
import CartContext from '../../../../share';
import api from '../../../../api';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './ProductList.scss';

function ProductList(props) {
    const cart = useContext(CartContext);
    const [data, setData] = useState([]);
    const [discountedPrice, setDiscountedPrice] = useState({ value: '', class: '' });
    const [cost, setCost] = useState(0);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/cart/getCart`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                cart.setCart(content.data);
            })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(`${api}/coupon/getCoupons-client-includeAll`, {
                headers: { 'Content-Type': 'application/json' },
            });
            const responseContent = await response.json();
            const coupons = responseContent.coupons;
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
            let productCouponSlugs = [];
            if (coupon && coupon.addons.length > 0) addonCouponSlugs = coupon.addons.map((add) => add.slug);
            if (coupon && coupon.products.length > 0) productCouponSlugs = coupon.products.map((prod) => prod.slug);
            let content = [];
            setSelectedCoupon(coupon);
            const removeCartItem = async (key) => {
                const response = await fetch(`${api}/cart/removeItem?key=${key}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                cart.setCart(content.data);
            }
            const addCartItem = async (key) => {
                const response = await fetch(`${api}/cart/addItem?key=${key}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                cart.setCart(content.data);
            }
            const prices = [];
            for (const key in cart.cartObj) {
                if (Object.hasOwnProperty.call(cart.cartObj, key)) {
                    const element = cart.cartObj[key];
                    const quantity = element.quantity;
                    let totalPrice = 0;
                    let newPriceHTML = <></>;
                    let discountedPrice = null;
                    let discountClass = '';
                    let paraText = '';
                    if (element.type === 'product') {
                        let unitPrice = element.size.price;
                        totalPrice = element.size.price * quantity;
                        if (coupon) {
                            let flag = true;
                            if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                            if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                            if (flag) {
                                if (coupon.appliedToProducts && productCouponSlugs.includes(element.productSlug)) {
                                    discountClass = 'line-through';
                                    if (coupon.type === 'Fixed Amount Discount') {
                                        unitPrice = (unitPrice - coupon.amountOff) < 0 ? 0 : unitPrice - coupon.amountOff;
                                        discountedPrice = unitPrice * quantity;
                                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{discountedPrice}</strong></p>
                                    } else {
                                        unitPrice = (unitPrice - (unitPrice * (coupon.percentOff / 100))).toFixed(2);
                                        discountedPrice = unitPrice * quantity;
                                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{discountedPrice}</strong></p>
                                    }
                                }
                            }
                        }
                        paraText = <div>
                            <Heading3
                                bold="Description:"
                                classes="text-uppercase"
                            />
                            <ParaText
                                text={element.description}
                                href="/"
                                classes="margin-bottom-0"
                            />
                            <ParaText
                                bold="Size:"
                                text={element.size.name}
                                classes="margin-bottom-0"
                                href='/'
                            />
                        </div>
                    } else if (element.type === 'addon') {
                        let unitPrice = element.price;
                        totalPrice = element.price * quantity;
                        if (coupon) {
                            let flag = true;
                            if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                            if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                            if (flag) {
                                if (coupon.appliedToAddons && addonCouponSlugs.includes(element.addonSlug)) {
                                    discountClass = 'line-through';
                                    if (coupon.type === 'Fixed Amount Discount') {
                                        unitPrice = (unitPrice - coupon.amountOff) < 0 ? 0 : unitPrice - coupon.amountOff;
                                        discountedPrice = unitPrice * quantity;
                                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{discountedPrice}</strong></p>
                                    } else {
                                        unitPrice = (unitPrice - (unitPrice * (coupon.percentOff / 100))).toFixed(2);
                                        discountedPrice = unitPrice * quantity;
                                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{discountedPrice}</strong></p>
                                    }
                                }
                            }
                        }
                    } else if (element.type === 'diy') {
                        const totalFlowersPrice = element.flowers.reduce((acc, curr) => acc + curr.price, 0);
                        const totalAddonsPrice = element.addons.reduce((acc, curr) => acc + curr.price, 0);
                        let unitPrice = element.size.price + element.base.price + element.color.price + totalFlowersPrice + totalAddonsPrice;
                        totalPrice = (element.size.price + element.base.price + element.color.price + totalFlowersPrice + totalAddonsPrice) * quantity;
                        if (coupon) {
                            let flag = true;
                            if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                            if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                            if (flag) {
                                if (coupon.appliedToDIY) {
                                    discountClass = 'line-through';
                                    if (coupon.type === 'Fixed Amount Discount') {
                                        unitPrice = (unitPrice - coupon.amountOff) < 0 ? 0 : unitPrice - coupon.amountOff;
                                        discountedPrice = unitPrice * quantity;
                                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{discountedPrice}</strong></p>
                                    } else {
                                        unitPrice = (unitPrice - (unitPrice * (coupon.percentOff / 100))).toFixed(2);
                                        discountedPrice = unitPrice * quantity;
                                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{discountedPrice}</strong></p>
                                    }
                                }
                            }
                        }
                        paraText = (
                            <div>
                                <ParaText
                                    bold="Size:"
                                    href='/'
                                    text={element.size.name}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                <ParaText
                                    bold="Base:"
                                    href='/'
                                    text={element.base.name}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                <ParaText
                                    bold="Color:"
                                    href='/'
                                    text={element.color.name}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                <ParaText
                                    bold="Flowers:"
                                    href='/'
                                    text={element.flowers.map(flower => flower.name).join(', ')}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                {
                                    element.addons.length === 0 ? (
                                        <ParaText
                                            bold="Addons:"
                                            href='/'
                                            text="No Addons"
                                            classes="text-capatalize"
                                        />
                                    ) : (
                                        <ParaText
                                            bold="Addons:"
                                            href='/'
                                            text={element.addons.map(addon => addon.name).join(', ')}
                                            classes="text-capatalize"
                                        />
                                    )
                                }
                            </div>
                        )
                    }
                    if (discountedPrice !== null) prices.push(discountedPrice);
                    else prices.push(totalPrice);
                    content.push({
                        key: key,
                        name: element.name,
                        image: element.image,
                        paraText,
                        quantity: element.quantity,
                        removeCartItem,
                        addCartItem,
                        totalPrice,
                        newPriceHTML,
                        discountClass,
                    });
                }
            }
            if (coupon && !coupon.appliedToProducts && !coupon.appliedToAddons && !coupon.appliedToDIY) {
                if (coupon.type === 'Fixed Amount Discount') {
                    let totalPrice = prices.reduce((acc, curr) => acc + curr, 0);
                    if (coupon.minAmount <= totalPrice) {
                        let discountedPrice = (totalPrice - coupon.amountOff) < 0 ? 0 : totalPrice - coupon.amountOff;
                        setDiscountedPrice({ value: `PKR.${discountedPrice}`, class: 'line-through' });
                    }
                } else {
                    let totalPrice = prices.reduce((acc, curr) => acc + curr, 0);
                    if (coupon.minAmount <= totalPrice) {
                        let discountedPrice = (totalPrice - (totalPrice * (coupon.percentOff / 100))).toFixed(2);
                        setDiscountedPrice({ value: `PKR.${discountedPrice}`, class: 'line-through' });
                    }
                }
            }
            setCost(prices.reduce((a, b) => a + b, 0))
            setData(content);
        };
        getData();
    }, [cart]);

    return (
        <Container fluid className="product-list-back">
            <Container className="product-list">
                {
                    data.map((element) => {
                        return (
                            <Row key={element.key} className="product-row">
                                <div className="global-mt-2 display-992" />
                                <Col lg={3}>
                                    <img src={element.image} alt={element.name} />
                                </Col>
                                <div className="global-mt-3 display-992" />
                                <Col lg={5}>
                                    <Heading2
                                        bold={element.name}
                                        link="/"
                                        classes="text-uppercase"
                                    />
                                    {element.paraText}
                                </Col>
                                <Col lg={1}>
                                    <div className="center-relative">
                                        <input value={element.quantity} type="text" readOnly={true} />
                                        <div className="add-remove-icons horizontal-center-relative">
                                            <RemoveIcon onClick={_ => element.removeCartItem(element.key)} className="cart-icon" />
                                            <AddIcon onClick={_ => element.addCartItem(element.key)} className="cart-icon" />
                                        </div>
                                    </div>
                                </Col>
                                <div className="global-mt-3 display-992" />
                                <Col className="align-middle">
                                    <div className="center-relative">
                                        <Heading1
                                            bold={`PKR.${element.totalPrice}`}
                                            newPriceHTML={selectedCoupon && selectedCoupon.minAmount <= cost ? element.newPriceHTML : <></>}
                                            classes={`text-uppercase text-center ${selectedCoupon && selectedCoupon.minAmount <= cost ? element.discountClass : ''}`}
                                        />
                                    </div>
                                </Col>
                                <div className="global-mt-2 display-992" />
                            </Row>
                        )
                    })
                }
            </Container>
            <div className="global-mt-3" />
            <Row>
                <Heading1
                    bold="Total Cost: "
                    second={`PKR.${cost}`}
                    discountAvailable={discountedPrice.value}
                    discountClass={discountedPrice.class}
                    classes="text-uppercase text-center"
                />
            </Row>
            <div className="global-mt-3" />
            <Row>
                <div className="horizontal-center-margin">
                    <Button
                        to="/cart/delivery-info"
                        text="Proceed"
                        classes="text-uppercase"
                    />
                </div>
            </Row>
        </Container>
    );
}

export default ProductList;