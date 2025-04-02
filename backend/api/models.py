from django.db import models
from django.utils import timezone
from itertools import chain

class Token(models.Model):
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    user_id = models.IntegerField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return self.token

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.name
    
class NewsArticle(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    summary = models.CharField(max_length=200, null=True, blank=True)
    content = models.TextField()
    published_date = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    active = models.BooleanField(default=True)
    pinned = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return self.title
    
    def GetImages(self):
        return Image.objects.filter(news_article=self, active=True) or []
    
    def GetFrontImage(self):
        images = self.GetImages()
        return images[0] if images else None
    
    @classmethod
    def GetTopArticles(cls, limit=4):
        pinnedArticles = cls.objects.filter(pinned=True, active=True)
        if pinnedArticles.count() > limit:
            return pinnedArticles[:limit]
        
        pinnedCount = pinnedArticles.count()
        recentArticles = cls.objects.filter(
            pinned=False, active=True
        ).order_by('-published_date')[:limit - pinnedCount]
        
        return list(chain(pinnedArticles, recentArticles)) or []

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    
    def __str__(self) -> str:
        return self.name

class Image(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    news_article = models.ForeignKey(NewsArticle, on_delete=models.SET_NULL, null=True)
    active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name
    
class ImageHash(models.Model):
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    hash = models.CharField(max_length=32, unique=True)
