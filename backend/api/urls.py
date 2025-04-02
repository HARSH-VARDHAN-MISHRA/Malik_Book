from django.urls import path
from .views import home,auth,shops,customers


urlpatterns = [
    path('', home.home_view),
    path('login/',auth.login),
    path('check-token-validity/',auth.check_token_validity),
    path('get-all-shops/',shops.get_all_shops),
    path('get-shop-deatil/',shops.get_shop_detail),



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
]
