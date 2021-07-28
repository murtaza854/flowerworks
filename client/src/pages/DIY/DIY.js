import React, { useEffect, useContext } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import api from '../../api';
import { RadioBox, Heading1, Button, ParaText } from '../../components';
import DiscountContext from '../../discountContext';
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
    const discount = useContext(DiscountContext);

    const [cost, setCost] = React.useState(0);
    const [discountedPrice, setDiscountedPrice] = React.useState({ value: '', class: '' });

    useEffect(() => {
        try {
            if (discount && discount.type === 'DIY') {
                const newPrice = ((100 - discount.discountPercentage) / 100) * cost;
                setDiscountedPrice({ value: `PKR.${newPrice}`, class: 'line-through' });
            } else throw new Error();
        } catch (error) {
            setDiscountedPrice({ value: '', class: '' });
        }
    }, [discount, cost])

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/sizes/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                try {
                    const size = data[0];
                    setCost(c => c + size.price);
                    setSizeRadio(size.name);
                    setSizeArray(data);
                    setSizeLoading(true);
                } catch (error) {
                }
            })();
    }, []);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/bases/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                try {
                    const base = data[0];
                    setCost(c => c + base.price);
                    setBaseRadio(base.name);
                    setBaseArray(data);
                    setBaseLoading(true);
                } catch (error) {
                }
            })();
    }, []);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/colors/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                try {
                    const color = data[0];
                    setCost(c => c + color.price);
                    setColorRadio(color.name);
                    setColorArray(data);
                    setColorLoading(true);
                } catch (error) {
                }
            })();
    }, []);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/flowers/get-data`, {
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
                const response = await fetch(`${api}/addons/get-data`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                setAddonCheckbox(new Array(data.length).fill(false));
                setAddonArray(data);
                setAddonLoading(true);
            })();
    }, []);

    const onClick = async (event, diy) => {
        event.preventDefault();
        if (!diy.flowerCheckbox.includes(true)) alert('Flower is required!')
        else {
            const response = await fetch(`${api}/cart/addToCart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                withCredentials: true,
                body: JSON.stringify({ diy: diy })
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
                        onClick={event => onClick(event, { size: sizeRadio, base: baseRadio, color: colorRadio, flowerCheckbox: flowerCheckbox, addonCheckbox: addonCheckbox, flowerArray: flowerArray, addonArray: addonArray, cost: cost })}
                        text="Create"
                        classes="text-uppercase"
                    />
                </div>
            </Row>
        </Container>
    );
}

export default DIY;