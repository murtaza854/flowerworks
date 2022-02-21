import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Badge } from '@mui/material';
import CartContext from '../../share';
import { Card } from '../../components';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Link
} from "react-router-dom";
import { Heading3, ParaText, Heading2 } from '../../components';
import api from '../../api';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Sidebar from '../sidebar/Sidebar';
import './WebNavbar.scss';

function WebNavbar(props) {
    const cart = useContext(CartContext);
    const [data, setData] = useState([]);
    const [cost, setCost] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState({ value: '', class: '' });
    const [categoryArray, setCategoryArray] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const onClickHamburger = () => {
        const sidebar = document.getElementById('client-sidebar');
        const check = sidebar.classList.contains('client-sidebar-closed');
        const notActive = sidebar.classList.contains('client-sidebar-not-active');
        if (notActive) {
            sidebar.classList.remove('client-sidebar-not-active');
            sidebar.classList.add('client-sidebar-open');
        } else {
            if (check) {
                sidebar.classList.remove('client-sidebar-closed');
                sidebar.classList.add('client-sidebar-open');
            } else {
                sidebar.classList.add('client-sidebar-closed');
                sidebar.classList.remove('client-sidebar-open');
            }
        }
    }

    const theme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#000000',
            },
            secondary: {
                main: '#000000',
            },
        },
        typography: {
            fontFamily: 'Raleway',
        },
    });

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/base/client-getAll`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const content = await response.json();
                const data = content.data;
                const htmlData = [];
                data.forEach(obj => {
                    htmlData.push(
                        <Col md={2} key={obj.slug} className="spacing">
                            <Link to={`/${obj.slug}`}>
                                <Card classesNavbar="cat-card-navbar" src={obj.image} alt={obj.name} />
                            </Link>
                        </Col>
                    );
                });
                setCategoryArray(htmlData);
            })();
    }, []);

    useEffect(() => {
        try {
            const getCoupons = async () => {
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
                setSelectedCoupon(coupon);
                for (const key in cart.cartObj) {
                    if (Object.hasOwnProperty.call(cart.cartObj, key)) {
                        const element = cart.cartObj[key];
                        const quantity = element.quantity;
                        let totalPrice = 0;
                        let newPriceHTML = <></>;
                        let discountedPrice = null;
                        let discountClass = '';
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
                        }
                        if (discountedPrice !== null) prices.push(discountedPrice);
                        else prices.push(totalPrice);
                        content.push({
                            key: key,
                            image: element.image,
                            name: element.name,
                            size: element.size.name,
                            quantity: element.quantity,
                            removeCartItem,
                            addCartItem,
                            totalPrice,
                            newPriceHTML,
                            discountClass,
                        });
                    }
                }
                if (coupon && !coupon.hasPromotionCodes && !coupon.appliedToProducts && !coupon.appliedToAddons && !coupon.appliedToDIY) {
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
                setCost(prices.reduce((a, b) => a + b, 0));
                setData(content);
            }
            getCoupons();
        } catch (error) {

        }
    }, [cart])

    return (
        <div>
            <Container className="web-navbar">
                <Row>
                    <Col>
                        <Navbar bg="transparent" expand="lg">
                        <MenuIcon id="client-sidebar-hamburger" className="hamburger-icon unhide-991" onClick={onClickHamburger} />
                            <Navbar.Brand href="/">
                                <img
                                    src="/images/logo-white.png"
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
                                                {categoryArray}
                                                {/* <Col md={2} className="spacing">
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
                                                </Col> */}
                                            </Row>
                                            {/* <Link to="/signin"><li>Sign In</li></Link>
                                        <Link to="/signup"><li>Sign Up</li></Link> */}
                                        </div>
                                    </div>
                                    <Link className="nav-link" to="/do-it-yourself">DIY</Link>
                                    <Link className="nav-link" to="/contact">Contact Us</Link>
                                </Nav>
                                <Nav className="ml-auto">
                                    {/* <div className="hover-box position-relative first-box">
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
                                    </div> */}
                                    <div className="hover-box position-relative">
                                        <Link className="account-icon justify-content-end" to="/cart">
                                            <ThemeProvider theme={theme}>
                                                <Badge color="secondary" badgeContent={Object.keys(cart.cartObj).length}>
                                                    <LocalMallIcon fontSize="large" />
                                                </Badge>
                                            </ThemeProvider>
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
                                                            {
                                                                data.map((element) => {
                                                                    return (
                                                                        <li className="cart-list-item" key={element.key}>
                                                                            <Row>
                                                                                <Col md={3}>
                                                                                    <img src={element.image} alt={element.name} />
                                                                                </Col>
                                                                                <Col md={5}>
                                                                                    <div className="vertical-center-relative">
                                                                                        <Heading3
                                                                                            bold={element.name}
                                                                                            classes="text-uppercase"
                                                                                        />
                                                                                        {
                                                                                            element.type === 'product' ? (
                                                                                                <ParaText
                                                                                                    text={`Size: ${element.size.name}`}
                                                                                                    classes="margin-bottom-0"
                                                                                                    href='/'
                                                                                                />
                                                                                            ) : null
                                                                                        }
                                                                                        <ParaText
                                                                                            text={`Quantity: ${element.quantity}`}
                                                                                            classes="margin-bottom-0"
                                                                                            href='/'
                                                                                        />
                                                                                        <div className="add-remove-icons">
                                                                                            <RemoveIcon onClick={_ => element.removeCartItem(element.key)} className="cart-icon" />
                                                                                            <AddIcon onClick={_ => element.addCartItem(element.key)} className="cart-icon" />
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>
                                                                                <Col className="align-middle">
                                                                                    <div className="vertical-center-relative">
                                                                                        <Heading3
                                                                                            bold={`PKR.${element.totalPrice}`}
                                                                                            newPriceHTML={selectedCoupon && selectedCoupon.minAmount <= cost ? element.newPriceHTML : <></>}
                                                                                            classes={`text-uppercase text-center ${selectedCoupon && selectedCoupon.minAmount <= cost ? element.discountClass : ''}`}
                                                                                        />
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div className="cart-buttons">
                                                            <Heading3
                                                                bold="Total: "
                                                                second={`PKR.${cost}`}
                                                                discountAvailable={discountedPrice.value}
                                                                discountClass={discountedPrice.class}
                                                                classes="text-uppercase"
                                                            />
                                                            <Heading3
                                                                first="Go to"
                                                                link="/cart"
                                                                linkTag="cart"
                                                                bold=""
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
                            {/* <Sidebar /> */}
                        </Navbar>
                    </Col>
                </Row>
            </Container>
            <Sidebar />
        </div>
    );
}

export default WebNavbar;