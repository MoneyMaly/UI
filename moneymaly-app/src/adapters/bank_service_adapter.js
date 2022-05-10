import axios from 'axios';

const bank_service_url = 'http://192.116.98.107:8082';
var urljoin = require('url-join');

// Users Bank Accounts  
export function get_user_bank_accounts_list(username, token) {
    var url = urljoin(bank_service_url, 'users', username, 'bankaccounts')
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

// Users Bank Accounts
export function add_user_bank_accounts_list(username, owner, ssn, account_number, token) {
    const data = { username: username, owner: owner, ssn: ssn, account_number: account_number };
    var url = urljoin(bank_service_url, 'users', username, 'bankaccounts')
    return axios.post(url, data,
        { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
    ).then(
        res => {
            return res.data;
        },
        err => {
            console.log(err);
            return null;
        }
    );
};

// Users Bank Accounts
export function delete_user_bank_accounts_list(username, account_number, token) {
    var url = urljoin(bank_service_url, 'users', username, 'bankaccounts', account_number)
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
// Banking Service - Account Balance
export function get_user_monthly_balance(username, token, month, year) {
    var url = urljoin(bank_service_url, 'users', username, 'bankaccounts', 'balance')
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { month: month, year: year }
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

// Banking Service - Account Balance
export function get_account_monthly_balance(username, token, account_number, ssn, owner, month, year) {
    var url = urljoin(bank_service_url, 'users', username, 'bankaccounts', account_number)
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { ssn: ssn, owner: owner, month: month, year: year }
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

// Users Deals
export function get_user_deals_by_account_number(username, token, account_number) {
    var url = urljoin(bank_service_url, 'users', username, 'bankaccounts', account_number, '/deals')
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` }
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

// Users Deals
export function add_user_deal_by_account_number(username, token, account_number, company, sector, extra_info_json) {
    var url = urljoin(bank_service_url, 'users', username, 'bankaccounts', account_number, '/deals');
    const data = { company: company, sector: sector, extra_info: extra_info_json };
    return axios.post(url, data,
        { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } })
        .then(
            res => {
                return res.data;
            },
            err => {
                console.log(err);
                return null;
            }
        );
};
// Users Deals
export function remove_user_deals_by_account_number(username, token, account_number, company) {
    var url = urljoin(bank_service_url, 'users', username, 'bankaccounts', account_number, 'deals', 'company', company);
    return axios.delete(url, {
        headers: { "Authorization": `Bearer ${token}` }
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

// Users Deals - Get all Users Deals Anonymously
export function get_all_users_deals(token, sector) {
    var url = urljoin(bank_service_url, 'deals', 'sectors', sector)
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` }
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