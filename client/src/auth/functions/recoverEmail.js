import api from "../../api";

export default async function recoverEmail(actionCode) {
    const response = await fetch(`${api}/users/recover-email`, {
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
