export function CreateUserData(obj) {
    const data = {
        id: obj.id,
        name: obj.firstName + ' ' + obj.lastName,
        email: obj.email,
        admin: obj.admin,
        emailVerified: obj.emailVerified,
        active: obj.active,
        subscribed: obj.subscribed,
    };
    return data;
}