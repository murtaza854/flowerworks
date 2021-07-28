import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Heading1, Heading2, ParaText, Heading3, Button } from '../../../../components';
import CartContext from '../../../../share';
import api from '../../../../api';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import './ProductList.scss';

function ProductList(props) {
    const cart = useContext(CartContext);
    const [data, setData] = useState();

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
            for (const key in cart.cartObj.data) {
                if (Object.hasOwnProperty.call(cart.cartObj.data, key)) {
                    const element = cart.cartObj.data[key];
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
                                    link="/"
                                    bold={element.item.name}
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
                                        classes="text-uppercase text-center"
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
            setData(content);
        } catch (error) {

        }
    }, [cart]);

    return (
        <Container fluid className="product-list-back">
            <Container className="product-list">
                {data}
            </Container>
            <div className="global-mt-3" />
            <Row>
                <Heading1
                    bold="Total Cost: "
                    second={`PKR.${cart.cartObj.cartTotalPrice}`}
                    classes="text-uppercase text-center"
                />
            </Row>
            <div className="global-mt-3" />
            <Row>
                <div className="horizontal-center-margin">
                    <Button
                        setArrowLeft={props.setArrowLeft}
                        setArrowRight={props.setArrowRight}

                        cartForm={2}
                        setActive={props.setActive}
                        setActiveCompClass={props.setActiveCompClass}
                        to="/"
                        text="Proceed"
                        classes="text-uppercase"
                    />
                </div>
            </Row>
        </Container>
    );
}

export default ProductList;