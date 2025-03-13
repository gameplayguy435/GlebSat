from rest_framework import serializers
from .models import User, Token, NewsArticle

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'created_at', 'updated_at']

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['token', 'created_at', 'expires_at', 'user_id', 'is_used' ]
        
class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = ['title', 'summary', 'content', 'published_date', 'author']