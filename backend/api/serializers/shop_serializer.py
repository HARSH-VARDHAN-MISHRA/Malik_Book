from rest_framework import serializers
from api.models import Shop,BankAccount,ShopCash,Currency



class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'


class ShopCashSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    class Meta:
        model = ShopCash
        fields = ['id', 'currency', 'quantity'] 

class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = '__all__'

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