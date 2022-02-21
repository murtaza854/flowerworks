export function CreateOrderData(obj) {
    const date = new Date(obj.orderDate);
    const date1 = new Date(obj.deliveryDate);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const orderDate = date.toLocaleDateString('en-US', options);
    const deliveryDate = date1.toLocaleDateString('en-US', options);
    return {
        id: obj._id,
        orderNumber: obj.orderNumber,
        orderDate: orderDate,
        orderStatus: obj.status,
        orderStatusDisplay: obj.status,
        amountTotal: `PKR.${0}`,
        firstName: obj.firstName,
        lastName: obj.lastName,
        email: obj.email,
        contactNumber: obj.phoneNumber,
        firstName1: obj.firstName1,
        lastName1: obj.lastName1,
        email1: obj.email1,
        contactNumber1: obj.phoneNumber1,
        items: obj.items,
        area: obj.area,
        addressLine1: obj.addressLine1,
        addressLine2: obj.addressLine2,
        landmark: obj.landmark,
        callMe: obj.callMe,
        deliveryDate: deliveryDate,
        message: obj.message,
        receiver: obj.receiver,
        paymentMethod: obj.paymentMethod,
        coupon: obj.coupon,
    };
}