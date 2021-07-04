import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import './RadioBox.scss';

function RadioBox(props) {
    const theme = createMuiTheme({
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
                            <RadioGroup aria-label="months" name="months" value={props.radioState} onChange={e => props.setRadioState(e.target.value)}>
                                <FormControlLabel
                                    value="1 Month - 4 Boxes (PKR.0000)"
                                    control={
                                        <Radio
                                            disableRipple={true}
                                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxOutlinedIcon fontSize="large"  />} />
                                        }
                                    label="1 Month - 4 Boxes (PKR.0000)"
                                />
                                <FormControlLabel
                                    value="3 Months - 12 Boxes (PKR.0000)"
                                    control={
                                        <Radio
                                            disableRipple={true}
                                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxOutlinedIcon fontSize="large"  />} />
                                        }
                                    label="3 Months - 12 Boxes (PKR.0000)"
                                />
                                <FormControlLabel
                                    value="6 Months - 26 Boxes (PKR.0000)"
                                    control={
                                        <Radio
                                            disableRipple={true}
                                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxOutlinedIcon fontSize="large"  />} />
                                        }
                                    label="6 Months - 26 Boxes (PKR.0000)"
                                />
                                <FormControlLabel
                                    value="12 Months - 52 Boxes (PKR.0000)"
                                    control={
                                        <Radio
                                            disableRipple={true}
                                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxOutlinedIcon fontSize="large"  />} />
                                        }
                                    label="12 Months - 52 Boxes (PKR.0000)"
                                />
                            </RadioGroup>
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