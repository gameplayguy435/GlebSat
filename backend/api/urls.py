from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    
    path('newsarticle', NewsArticleView.as_view(), name='newsarticle'),
    path('newsarticle/<int:news_article_id>', GetNewsArticleView.as_view(), name='newsarticle_get'),
    path('newsarticle/create', CreateNewsArticleView.as_view(), name='newsarticle_create'),
    path('newsarticle/update/<int:news_article_id>', UpdateNewsArticleView.as_view(), name='newsarticle_update'),
    
    path('category', CategoryView.as_view(), name='category'),
    path('image', ImageView.as_view(), name='image'),
    path('image/article/<int:news_article_id>', GetNewsArticleImagesView.as_view()),
    path('image/create', CreateImageView.as_view(), name='image_create'),
    path('image/update/<int:image_id>', UpdateImageView.as_view(), name='image_update'),
    
    path('contact', ContactView.as_view(), name='contact'),
    
    path('mission', MissionView.as_view(), name='mission'),
    path('mission/create', CreateMissionView.as_view(), name='mission_create'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
