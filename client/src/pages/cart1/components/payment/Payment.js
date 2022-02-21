import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import { Radio, FormControlLabel, RadioGroup } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { Button, ParaText, Heading2 } from '../../../../components';
import {
    useHistory,
    useLocation
} from "react-router-dom";
import './Payment.scss'
import api from '../../../../api';

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

    const location = useLocation();
    const history = useHistory();
    
    const query = new URLSearchParams(location.search);
    const data = query.get('data') || null;

    const handleChange = (event) => {
        setRadioBoxes({ method: event.target.value });
        if (event.target.value === 'Cash on Delivery') setDisplay('none');
        else setDisplay('block');
    };

    useEffect(() => {
        if (data === null) {
            alert('Fill delivery form!')
            history.push('/cart/delivery-info');
        }
    }, [history, data])

    const onClick = async event => {
        event.preventDefault();
        const deliveryDetails = JSON.parse(data);
        const response = await fetch(`${api}/order/confirmOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                deliveryDetails,
                radioBoxes
            })
        });
        const content = await response.json();
        if (content.data === 'success') history.push(`/thankyou/${content.orderNumber}`);
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
                                text="Muslim Commercial Bank (MCB)"
                                classes="bold margin-bottom-0"
                                href="/"
                            />
                            <ParaText
                                text="Account Title: Kinza Asif"
                                classes="margin-bottom-0"
                                href="/"
                            />
                            <ParaText
                                text="Account Number: 1049953781007946"
                                classes="margin-bottom-0"
                                href="/"
                            />
                            <ParaText
                                text="PK 32 MUCB 1049953781007946"
                                href="/"
                            />
                            <div className="global-mt-3"></div>
                            <ParaText
                                text="Proof of payment with order number must be emailed at "
                                link="info@flowerworks.pk"
                                text2="."
                                href="mailto:info@flowerworks.pk"
                                textAlign="center"
                                target="_blank"
                                rel="noreferrer"
                                classes="margin-bottom-0"
                            />
                            <ParaText
                                text="You may also send proof of payment to our whatsapp number, "
                                link="0334 3214311"
                                text2="."
                                href="https://wa.me/+923343214311"
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