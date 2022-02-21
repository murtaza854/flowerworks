import { FormControl, InputLabel, Typography, Input, FormHelperText, Button, FormControlLabel, Checkbox, Select, MenuItem, Autocomplete, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import api from '../../../../api';

function SubscribeForm(props) {

    const [price, setPrice] = useState({ value: '', error: false, helperText: 'Enter a price Ex. 200' });
    const [packageLength, setPackageLength] = useState({ value: '', dropdown: 'Week', error: false, helperText: 'Enter a package length Ex. 1' });
    const [base, setBase] = useState({ name: '', obj: null, helperText: 'Enter base Ex. Box', error: false });
    const [baseAmount, setBaseAmount] = useState({ value: '', error: false, helperText: 'Enter a base amount Ex. 1' });
    const [checkBoxes, setCheckBoxes] = useState({ active: true });

    const [bases, setBases] = useState([]);

    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/base/getAllBases`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const content = await response.json();
                if (content.data) {
                    setBases(content.data);
                }
            }
        )();
    }, []);

    useEffect(() => {
        let flag = true;
        if (price.error === true) flag = true;
        else if (price.value.length === 0) flag = true;
        else if (packageLength.error === true) flag = true;
        else if (packageLength.value.length === 0) flag = true;
        else if (base.error === true) flag = true;
        else if (base.obj === null) flag = true;
        else if (baseAmount.error === true) flag = true;
        else if (baseAmount.value.length === 0) flag = true;
        else flag = false;
        setDisabled(flag);
    }, [price, packageLength, base, baseAmount]);

    const handleBaseChange = (event) => {
        const obj = bases.find(base => base.name === event.target.value);
        if (event.target.value === '') {
            setBase({ name: event.target.value, obj: null, helperText: 'Base is required!', error: true });
        } else if (obj === undefined) {
            setBase({ name: event.target.value, obj: null, helperText: 'Base does not exist!', error: true });
        } else {
            setBase({ name: event.target.value, obj, helperText: 'Enter base Ex. Box', error: false });
        }
    }

    const handleBaseAmountChange = (event) => {
        if (event.target.value === '') {
            setBaseAmount({ value: event.target.value, error: true, helperText: 'Base amount is required!' });
        } else if (isNaN(event.target.value)) {
            setBaseAmount({ value: event.target.value, error: true, helperText: 'Base amount must be a number!' });
        } else {
            setBaseAmount({ value: event.target.value, error: false, helperText: 'Enter a base amount Ex. 1' });
        }
    }

    const handlePriceChange = (event) => {
        if (event.target.value.length === 0) {
            setPrice({ value: event.target.value, error: true, helperText: 'Price is required!' });
        } else if (isNaN(event.target.value)) {
            setPrice({ value: event.target.value, error: true, helperText: 'Price must be a number!' });
        } else if (parseFloat(event.target.value) < 0) {
            setPrice({ value: event.target.value, error: true, helperText: 'Price must be greater than 0!' });
        } else {
            setPrice({ value: event.target.value, error: false, helperText: 'Enter a price Ex. 200' });
        }
    }

    const handlePackageLengthChange = (event) => {
        if (event.target.value.length === 0) {
            setPackageLength((prevState) => ({ ...prevState, value: event.target.value, error: true, helperText: 'Package length is required!' }));
        } else if (isNaN(event.target.value)) {
            setPackageLength((prevState) => ({ ...prevState, value: event.target.value, error: true, helperText: 'Package length must be a number!' }));
        } else {
            setPackageLength((prevState) => ({ ...prevState, value: event.target.value, error: false, helperText: 'Enter a package length Ex. 1' }));
        }
    }

    const handlePackageLengthUnitChange = (event) => {
        setPackageLength((prevState) => ({ ...prevState, dropdown: event.target.value }));
    }

    const handleActiveChange = (event) => {
        setCheckBoxes({ ...checkBoxes, active: !checkBoxes.active });
    }

    const handleSubmitAdd = async event => {
        event.preventDefault();
        const response = await fetch(`${api}/subscribe/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            body: JSON.stringify({
                price: price.value,
                packageLength: packageLength.value,
                packageLengthUnit: packageLength.dropdown,
                base: base.obj,
                baseAmount: baseAmount.value,
                active: checkBoxes.active
            })
        });
        const content = await response.json();
        if (content.data) {
            window.location.href = window.location.href.split('/admin')[0] + '/admin/subscribe';
        } else {
            alert("Something went wrong.");
        }
    }

    let onSubmit = handleSubmitAdd;

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
                        Subscribe Package
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
                            <InputLabel error={packageLength.error} htmlFor="packageLength">Package length</InputLabel>
                            <Input id="packageLength"
                                value={packageLength.value}
                                onChange={handlePackageLengthChange}
                                onBlur={handlePackageLengthChange}
                                error={packageLength.error}
                            />
                            <FormHelperText error={packageLength.error}>{packageLength.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                    <Col md={6}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="price">Package length unit</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={packageLength.dropdown}
                                label="Pakcage length unit"
                                onChange={handlePackageLengthUnitChange}
                            >
                                <MenuItem value="Week">Week</MenuItem>
                                <MenuItem value="Month">Month</MenuItem>
                                <MenuItem value="Year">Year</MenuItem>
                            </Select>
                            <FormHelperText>Select an option</FormHelperText>
                        </FormControl>
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControl variant="standard" fullWidth>
                            <Autocomplete
                                style={{ width: '100%' }}
                                disablePortal
                                value={base.obj ? base.obj.name : null}
                                onChange={handleBaseChange}
                                onBlur={handleBaseChange}
                                fullWidth
                                id="combo-box-demo"
                                options={bases.map(option => option.name)}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField error={base.error} {...params} variant="standard" label="Base" />}
                            />
                            <FormHelperText error={base.error}>{base.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                    <Col md={6}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel error={baseAmount.error} htmlFor="baseAmount">Base amount</InputLabel>
                            <Input id="baseAmount"
                                value={baseAmount.value}
                                onChange={handleBaseAmountChange}
                                onBlur={handleBaseAmountChange}
                                error={baseAmount.error}
                            />
                            <FormHelperText error={baseAmount.error}>{baseAmount.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                <Row>
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

export default SubscribeForm;