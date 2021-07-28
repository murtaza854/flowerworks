import api from "../../api";

export default async function resetPassword(actionCode, password) {
    const response = await fetch(`${api}/users/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        withCredentials: true,
        body: JSON.stringify({ actionCode, password })
    });
    const content = await response.json();
    return content.data
}
