export function CreatePromotionCodeData(obj) {
    const expiresAt = new Date(obj.expiresAt);
    let expiresAtString = expiresAt.getFullYear() + "-" + (expiresAt.getMonth() + 1) + "-" + expiresAt.getDate();
    return {
        id: obj.id,
        code: obj.code,
        coupon: `${obj.coupon.name} - ${obj.coupon.id}`,
        user: obj.user ? `${obj.user.firstName} ${obj.user.lastName} - ${obj.user.email}` : null,
        expiresAt: obj.expiresAt? expiresAtString : null,
        maxRedemptions: obj.maxRedemptions,
        firstTimeTransaction: obj.firstTimeTransaction,
        minAmount: obj.minAmount ? `$ ${parseInt(obj.minAmount)}` : null,
        timesRedeeemed: obj.timesRedeeemed,
    };
}