import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import { Radio, FormControlLabel, RadioGroup } from '@material-ui/core';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import { Button, ParaText, Heading2 } from '../../../../components';
import './Payment.scss'

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

    const handleChange = (event) => {
        props.setRadioBoxes({ method: event.target.value });
        if (event.target.value === 'Cash on Delivery') setDisplay('none');
        else setDisplay('block');
    };

    return (
        <div>
            <Container className="payment-cart">
                <Form className="form-style">
                    <Row>
                        <Col>
                            <ThemeProvider theme={theme}>
                                <RadioGroup aria-label="paymentMethod" name="paymentMethod1" value={props.radioBoxes.method} onChange={handleChange}>
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
                                bold="details"
                                link="/"
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
                        firstName={props.firstName}
                        lastName={props.lastName}
                        phoneNumber={props.phoneNumber}
                        email={props.email}

                        firstName1={props.firstName1}
                        lastName1={props.lastName1}
                        phoneNumber1={props.phoneNumber1}
                        email1={props.email1}

                        area={props.area}
                        addressLine1={props.addressLine1}
                        landmark={props.landmark}
                        addressLine2={props.addressLine2}

                        date={props.date}
                        message={props.message}

                        checkBoxes={props.checkBoxes}
                        
                        radioBoxes={props.radioBoxes}

                        cartForm={4}
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