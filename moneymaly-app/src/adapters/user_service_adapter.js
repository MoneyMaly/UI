import axios from 'axios';

const user_service_url = 'http://192.116.98.107:8081';
var urljoin = require('url-join');

export function user_token_validation(username, token) {
    var url = urljoin(user_service_url, 'users')
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { username: username }
    }).then(
        res => {
            if (res.status === 200) {
                return true;   
            }
            else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        });
};

export function update_user_data_with_token(username, token, phone, email) {
    var url = urljoin(user_service_url, 'users')
    return axios.put(url, null,
        {
            headers: { "Authorization": `Bearer ${token}` },
            params: { username: username, phone: phone, email: email }
        })
        .then(
            res => {
                if (res.status === 200) {
                    return res.data;
                }
                else {
                    localStorage.clear();
                }
            })
        .catch(err => {
            console.log(err);
            return null;
        });
};

export function get_user_data_with_token(username, token) {
    var url = urljoin(user_service_url, 'users')
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { username: username }
    }).then(
        res => {
            if (res.status === 200) {
                localStorage.setItem('UserRole', res.data.role);
                return res.data;
            }
            else {
                localStorage.clear();
            }
        })
        .catch(err => {
            console.log(err);
            return null;
        });
};

export function creat_user_token(username, password) {
    const data = 'username=' + username + '&password=' + password;
    var url = urljoin(user_service_url, 'token')
    return axios.post(url, data)
        .then(res => {
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('username', username);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}; 