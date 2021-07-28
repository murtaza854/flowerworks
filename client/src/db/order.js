import React from 'react';
import api from '../api';

const createBaseTableData = (data) => {
    const { _id, orderNumber, orderDate, paymentMethod, status, numberOfItems, totalPrice, firstName, lastName, phoneNumber, email, firstName1, lastName1, phoneNumber1, email1, area, addressLine1, addressLine2, landmark, deliveryDate, message, callMe, items, discount } = data;
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const finalDate = new Date(orderDate).toLocaleDateString('en-GB', dateOptions);
    const finalOrderNumber = orderNumber.toUpperCase();
    let call = 'No';
    if (callMe) call = 'Yes';
    const recieptData = {
        orderNumber: finalOrderNumber,
        orderDate: finalDate,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        firstName1: firstName1,
        lastName1: lastName1,
        phoneNumber1: phoneNumber1,
        email1: email1,
        area: area,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        landmark: landmark,
        deliveryDate: new Date(deliveryDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }),
        message: message,
        callMe: call,
        paymentMethod: paymentMethod,
        status: status,
        items: items,
        totalPrice: totalPrice,
        discount: discount
    }
    return { _id, finalOrderNumber, finalDate, paymentMethod, status, numberOfItems, recieptData };
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'status') {
        const rows = [];
        const response = await fetch(`${api}/orders/set-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: obj.value, selected: selected })
        });
        const content = await response.json();
        content.data.forEach(element => {
          rows.push(createBaseTableData(element));
        });
        setTableRows(rows);
        setOriginalTableRows(rows);
    }
}

const orderObj = {
    apiTable: `${api}/orders/TableData`,
    deleteApi: [`${api}/orders/getByIds`, `${api}/orders/delete`],
    createTableData: createBaseTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'finalOrderNumber', numeric: false, disablePadding: false, label: 'Order number' },
        { id: 'finalDate', numeric: false, disablePadding: false, label: 'Order date' },
        { id: 'paymentMethod', numeric: false, disablePadding: false, label: 'Payment method' },
        { id: 'status', numeric: false, disablePadding: false, label: 'Order status' },
        { id: 'numberOfItems', numeric: true, disablePadding: false, label: 'Quantity' },
        { id: '', numeric: false, disablePadding: false, label: '' },
    ],
    ManyChild: '',
    checkboxSelection: '_id',
    deletePage: 'name',
    editAllowed: false,
    deleteAllowed: false,
    addAllowed: false,
    modelName: 'Order',
    ordering: 'finalOrderNumber',
    searchField: 'finalOrderNumber',
    rightAllign: ['numberOfItems'],
    type: 'collapse',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' },
        { label: 'Set processing', value: 'Processing ', type: 'status' },
        { label: 'Set refunded', value: 'Refunded ', type: 'status' },
        { label: 'Set completed', value: 'Completed ', type: 'status' },
        { label: 'Set cancelled', value: 'Cancelled ', type: 'status' },
    ],
    Form: function (id, classes) {
        return (
            <div></div>
        );
    },
}

export default orderObj;