import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { RadioBox, Heading1, Button, ParaText } from '../../components';
import './DIY.scss';

function DIY(props) {
    const [sizeRadio, setSizeRadio] = React.useState('Small');
    const [baseRadio, setBaseRadio] = React.useState('Bouquet');
    const [colorRadio, setColorRadio] = React.useState('Red');

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
                        radioState={sizeRadio}
                        setRadioState={setSizeRadio}
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="size"
                                classes="text-uppercase text-center"
                            />
                        }
                    />
                </Col>
                <Col md={4}>
                    <RadioBox
                        radioState={baseRadio}
                        setRadioState={setBaseRadio}
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="base"
                                classes="text-uppercase text-center"
                            />
                        }
                    />
                </Col>
                <Col md={4}>
                    <RadioBox
                        radioState={colorRadio}
                        setRadioState={setColorRadio}
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="color"
                                classes="text-uppercase text-center"
                            />
                        }
                        paraText={
                            <ParaText
                                text="Depending on Availability"
                                classes="bold"
                                textAlign="center"
                            />
                        }
                    />
                </Col>
            </Row>
            <div className="global-mt-3"></div>
            <Row>
                <Col>
                    <RadioBox
                        radioState={colorRadio}
                        setRadioState={setColorRadio}
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="Flowers"
                                classes="text-uppercase text-center"
                            />
                        }
                    />
                </Col>
            </Row>
            <div className="global-mt-3"></div>
            <Row>
                <Col>
                    <RadioBox
                        radioState={colorRadio}
                        setRadioState={setColorRadio}
                        optional={
                            <ParaText
                                text="Optional"
                                classes="bold"
                            />
                        }
                        heading={
                            <Heading1
                                first="Pick your"
                                bold="Add-ons"
                                classes="text-uppercase text-center"
                            />
                        }
                    />
                </Col>
            </Row>
            <div className="global-mt-2"></div>
            <Row>
                <div className="horizontal-center-margin">
                    <Button to="/" text="Create" classes="text-uppercase" />
                </div>
            </Row>
        </Container>
    );
}

export default DIY;