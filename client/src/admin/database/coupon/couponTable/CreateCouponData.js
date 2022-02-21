export function CreateCouponData(obj) {
    const redeemBy = new Date(obj.redeemBy);
    let redeemByString = redeemBy.getFullYear() + "-" + (redeemBy.getMonth() + 1) + "-" + redeemBy.getDate();
    return {
        id: obj._id,
        name: obj.name,
        type: obj.type,
        appliedToProducts: obj.appliedToProducts,
        value: obj.type === 'Percentage Discount' ? `${parseFloat(obj.percentOff)} %` : `PKR.${parseInt(obj.amountOff)}`,
        usageLimit: obj.maxRedemptions,
        redeemBy: obj.redeemBy? redeemByString : null,
        minAmount: `PKR.${parseInt(obj.minAmount)}`,
        appliedToAddons: obj.appliedToAddons,
        appliedToDIY: obj.appliedToDIY,
        active: obj.active,
    };
}