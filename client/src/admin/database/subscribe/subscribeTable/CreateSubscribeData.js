export function CreateSubscribeData(obj) {
    const data = {
        id: obj._id,
        packageLength: obj.packageLength,
        packageLengthUnit: obj.packageLengthUnit,
        base: obj.base,
        baseAmount: obj.baseAmount,
        price: obj.price,
        active: obj.active
    };
    return data;
}