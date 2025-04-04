from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import User,UserToken
from rest_framework_simplejwt.tokens import RefreshToken
from functools import wraps

def token_validator(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):    
        try:

            token = request.headers.get('Authorization', None)
            if not token:
                token = request.COOKIES.get('token', None)
            if token and " " in token:
                token=token.split(' ')[1]
            current_token=UserToken.objects.filter(token=token).last()
            if not current_token:
                return Response({"status": 0, "message": "Invalid or Expired Token"}, status=status.HTTP_401_UNAUTHORIZED)
            if current_token.user.is_active==False:
                return Response({"status": 0, "message": "Your account is inactive"}, status=status.HTTP_401_UNAUTHORIZED)
            request.current_user=current_token.user
            return view_func(request, *args, **kwargs)
        except Exception as e:
            return Response({"status": 0, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return _wrapped_view


def create_token(cur_user):
    refresh = RefreshToken.for_user(cur_user)
    return str(refresh.access_token)

def get_unique_token(cur_user):
    while True:
        token = create_token(cur_user)
        if not UserToken.objects.filter(token=token).exists():
            return token

@api_view(["POST"])
def login(request):
    try:
        data=request.data
        email=data.get('email',None)
        password=data.get('password',None)
        current_user=User.objects.filter(email__iexact=email).first()
        if not current_user:
            return Response({"status":0,'message':"Email is not registered"},status=status.HTTP_400_BAD_REQUEST)
        if current_user.password!=password:
            return Response({"status":0,'message':"Invalid Password"},status=status.HTTP_400_BAD_REQUEST)
        if current_user.is_active==False:
            return Response({"status":0,'message':"Your account is inactive"},status=status.HTTP_400_BAD_REQUEST)
        cur_token=UserToken.objects.filter(user=current_user).last()
        if not cur_token:
            geted_token=get_unique_token(current_user)
            cur_token=UserToken(user=current_user,token=geted_token)
            cur_token.save()
        detail={
            "id":current_user.pk,
            "name":current_user.name,
            "email":current_user.email,
            "token":cur_token.token,
            "role":current_user.role,
            "shop_pk":current_user.shop.pk if current_user.shop else 0
        }

        response=Response({"status": 1, 'message': 'logged in success',"data":detail}, status=status.HTTP_200_OK)
        years = 1 * 365 * 24 * 60 * 60 
        response.set_cookie("token", cur_token.token, httponly=True,max_age=years,samesite="Lax",secure=False)
        return response
    except Exception as e:
        # print(e,'is exception')
        return Response({"status":0,"message":"something went wrong"},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["POST"])
def check_token_validity(request):
    try:
        token=request.headers.get('Authorization', None)
        if not token:
            token = request.COOKIES.get('token', None)
        if token and " " in token:
            token=token.split(' ')[1]
        current_token=UserToken.objects.filter(token=token).last()
        if not current_token:
            return Response({"status": 0, "message": "Invalid or Expired Token"}, status=status.HTTP_401_UNAUTHORIZED)
        if current_token.user.is_active==False:
            return Response({"status": 0, "message": "Your account is inactive"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"status": 1, "message": "Token is valid"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": 0, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)