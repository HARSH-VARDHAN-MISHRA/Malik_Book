from rest_framework import serializers
from api.models import Transaction,TransactionCashDenomination,TransactionPaymentDetail,Customer


class CustomerSerializer(serializers.ModelSerializer):
    total_received_amount = serializers.SerializerMethodField()
    total_paid_amount = serializers.SerializerMethodField()
    total_transactions = serializers.SerializerMethodField()
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone', 'address','total_received_amount','total_paid_amount','total_transactions']
    def get_total_received_amount(self, obj):
        received_transactions = Transaction.objects.filter(customer=obj,transaction_type__transaction_type__icontains='receive')
        total_received_amount = 0
        for transaction in received_transactions:
            cash_denomination = TransactionCashDenomination.objects.filter(transaction=transaction)
            payment_detail = TransactionPaymentDetail.objects.filter(transaction=transaction)
            for cash in cash_denomination:
                total_received_amount += cash.quantity * cash.currency.currency
            for payment in payment_detail:
                total_received_amount += payment.amount
        return total_received_amount
    def get_total_paid_amount(self, obj):
        paid_transactions = Transaction.objects.filter(customer=obj,transaction_type__transaction_type__icontains='pay')
        total_paid_amount = 0
        for transaction in paid_transactions:
            cash_denomination = TransactionCashDenomination.objects.filter(transaction=transaction)
            payment_detail = TransactionPaymentDetail.objects.filter(transaction=transaction)
            for cash in cash_denomination:
                total_paid_amount += cash.quantity * cash.currency.currency
            for payment in payment_detail:
                total_paid_amount += payment.amount
        return total_paid_amount
    def get_total_transactions(self, obj):
        return Transaction.objects.filter(customer=obj).count()


