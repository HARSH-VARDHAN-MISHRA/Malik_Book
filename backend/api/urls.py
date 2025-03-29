from django.urls import path
from .views import home,auth,shops


urlpatterns = [
    path('', home.home_view),
    path('login/',auth.login),
    path('get-all-shops/',shops.get_all_shops),
    path('get-shop-deatil/',shops.get_shop_detail)
]
