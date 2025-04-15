from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .auth import token_validator
from api.models import Shop,Transaction,Currency,BankAccount,TransactionType,Customer,ShopCash,TransactionCashDenomination,TransactionPaymentDetail,DepositWithdrawHistory,DepositWithdrawHistoryCashDenomination,DepositWithdrawHistoryPaymentDetail,User , DailyBalance,ServiceType,Service,ServicePayment,ServiceCashDinomination
from django.utils import timezone
from api.serializers import shop_serializer
from django.db import transaction
from django.db.models import Q
from django.forms import model_to_dict
import math


@api_view(["GET"])
@token_validator
def get_all_shops(request):
    try:
        if str(request.current_user.role).strip().lower()!="admin":
            return Response({"status":0,'message':"Only Admin can access all shops"},status=status.HTTP_400_BAD_REQUEST)
        shops=Shop.objects.all()
        serialized_shops=shop_serializer.ShopSerializer(shops,many=True).data
        return Response({"status":1,'data':serialized_shops},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def add_shop(request):
    try:
        if str(request.current_user.role).strip().lower()!="admin":
            return Response({"status":0,'message':"Only Admin can add shop"},status=status.HTTP_400_BAD_REQUEST)
        data=request.data
        name=data.get('name',None)
        address=data.get('address',None)
        contact_number=data.get('contact_number',None)
        if not name or len(name)<3:
            return Response({"status":0,'message':"Please enter valid shop name"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            shop=Shop(name=name,address=address,contact_number=contact_number)
            shop.save()
        return Response({"status":1,'message':"Shop added successfully"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def add_bank_account(request):
    try:
        data=request.data
        shop_pk=data.get('shop_pk',0)
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin" and request.current_user.shop != current_shop:
            return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        bank_name=data.get('bank_name',None)
        account_name=data.get('account_name',None)
        account_number=data.get('account_number',None)
        balance=data.get('balance',0.00)
        ifsc_code=data.get('ifsc_code',None)
        if not bank_name or len(bank_name)<3:
            return Response({"status":0,'message':"Please enter valid bank name"},status=status.HTTP_400_BAD_REQUEST)
        if not account_name or len(account_name)<3:
            return Response({"status":0,'message':"Please enter valid account name"},status=status.HTTP_400_BAD_REQUEST)
        if not account_number or len(account_number)<10:
            return Response({"status":0,'message':"Please enter valid account number"},status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            bank_account=BankAccount(shop=current_shop,bank_name=bank_name,account_name=account_name,account_number=account_number,ifsc_code=ifsc_code,balance=balance)
            bank_account.save()
        return Response({"status":1,'message':"Bank account added successfully"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@token_validator
def get_shop_detail(request):
    try:
        data=request.GET
        current_user=request.current_user
        shop_pk=data.get('shop_pk',0)
        shop=Shop.objects.filter(pk=shop_pk).first()
        if not shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(current_user.role).strip().lower()!="admin":
            if current_user.shop != shop:
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        serialized_shop=shop_serializer.ShopSerializer(shop).data
        return Response({"status":1,'data':serialized_shop},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    





# transacitons

@api_view(["POST"])
@token_validator
def make_payment(request):
    try:
        data=request.data
        shop_pk=data.get('shop_pk',0)
        transaction_type="pay"
        current_transaction_type=TransactionType.objects.filter(transaction_type__iexact=transaction_type).first()
        if not current_transaction_type:
            return Response({"status":0,'message':"invalid transaction type"},status=status.HTTP_400_BAD_REQUEST)
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        customer_pk=data.get('customer_pk',0)
        customer=Customer.objects.filter(pk=customer_pk).first()
        if not customer:
            return Response({"status":0,'message':"invalid customer_pk"},status=status.HTTP_400_BAD_REQUEST)
        remark=data.get('remark',None)
        cash_denomination=data.get('cash_denomination',[])
        payment_details=data.get('payment_details',[])
        if not cash_denomination and not payment_details:
            return Response({"status":0,'message':"cash_denomination or payment_details is required"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin":
            if request.current_user.shop != current_shop:
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            transaction_data=Transaction(
                shop=current_shop,
                customer=customer,
                transaction_type=current_transaction_type,
                created_by=request.current_user,
                remark=remark
            )
            transaction_data.save()
            if cash_denomination:
                for cash in cash_denomination:
                    cash_pk=cash.get('cash_pk',0)
                    quantity=cash.get('quantity',0)
                    if quantity<=0:
                        raise Exception("quantity should be greater than 0 in cash_denomination")
                    current_cash_object=ShopCash.objects.filter(pk=cash_pk).first()
                    if not current_cash_object:
                        raise Exception(f"invalid cash_pk =>  {cash_pk}  in cash_denomination")
                    if current_cash_object.quantity<quantity:
                        raise Exception(f"only {current_cash_object.quantity} available for cash_pk =>  {cash_pk} ")
                    cash_denomination_object=TransactionCashDenomination(
                        transaction=transaction_data,
                        currency=current_cash_object.currency,
                        quantity=quantity
                    )
                    cash_denomination_object.save()
                    current_cash_object.quantity-=quantity
                    current_cash_object.save()
            if payment_details:
                for payment in payment_details:
                    bank_account_pk=payment.get('bank_account_pk',0)
                    amount=payment.get('amount',0)
                    if amount<=0:
                        raise Exception("amount should be greater than 0 in payment_details")
                    current_bank_account=BankAccount.objects.filter(pk=bank_account_pk).first()
                    if not current_bank_account:
                        raise Exception( f"invalid bank_account_pk =>  {bank_account_pk}  in payment_details")
                    if current_bank_account.shop != current_shop:
                        raise Exception(f"bank_account_pk =>  {bank_account_pk} does not belong to this shop")
                    if current_bank_account.balance<amount:
                        raise Exception(f"amount is greater than available balance for bank_account_pk =>  {bank_account_pk} ")
                    payment_detail_object=TransactionPaymentDetail(
                        transaction=transaction_data,
                        bank_account=current_bank_account,
                        amount=amount
                    )
                    payment_detail_object.save()
                    current_bank_account.balance-=amount
                    current_bank_account.save()
            return Response({"status":1,'message':"Payment successful"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@token_validator
def receive_payment(request):
    try:
        data=request.data
        shop_pk=data.get('shop_pk',0)
        transaction_type="receive"
        current_transaction_type=TransactionType.objects.filter(transaction_type__iexact=transaction_type).first()
        if not current_transaction_type:
            return Response({"status":0,'message':"invalid transaction type"},status=status.HTTP_400_BAD_REQUEST)
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        customer_pk=data.get('customer_pk',0)
        customer=Customer.objects.filter(pk=customer_pk).first()
        if not customer:
            return Response({"status":0,'message':"invalid customer_pk"},status=status.HTTP_400_BAD_REQUEST)
        remark=data.get('remark',None)
        cash_denomination=data.get('cash_denomination',[])
        payment_details=data.get('payment_details',[])
        if not cash_denomination and not payment_details:
            return Response({"status":0,'message':"cash_denomination or payment_details is required"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin":
            if request.current_user.shop != current_shop:
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            transaction_data=Transaction(
                shop=current_shop,
                customer=customer,
                transaction_type=current_transaction_type,
                created_by=request.current_user,
                remark=remark
            )
            transaction_data.save()
            if cash_denomination:
                for cash in cash_denomination:
                    cash_pk=cash.get('cash_pk',0)
                    quantity=cash.get('quantity',0)
                    if quantity<=0:
                        raise Exception("quantity should be greater than 0 in cash_denomination")
                    current_cash_object=ShopCash.objects.filter(pk=cash_pk).first()
                    if not current_cash_object:
                        raise Exception(f"invalid cash_pk =>  {cash_pk}  in cash_denomination")
                    cash_denomination_object=TransactionCashDenomination(
                        transaction=transaction_data,
                        currency=current_cash_object.currency,
                        quantity=quantity
                    )
                    cash_denomination_object.save()
                    current_cash_object.quantity+=quantity
                    current_cash_object.save()
            if payment_details:
                for payment in payment_details:
                    bank_account_pk=payment.get('bank_account_pk',0)
                    amount=payment.get('amount',0)
                    if amount<=0:
                        raise Exception("amount should be greater than 0 in payment_details")
                    current_bank_account=BankAccount.objects.filter(pk=bank_account_pk).first()
                    if not current_bank_account:
                        raise Exception( f"invalid bank_account_pk =>  {bank_account_pk}  in payment_details")
                    if current_bank_account.shop != current_shop:
                        raise Exception(f"bank_account_pk =>  {bank_account_pk} does not belong to this shop")
                    payment_detail_object=TransactionPaymentDetail(
                        transaction=transaction_data,
                        bank_account=current_bank_account,
                        amount=amount
                        )
                    payment_detail_object.save()
                    current_bank_account.balance+=amount
                    current_bank_account.save()
            return Response({"status":1,'message':"Payment successful"},status=status.HTTP_200_OK)
    except Exception as e:  
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def get_transactions(request):
    try:
        data=request.data
        # print(data)
        search=data.get('search',None)
        page_number=data.get('page_number',1)
        page_size=data.get('page_size',25)
        shop_pk=data.get('shop_pk',0)
        selected_customer_pks=data.get('selected_customer_pks',[])
        selected_transaction_type=data.get('selected_transaction_type',[])
        starting_date=data.get('starting_date',None)
        ending_date=data.get('ending_date',None)
        selected_user_pks=data.get('selected_user_pks',[])
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin":
            if request.current_user.shop != current_shop:
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        all_transactions=Transaction.objects.filter(shop=current_shop).order_by('-id')
        if search:
            search_query=search.split()
            q_objects=Q()
            for query in search_query:
                q_objects &= Q(customer__name__icontains=query) | Q(customer__phone__icontains=query) | Q(customer__address__icontains=query) | Q(customer__email__icontains=query)  | Q(remark__icontains=query)
            all_transactions=all_transactions.filter(q_objects)
        total_rows=all_transactions.count()
        total_pages=math.ceil(total_rows/page_size)
        starting=(page_number-1)*page_size
        ending=starting+page_size
        if selected_customer_pks:
            all_transactions=all_transactions.filter(customer__pk__in=selected_customer_pks)
        if selected_transaction_type:
            all_transactions=all_transactions.filter(transaction_type__transaction_type__in=selected_transaction_type)
        if starting_date and ending_date:
            if starting_date == ending_date:
                all_transactions=all_transactions.filter(date__icontains=starting_date)
            else:
                all_transactions=all_transactions.filter(date__range=[starting_date,ending_date])
        if selected_user_pks:
            all_transactions=all_transactions.filter(created_by__pk__in=selected_user_pks)
                
        serialized_transacitons=shop_serializer.TransactionSerializer(all_transactions[starting:ending],many=True).data
        return Response({"status":1,'transactions':serialized_transacitons,'total_pages':total_pages,'page_number':page_number,'total_rows':total_rows},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def get_deposit_and_withdraw_history(request):
    try:
        data=request.data
        print(data)
        search=data.get('search',None)
        page_number=data.get('page_number',1)
        page_size=data.get('page_size',25)
        shop_pk=data.get('shop_pk',0)
        selected_type=data.get('selected_type',[])
        starting_date=data.get('starting_date',None)
        ending_date=data.get('ending_date',None)
        selected_user_pks=data.get('selected_user_pks',[])
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin" and request.current_user.shop != current_shop:
            return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        all_history=DepositWithdrawHistory.objects.filter(shop=current_shop).order_by('-id')
        if search:
            search_query=search.split()
            q_objects=Q()
            for query in search_query:
                q_objects &= Q(remark__icontains=query) 
            all_history=all_history.filter(q_objects)
        total_rows=all_history.count()
        total_pages=math.ceil(total_rows/page_size)
        starting=(page_number-1)*page_size
        ending=starting+page_size

        if selected_type:
            all_history=all_history.filter(type__in=selected_type)
        if starting_date and ending_date:
            if starting_date == ending_date:
                all_history=all_history.filter(date__icontains=starting_date)
            else:
                all_history=all_history.filter(date__range=[starting_date,ending_date])
        if selected_user_pks:
            all_history=all_history.filter(created_by__pk__in=selected_user_pks)
                
        serialized_history=shop_serializer.DepositAndWithdrawHistorySerializer(all_history[starting:ending],many=True).data
        return Response({"status":1,'data':serialized_history,'total_pages':total_pages,'page_number':page_number,'total_rows':total_rows},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)







# helpers 
@api_view(["GET"])
@token_validator
def get_currencies(request):
    try:
        currencies=Currency.objects.all()
        serialized_currencies=shop_serializer.CurrencySerializer(currencies,many=True).data
        return Response({"status":1,'data':serialized_currencies},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@token_validator
def get_bank_accounts(request):
    try:
        data=request.GET
        shop_pk=data.get('shop_pk',0)
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        bank_accounts=BankAccount.objects.filter(shop=current_shop)
        serialized_accounts=shop_serializer.BankAccountSerializer(bank_accounts,many=True).data
        return Response({"status":1,'data':serialized_accounts},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET"])
@token_validator
def get_transaction_types(request):
    try:
        transaction_types=list(TransactionType.objects.all().values())
        return Response({"status":1,'data':transaction_types},status=status.HTTP_200_OK) 
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def deposit_balance(request):
    try:
        data=request.data
        shop_pk=data.get('shop_pk',0)
        remark=data.get('remark','')
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin" and request.current_user.shop != current_shop :
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        cash_denomination=data.get('cash_denomination',[])
        payment_details=data.get('payment_details',[])
        if not cash_denomination and not payment_details:
            return Response({"status":0,'message':"cash_denomination or payment_details is required"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            deposit_withdraw_history=DepositWithdrawHistory(
                shop=current_shop,
                type="deposit",
                created_by=request.current_user,
                remark=remark
            )
            deposit_withdraw_history.save()
            if cash_denomination:
                for cash in cash_denomination:
                    cash_pk=cash.get('cash_pk',0)
                    quantity=cash.get('quantity',0)
                    if quantity<=0:
                        raise Exception("quantity should be greater than 0 in cash_denomination")
                    current_cash_object=ShopCash.objects.filter(pk=cash_pk).first()
                    if not current_cash_object:
                        raise Exception(f"invalid cash_pk =>  {cash_pk}  in cash_denomination")
                    cash_denomination_object=DepositWithdrawHistoryCashDenomination(
                        deposit_withdraw_history=deposit_withdraw_history,
                        currency=current_cash_object.currency,
                        quantity=quantity
                    )
                    cash_denomination_object.save()
                    current_cash_object.quantity+=quantity
                    current_cash_object.save()
            if payment_details:
                for payment in payment_details:
                    bank_account_pk=payment.get('bank_account_pk',0)
                    amount=payment.get('amount',0)
                    if amount<=0:
                        raise Exception("amount should be greater than 0 in payment_details")
                    current_bank_account=BankAccount.objects.filter(pk=bank_account_pk).first()
                    if not current_bank_account:
                        raise Exception( f"invalid bank_account_pk =>  {bank_account_pk}  in payment_details")
                    if current_bank_account.shop != current_shop:
                        raise Exception(f"bank_account_pk =>  {bank_account_pk} does not belong to this shop")
                    payment_detail_object=DepositWithdrawHistoryPaymentDetail(
                        deposit_withdraw_history=deposit_withdraw_history,
                        bank_account=current_bank_account,
                        amount=amount
                        )
                    payment_detail_object.save()
                    current_bank_account.balance+=amount
                    current_bank_account.save()
        return Response({"status":1,'message':"Balance deposited successfully"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def withdraw_balance(request):
    try:
        data=request.data
        shop_pk=data.get('shop_pk',0)
        remark=data.get('remark','')
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin" and request.current_user.shop != current_shop :
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        cash_denomination=data.get('cash_denomination',[])
        payment_details=data.get('payment_details',[])
        if not cash_denomination and not payment_details:
            return Response({"status":0,'message':"cash_denomination or payment_details is required"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            deposit_withdraw_history=DepositWithdrawHistory(
                shop=current_shop,
                type="withdraw",
                created_by=request.current_user,
                remark=remark
            )
            deposit_withdraw_history.save()
            for cash in cash_denomination:
                cash_pk=cash.get('cash_pk',0)
                quantity=cash.get('quantity',0)
                if quantity<=0:
                    raise Exception("quantity should be greater than 0 in cash_denomination")
                current_cash_object=ShopCash.objects.filter(pk=cash_pk).first()
                if not current_cash_object:
                    raise Exception(f"invalid cash_pk =>  {cash_pk}  in cash_denomination")
                if current_cash_object.quantity <quantity:
                    raise Exception(f"not enough quantity of cash =>  {cash_pk}  in cash_denomination")
                cash_denomination_object=DepositWithdrawHistoryCashDenomination(
                    deposit_withdraw_history=deposit_withdraw_history,
                    currency=current_cash_object.currency,
                    quantity=quantity
                )
                cash_denomination_object.save()
                current_cash_object.quantity-=quantity
                current_cash_object.save()
            for payment in payment_details:
                bank_account_pk=payment.get('bank_account_pk',0)
                amount=payment.get('amount',0)
                if amount<=0:
                    raise Exception("amount should be greater than 0 in payment_details")
                current_bank_account=BankAccount.objects.filter(pk=bank_account_pk).first()
                if not current_bank_account:
                    raise Exception( f"invalid bank_account_pk =>  {bank_account_pk}  in payment_details")
                if current_bank_account.shop != current_shop:
                    raise Exception(f"bank_account_pk =>  {bank_account_pk} does not belong to this shop")
                if current_bank_account.balance < amount:
                    raise Exception(f"not enough balance in bank_account_pk =>  {bank_account_pk} in payment_details")
                payment_detail_object=DepositWithdrawHistoryPaymentDetail(
                    deposit_withdraw_history=deposit_withdraw_history,
                    bank_account=current_bank_account,
                    amount=amount
                    )
                payment_detail_object.save()
                current_bank_account.balance-=amount
                current_bank_account.save()
        return Response({"status":1,'message':"withdrawal successful"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    



@api_view(["GET"])
@token_validator
def get_shop_users(request):
    try:
        data=request.GET
        shop_pk=data.get('shop_pk',0)
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin":
            return Response({"status":0,'message':"only admin can access this data"},status=status.HTTP_400_BAD_REQUEST)
        users=User.objects.filter(shop=current_shop).exclude(role="Admin")
        return Response({"status":1,'data':list(users.values())},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    



@api_view(["POST"])
@token_validator
def get_daily_balance(request):
    try:
        data=request.data
        page_number=data.get('page_number',1)
        page_size=data.get('page_size',25)
        shop_pk=data.get('shop_pk',0)
        starting_date=data.get('starting_date',None)
        ending_date=data.get('ending_date',None)
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin":
            if request.current_user.shop != current_shop:
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        all_balance_history=DailyBalance.objects.filter(shop=current_shop).order_by('-id')
        total_rows=all_balance_history.count()
        total_pages=math.ceil(total_rows/page_size)
        starting=(page_number-1)*page_size
        ending=starting+page_size
        if starting_date and ending_date:
            if starting_date == ending_date:
                all_balance_history=all_balance_history.filter(date__icontains=starting_date)
            else:
                all_balance_history=all_balance_history.filter(date__range=[starting_date,ending_date])
        serialized_balance_history=shop_serializer.DailyBalanceSerializer(all_balance_history[starting:ending],many=True).data
        return Response({"status":1,'data':serialized_balance_history,'total_pages':total_pages,'page_number':page_number,'total_rows':total_rows},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    




@api_view(["POST"])
@token_validator
def add_service_type(request):
    try:
        data=request.data
        service_type=data.get('service_type',None)
        if not service_type:
            return Response({"status":0,'message':"service_type is required"},status=status.HTTP_400_BAD_REQUEST)
        if ServiceType.objects.filter(service_type__iexact=service_type).exists():
            return Response({"status":0,'message':"service_type already exists"},status=status.HTTP_400_BAD_REQUEST)
        new_service_type=ServiceType(service_type=service_type)
        new_service_type.save()
        return Response({"status":1,'message':"service_type added successfully","service_type":model_to_dict(new_service_type)},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@token_validator
def get_service_types(request):
    try:
        all_service_types=list(ServiceType.objects.all().values())
        return Response({"status":1,'data':all_service_types},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["POST"])
@token_validator
def update_service_type(request):
    try:
        data=request.data
        service_type_pk=data.get('service_type_pk',0)
        service_type=data.get('service_type',None)
        if not service_type:
            return Response({"status":0,'message':"service_type is required"},status=status.HTTP_400_BAD_REQUEST)
        current_service_type=ServiceType.objects.filter(pk=service_type_pk).first()
        if not current_service_type:
            return Response({"status":0,'message':"invalid service_type_pk"},status=status.HTTP_400_BAD_REQUEST)
        if ServiceType.objects.filter(service_type__iexact=service_type).exclude(pk=service_type_pk).exists():
            return Response({"status":0,'message':"service_type already exists"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            current_service_type.service_type=service_type
            current_service_type.save()
        return Response({"status":1,'message':"service_type updated successfully"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["POST"])
@token_validator
def add_service(request):
    try:
        data=request.data
        shop_pk=data.get('shop_pk',0)
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        service_type_pk=data.get('service_type_pk',0)
        customer_pk=data.get('customer_pk',0)
        note=data.get('note','')
        cash_denomination=data.get('cash_denomination',[])
        payment_details=data.get('payment_details',[])
        if not cash_denomination and not payment_details:
            return Response({"status":0,'message':"cash_denomination or payment_details is required"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin":
            if request.current_user.shop != current_shop:
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        current_service_type=ServiceType.objects.filter(pk=service_type_pk).first()
        if not current_service_type:
            return Response({"status":0,'message':"invalid service_type_pk"},status=status.HTTP_400_BAD_REQUEST)
        current_customer=Customer.objects.filter(pk=customer_pk).first()
        if not current_customer:
            return Response({"status":0,'message':"invalid customer_pk"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            service=Service(shop=current_shop,service_type=current_service_type,note=note,customer=current_customer,created_by=request.current_user)
            service.save()
            if cash_denomination:
                for cash in cash_denomination:
                    cash_pk=cash.get('cash_pk',0)
                    quantity=cash.get('quantity',0)
                    if quantity<=0:
                        raise Exception("quantity should be greater than 0 in cash_denomination")
                    current_cash_object=ShopCash.objects.filter(pk=cash_pk).first()
                    if not current_cash_object:
                        raise Exception(f"invalid cash_pk =>  {cash_pk}  in cash_denomination")
                    cash_denomination_object=ServiceCashDinomination(
                        service=service,
                        currency=current_cash_object.currency,
                        quantity=quantity
                    )
                    cash_denomination_object.save()
                    current_cash_object.quantity+=quantity
                    current_cash_object.save()
            if payment_details:
                for payment in payment_details:
                    bank_account_pk=payment.get('bank_account_pk',0)
                    amount=payment.get('amount',0)
                    if amount<=0:
                        raise Exception("amount should be greater than 0 in payment_details")
                    current_bank_account=BankAccount.objects.filter(pk=bank_account_pk).first()
                    if not current_bank_account:
                        raise Exception( f"invalid bank_account_pk =>  {bank_account_pk}  in payment_details")
                    if current_bank_account.shop != current_shop:
                        raise Exception(f"bank_account_pk =>  {bank_account_pk} does not belong to this shop")
                    payment_detail_object=ServicePayment(
                        service=service,
                        bank_account=current_bank_account,
                        amount=amount
                        )
                    payment_detail_object.save()
                    current_bank_account.balance+=amount
                    current_bank_account.save()
        return Response({"status":1,'message':"service added successfully"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def get_services(request):
    try:
        data=request.data
        page_number=data.get('page_number',1)
        page_size=data.get('page_size',25)
        shop_pk=data.get('shop_pk',0)
        search=data.get('search',None)
        selected_customer_pks=data.get('selected_customer_pks',[])
        selected_service_type_pks=data.get('selected_service_type_pks',[])
        starting_date=data.get('starting_date',None)
        ending_date=data.get('ending_date',None)
        selected_user_pks=data.get('selected_user_pks',[])
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            raise Exception(f"invalid shop_pk =>  {shop_pk}  in get_services")
        services=Service.objects.filter(shop=current_shop)
        if search:
            services=services.filter(note__icontains=search)
        if selected_customer_pks:
            services=services.filter(customer__pk__in=selected_customer_pks)
        if selected_service_type_pks:
            services=services.filter(service_type__pk__in=selected_service_type_pks)
        if selected_user_pks:
            services=services.filter(created_by__pk__in=selected_user_pks)
        if starting_date and ending_date:
            if starting_date == ending_date:
                services=services.filter(created_at__icontains=starting_date)
            else:
                services=services.filter(created_at__range=[starting_date,ending_date])
        total_rows=services.count()
        total_pages=math.ceil(total_rows/page_size)
        starting=(page_number-1)*page_size
        ending=starting+page_size
        serialized_serivces=shop_serializer.ServiceSerializer(services[starting:ending],many=True).data
        return Response({"status":1,'data':serialized_serivces,"total_pages":total_pages,"total_rows":total_rows},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)