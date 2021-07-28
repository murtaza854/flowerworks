import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Badge } from '@material-ui/core';
import CartContext from '../../share';
import { Card, Sidebar } from '../../components';
import {
    Link
} from "react-router-dom";
import { Heading3, ParaText, Heading2 } from '../../components';
import api from '../../api';
import './WebNavbar.scss';
import DiscountContext from '../../discountContext';
import UserContext from '../../authenticatedUser';

function WebNavbar(props) {
    const cart = useContext(CartContext);
    const discount = useContext(DiscountContext);
    const user = useContext(UserContext);
    const [data, setData] = useState([]);
    const [cost, setCost] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState({ value: '', class: '' });
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
                        newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)' }}><strong>PKR.{newPrice}</strong></p>
                        lineClass = 'line-through';
                        prices.push(newPrice);
                    } else if (element.type === 'product' && discount && discount.type === 'Product') {
                        // console.log(discountedProducts);
                        const discObj = discountedProducts.find(prod => element.item.name === prod.item.name);
                        if (discObj) {
                            const newPrice = ((100 - discObj.discountPercentage) / 100) * element.totalPrice;
                            newPriceHTML = <p style={{ color: 'rgb(177, 0, 0)' }}><strong>PKR.{newPrice}</strong></p>
                            lineClass = 'line-through';
                            prices.push(newPrice);
                        } else prices.push(element.totalPrice);
                    } else prices.push(element.totalPrice)
                    content.push(
                        <li className="cart-list-item" key={key}>
                            <Row>
                                <Col md={3}>
                                    <img src={element.item.imagePath} alt={element.item.name} />
                                </Col>
                                <Col md={5}>
                                    <div className="vertical-center-relative">
                                        <Heading3
                                            bold={element.item.name}
                                            classes="text-uppercase"
                                        />
                                        <ParaText
                                            text={`Quantity: ${element.count}`}
                                            classes="margin-bottom-0"
                                        />
                                        <div className="add-remove-icons">
                                            <RemoveIcon onClick={_ => removeCartItem(key, element.type)} className="cart-icon" />
                                            <AddIcon onClick={_ => addCartItem(key, element.type)} className="cart-icon" />
                                        </div>
                                    </div>
                                </Col>
                                <Col className="align-middle">
                                    <div className="vertical-center-relative">
                                        <Heading3
                                            bold={`PKR.${element.totalPrice}`}
                                            newPriceHTML={newPriceHTML}
                                            classes={`text-uppercase text-center ${lineClass}`}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </li>
                    )
                }
            }
            setCost(prices.reduce((a, b) => a + b, 0))
            setData(content);
        } catch (error) {

        }
    }, [cart, discount, discountedProducts]);

    return (
        <div>
            <Container className="web-navbar">
                <Row>
                    <Col>
                        <Navbar bg="transparent" expand="lg">
                            <Navbar.Brand href="/">
                                <img
                                    src="/images/Flowerworks_Logo-Website.png"
                                    className="d-inline-block align-top"
                                    alt="Flowerworks logo"
                                />
                            </Navbar.Brand>
                            <Navbar.Collapse className="nav-spacing" id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                    <Link className="nav-link" to="/">Home</Link>
                                    <div className="hover-box nav-box">
                                        <div className="account-icon nav-link">Shop</div>
                                        <div className="shop-list">
                                            <Row className="justify-content-center">
                                                <Col md={2} className="spacing">
                                                    <Link to="/">
                                                        <Card classesNavbar="cat-card-navbar" src="/images/box.jpg" alt="box" />
                                                    </Link>
                                                </Col>
                                                <Col md={2} className="spacing">
                                                    <Link to="/">
                                                        <Card classesNavbar="cat-card-navbar" src="/images/box.jpg" alt="box" />
                                                    </Link>
                                                </Col>
                                                <Col md={2} className="spacing">
                                                    <Link to="/">
                                                        <Card classesNavbar="cat-card-navbar" src="/images/box.jpg" alt="box" />
                                                    </Link>
                                                </Col>
                                                <Col md={2} className="spacing">
                                                    <Link to="/">
                                                        <Card classesNavbar="cat-card-navbar" src="/images/box.jpg" alt="box" />
                                                    </Link>
                                                </Col>
                                                <Col md={2} className="spacing">
                                                    <Link to="/">
                                                        <Card classesNavbar="cat-card-navbar" src="/images/box.jpg" alt="box" />
                                                    </Link>
                                                </Col>
                                            </Row>
                                            {/* <Link to="/signin"><li>Sign In</li></Link>
                                        <Link to="/signup"><li>Sign Up</li></Link> */}
                                        </div>
                                    </div>
                                    <Link className="nav-link" to="/">DIY</Link>
                                    <Link className="nav-link" to="/">Contact Us</Link>
                                </Nav>
                                <Nav className="ml-auto">
                                    <div className="hover-box position-relative first-box">
                                        <Link className="account-icon justify-content-end" to="/"><AccountCircleIcon fontSize="large" /></Link>
                                        {
                                            user.userState ? (
                                                <div className="box-list logged-in">
                                                    <Link to="/dashboard"><li>My dashboard</li></Link>
                                                    <Link to={{ pathname: '/logout', state: { user: user.userState } }}><li>Logout</li></Link>
                                                </div>
                                            ) : (
                                                <div className="box-list">
                                                    <Link to="/signin"><li>Sign In</li></Link>
                                                    <Link to="/signup"><li>Sign Up</li></Link>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="hover-box position-relative">
                                        <Link className="account-icon justify-content-end" to="/cart">
                                            <Badge color="secondary" badgeContent={cart.cartObj.count}>
                                                <LocalMallIcon fontSize="large" />
                                            </Badge>
                                        </Link>
                                        <div className="cart-list-box">
                                            {
                                                data.length === 0 ? (
                                                    <div className="center-relative-fit-content">
                                                        <Heading2
                                                            first="Cart is"
                                                            link="/"
                                                            bold="Empty!"
                                                            classes="text-uppercase"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="cart-list">
                                                            {data}
                                                        </div>
                                                        <div className="cart-buttons">
                                                            <Heading3
                                                                bold={`Total: PKR.${cost}`}
                                                                discountAvailable={discountedPrice.value}
                                                                discountClass={discountedPrice.class}
                                                                classes="text-uppercase"
                                                            />
                                                            <Heading3
                                                                first="Go to"
                                                                bold="cart"
                                                                classes="text-uppercase"
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </Nav>
                            </Navbar.Collapse>
                            <Sidebar />
                        </Navbar>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default WebNavbar;