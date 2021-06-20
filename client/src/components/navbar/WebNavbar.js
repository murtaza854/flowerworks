import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import {
    Link
} from "react-router-dom";
import './WebNavbar.scss';

function WebNavbar(props) {
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
                                <Link to="/"><AccountCircleIcon fontSize="large"/></Link>
                                <Link to="/"><LocalMallIcon fontSize="large"/></Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    );
}

export default WebNavbar;