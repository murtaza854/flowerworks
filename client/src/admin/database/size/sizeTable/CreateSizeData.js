export function CreateSizeData(obj) {
    const data = {
        id: obj._id,
        name: obj.name,
        price: obj.price,
        active: obj.active,
    };
    return data;
}