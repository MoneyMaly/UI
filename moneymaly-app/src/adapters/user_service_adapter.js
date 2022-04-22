import axios from 'axios';

const user_service_url = 'http://192.116.98.107:8081';
const bank_service_url = 'http://192.116.98.107:8082';
var urljoin = require('url-join');

export function validate_user_token(username, token) {
    var url = urljoin(user_service_url, 'users')
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { username: username }
    }).then(
        res => {
            if (res.status === 200){
                return res.data;   
                }
                else{
                    localStorage.clear();
                }
        },
        err => {
            console.log(err);
            return null;
        }
    );
};


export function get_user_bank_accounts_list(username, token) {
    var url = urljoin(bank_service_url, '/users/', username, 'bankaccounts')
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { username: username }
    }).then(
        res => {
            return res.data;
        },
        err => {
            console.log(err);
            return null;
        }
    );
}; 