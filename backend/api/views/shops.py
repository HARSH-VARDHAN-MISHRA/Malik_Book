from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .auth import token_validator
from api.models import Shop,Transaction
from api.serializers import shop_serializer
from django.db import transaction
from django.db.models import Q


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
    
@api_view(["POST"])
@token_validator
def get_transactions(request):
    try:
        data=request.data
        search=data.get('search',None)
        page_number=data.get('page_number',1)
        page_size=data.get('page_size',25)
        shop_pk=data.get('shop_pk',0)
        selected_customer_pks=data.get('selected_customer_pks',[])
        selected_transaction_type=data.get('selected_transaction_type',[])
        starting_date=data.get('starting_date',None)
        ending_date=data.get('ending_date',None)
        current_shop=Shop.objects.filter(pk=shop_pk).first()
        if not current_shop:
            return Response({"status":0,'message':"invalid shop_pk"},status=status.HTTP_400_BAD_REQUEST)
        if str(request.current_user.role).strip().lower()!="admin":
            if request.current_user.shop != current_shop:
                return Response({"status":0,'message':"You can not access this shop"},status=status.HTTP_400_BAD_REQUEST)
        all_transactions=Transaction.objects.filter(shop=current_shop)
        if search:
            search_query=search.split()
            q_objects=Q()
            for query in search_query:
                q_objects &= Q(transaction_id__icontains=query) | Q(customer__name__icontains=query) | Q(customer__phone__icontains=query) | Q(customer__address__icontains=query) | Q(customer__email__icontains=query)  | Q(remark__icontains=query)
            all_transactions=all_transactions.filter(q_objects)
        
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)

