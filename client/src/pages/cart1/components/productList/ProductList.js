import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Heading1, Heading2, ParaText, Heading3, Button } from '../../../../components';
import CartContext from '../../../../share';
import api from '../../../../api';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import './ProductList.scss';
import DiscountContext from '../../../../discountContext';

function ProductList(props) {
    const cart = useContext(CartContext);
    const discount = useContext(DiscountContext);
    const [data, setData] = useState();
    const [discountedPrice, setDiscountedPrice] = useState({ value: '', class: '' });
    const [cost, setCost] = useState(0);
    const [discountedProducts, setDiscountedProducts] = useState([]);

    useEffect(() => {
        if (discount && discount.type === 'Product') setDiscountedProducts(discount.products);
        else setDiscountedProducts([]);
    }, [discount])

    useEffect(() => {
        try {
            if (discount && discount.type === 'Bill') {
                const cartCurrentPrice = cart.cartObj.cartTotalPrice
                if (cartCurrentPrice >= discount.minAmount && cartCurrentPrice <= discount.maxAmount) {
                    const newPrice = ((100 - discount.discountPercentage) / 100) * cartCurrentPrice;
                    setDiscountedPrice({ value: `PKR.${newPrice}`, class: 'line-through' });
                } else throw new Error();
            } else throw new Error();
        } catch (error) {
            setDiscountedPrice({ value: '', class: '' });
        }
    }, [discount, cart])

    useEffect(() => {
        try {
            let content = [];
            const removeCartItem = async (slug, type) => {
                const response = await fetch(`${api}/cart/removeItem?${type}Slug=${slug}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                cart.setCart(content.data);
            }
            const addCartItem = async (slug, type) => {
                const response = await fetch(`${api}/cart/addItem?${type}Slug=${slug}`, {
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
            for (const key in cart.cartObj.data) {
                if (Object.hasOwnProperty.call(cart.cartObj.data, key)) {
                    const element = cart.cartObj.data[key];
                    let newPrice = element.totalPrice;
                    let newPriceHTML = <></>;
                    let lineClass = '';
                    if (element.type === 'diy' && discount && discount.type === 'DIY') {
                        newPrice = ((100 - discount.discountPercentage) / 100) * newPrice;
                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{newPrice}</strong></p>
                        lineClass = 'line-through';
                        prices.push(newPrice);
                    } else if (element.type ==='product' && discount && discount.type === 'Product') {
                        const discObj = discountedProducts.find(prod => element.item.name === prod.item.name);
                        if (discObj) {
                            const newPrice = ((100 - discObj.discountPercentage) / 100) * element.totalPrice;
                            newPriceHTML = <p style={{color: 'rgb(177, 0, 0)', textAlign: 'center' }}><strong>PKR.{newPrice}</strong></p>
                            lineClass = 'line-through';
                            prices.push(newPrice);
                        } else prices.push(element.totalPrice);
                    } else prices.push(element.totalPrice)
                    let paraText = <div>
                        <Heading3
                            bold="Description:"
                            classes="text-uppercase"
                        />
                        <ParaText
                            text={element.item.description}
                        />
                    </div>
                    if (element.type === 'diy') {
                        const flowers = element.item.flowers.map((value, index) => {
                            return value.name;
                        }).join(', ');
                        const addons = element.item.addons.map((value, index) => {
                            return value.name;
                        }).join(', ');
                        paraText = (
                            <div>
                                <ParaText
                                    bold="Size:"
                                    text={element.item.size}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                <ParaText
                                    bold="Base:"
                                    text={element.item.base}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                <ParaText
                                    bold="Color:"
                                    text={element.item.color}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                <ParaText
                                    bold="Flowers:"
                                    text={flowers}
                                    classes="text-capatalize margin-bottom-0"
                                />
                                {
                                    element.item.addons.length === 0 ? (
                                        <ParaText
                                            bold="Addons:"
                                            text="No Addons"
                                            classes="text-capatalize"
                                        />
                                    ) : (
                                        <ParaText
                                            bold="Addons:"
                                            text={addons}
                                            classes="text-capatalize"
                                        />
                                    )
                                }
                            </div>
                        )
                    }
                    content.push(
                        <Row key={key} className="product-row">
                            <div className="global-mt-2 display-992" />
                            <Col lg={3}>
                                <img src={element.item.imagePath} alt={element.item.name} />
                            </Col>
                            <div className="global-mt-3 display-992" />
                            <Col lg={5}>
                                <Heading2
                                    bold={element.item.name}
                                    link="/"
                                    classes="text-uppercase"
                                />
                                {paraText}
                            </Col>
                            <Col lg={1}>
                                <div className="center-relative">
                                    <input value={element.count} type="text" readOnly={true} />
                                    <div className="add-remove-icons horizontal-center-relative">
                                        <RemoveIcon onClick={_ => removeCartItem(key, element.type)} className="cart-icon" />
                                        <AddIcon onClick={_ => addCartItem(key, element.type)} className="cart-icon" />
                                    </div>
                                </div>
                            </Col>
                            <div className="global-mt-3 display-992" />
                            <Col className="align-middle">
                                <div className="center-relative">
                                    <Heading1
                                        bold={`PKR.${element.totalPrice}`}
                                        newPriceHTML={newPriceHTML}
                                        classes={`text-uppercase text-center ${lineClass}`}
                                    />
                                </div>
                            </Col>
                            <div className="global-mt-2 display-992" />
                            {/* <Col lg={1}>
                                <i className="fa fa-times center-relative" aria-hidden="true"></i>
                            </Col> */}
                        </Row>
                    )
                }
            }
            setCost(prices.reduce((a, b) => a + b, 0))
            setData(content);
        } catch (error) {

        }
    }, [cart, discount, discountedProducts]);

    return (
        <Container fluid className="product-list-back">
            <Container className="product-list">
                {data}
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
                        // setArrowLeft={props.setArrowLeft}
                        // setArrowRight={props.setArrowRight}

                        // cartForm={2}
                        // setActive={props.setActive}
                        // setActiveCompClass={props.setActiveCompClass}
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