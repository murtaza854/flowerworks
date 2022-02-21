import api from "../../api";

export default async function resetPasswordCheck(actionCode) {
    const response = await fetch(`${api}/auth/reset-password-check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        withCredentials: true,
        body: JSON.stringify({ actionCode })
    });
    const content = await response.json();
    return content.data
}