import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './Sidebar.scss';

function Sidebar(props) {

    useEffect(() => {
        document.addEventListener('click', function (event) {
            const isClickInsideSidebar = document.getElementById('client-sidebar').contains(event.target);
            const isClickInsideHamburger = document.getElementById('client-sidebar-hamburger').contains(event.target);

            if (!isClickInsideSidebar && !isClickInsideHamburger) {
                const sidebar = document.getElementById('client-sidebar');
                const check = sidebar.classList.contains('client-sidebar-open');
                if (check) {
                    sidebar.classList.remove('client-sidebar-open');
                    sidebar.classList.add('client-sidebar-closed');
                }
            }
        });
    }, []);

    return (
        <Container id="client-sidebar" className="client-sidebar unhide-991 client-sidebar-not-active" fluid>
            <Row className="top-row">
                <Col>
                    <Link to="/">
                        <img src="/images/logo-white-removebg-preview.png" alt="logo" className="logo" />
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to="/">
                        Home
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to="/do-it-yourself">
                        DIY
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to="/contact">
                        Contact Us
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}

export default Sidebar;