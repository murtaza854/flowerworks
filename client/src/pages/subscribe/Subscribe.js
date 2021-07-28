import React, { useEffect } from 'react';
import { Container, Form, Col, Row } from 'react-bootstrap';
import { Button, Heading1, Divider } from '../../components';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import { RadioGroup, Radio, FormControlLabel, FormControl } from '@material-ui/core';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import './Subscribe.scss';

function Subscribe(props) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
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
    const [valueRadio1, setValueRadio1] = React.useState('1 Month - 4 Boxes (PKR.0000)');
    const [valueRadio2, setValueRadio2] = React.useState('Mixed Flowers');

    const handleChangeRadioGroup1 = (event) => {
        setValueRadio1(event.target.value);
    };
    const handleChangeRadioGroup2 = (event) => {
        setValueRadio2(event.target.value);
    };

    return (
        <Container className="subscribe">
            <Heading1
                first="Flower"
                bold="Subscription"
                classes="text-uppercase text-center"
            />
            <div className="global-mt-2"></div>
            <Form className="form-style">
                <input
                    type="password"
                    autoComplete="on"
                    value=""
                    style={{ display: 'none' }}
                    readOnly={true}
                />
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="firstName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control readOnly={true} type="text" />
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="lastName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control readOnly={true} type="text" />
                    </Form.Group>
                </Row>
                <Row className="justify-content-between">
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="phoneNumber">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control readOnly={true} type="text" />
                    </Form.Group>
                    <Form.Group className="input-form-group" as={Col} md={5} controlId="email">
                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control readOnly={true} type="text" />
                    </Form.Group>
                </Row>
                <div className="global-mt-2 hide-991"></div>
                <Row className="justify-content-center">
                    <Divider md={4} classes="margin-specified" />
                </Row>
                <Row className="justify-content-center">
                    <Col md={5} className="checkbox-form-group">
                        <FormControl component="fieldset">
                            <ThemeProvider theme={theme}>
                                <RadioGroup aria-label="months" name="months" value={valueRadio1} onChange={handleChangeRadioGroup1}>
                                    <FormControlLabel
                                        value="1 Month - 4 Boxes (PKR.0000)"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="1 Month - 4 Boxes (PKR.0000)"
                                    />
                                    <FormControlLabel
                                        value="3 Months - 12 Boxes (PKR.0000)"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="3 Months - 12 Boxes (PKR.0000)"
                                    />
                                    <FormControlLabel
                                        value="6 Months - 26 Boxes (PKR.0000)"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="6 Months - 26 Boxes (PKR.0000)"
                                    />
                                    <FormControlLabel
                                        value="12 Months - 52 Boxes (PKR.0000)"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="12 Months - 52 Boxes (PKR.0000)"
                                    />
                                </RadioGroup>
                            </ThemeProvider>
                        </FormControl>
                    </Col>
                    <Row className="justify-content-center unhide-991">
                        <Divider md={4} classes="margin-specified horizontal-center-relative" />
                    </Row>
                    <Col md={3} className="checkbox-form-group">
                        <FormControl component="fieldset">
                            <ThemeProvider theme={theme}>
                                <RadioGroup aria-label="months" name="months" value={valueRadio2} onChange={handleChangeRadioGroup2}>
                                    <FormControlLabel
                                        value="Mixed Flowers"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="Mixed Flowers"
                                    />
                                    <FormControlLabel
                                        value="One Type"
                                        control={
                                            <Radio
                                                disableRipple={true}
                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                        }
                                        label="One Type"
                                    />
                                </RadioGroup>
                            </ThemeProvider>
                        </FormControl>
                    </Col>
                </Row>
                <Row>
                    <div className="horizontal-center-margin">
                        <Button to="/" text="Subscribe" classes="text-uppercase" />
                    </div>
                </Row>
            </Form>
        </Container>
    );
}

export default Subscribe;