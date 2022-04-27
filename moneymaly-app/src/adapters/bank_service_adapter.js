import axios from 'axios';

const bank_service_url = 'http://192.116.98.107:8082';
var urljoin = require('url-join');

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

export function delete_user_bank_accounts_list(username, account_number, token) {
    var url = urljoin(bank_service_url, '/users/', username, 'bankaccounts', account_number)
    return axios.delete(url, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { username: username, account_number: account_number }
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
