import axios from 'axios';

const business_service_url = 'http://192.116.98.107:8083';
var urljoin = require('url-join');

// Business Service - Anomaly Detector
export function get_account_anomaly_by_date(username, token, account_number, from_year, to_year, from_month, to_month) {
    var url = urljoin(business_service_url, 'users', username, 'bankaccounts', account_number, 'deals', 'anomaly')
    return axios.get(url, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { from_year: from_year, to_year: to_year, from_month: from_month, to_month: to_month }
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
// Business Service - User Payment Ratio
export function get_user_account_payment_ratio(username, token, account_number, company) {
    var url = urljoin(business_service_url, 'users', username, 'bankaccounts', account_number, 'deals', 'companies', company, 'ratio')
    return axios.get(url, { headers: { "Authorization": `Bearer ${token}` } })
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
// Business Service - Send New Offer To Client
export function send_new_offer_to_client_by_deal_id(token, deal_id, price, business_phone) {
    var url = urljoin(business_service_url, 'deals', 'deal_id', deal_id, 'prices', price);
    return axios.post(url, null,
        {
            params: { business_phone: business_phone },
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        })
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

    // Business Service - Reject New Offer
    export function reject_new_offer(token, username, account_number, company, new_price, business_phone) {
        var url = urljoin(business_service_url, 'users', username, 'bankaccounts', account_number, 'offers', 'companies', company, 'offer_status', 'Rejected');
        return axios.put(url, null,
            {
                params: { new_price: new_price, business_phone: business_phone },
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
            })
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

// Business Service - Accept New Offer
export function accept_new_offer(token, username, account_number, company, new_price, business_phone) {
    var url = urljoin(business_service_url, 'users', username, 'bankaccounts', account_number, 'offers', 'companies', company, 'offer_status', 'Accepted');
    return axios.put(url, null,
        {
            params: { new_price: new_price, business_phone: business_phone },
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        })
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

// Business Service - Get All User New Offers
export function get_all_user_new_offers(token, username) {
    var url = urljoin(business_service_url, 'users', username, 'offers', 'offer_status', 'Open');
    return axios.get(url,
        {
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        })
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

// Business Service - Get All User Anomaly
export function get_all_user_anomalies(token, username) {
    var url = urljoin(business_service_url, 'users', username, 'deals', 'anomaly');
    return axios.get(url,
        {
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        })
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

// Business Service - Get All Business Offers
export function get_all_business_offers(token, business_phone) {
    var url = urljoin(business_service_url, 'offers', 'business_phone', business_phone.replace('+', '%2B'));
    console.log(url);
    console.log(business_phone);
    return axios.get(url,
        {
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        })
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