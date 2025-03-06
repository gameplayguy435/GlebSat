from rest_framework import serializers
from .models import User, Token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'created_at', 'updated_at']

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['token', 'created_at', 'expires_at', 'user_id', 'is_used' ]