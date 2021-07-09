import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, Button } from '../../../../components';
import './Category.scss';
import api from '../../../../api';

function Category(props) {
    const [categoryArray, setCategoryArray] = useState([]);

    useEffect(() => {(
        async () => {
            const response = await fetch(`${api}/bases/TableData?excludeID=${true}`, {
                headers: {'Content-Type': 'application/json'},
            });
            const content = await response.json();
            const data = content.data;
            const htmlData = [];
            // let count = 0;
            data.forEach(obj => {
                htmlData.push(
                    <Col key={obj.slug} md={4} className="spacing">
                        <Card button={<Button to={obj.slug} text={obj.name} classes="center-absolute text-uppercase" />} src={obj.imagePath} alt={obj.name} text="box" />
                    </Col>
                );
            });
            setCategoryArray(htmlData);
        })();
    }, []);
    return (
        <Container className="category">
            <Row className="justify-content-center">
                {categoryArray}
                {/* <Col md={4} className="spacing">
                    <Card button={<Button to="box" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                </Col>
                <Col md={4} className="spacing">
                    <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                </Col> */}
            </Row>
            {/* <Row className="justify-content-center"> */}
                {/* <Col md={4} className="spacing">
                        <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                    </Col>
                    <Col md={4} className="spacing">
                        <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                    </Col>
                    <Col md={4} className="spacing">
                        <Card button={<Button to="/" text="Box" classes="center-absolute text-uppercase" />} src="/images/box.png" alt="box" text="box" />
                    </Col> */}
                {/* </Row> */}
        </Container>
    );
}

export default Category;