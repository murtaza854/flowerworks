import { FormControl, Input, InputLabel, FormHelperText, Button, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';

const createBaseTableData = (data) => {
    const { _id, name, price, imagePath } = data;
    const finalPrice = `PKR ${price}`;
    return { _id, name, finalPrice, imagePath };
}

const editObjCheck = (data, value, editObj) => {
    if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
    else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
}

const orderObj = {
    apiTable: `${api}/orders/TableData`,
    deleteApi: [`${api}/orders/getByIds`, `${api}/orders/delete`],
    createTableData : createBaseTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'finalPrice', numeric: false, disablePadding: false, label: 'Price' },
        { id: 'imagePath', numeric: false, disablePadding: false, label: 'Image' },
    ],
    ManyChild: '',
    checkboxSelection: '_id',
    deletePage: 'name',
    editAllowed: false,
    deleteAllowed: false,
    addAllowed: false,
    modelName: 'Order',
    ordering: 'name',
    rightAllign: [],
    Form: function(id, classes) {
        return (
            <div></div>
            );
    },
}

export default orderObj;