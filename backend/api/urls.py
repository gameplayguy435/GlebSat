from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import LoginView, RegisterView, NewsArticleView

urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('newsarticle', NewsArticleView.as_view(), name='newsarticle'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
