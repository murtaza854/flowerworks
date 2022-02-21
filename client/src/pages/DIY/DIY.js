import React, { useEffect, useContext } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import api from '../../api';
import { RadioBox, Heading1, Button, ParaText } from '../../components';
import CartContext from '../../share';
import './DIY.scss';

function DIY(props) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    const [sizeRadio, setSizeRadio] = React.useState();
    const [baseRadio, setBaseRadio] = React.useState();
    const [colorRadio, setColorRadio] = React.useState();
    const [flowerCheckbox, setFlowerCheckbox] = React.useState();
    const [addonCheckbox, setAddonCheckbox] = React.useState();

    const [sizeLoading, setSizeLoading] = React.useState(false);
    const [baseLoading, setBaseLoading] = React.useState(false);
    const [colorLoading, setColorLoading] = React.useState(false);
    const [flowerLoading, setFlowerLoading] = React.useState(false);
    const [addonLoading, setAddonLoading] = React.useState(false);

    const [sizeArray, setSizeArray] = React.useState();
    const [baseArray, setBaseArray] = React.useState();
    const [colorArray, setColorArray] = React.useState();
    const [flowerArray, setFlowerArray] = React.useState();
    const [addonArray, setAddonArray] = React.useState();

    const cart = useContext(CartContext);

    const [cost, setCost] = React.useState(0);
    const [discountedPrice, setDiscountedPrice] = React.useState({ value: '', class: '' });

    useEffect(() => {
        try {
            const getCoupons = async () => {
                const response = await fetch(`${api}/coupon/getCoupons-client`, {
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
                let discountedPriceDB = null;
                let discountClassDB = '';
                if (coupon) {
                    let flag = true;
                    if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                    if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                    if (flag) {
                        if (coupon.appliedToDIY) {
                            discountClassDB = 'line-through';
                            if (coupon.type === 'Fixed Amount Discount') {
                                discountedPriceDB = (cost - coupon.amountOff) < 0 ? 0 : `PKR.${cost - coupon.amountOff}`;
                            } else {
                                discountedPriceDB = `PKR.${cost - (cost * (coupon.percentOff / 100))}`;
                            }
                        }
                    }
                }
                setDiscountedPrice({ value: discountedPriceDB, class: discountClassDB });
            }
            getCoupons();
        } catch (error) {
            
        }
    }, [cost])

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/size/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                try {
                    const size = data[0];
                    setCost(c => c + size.price);
                    setSizeRadio(size.slug);
                    setSizeArray(data);
                    setSizeLoading(true);
                } catch (error) {
                }
            })();
    }, []);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/base/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                try {
                    const base = data[0];
                    setCost(c => c + base.price);
                    setBaseRadio(base.slug);
                    setBaseArray(data);
                    setBaseLoading(true);
                } catch (error) {
                }
            })();
    }, []);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/color/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                try {
                    const color = data[0];
                    setCost(c => c + color.price);
                    setColorRadio(color.slug);
                    setColorArray(data);
                    setColorLoading(true);
                } catch (error) {
                }
            })();
    }, []);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/flower/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                setFlowerCheckbox(new Array(data.length).fill(false));
                setFlowerArray(data);
                setFlowerLoading(true);
            })();
    }, []);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/addon/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                setAddonCheckbox(new Array(data.length).fill(false));
                setAddonArray(data);
                setAddonLoading(true);
            })();
    }, []);

    const onClick = async (event) => {
        event.preventDefault();
        if (!flowerCheckbox.includes(true)) alert('Flower is required!')
        else {
            const flowers = flowerCheckbox.map((flower, index) => {
                if (flower) return flowerArray[index];
                else return null;
            }).filter(flower => flower !== null);
            const addons = addonCheckbox.map((addon, index) => {
                if (addon) return addonArray[index];
                else return null;
            }).filter(addon => addon !== null);
            const response = await fetch(`${api}/cart/addToCart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                withCredentials: true,
                body: JSON.stringify({
                    size: sizeRadio,
                    base: baseRadio,
                    color: colorRadio,
                    flowers,
                    addons,
                    type: 'diy',
                })
            });
            const content = await response.json();
            cart.setCart(content.data);
            alert('DIY Created!');
        }
    }

    if (!sizeLoading || !baseLoading || !colorLoading || !flowerLoading || !addonLoading) return <div></div>

    return (
        <Container className="diy">
            <Heading1
                first="Do it"
                bold="Yourself"
                classes="text-uppercase text-center"
            />
            <div className="global-mt-2"></div>
            <Row>
                <Col md={4}>
                    <RadioBox
                        dataState={sizeRadio}
                        setData={setSizeRadio}
                        type="radio"
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="size"
                                classes="text-uppercase text-center diy-heading"
                            />
                        }
                        data={sizeArray}
                        setCost={setCost}
                        classes="row-format"
                    />
                </Col>
                <div className="global-mt-3 no-display"></div>
                <Col md={4}>
                    <RadioBox
                        dataState={baseRadio}
                        setData={setBaseRadio}
                        type="radio"
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="base"
                                classes="text-uppercase text-center diy-heading"
                            />
                        }
                        data={baseArray}
                        setCost={setCost}
                        classes=""
                    />
                </Col>
                <div className="global-mt-3 no-display"></div>
                <Col md={4}>
                    <RadioBox
                        dataState={colorRadio}
                        setData={setColorRadio}
                        type="radio"
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="color"
                                classes="text-uppercase text-center diy-heading"
                            />
                        }
                        paraText={
                            <ParaText
                                text="Depending on Availability"
                                classes="bold"
                                textAlign="center"
                                href="/"
                            />
                        }
                        data={colorArray}
                        setCost={setCost}
                        classes=""
                    />
                </Col>
            </Row>
            <div className="global-mt-3"></div>
            <Row>
                <Col>
                    <RadioBox
                        dataState={flowerCheckbox}
                        setData={setFlowerCheckbox}
                        type="checkbox"
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="Flowers"
                                classes="text-uppercase text-center diy-heading"
                            />
                        }
                        data={flowerArray}
                        setCost={setCost}
                        classes="row-format"
                    />
                </Col>
            </Row>
            <div className="global-mt-3"></div>
            <Row>
                <Col>
                    <RadioBox
                        dataState={addonCheckbox}
                        setData={setAddonCheckbox}
                        optional={
                            <ParaText
                                text="Optional"
                                classes="bold"
                                href="/"
                            />
                        }
                        type="checkbox"
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="Add-ons"
                                classes="text-uppercase text-center diy-heading"
                            />
                        }
                        data={addonArray}
                        setCost={setCost}
                        classes="row-format"
                    />
                </Col>
            </Row>
            <div className="global-mt-2"></div>
            <Row>
                <Heading1
                    bold="Total Cost:"
                    second={`PKR.${cost}`}
                    discountAvailable={discountedPrice.value}
                    discountClass={discountedPrice.class}
                    classes="text-uppercase text-center"
                />
            </Row>
            <div className="global-mt-2"></div>
            <Row>
                <div className="horizontal-center-margin">
                    <Button
                        to="/"
                        onClick={onClick}
                        text="Create"
                        classes="text-uppercase"
                    />
                </div>
            </Row>
        </Container>
    );
}

export default DIY;