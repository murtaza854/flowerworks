import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import { RadioGroup, Radio, FormControlLabel, Checkbox } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './RadioBox.scss';

function RadioBox(props) {
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
    const handleRadioChange = event => {
        const array = props.data;
        const oldState = props.dataState;
        const objOld = array.find(obj => obj.slug === oldState);
        const objNew = array.find(obj => obj.slug === event.target.value);
        props.setCost(c => (c - objOld.price) + objNew.price);
        props.setData(objNew.slug);
    };
    const handleCheckboxChange = (position) => {
        const array = props.data;
        const checkboxArray = props.dataState;
        const updatedCheckedState = checkboxArray.map((item, index) =>
            index === position ? !item : item
        );

        const oldPrice = checkboxArray.reduce(
            (sum, currentState, index) => {
                if (currentState === true) {
                    return sum + array[index].price;
                }
                return sum;
            },
            0
        );
        const newPrice = updatedCheckedState.reduce(
            (sum, currentState, index) => {
                if (currentState === true) {
                    return sum + array[index].price;
                }
                return sum;
            },
            0
        );
        props.setCost(c => (c - oldPrice) + newPrice);
        props.setData(updatedCheckedState);
    };
    return (
        <div className="radio-box">
            {props.heading}
            <div className="optional">
                {props.optional}
            </div>
            <Col className="scroll">
                <ThemeProvider theme={theme}>
                    <Row className="justify-content-between">
                        <Form.Group as={Col}>
                            {props.type === 'radio' ? <RadioGroup aria-label="months" name="months" value={props.dataState} onChange={handleRadioChange}>
                                <ul>
                                    {props.data.map((value, index) => {
                                        return (
                                            <li key={index}>
                                                <FormControlLabel
                                                    value={value.slug}
                                                    control={
                                                        <Radio
                                                            disableRipple={true}
                                                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                            checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                                    }
                                                    label={value.name}
                                                    style={{ textTransform: 'capitalize' }}
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </RadioGroup> : <ul className={props.classes}>
                                {props.data.map((value, index) => {
                                    return (
                                        <li key={index}>
                                            <FormControlLabel
                                                onChange={() => handleCheckboxChange(index)}
                                                value={value.name}
                                                checked={props.dataState[index]}
                                                control={
                                                    <Checkbox
                                                        disableRipple={true}
                                                        icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                                        checkedIcon={<CheckBoxOutlinedIcon fontSize="large" />} />
                                                }
                                                label={value.name}
                                                style={{ textTransform: 'capitalize' }}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>}
                        </Form.Group>
                    </Row>
                </ThemeProvider>
            </Col>
            <div className="text">
                {props.paraText}
            </div>
        </div>
    );
}

export default RadioBox;