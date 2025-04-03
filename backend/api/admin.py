from django.contrib import admin

from .models import *

@admin.register(Shop)
class AdminShop(admin.ModelAdmin):
    list_display = ('id','name', 'address','contact_number')
    search_fields = ['id','name','address','contact_number']

@admin.register(User)
class AdminUser(admin.ModelAdmin):
    list_display = ('id','name', 'email', 'is_active','role')
    search_fields = ['id','name','email']

@admin.register(Currency)
class AdminCurrency(admin.ModelAdmin):
    list_display = ('id','currency')

@admin.register(BankAccount)
class AdminBankAccount(admin.ModelAdmin):
    list_display = ('id','shop','account_name','bank_name','account_number','balance')
    search_fields = ['id','shop','account_name','bank_name','account_number']


@admin.register(ShopCash)
class AdminShopCash(admin.ModelAdmin):
    list_display = ('id','shop','quantity','currency')
    search_fields = ['id','shop','quantity','currency']

@admin.register(Customer)
class AdminCustomer(admin.ModelAdmin):
    list_display = ('id','name','email','phone')
    search_fields = ['id','name','email','phone']

@admin.register(TransactionType)
class AdminTransactionType(admin.ModelAdmin):
    list_display = ('id','transaction_type')
    search_fields = ['id','transaction_type']


@admin.register(Transaction)
class AdminTransaction(admin.ModelAdmin):
    list_display = ('id','date','customer','shop','transaction_type','remark')
    search_fields = ['id','date','customer','shop','transaction_type','remark']


@admin.register(TransactionCashDenomination)
class AdminTransactionCashDenomination(admin.ModelAdmin):
    list_display = ('id','transaction','currency','quantity')
    search_fields=['transaction__id']

@admin.register(TransactionPaymentDetail)
class AdminTransactionPaymentDetail(admin.ModelAdmin):
    list_display = ('id','transaction','bank_account','amount')
    search_fields=['transaction__id']

@admin.register(DailyBalance)
class AdminDailyBalance(admin.ModelAdmin):
    list_display = ('id','date','shop')
    search_fields = ['id','date','shop']

@admin.register(DailyOpeningCashBalance)
class AdminDailyOpeningCashBalance(admin.ModelAdmin):
    list_display = ('id','currency','quantity')
    search_fields = ['id','currency','quantity']

@admin.register(DailyClosingCashBalance)
class AdminDailyClosingCashBalance(admin.ModelAdmin):
    list_display = ('id','currency','quantity')
    search_fields = ['id','currency','quantity']

@admin.register(DailyOpeningBankBalance)
class AdminDailyOpeningBankBalance(admin.ModelAdmin):
    list_display = ('id','bank_account','amount')
    search_fields = ['id','bank_account','amount']
    
@admin.register(DailyClosingBankBalance)
class AdminDailyClosingBankBalance(admin.ModelAdmin):
    list_display = ('id','bank_account','amount')
    search_fields = ['id','bank_account','amount']






# hide section

from django.contrib import admin
from django.contrib.auth.models import Group, User as AuthUser

# Unregister Groups and Users from the admin panel
admin.site.unregister(Group)
admin.site.unregister(AuthUser)
