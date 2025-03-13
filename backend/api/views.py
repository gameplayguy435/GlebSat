from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, Token, NewsArticle
from .serializers import UserSerializer, TokenSerializer, NewsArticleSerializer

SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"
URL = "http://localhost:5173"

class LoginView(APIView):
    def post(self, request, format=None):
        email = request.data['email']
        password = request.data['password']
        hashed_password = make_password(password=password, salt=SALT)
        try:
            user = User.objects.get(email=email)
            if user.password != hashed_password:
                return Response(
                    {
                        'success': False,
                        'message': 'Login inválido'
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        'success': True,
                        'message': 'Login efetuado com sucesso!',
                    },
                    status=status.HTTP_200_OK,
                )
        except User.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Login inválido'
                },
                status=status.HTTP_200_OK,
            )
            
class RegisterView(APIView):
    def post(self, request, format=None):
        request.data['password'] = make_password(password=request.data['password'], salt=SALT)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'success': True,
                    'message': 'Utilizador criado com sucesso!',
                },
                status=status.HTTP_200_OK,
            )
        else:
            message = ""
            for key in serializer.errors:
                message += serializer.errors[key][0]
            return Response(
                {
                    'success': False,
                    'message': message,
                },
                status=status.HTTP_200_OK,
            )

class NewsArticleView(APIView):
    def get(self, request, format=None):
        try:
            news_articles = NewsArticle.objects.all()
            serializer = NewsArticleSerializer(news_articles, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Notícias obtidas com sucesso!',
                    'news_articles': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except NewsArticle.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Notícias não encontradas!',
                },
                status=status.HTTP_200_OK,
            )