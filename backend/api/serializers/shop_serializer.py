from rest_framework import serializers
from api.models import Shop,BankAccount,ShopCash,Currency,Transaction,TransactionCashDenomination,TransactionPaymentDetail,TransactionType,Customer



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
    class Meta:
        model = Transaction
        fields = ['id', 'date', 'customer', 'shop', 'transaction_type', 'remark','cash_denomination','payment_detail','created_at']
    def get_cash_denomination(self, obj):
        return TransactionCashDenomination.objects.filter(transaction=obj).values('currency__currency','quantity')
    def get_payment_detail(self, obj):
        transaciton_payment_details=TransactionPaymentDetail.objects.filter(transaction=obj)
        return TransactionPaymentDetailSerializer(transaciton_payment_details, many=True).data
    def get_transaction_type(self, obj):
        return obj.transaction_type.transaction_type if obj.transaction_type else None