from django.contrib import admin
from .models import User, Token, NewsArticle, Category, Image

admin.site.register(User)
admin.site.register(Token)
admin.site.register(NewsArticle)
admin.site.register(Category)
admin.site.register(Image)

