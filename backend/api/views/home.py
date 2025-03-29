from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(["POST","GET","DELETE","PUT","PATCH"])
def home_view(request):
    return Response({"message": "you are welcomed but this is not a valid endpoint"}, status=status.HTTP_200_OK)