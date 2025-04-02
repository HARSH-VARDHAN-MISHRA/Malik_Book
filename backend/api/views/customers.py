from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .auth import token_validator
from api.models import Customer,Transaction
from django.db import transaction
from django.forms import model_to_dict
from django.db.models import Q
import math

@api_view(["POST"])
@token_validator
def add_customer(request):
    try:
        data=request.data
        name=data.get('name',None)
        email=data.get('email',None)
        phone=data.get('phone',None)
        address=data.get('address',None)
        if not name:
            return Response({"status":0,'message':"name is required"},status=status.HTTP_400_BAD_REQUEST)
        if not phone or len(phone)<10:
            return Response({"status":0,'message':"valid phone number is required"},status=status.HTTP_400_BAD_REQUEST)
        if Customer.objects.filter(phone=phone).exists():
            return Response({"status":0,'message':"Customer with this phone number already exists"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            customer=Customer(name=name,email=email,phone=phone,address=address)
            customer.save()
        return Response({"status":1,'message':"Customer added successfully","data":model_to_dict(customer)},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def update_customer(request):
    try:
        data=request.data
        customer_pk=data.get('customer_pk',0)
        customer=Customer.objects.filter(pk=customer_pk).first()
        if not customer:
            return Response({"status":0,'message':"invalid customer_pk"},status=status.HTTP_400_BAD_REQUEST)
        name=data.get('name',None)
        email=data.get('email',None)
        phone=data.get('phone',None)
        address=data.get('address',None)
        if not name:
            return Response({"status":0,'message':"name is required"},status=status.HTTP_400_BAD_REQUEST)
        if not phone or len(phone)<10:
            return Response({"status":0,'message':"valid phone number is required"},status=status.HTTP_400_BAD_REQUEST)
        if Customer.objects.filter(phone=phone).exclude(pk=customer_pk).exists():
            return Response({"status":0,'message':"Customer with this phone number already exists"},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            customer.name=name
            customer.email=email
            customer.phone=phone
            customer.address=address
            customer.save()
        return Response({"status":1,'message':"Customer updated successfully","data":model_to_dict(customer)},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["DELETE"])
@token_validator
def delete_customer(request):
    try:
        data=request.data
        customer_pk=data.get('customer_pk',0)
        customer=Customer.objects.filter(pk=customer_pk).first()
        if not customer:
            return Response({"status":0,'message':"invalid customer_pk"},status=status.HTTP_400_BAD_REQUEST)
        if Transaction.objects.filter(customer=customer).exists():
            return Response({"status":0,'message':"Customer has transactions, cannot delete"},status=status.HTTP_400_BAD_REQUEST)
        customer.delete()
        return Response({"status":1,'message':"Customer deleted successfully"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@token_validator
def get_customers(request):
    try:
        data=request.data
        search=data.get('search',None)
        page_number=data.get('page_number',1)
        page_size=data.get('page_size',10)
        all_customers=Customer.objects.all()
        if search:
            q_objects=Q()
            search_query=search.split()
            for query in search_query:
                q_objects &= Q(name__icontains=query) | Q(phone__icontains=query) | Q(email__icontains=query) | Q(address__icontains=query)
            all_customers=all_customers.filter(q_objects)
        total_rows=all_customers.count()
        total_pages=math.ceil(total_rows/page_size)
        starting=(page_number-1)*page_size
        ending=starting+page_size
        customers=list(all_customers[starting:ending].values())
        return Response({"status":1,"data":customers,"total_pages":total_pages,"total_rows":total_rows},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@token_validator
def get_customer_detail(request):
    try:
        pass
    except Exception as e:
        return Response({"status":0,'message':str(e)},status=status.HTTP_400_BAD_REQUEST)

