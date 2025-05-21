from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(NewsArticle)
admin.site.register(Category)
admin.site.register(Image)
admin.site.register(Mission)
admin.site.register(Record)

