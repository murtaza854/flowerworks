export function CreateCategoryData(obj) {
    const data = {
        id: obj._id,
        name: obj.name,
        price: `PKR ${obj.price}/-`,
        fileName: obj.fileName,
        imagePath: obj.image,
        active: obj.active,
    };
    return data;
}