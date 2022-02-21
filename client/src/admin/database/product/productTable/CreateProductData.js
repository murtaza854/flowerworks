export function CreateProductData(obj) {
    return {
        id: obj._id,
        image: obj.image,
        name: obj.name,
        base: obj.base.name,
        active: obj.active,
        description: obj.description,
        sizes: obj.sizes,
    };
}