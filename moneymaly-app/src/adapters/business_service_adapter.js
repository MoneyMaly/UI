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