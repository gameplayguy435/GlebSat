from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import LoginView, RegisterView, NewsArticleView, CreateNewsArticleView, CategoryView, ImageView, CreateImageView, UpdateImageView

urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('newsarticle', NewsArticleView.as_view(), name='newsarticle'),
    path('newsarticle/create', CreateNewsArticleView.as_view(), name='newsarticle_create'),
    path('category', CategoryView.as_view(), name='category'),
    path('image', ImageView.as_view(), name='image'),
    path('image/create', CreateImageView.as_view(), name='image_create'),
    path('image/update/<int:image_id>', UpdateImageView.as_view(), name='image_update'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
