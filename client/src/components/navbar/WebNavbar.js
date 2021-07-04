import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Badge } from '@material-ui/core';
import CartContext from '../../share';
import {
    Link
} from "react-router-dom";
import { Heading3, ParaText } from '../../components';
import api from '../../api';
import './WebNavbar.scss';

function WebNavbar(props) {
    const cart = useContext(CartContext);
    const [data, setData] = useState([]);

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
                                            classes="text-uppercase text-center"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </li>
                    )
                }
            }
            setData(content);
        } catch (error) {

        }
    }, [cart]);

    return (
        <Container className="web-navbar p-0">
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
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="/">Shop</Nav.Link>
                                <Nav.Link href="/">DIY</Nav.Link>
                                <Nav.Link href="/">Contact Us</Nav.Link>
                            </Nav>
                            <Nav className="ml-auto">
                                <div className="hover-box first-box">
                                    <Link className="account-icon justify-content-end" to="/"><AccountCircleIcon fontSize="large" /></Link>
                                    <div className="box-list">
                                        <Link to="/signin"><li>Sign In</li></Link>
                                        <Link to="/signup"><li>Sign Up</li></Link>
                                    </div>
                                </div>
                                <div className="hover-box">
                                    <Link className="account-icon justify-content-end" to="/cart">
                                        <Badge color="secondary" badgeContent={cart.cartObj.count}>
                                            <LocalMallIcon fontSize="large" />
                                        </Badge>
                                    </Link>
                                    <div className="cart-list-box">
                                        <div className="cart-list">
                                            {data}
                                        </div>
                                        <div className="cart-buttons">
                                            <Heading3
                                                bold={`Total: PKR.${cart.cartObj.cartTotalPrice}`}
                                                classes="text-uppercase"
                                            />
                                            <Heading3
                                                first="Go to"
                                                bold="cart"
                                                classes="text-uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    );
}

export default WebNavbar;