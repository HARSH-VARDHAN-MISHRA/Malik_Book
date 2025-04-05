from rest_framework import serializers
from api.models import Shop,BankAccount,ShopCash,Currency,Transaction,TransactionCashDenomination,TransactionPaymentDetail,TransactionType,Customer,DepositWithdrawHistory,DepositWithdrawHistoryCashDenomination,DepositWithdrawHistoryPaymentDetail



class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'


class ShopCashSerializer(serializers.ModelSerializer):
    currency = serializers.SerializerMethodField()
    class Meta:
        model = ShopCash
        fields = ['id', 'currency', 'quantity'] 
    def get_currency(self, obj):
        return obj.currency.currency if obj.currency else None

class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = '__all__'

class ShopMinimalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shop
        fields = ['id', 'name', 'address', 'contact_number']

class ShopSerializer(serializers.ModelSerializer):
    current_balance = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = ['id', 'name', 'address', 'contact_number', 'current_balance']

    def get_current_balance(self, obj):
        cash_details = ShopCash.objects.filter(shop=obj)
        bank_details = BankAccount.objects.filter(shop=obj)

        return {
            "cash": ShopCashSerializer(cash_details, many=True).data,
            "bank_balance": BankAccountSerializer(bank_details, many=True).data
        }
    

class CustomerMinimalSeralizer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields="__all__"


class TransactionPaymentDetailSerializer(serializers.ModelSerializer):
    bank_account=BankAccountSerializer(read_only=True)
    class Meta:
        model = TransactionPaymentDetail
        fields = ['id', 'bank_account', 'amount']

class TransactionSerializer(serializers.ModelSerializer):
    cash_denomination = serializers.SerializerMethodField()
    payment_detail = serializers.SerializerMethodField()
    transaction_type = serializers.SerializerMethodField()
    shop = ShopMinimalSerializer()
    customer=CustomerMinimalSeralizer()
    created_by=serializers.SerializerMethodField()
    class Meta:
        model = Transaction
        fields = ['id', 'date', 'customer', 'shop', 'transaction_type', 'remark','cash_denomination','payment_detail','created_at','created_by']
    def get_cash_denomination(self, obj):
        return TransactionCashDenomination.objects.filter(transaction=obj).values('currency__currency','quantity')
    def get_payment_detail(self, obj):
        transaciton_payment_details=TransactionPaymentDetail.objects.filter(transaction=obj)
        return TransactionPaymentDetailSerializer(transaciton_payment_details, many=True).data
    def get_transaction_type(self, obj):
        return obj.transaction_type.transaction_type if obj.transaction_type else None
    def get_created_by(self, obj):
        return {
            "id": obj.created_by.pk,
            "name": obj.created_by.name,
            "email": obj.created_by.email
        } if obj.created_by else {}
    



class DepositAndWithdrawPaymentDetailSerializer(serializers.ModelSerializer):
    bank_account=BankAccountSerializer(read_only=True)
    class Meta:
        model = DepositWithdrawHistoryPaymentDetail
        fields = ['id', 'bank_account', 'amount']


class DepositAndWithdrawHistorySerializer(serializers.ModelSerializer):
    cash_dinomination=serializers.SerializerMethodField()
    payment_detail=serializers.SerializerMethodField()
    created_by=serializers.SerializerMethodField()
    class Meta:
        model = DepositWithdrawHistory
        fields = ['id', 'date','created_at', 'remark', 'type','created_by','cash_dinomination','payment_detail']
    def get_cash_dinomination(self, obj):
        return DepositWithdrawHistoryCashDenomination.objects.filter(deposit_withdraw_history=obj).values('currency__currency','quantity')
    def get_payment_detail(self, obj):
        history_payment_details=DepositWithdrawHistoryPaymentDetail.objects.filter(deposit_withdraw_history=obj)
        return DepositAndWithdrawPaymentDetailSerializer(history_payment_details, many=True).data
    def get_created_by(self, obj):
        return {
            "id": obj.created_by.pk,
            "name": obj.created_by.name,
            "email": obj.created_by.email
            } if obj.created_by else {}
