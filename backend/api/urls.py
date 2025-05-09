from django.urls import path
from .views import home,auth,shops,customers


urlpatterns = [
    path('', home.home_view),

    # authentication
    path('login/',auth.login),
    path('check-token-validity/',auth.check_token_validity),
    path('add-user/',auth.add_user),
    path('update-user/',auth.update_user),
    path('delete-user/',auth.delete_user),
    
    # shops
    path('get-all-shops/',shops.get_all_shops),
    path('get-shop-deatil/',shops.get_shop_detail),
    path('add-shop/',shops.add_shop),
    path('add-bank-account/',shops.add_bank_account),
    path('get-shop-users/',shops.get_shop_users),

    path('deposit-balance/',shops.deposit_balance),
    path('withdraw-balance/',shops.withdraw_balance),
    path('get-deposit-and-withdraw-history/',shops.get_deposit_and_withdraw_history),


    # customers
    path('add-customer/',customers.add_customer),
    path('update-customer/',customers.update_customer),
    path('delete-customer/',customers.delete_customer),
    path('get-customers/',customers.get_customers),
    path('get-customer-detail/',customers.get_customer_detail),

    path('make-payment/',shops.make_payment),
    path('receive-payment/',shops.receive_payment),
    path('get-transactions/',shops.get_transactions),

    # helpers
    path('get-currencies/',shops.get_currencies),
    path('get-bank-accounts/',shops.get_bank_accounts),
    path('get-transaction-types/',shops.get_transaction_types),

    # get daily balance
    path('get-daily-balance/',shops.get_daily_balance),

    path('add-service-type/',shops.add_service_type),
    path('get-service-types/',shops.get_service_types),
    path('update-service-type/',shops.update_service_type),

    path('add-service/',shops.add_service),
    path('get-services/',shops.get_services),



]
