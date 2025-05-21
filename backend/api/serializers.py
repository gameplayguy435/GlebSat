from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'created_at', 'updated_at']
        
class NewsArticleSerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField()
    
    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'summary', 'content', 'published_date', 'author', 'active', 'pinned', 'main_image']
        
    def get_main_image(self, obj):
        frontImage =  obj.GetFrontImage()
        if frontImage:
            return frontImage.image.url
        return None
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'name', 'image', 'category', 'news_article', 'active']

class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = ['id', 'name', 'start_date', 'end_date', 'duration', 'is_realtime']