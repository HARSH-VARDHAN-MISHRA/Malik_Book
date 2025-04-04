// Home
// export const BASE_URL = 'http://192.168.1.61:8001';

// Office
export const BASE_URL = 'http://192.168.1.38:8001';

export const PREFIX_URL = `${BASE_URL}/api`;

// API KEY
export const APIKEY = "web";

// API Endpoints
export const CHECK_TOKEN_VALIDITY = `${PREFIX_URL}/check-token-validity/`;
export const LOGIN = `${PREFIX_URL}/login/`;

// Products
export const FETCH_ALL_PRODUCTS = `${PREFIX_URL}/get-products/`;

// Shops
export const GET_ALL_SHOPS = `${PREFIX_URL}/get-all-shops/`;
export const GET_SHOP_DETAIL = `${PREFIX_URL}/get-shop-deatil/`;


// Customer
export const GET_CUSTOMERS = `${PREFIX_URL}/get-customers/`;
export const ADD_CUSTOMER = `${PREFIX_URL}/add-customer/`;
export const UPDATE_CUSTOMER = `${PREFIX_URL}/update-customer/`;
export const DELETE_CUSTOMER = `${PREFIX_URL}/delete-customer/`;



// Helpers
export const GET_CURRENCIES = `${PREFIX_URL}/get-currencies/`;
export const GET_BANK_ACCOUNTS = `${PREFIX_URL}/get-bank-accounts/`;


// Transactions
export const MAKE_PAYMENT = `${PREFIX_URL}/make-payment/`;
export const RECEIVE_PAYMENT = `${PREFIX_URL}/receive-payment/`;
export const GET_TRANSACTIONS = `${PREFIX_URL}/get-transactions/`;


