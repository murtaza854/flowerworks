import { FormControl, Input, InputLabel, FormHelperText, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';

const createBaseTableData = (data) => {
    const { _id, name } = data;
    return { _id, name };
}

const editObjCheck = (data, value, editObj) => {
    if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
    else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
}

const areaObj = {
    apiTable: `${api}/areas/TableData`,
    deleteApi: [`${api}/areas/getByIds`, `${api}/areas/delete`],
    createTableData : createBaseTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    ],
    ManyChild: '',
    checkboxSelection: '_id',
    deletePage: 'name',
    editAllowed: true,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Area',
    ordering: 'name',
    searchField: 'name',
    rightAllign: [],
    type: 'enhanced',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' }
    ],
    Form: function(id, classes) {
        let history = useHistory();

        let queryID = '';
        if (id != null) queryID = id;
        const [editObj, setEditObj] = useState(null);
        
        const [nameState, setNameState] = useState({name: '', helperText: 'Enter name Ex. DHA Phase 1', error: false});
        
        const [areasArray, setProductsArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);

        useEffect(() => {
            let flag = true;
            if (nameState.error === true) flag = true;
            else if (nameState.name.length === 0) flag = true;
            else flag = false;
            setCanSubmit(flag);
        }, [nameState]);

        useEffect(() => {(
            async () => {
                const response = await fetch(`${api}/areas/TableData`, {
                    headers: {'Content-Type': 'application/json'},
                });
                const content = await response.json();
                const obj = content.data.find(o => o._id === queryID);
                setEditObj(obj)
                setProductsArray(content.data)
            })();
        }, [queryID]);

        useEffect(() => {
            if (editObj) {
                setNameState(prevState => ({ ...prevState, name: editObj.name }));
            }
        }, [editObj]);

        function changeNameState(event) {
            const { value } = event.target;
            setNameState(prevState => ({ ...prevState, name: value }));
            const obj = editObjCheck(areasArray, value, editObj);
            if (obj) setNameState(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setNameState(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setNameState(prevState => ({ ...prevState, helperText: 'Enter name Ex. DHA Phase 1', error: false }));
        };

        const onSubmit = async e => {
            e.preventDefault();
            if (queryID === '') {
                await fetch(`${api}/areas/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({name: nameState.name}),
                });
            } else {
                await fetch(`${api}/areas/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({_id: queryID, name: nameState.name}),
                });
            }
            if (pressedBtn === 1) {
                history.push('/admin/areas');
            }
            else {
                setNameState({name: '', helperText: 'Enter name Ex. DHA Phase 1', error: false});
                history.push('/admin/areas/add');
            }
        };

        return (<form onSubmit={onSubmit} autoComplete="off">
            <fieldset>
                <legend>Details</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={nameState.error} color="secondary"  htmlFor="name">Name</InputLabel>
                            <Input
                                color="secondary" 
                                autoComplete="none"
                                value={nameState.name}
                                type="text"
                                error={nameState.error}
                                id="name"
                                name="name"
                                onChange={changeNameState}
                                onBlur={changeNameState}
                                aria-describedby="name-helper"
                            />
                            <FormHelperText error={nameState.error} id="name-helper">{nameState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
            </fieldset>
            <input 
                type="text" 
                autoComplete="on" 
                value="" 
                style={{display: 'none'}} 
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

export default areaObj;