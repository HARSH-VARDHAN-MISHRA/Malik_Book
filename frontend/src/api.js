// Home
// export const BASE_URL = 'http://192.168.1.61:8001';

// Office
export const BASE_URL = 'http://192.168.1.25:8001';
// export const BASE_URL = 'http://192.168.1.30:8001';

// live server 
// export const BASE_URL = 'https://server.faizone.in';

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
export const GET_SHOP_USERS = `${PREFIX_URL}/get-shop-users/`;
export const ADD_SHOP = `${PREFIX_URL}/add-shop/`;
export const ADD_BANK_ACCOUNT = `${PREFIX_URL}/add-bank-account/`;

export const DEPOSIT_BALANCE = `${PREFIX_URL}/deposit-balance/`;
export const WITHDRAW_BALANCE = `${PREFIX_URL}/withdraw-balance/`;
export const GET_DAILY_BALANCE = `${PREFIX_URL}/get-daily-balance/`;

// Users
export const ADD_USER = `${PREFIX_URL}/add-user/`;
export const UPDATE_USER = `${PREFIX_URL}/update-user/`;
export const DELETE_USER = `${PREFIX_URL}/delete-user/`;


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
export const GET_DEPOSIT_AND_WITHDRAW_HISTORY = `${PREFIX_URL}/get-deposit-and-withdraw-history/`;



// Services
export const ADD_SERVICE_TYPE = `${PREFIX_URL}/add-service-type/`;
export const UPDATE_SERVICE_TYPE = `${PREFIX_URL}/update-service-type/`;
export const GET_SERVICE_TYPES = `${PREFIX_URL}/get-service-types/`;
export const ADD_SERVICE = `${PREFIX_URL}/add-service/`;
export const GET_SERVICES = `${PREFIX_URL}/get-services/`;



