import api from "../../api";

export default async function resetPassword(mode, actionCode, password) {
    const response = await fetch(`${api}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        withCredentials: true,
        body: JSON.stringify({ mode, actionCode, password })
    });
    const content = await response.json();
    return content.data
}