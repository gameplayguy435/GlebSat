from django.db import models
from django.utils import timezone
from itertools import chain

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    reset_token = models.CharField(max_length=255, null=True, blank=True)
    reset_token_expiry = models.DateTimeField(null=True, blank=True)
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
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    news_article = models.ForeignKey(NewsArticle, on_delete=models.SET_NULL, null=True)
    active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name

class ImageHash(models.Model):
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    hash = models.CharField(max_length=32, unique=True)

class Mission(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    is_realtime = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name

class Record(models.Model):
    id = models.AutoField(primary_key=True)
    data = models.JSONField()
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.data}"