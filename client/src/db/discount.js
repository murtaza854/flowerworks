import { FormControl, Input, InputLabel, FormHelperText, Button, Select, MenuItem, InputAdornment, IconButton, Checkbox, ListItemText } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import api from '../api';
import TodayIcon from '@material-ui/icons/Today';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const createBaseTableData = (data) => {
    const { _id, name, type, startDate, endDate, minAmount, maxAmount, discountPercentage } = data;
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    let minAmountText = 'Not applicable';
    let maxAmountText = 'Not applicable';
    let discountPercentageText = discountPercentage;
    if (type === 'Bill') {
        minAmountText = minAmount;
        maxAmountText = maxAmount;
    } else if (type === 'Product') discountPercentageText = 'Not applicable';
    const sDate = new Date(startDate).toLocaleString('en-UK', dateOptions);
    const eDate = new Date(endDate).toLocaleString('en-UK', dateOptions);
    let status = 'Pending';
    if (new Date() >= new Date(endDate)) status = 'Completed'
    else if (new Date() < new Date(startDate)) status = 'Pending'
    else if (new Date() >= new Date(startDate)) status = 'Running';
    return { _id, name, type, sDate, eDate, minAmountText, maxAmountText, discountPercentageText, status };
}

const editObjCheck = (data, value, editObj) => {
    // console.log(data, value);
    if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
    else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
}

const discountObj = {
    apiTable: `${api}/discounts/TableData`,
    deleteApi: [`${api}/discounts/getByIds`, `${api}/discounts/delete`],
    createTableData: createBaseTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
        { id: 'sDate', numeric: false, disablePadding: false, label: 'Start date & time' },
        { id: 'endDate', numeric: false, disablePadding: false, label: 'End date & time' },
        { id: 'minAmountText', numeric: true, disablePadding: false, label: 'Min amount (PKR)' },
        { id: 'maxAmountText', numeric: true, disablePadding: false, label: 'Max amount (PKR)' },
        { id: 'discountPercentageText', numeric: true, disablePadding: false, label: 'Discount percentage (Bill / DIY) (%)' },
        { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    ],
    ManyChild: '',
    checkboxSelection: '_id',
    deletePage: 'name',
    editAllowed: false,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Discount',
    ordering: 'name',
    searchField: 'name',
    rightAllign: ['minAmountText', 'maxAmountText', 'discountPercentageText'],
    type: 'enhanced',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' }
    ],
    Form: function (id, classes) {
        let history = useHistory();

        let queryID = '';
        if (id != null) queryID = id;
        // const [editObj, setEditObj] = useState(null);

        const [nameState, setNameState] = useState({ name: '', helperText: 'Enter name Ex. Rose', error: false });
        const [typeState, setTypeState] = useState({ name: '', helperText: 'Select a type Ex. Bill', error: false });
        const [startDateState, setStartDateState] = useState(new Date());
        const [endDateState, setEndDateState] = useState(new Date());
        const [endDateError, setEndDateError] = useState('s');
        const [minAmountState, setMinAmountState] = useState({ name: '', helperText: 'Enter minimum amount Ex. 1000', error: false });
        const [maxAmountState, setMaxAmountState] = useState({ name: '', helperText: 'Enter maximum amount Ex. 10000', error: false });
        const [discountPercentageState, setDiscountPercentageState] = useState({ name: '', helperText: 'Enter discount percentage Ex. 25', error: false });
        const [productsMultiple, setProductsMultiple] = useState([]);

        const [hide, setHide] = useState({ discountRange: true, discountPercentage: true, productsMultiple: true });

        const [discountsArray, setDiscountsArray] = useState([]);
        const [productsArray, setProductsArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);

        useEffect(() => {
            let flag = true;
            if (nameState.error === true) flag = true;
            else if (nameState.name.length === 0) flag = true;
            else if (typeState.error === true) flag = true;
            else if (typeState.name.length === 0) flag = true;
            else if (minAmountState.error === true) flag = true;
            else if (minAmountState.name.length === 0) flag = true;
            else if (maxAmountState.error === true) flag = true;
            else if (maxAmountState.name.length === 0) flag = true;
            else if (discountPercentageState.error === true) flag = true;
            else if (discountPercentageState.name.length === 0) flag = true;
            else if (endDateError !== '') flag = true;
            else flag = false;
            setCanSubmit(flag);
        }, [nameState, typeState, minAmountState, maxAmountState, discountPercentageState, endDateError]);

        // useEffect(() => {
        // }, [productsMultiple]);

        useEffect(() => {
            const typeName = typeState.name;
            if (typeName === '') {
                setHide({ discountRange: true, discountPercentage: true, productsMultiple: true });
                setMinAmountState({ name: '', helperText: 'Enter minimum amount Ex. 1000', error: false });
                setMaxAmountState({ name: '', helperText: 'Enter maximum amount Ex. 1000', error: false });
                setDiscountPercentageState({ name: '', helperText: 'Enter discount percentage Ex. 25', error: false });
                setProductsMultiple([]);
            }
            else if (typeName === 'Bill') {
                setHide({ discountRange: false, discountPercentage: false, productsMultiple: true });
                setMinAmountState({ name: '', helperText: 'Enter minimum amount Ex. 1000', error: false });
                setMaxAmountState({ name: '', helperText: 'Enter maximum amount Ex. 1000', error: false });
                setDiscountPercentageState({ name: '', helperText: 'Enter discount percentage Ex. 25', error: false });
                setProductsMultiple([]);
            }
            else if (typeName === 'DIY') {
                setHide({ discountRange: true, discountPercentage: false, productsMultiple: true });
                setMinAmountState({ name: 0, helperText: 'Enter minimum amount Ex. 1000', error: false });
                setMaxAmountState({ name: 0, helperText: 'Enter maximum amount Ex. 1000', error: false });
                setDiscountPercentageState({ name: '', helperText: 'Enter discount percentage Ex. 25', error: false });
                setProductsMultiple([]);
            }
            else if (typeName === 'Product') {
                setHide({ discountRange: true, discountPercentage: true, productsMultiple: false });
                setMinAmountState({ name: 0, helperText: 'Enter minimum amount Ex. 1000', error: false });
                setMaxAmountState({ name: 0, helperText: 'Enter maximum amount Ex. 1000', error: false });
                setDiscountPercentageState({ name: 0, helperText: 'Enter discount percentage Ex. 25', error: false });
                setProductsMultiple([]);
            }
        }, [typeState.name])

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/discounts/TableData`, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const content = await response.json();
                    // console.log(content.data);
                    setDiscountsArray(content.data)
                })();
        }, [queryID]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/products/TableData`, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const content = await response.json();
                    const products = [];
                    content.data.forEach(element => {
                        products.push({ item: element, discountPercentage: 0 });
                    });
                    setProductsArray(products)
                })();
        }, [queryID]);

        useEffect(() => {
            if (parseFloat(discountPercentageState.name) < 0 || parseFloat(discountPercentageState.name) > 100) setDiscountPercentageState(prevState => ({ ...prevState, helperText: 'Must be between 0 and 100!', error: true }));
            else setDiscountPercentageState(prevState => ({ ...prevState, helperText: 'Enter discount percentage Ex. 25', error: false }));
        }, [discountPercentageState.name]);

        useEffect(() => {
            if (parseFloat(maxAmountState.name) < parseFloat(minAmountState.name)) setMaxAmountState(prevState => ({ ...prevState, helperText: 'Must be greater than minimum amount', error: true }));
            else setMaxAmountState(prevState => ({ ...prevState, helperText: 'Enter maximum amount Ex. 10000', error: false }));
        }, [minAmountState.name, maxAmountState.name]);

        function changeNameState(event) {
            const { value } = event.target;
            setNameState(prevState => ({ ...prevState, name: value }));
            const obj = editObjCheck(discountsArray, value, null);
            if (obj) setNameState(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setNameState(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setNameState(prevState => ({ ...prevState, helperText: 'Enter name Ex. Rose', error: false }));
        };
        function changeTypeState(event) {
            const { value } = event.target;
            setTypeState(prevState => ({ ...prevState, name: value }));
            if (value === '') setTypeState(prevState => ({ ...prevState, helperText: 'Type is required!', error: true }));
            else setTypeState(prevState => ({ ...prevState, helperText: 'Select a type Ex. Bill', error: false }));
        };
        const changeMinAmountState = event => {
            const { value } = event.target;
            const reg = /^[1-9]\d*$/;
            setMinAmountState(prevState => ({ ...prevState, name: value }));
            if (value === '') setMinAmountState(prevState => ({ ...prevState, helperText: 'Minimum amount is required!', error: true }));
            else if (!value.match(reg)) setMinAmountState(prevState => ({ ...prevState, helperText: 'Must contain digits only!', error: true }));
            else setMinAmountState(prevState => ({ ...prevState, helperText: 'Enter minimum amount Ex. 1000', error: false }));
        }
        const changeMaxAmountState = event => {
            const { value } = event.target;
            const reg = /^[1-9]\d*$/;
            setMaxAmountState(prevState => ({ ...prevState, name: value }));
            if (value === '') setMaxAmountState(prevState => ({ ...prevState, helperText: 'Maximum amount is required!', error: true }));
            else if (!value.match(reg)) setMaxAmountState(prevState => ({ ...prevState, helperText: 'Must contain digits only!', error: true }));
            else setMaxAmountState(prevState => ({ ...prevState, helperText: 'Enter maximum amount Ex. 1000', error: false }));
        }
        const changeDiscountPercentageState = event => {
            const { value } = event.target;
            const reg = /^[1-9]\d*$/;
            setDiscountPercentageState(prevState => ({ ...prevState, name: value }));
            if (value === '') setDiscountPercentageState(prevState => ({ ...prevState, helperText: 'Discount percentage is required!', error: true }));
            else if (!value.match(reg)) setDiscountPercentageState(prevState => ({ ...prevState, helperText: 'Must contain digits only!', error: true }));
            else setDiscountPercentageState(prevState => ({ ...prevState, helperText: 'Enter discount percentage Ex. 25', error: false }));
        }
        const handleChange = event => {
            const { value } = event.target;
            setProductsMultiple(value);
        };
        const handleDiscountProductChange = (event, index) => {
            const { value } = event.target;
            // setProductsMultiple(value)
            const products = [...productsMultiple];
            const reg = /^[0-9]\d*$/;
            if (value.match(reg) || value === '') {
                let number = value;
                if (number.startsWith('0') && number.length > 1) number = number.substring(1);
                if (number === '') {
                    products[index].discountPercentage = 0;
                    setProductsMultiple(products);
                } else if (parseFloat(number) >= 0 && parseFloat(number) <= 100) {
                    products[index].discountPercentage = number;
                    setProductsMultiple(products);
                }
            }
        };

        const onSubmit = async e => {
            e.preventDefault();
            if (queryID === '') {
                await fetch(`${api}/discounts/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: nameState.name, type: typeState.name, minAmount: minAmountState.name, maxAmount: maxAmountState.name, discountPercentage: discountPercentageState.name, startDate: startDateState, endDate: endDateState, productsMultiple: productsMultiple }),
                });
            }
            if (pressedBtn === 1) {
                history.push('/admin/discounts');
            }
            else {
                setNameState({ name: '', helperText: 'Enter name Ex. Rose', error: false });
                setTypeState(prevState => ({ ...prevState, helperText: 'Select a type Ex. Bill', error: false }));
                setStartDateState(new Date());
                setEndDateState(new Date());
                setMinAmountState({ name: '', helperText: 'Enter minimum amount Ex. 1000', error: false });
                setMaxAmountState({ name: '', helperText: 'Enter maximum amount Ex. 1000', error: false });
                setDiscountPercentageState({ name: '', helperText: 'Enter discount percentage Ex. 25', error: false });
                setProductsMultiple([]);
                setEndDateError('s')
                setHide({ discountRange: true, discountPercentage: true, productsMultiple: true });
                queryID = '';
                // history.push('/admin/discounts/add');
            }
        };

        return (<form onSubmit={onSubmit} autoComplete="off">
            <fieldset>
                <legend>Discount description</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={nameState.error} color="secondary" htmlFor="name">Name</InputLabel>
                            <Input
                                color="secondary"
                                autoComplete="none"
                                value={nameState.name}
                                type="text"
                                error={nameState.error}
                                onChange={changeNameState}
                                onBlur={changeNameState}
                                aria-describedby="name-helper"
                            />
                            <FormHelperText error={nameState.error} id="name-helper">{nameState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="type">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={typeState.error}>Type</InputLabel>
                            <Select
                                labelId="type"
                                value={typeState.name}
                                error={typeState.error}
                                onChange={changeTypeState}
                                onBlur={changeTypeState}
                                input={<Input />}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="">
                                    -
                                </MenuItem>
                                <MenuItem value="Bill">
                                    Bill
                                </MenuItem>
                                <MenuItem value="DIY">
                                    DIY
                                </MenuItem>
                                <MenuItem value="Product">
                                    Product
                                </MenuItem>
                            </Select>
                            <FormHelperText error={typeState.error}>{typeState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                {
                    hide.discountRange ? null : (
                        <Row className={classes.rowGap}>
                            <Form.Group as={Col} md={6} controlId="minAmount">
                                <FormControl className={classes.formControl}>
                                    <InputLabel error={minAmountState.error} color="secondary" htmlFor="minAmount">Minimum amount</InputLabel>
                                    <Input
                                        color="secondary"
                                        autoComplete="none"
                                        value={minAmountState.name}
                                        type="text"
                                        error={minAmountState.error}
                                        id="minAmount"
                                        name="minAmount"
                                        onChange={changeMinAmountState}
                                        onBlur={changeMinAmountState}
                                        aria-describedby="minAmount-helper"
                                    />
                                    <FormHelperText error={minAmountState.error} id="minAmount-helper">{minAmountState.helperText}</FormHelperText>
                                </FormControl>
                            </Form.Group>
                            <Form.Group as={Col} md={6} controlId="maxAmount">
                                <FormControl className={classes.formControl}>
                                    <InputLabel error={maxAmountState.error} color="secondary" htmlFor="maxAmount">Maximum amount</InputLabel>
                                    <Input
                                        color="secondary"
                                        autoComplete="none"
                                        value={maxAmountState.name}
                                        type="text"
                                        error={maxAmountState.error}
                                        id="maxAmount"
                                        name="maxAmount"
                                        onChange={changeMaxAmountState}
                                        onBlur={changeMaxAmountState}
                                        aria-describedby="maxAmount-helper"
                                    />
                                    <FormHelperText error={maxAmountState.error} id="maxAmount-helper">{maxAmountState.helperText}</FormHelperText>
                                </FormControl>
                            </Form.Group>
                        </Row>
                    )
                }
                {
                    hide.discountPercentage ? null : (
                        <Row className={classes.rowGap}>
                            <Form.Group as={Col} md={6} controlId="discountPercentage">
                                <FormControl className={classes.formControl}>
                                    <InputLabel error={discountPercentageState.error} color="secondary" htmlFor="minAmount">Discount percentage</InputLabel>
                                    <Input
                                        color="secondary"
                                        autoComplete="none"
                                        value={discountPercentageState.name}
                                        type="text"
                                        error={discountPercentageState.error}
                                        id="discountPercentage"
                                        name="discountPercentage"
                                        onChange={changeDiscountPercentageState}
                                        onBlur={changeDiscountPercentageState}
                                        aria-describedby="discountPercentage-helper"
                                    />
                                    <FormHelperText error={discountPercentageState.error} id="discountPercentage-helper">{discountPercentageState.helperText}</FormHelperText>
                                </FormControl>
                            </Form.Group>
                        </Row>
                    )
                }
            </fieldset>
            <fieldset>
                <legend>Discount period</legend>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Row className={classes.rowGap}>
                        <Form.Group as={Col} md={6} controlId="startDate">
                            <DateTimePicker
                                value={startDateState}
                                style={{ width: '100%' }}
                                disablePast
                                onChange={setStartDateState}
                                label="Start date"
                                showTodayButton
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton>
                                                <TodayIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6} controlId="endDate">
                            <DateTimePicker
                                value={endDateState}
                                style={{ width: '100%' }}
                                disablePast
                                minDate={startDateState}
                                onError={(error, value) => setEndDateError(error)}
                                onChange={setEndDateState}
                                label="End date"
                                showTodayButton
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton>
                                                <TodayIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Form.Group>
                    </Row>
                </MuiPickersUtilsProvider>
            </fieldset>
            {
                hide.productsMultiple ? null : (
                    <fieldset>
                        <legend>Products</legend>
                        <Row className={classes.rowGap}>
                            <Form.Group as={Col} md={6} controlId="endDate">
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-mutiple-checkbox-label">Products</InputLabel>
                                    <Select
                                        labelId="demo-mutiple-checkbox-label"
                                        id="demo-mutiple-checkbox"
                                        multiple
                                        value={productsMultiple}
                                        onChange={handleChange}
                                        input={<Input />}
                                        renderValue={(selected) => selected.map((value) => { return value.item.name }).join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {productsArray.map((value) => (
                                            <MenuItem key={value.item.name} value={value}>
                                                <Checkbox checked={productsMultiple.indexOf(value) > -1} />
                                                <ListItemText primary={value.item.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Form.Group>
                        </Row>
                        {
                            productsMultiple.map((value, index) => (
                                <Row key={index} className={classes.rowGap}>
                                    <Form.Group as={Col} md={6} controlId="name">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel color="secondary" htmlFor="name">Product</InputLabel>
                                            <Input
                                                color="secondary"
                                                autoComplete="none"
                                                value={`${value.item.name} - PKR ${value.item.price}/-`}
                                                type="text"
                                                readOnly={true}
                                            />
                                        </FormControl>
                                    </Form.Group>
                                    <Form.Group as={Col} md={6} controlId="productsMultiple">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel error={discountPercentageState.error} color="secondary" htmlFor="minAmount">Discount percentage</InputLabel>
                                            <Input
                                                color="secondary"
                                                autoComplete="none"
                                                value={value.discountPercentage}
                                                type="text"
                                                id="discountPercentage"
                                                name="discountPercentage"
                                                onChange={e => handleDiscountProductChange(e, index)}
                                                onBlur={e => handleDiscountProductChange(e, index)}
                                                aria-describedby="discountPercentage-helper"
                                            />
                                            <FormHelperText id="discountPercentage-helper">Enter discount percentage Ex. 25</FormHelperText>
                                        </FormControl>
                                    </Form.Group>
                                </Row>)
                            )
                        }
                    </fieldset>
                )
            }
            <input
                type="text"
                autoComplete="on"
                value=""
                style={{ display: 'none' }}
                readOnly={true}
            />
            <Button className={classes.button} onClick={_ => setPressedBtn(1)} disabled={isDisabled} type="submit" variant="contained" color="primary">
                Save
            </Button>
            <Button onClick={_ => setPressedBtn(2)} disabled={isDisabled} type="submit" variant="contained" color="primary">
                Save and add another
            </Button>
        </form>);
    },
}

export default discountObj;