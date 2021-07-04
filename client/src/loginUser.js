import api from './api';

export default async function loginUser(credentials) {
    return fetch(`${api}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        withCredentials: true,
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}
