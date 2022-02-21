import { FormControl, InputLabel, Typography, Input, FormControlLabel, Checkbox, FormHelperText, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import api from '../../../../api';

function checkIfObjExistsByName(rows, name, id) {
    if (id) {
        return rows.find(o => o.name.toLowerCase() === name.toLowerCase() && o.id !== id);
    } else {
        return rows.find(o => o.name.toLowerCase() === name.toLowerCase());
    }
}

function SizeForm(props) {
    const {
        rows,
    } = props;
    const id = useParams().id || null;

    const [name, setName] = useState({ value: '', error: false, helperText: 'Enter a name Ex. Small' });
    const [price, setPrice] = useState({ value: '', error: false, helperText: 'Enter a price Ex. 200' });
    const [checkBoxes, setCheckBoxes] = useState({ active: true });

    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        (
            async () => {
                if (id) {
                    const response = await fetch(`${api}/size/getById`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id
                        })
                    });
                    const content = await response.json();
                    if (content.data) {
                        const { data } = content;
                        setName({ value: data.name, error: false, helperText: 'Enter a name Ex. Small' });
                        setPrice({ value: data.price, error: false, helperText: 'Enter a price Ex. 200' });
                        setCheckBoxes({ active: data.active });
                        setDisabled(false);
                    } else {
                        window.location.href = window.location.href.split('/admin')[0] + '/admin/size';
                    }
                }
            })();
    }, [id]);

    useEffect(() => {
        let flag = true;
        if (name.error === true) flag = true;
        else if (name.value.length === 0) flag = true;
        else if (price.error === true) flag = true;
        else if (price.value.length === 0) flag = true;
        else flag = false;
        setDisabled(flag);
    }, [name, price]);

    const handleNameChange = (event) => {
        if (event.target.value.length === 0) {
            setName({ value: event.target.value, error: true, helperText: 'Name is required!' });
        } else if (checkIfObjExistsByName(rows, event.target.value, id)) {
            setName({ value: event.target.value, error: true, helperText: 'Size already exists!' });
        } else {
            setName({ value: event.target.value, error: false, helperText: 'Enter a name Ex. Small' });
        }
    }

    const handlePriceChange = (event) => {
        if (event.target.value.length === 0) {
            setPrice({ value: event.target.value, error: true, helperText: 'Price is required!' });
        } else if (isNaN(event.target.value)) {
            setPrice({ value: event.target.value, error: true, helperText: 'Price must be a number!' });
        } else if (parseFloat(event.target.value) <= 0) {
            setPrice({ value: event.target.value, error: true, helperText: 'Price must be greater than 0!' });
        } else {
            setPrice({ value: event.target.value, error: false, helperText: 'Enter a price Ex. 200' });
        }
    }

    const handleActiveChange = (event) => {
        setCheckBoxes({ ...checkBoxes, active: !checkBoxes.active });
    }

    const handleSubmitAdd = async event => {
        event.preventDefault();
        const response = await fetch(`${api}/size/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.value,
                price: price.value,
                active: checkBoxes.active
            })
        });
        const content = await response.json();
        if (content.data) {
            window.location.href = window.location.href.split('/admin')[0] + '/admin/size';
        } else {
            alert("Something went wrong.");
        }
    }

    const handleSubmitEdit = async event => {
        event.preventDefault();
        const response = await fetch(`${api}/size/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            body: JSON.stringify({
                id: id,
                name: name.value,
                price: price.value,
                active: checkBoxes.active,
            })
        });
        const content = await response.json();
        if (content.data) {
            window.location.href = window.location.href.split('/admin')[0] + '/admin/size';
        } else {
            alert("Something went wrong.");
        }
    }

    let onSubmit = handleSubmitAdd;
    if (id) onSubmit = handleSubmitEdit;

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Sizes
                    </Typography>
                </Col>
            </Row>
            <Form onSubmit={onSubmit}>
                <input
                    type="password"
                    autoComplete="on"
                    value=""
                    style={{ display: 'none' }}
                    readOnly={true}
                />
                <Row>
                    <Col md={6}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel error={name.error} htmlFor="name">Name</InputLabel>
                            <Input id="name"
                                value={name.value}
                                onChange={handleNameChange}
                                onBlur={handleNameChange}
                                error={name.error}
                            />
                            <FormHelperText error={name.error}>{name.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                    <Col md={6}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel error={price.error} htmlFor="price">Price</InputLabel>
                            <Input id="price"
                                value={price.value}
                                onChange={handlePriceChange}
                                onBlur={handlePriceChange}
                                error={price.error}
                            />
                            <FormHelperText error={price.error}>{price.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={checkBoxes.active}
                                onChange={handleActiveChange}
                            />}
                            label="Active"
                        />
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                <Row>
                    <Col className="flex-display">
                        <Button disabled={disabled} type="submit" variant="contained" color="secondary">
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default SizeForm;