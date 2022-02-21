import { FormControl, InputLabel, Typography, Input, FormHelperText, Button, FormControlLabel, Checkbox, Autocomplete, TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import api from '../../../../api';

function PromotionCodeForm(props) {

    const [code, setCode] = useState({ value: '', helperText: 'Enter a code Ex. FRIENDS20. Will be automatically generated if left blank' });
    const [coupon, setCoupon] = useState({ value: null, error: false, helperText: 'Enter a coupon name Ex. First time discount' });
    const [minValue, setMinValue] = useState({ value: '', error: false, helperText: 'Enter a minimum value Ex. 10', readOnly: false });
    const [user, setUser] = useState({ value: null, error: false, helperText: 'Enter a user name Ex. John doe' });
    const [expiresAt, setExpiresAt] = useState({ value: '', error: false, helperText: 'Enter a expires at' });
    const [usageLimit, setUsageLimit] = useState({ value: '', error: false, helperText: 'Enter a usage limit Ex. 10' });

    const [usersData, setUsersData] = useState([]);
    const [couponsData, setCouponsData] = useState([]);

    const [checkboxes, setCheckboxes] = useState({
        user: false,
        usageLimit: false,
        expiresAt: false,
        minValue: false,
        firstTime: false,
    });

    const [disabled] = useState(false);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/user/getAllUsers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const content = await response.json();
                if (content.data) {
                    const { data } = content;
                    const usersDB = data.map(user => {
                        return {
                            value: user.id,
                            label: user.firstName + ' ' + user.lastName + ' (' + user.email + ')'
                        };
                    });
                    setUsersData(usersDB);
                }
            })();
    }, []);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/coupon/getAllCouponsPromotionFlag`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const content = await response.json();
                if (content.data) {
                    const { data } = content;
                    const couponsDB = data.map(coupon => {
                        return {
                            value: coupon.id,
                            label: coupon.name + ' (' + coupon.id + ')'
                        };
                    });
                    setCouponsData(couponsDB);
                }
            })();
    }, []);

    const handleCodeChange = (event) => {
        const { value } = event.target;
        setCode({ value, helperText: 'Enter a code Ex. FRIENDS20. Will be automatically generated if left blank' });
    }

    const handleMinValueChange = (event) => {
        if (event.target.value.length === 0) {
            setMinValue({ value: '', error: true, helperText: 'Enter a minimum value Ex. 10', readOnly: false });
        } else if (event.target.value < 0) {
            setMinValue({ value: event.target.value, error: true, helperText: 'Minimum value must be greater than 0!', readOnly: false });
        } else if (isNaN(event.target.value)) {
            setMinValue({ value: event.target.value, error: true, helperText: 'Minimum value must be a number!', readOnly: false });
        } else {
            setMinValue({ value: parseInt(event.target.value), error: false, helperText: 'Enter a minimum value Ex. 10', readOnly: false });
        }
    }

    const handleUsageLimitValueChange = (event) => {
        if (event.target.value.length === 0) {
            setUsageLimit({ value: event.target.value, error: true, helperText: 'Usage limit is required!' });
        } else if (event.target.value < 0) {
            setUsageLimit({ value: event.target.value, error: true, helperText: 'Usage limit must be greater than 0!' });
        } else if (isNaN(event.target.value)) {
            setUsageLimit({ value: event.target.value, error: true, helperText: 'Usage limit must be a number!' });
        } else {
            setUsageLimit({ value: event.target.value, error: false, helperText: 'Enter a usage limit Ex. 10' });
        }
    }

    const handleUserCheckBoxChange = (event) => {
        setCheckboxes({ ...checkboxes, user: !checkboxes.user });
    }

    const handleUsageLimitChange = (event) => {
        setCheckboxes({ ...checkboxes, usageLimit: !checkboxes.usageLimit });
    }

    const handleExpiresAtChange = (event) => {
        setCheckboxes({ ...checkboxes, expiresAt: !checkboxes.expiresAt });
    }

    const handleMinValueCheckBoxChange = (event) => {
        setCheckboxes({ ...checkboxes, minValue: !checkboxes.minValue });
    }

    const handleFirstTimeChange = (event) => {
        setCheckboxes({ ...checkboxes, firstTime: !checkboxes.firstTime });
    }

    function handleUserChange(event, newValue) {
        if (newValue) {
            setUser({ value: newValue, error: false, helperText: 'Enter a user name Ex. John doe' });
        }
    }
    function handleCouponChange(event, newValue) {
        if (newValue) {
            setCoupon({ value: newValue, error: false, helperText: 'Enter a coupon name Ex. First time discount' });
        }
    }

    const handleSubmitAdd = async event => {
        event.preventDefault();
        const response = await fetch(`${api}/promotionCode/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            body: JSON.stringify({
                code: code.value === '' ? null : code.value,
                coupon: coupon.value,
                minValue: checkboxes.minValue ? minValue.value : null,
                user: checkboxes.user ? user.value : null,
                expiresAt: checkboxes.expiresAt ? expiresAt.value : null,
                usageLimit: checkboxes.usageLimit ? usageLimit.value : null,
                firstTime: checkboxes.firstTime,
            })
        });
        const content = await response.json();
        if (content.data) {
            window.location.href = window.location.href.split('/admin')[0] + '/admin/promotion-code';
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
                        Promotion Code
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
                            <InputLabel error={code.error} htmlFor="code">Code</InputLabel>
                            <Input id="name"
                                value={code.value}
                                onChange={handleCodeChange}
                                onBlur={handleCodeChange}
                                error={code.error}
                            />
                            <FormHelperText error={code.error}>{code.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                    <Col md={6}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={coupon.value}
                            onChange={(event, newValue) => handleCouponChange(event, newValue)}
                            onBlur={(event, newValue) => handleCouponChange(event, newValue)}
                            options={couponsData}
                            renderInput={(params) => <TextField label="Coupon" variant="standard" fullWidth {...params} />}
                        />
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={checkboxes.minValue}
                                onChange={handleMinValueCheckBoxChange}
                            />}
                            label="Require minimum order value"
                        />
                    </Col>
                </Row>
                {
                    checkboxes.minValue ? (
                        <Row className="margin-global-top-1">
                            <Col md={6}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel error={minValue.error} htmlFor="minValue">Minimum value</InputLabel>
                                    <Input id="minValue"
                                        value={minValue.value}
                                        onChange={handleMinValueChange}
                                        onBlur={handleMinValueChange}
                                        error={minValue.error}
                                    />
                                    <FormHelperText error={minValue.error}>{minValue.helperText}</FormHelperText>
                                </FormControl>
                            </Col>
                        </Row>
                    ) : null
                }
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={checkboxes.user}
                                onChange={handleUserCheckBoxChange}
                            />}
                            label="Limit to specific user"
                        />
                    </Col>
                </Row>
                {
                    checkboxes.user ? (
                        <Row className="margin-global-top-1">
                            <Col md={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    value={user.value}
                                    onChange={(event, newValue) => handleUserChange(event, newValue)}
                                    onBlur={(event, newValue) => handleUserChange(event, newValue)}
                                    options={usersData}
                                    renderInput={(params) => <TextField label="User name" variant="standard" fullWidth {...params} />}
                                />
                            </Col>
                        </Row>
                    ) : null
                }
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={checkboxes.expiresAt}
                                onChange={handleExpiresAtChange}
                            />}
                            label="Enable limit till when this code will expire"
                        />
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                {
                    checkboxes.expiresAt ? (
                        <>
                            <Row>
                                <Col md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            disablePortal
                                            label="Redeem By"
                                            value={expiresAt.value}
                                            onChange={(newValue) => {
                                                setExpiresAt({ value: newValue, error: false, helperText: 'Enter a expires at' });
                                            }}
                                            renderInput={(params) => <TextField error={expiresAt.error} helperText={expiresAt.helperText} variant="standard" fullWidth {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Col>
                            </Row>
                        </>
                    ) : null
                }
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={checkboxes.usageLimit}
                                onChange={handleUsageLimitChange}
                            />}
                            label="Enable usage limit"
                        />
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                {
                    checkboxes.usageLimit ? (
                        <>
                            <Row>
                                <Col md={6}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel error={usageLimit.error} id="demo-simple-select-label">Usage Limit</InputLabel>
                                        <Input id="name"
                                            value={usageLimit.value}
                                            onChange={handleUsageLimitValueChange}
                                            onBlur={handleUsageLimitValueChange}
                                            error={usageLimit.error}

                                        />
                                        <FormHelperText error={usageLimit.error}>{usageLimit.helperText}</FormHelperText>
                                    </FormControl>
                                </Col>
                            </Row>
                        </>
                    ) : null
                }
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={checkboxes.firstTime}
                                onChange={handleFirstTimeChange}
                            />}
                            label="Eligible for first time order only"
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

export default PromotionCodeForm;