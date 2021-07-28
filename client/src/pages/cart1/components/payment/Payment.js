import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import { Radio, FormControlLabel, RadioGroup } from '@material-ui/core';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import { Button, ParaText, Heading2 } from '../../../../components';
import {
    useHistory,
    useLocation
} from "react-router-dom";
import './Payment.scss'
import api from '../../../../api';
import DiscountContext from '../../../../discountContext';
import CartContext from '../../../../share';

function Payment(props) {
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
    const [display, setDisplay] = useState('none');
    const [radioBoxes, setRadioBoxes] = useState({ method: 'Cash on Delivery' });
    const discount = useContext(DiscountContext);
    const cart = useContext(CartContext);

    const location = useLocation();
    const history = useHistory();

    const handleChange = (event) => {
        setRadioBoxes({ method: event.target.value });
        if (event.target.value === 'Cash on Delivery') setDisplay('none');
        else setDisplay('block');
    };

    useEffect(() => {
        if (location.state === undefined) {
            alert('Fill delivery form!')
            history.push('/cart/delivery-info');
        }
    }, [history, location.state])

    const onClick = async event => {
        event.preventDefault();
        let orderDiscount = null;
        if (discount && discount.type === 'Bill') {
            const cartCurrentPrice = cart.cartObj.cartTotalPrice
            if (cartCurrentPrice >= discount.minAmount && cartCurrentPrice <= discount.maxAmount) {
                orderDiscount = discount
            }
        } else if (discount && discount.type === 'DIY') orderDiscount = discount
        else if (discount && discount.type === 'Product') orderDiscount = discount
        const response = await fetch(`${api}/orders/confirmOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                firstName: location.state.firstName,
                lastName: location.state.lastName,
                phoneNumber: location.state.phoneNumber,
                email: location.state.email,
                firstName1: location.state.firstName1,
                lastName1: location.state.lastName1,
                phoneNumber1: location.state.phoneNumber1,
                email1: location.state.email1,
                area: location.state.area,
                addressLine1: location.state.addressLine1,
                landmark: location.state.landmark,
                addressLine2: location.state.addressLine2,
                date: location.state.date,
                message: location.state.message,
                checkBoxes: location.state.checkBoxes,
                radioBoxes: radioBoxes,
                discount: orderDiscount
            })
        });
        const content = await response.json();
        if (content.data === 'success') history.push('/thankyou');
        else history.push('/');
    }

    return (
        <div>
            <Container className="payment-cart">
                <Form className="form-style">
                    <Row>
                        <Col>
                            <ThemeProvider theme={theme}>
                                <RadioGroup aria-label="paymentMethod" name="paymentMethod1" value={radioBoxes.method} onChange={handleChange}>
                                    <FormControlLabel
                                        value="Cash on Delivery"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="Cash on Delivery"
                                    />
                                    <FormControlLabel
                                        value="Online Bank Transfer"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="Online Bank Transfer"
                                    />
                                </RadioGroup>
                            </ThemeProvider>
                        </Col>
                    </Row>
                    <div style={{ display: display }} className="global-mt-3"></div>
                    <Row style={{ display: display }}>
                        <Col>
                            <Heading2
                                first="Payment"
                                link="/"
                                bold="details"
                                classes="text-uppercase"
                            />
                            <div className="global-mt-3"></div>
                            <ParaText
                                text="Bank name"
                                classes="bold margin-bottom-0"
                            />
                            <ParaText
                                text="Account Title: Some Name"
                                classes="margin-bottom-0"
                            />
                            <ParaText
                                text="Account Number: Some number"
                                classes="margin-bottom-0"
                            />
                            <ParaText
                                text="IBAN"
                            />
                            <div className="global-mt-3"></div>
                            <ParaText
                                text="Bank name"
                                classes="bold margin-bottom-0"
                            />
                            <ParaText
                                text="Account Title: Some Name"
                                classes="margin-bottom-0"
                            />
                            <ParaText
                                text="Account Number: Some number"
                                classes="margin-bottom-0"
                            />
                            <ParaText
                                text="IBAN"
                            />
                            <div className="global-mt-3"></div>
                            <ParaText
                                text="Proof of payment with order number must be emailed at "
                                link="info@flowerworks.pk"
                                href="mailto:info@flowerworks.pk"
                                textAlign="center"
                                target="_blank"
                                rel="noreferrer"
                            />
                        </Col>
                    </Row>
                </Form>
            </Container>
            <div className="global-mt-2"></div>
            <Row>
                <div className="horizontal-center-margin">
                    <Button
                        // firstName={firstName}
                        // lastName={lastName}
                        // phoneNumber={phoneNumber}
                        // email={email}

                        // firstName1={firstName1}
                        // lastName1={lastName1}
                        // phoneNumber1={phoneNumber1}
                        // email1={email1}

                        // area={area}
                        // addressLine1={addressLine1}
                        // landmark={landmark}
                        // addressLine2={addressLine2}

                        // date={date}
                        // message={message}

                        // checkBoxes={checkBoxes}

                        // radioBoxes={radioBoxes}

                        // cartForm={4}
                        onClick={onClick}
                        to="/"
                        text="Send"
                        classes="text-uppercase"
                    />
                </div>
            </Row>
        </div>
    );
}

export default Payment;