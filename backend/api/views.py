import hashlib
from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import User, Token, NewsArticle, Category, Image, ImageHash
from .serializers import UserSerializer, TokenSerializer, NewsArticleSerializer, CategorySerializer, ImageSerializer

SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"
URL = "http://localhost:5173"

class LoginView(APIView):
    def post(self, request, format=None):
        email = request.data['email']
        password = request.data['password']
        hashed_password = make_password(password=password, salt=SALT)
        try:
            user = User.objects.get(email=email)
            if user.password != hashed_password:
                return Response(
                    {
                        'success': False,
                        'message': 'Login inválido'
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        'success': True,
                        'message': 'Login efetuado com sucesso!',
                    },
                    status=status.HTTP_200_OK,
                )
        except User.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Login inválido'
                },
                status=status.HTTP_200_OK,
            )
            
class RegisterView(APIView):
    def post(self, request, format=None):
        request.data['password'] = make_password(password=request.data['password'], salt=SALT)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'success': True,
                    'message': 'Utilizador criado com sucesso!',
                },
                status=status.HTTP_200_OK,
            )
        else:
            message = ""
            for key in serializer.errors:
                message += serializer.errors[key][0]
            return Response(
                {
                    'success': False,
                    'message': message,
                },
                status=status.HTTP_200_OK,
            )

class NewsArticleView(APIView):
    def get(self, request, format=None):
        try:
            news_articles = NewsArticle.objects.all()
            serializer = NewsArticleSerializer(news_articles, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Notícias obtidas com sucesso!',
                    'news_articles': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except NewsArticle.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Notícias não encontradas!',
                },
                status=status.HTTP_200_OK,
            )
            
class CreateNewsArticleView(APIView):
    def get(self, request, format=None):
        serializer = NewsArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'success': True,
                    'message': 'Notícia criada com sucesso!',
                },
                status=status.HTTP_200_OK,
            )
        else:
            message = ""
            for key in serializer.errors:
                message += serializer.errors[key][0]
            return Response(
                {
                    'success': False,
                    'message': message,
                },
                status=status.HTTP_200_OK,
            )
            
class CategoryView(APIView):
    def get(self, request, format=None):
        try:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Categorias obtidas com sucesso!',
                    'categories': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Category.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Categorias não encontradas!',
                },
                status=status.HTTP_200_OK,
            )

class ImageDuplicationHandlerMixin:
    def calculate_file_hash(self, file):
        md5 = hashlib.md5()
        for chunk in file.chunks():
            md5.update(chunk)
        file.seek(0)
        return md5.hexdigest()
    
    def find_duplicate_image(self, file_hash):
        try:
            image_hash = ImageHash.objects.get(hash=file_hash)
            return image_hash.image
        except ImageHash.DoesNotExist:
            return None
        
    def store_image_hash(self, image, file_hash):
        ImageHash.objects.create(image=image, hash=file_hash)
        
    def process_image_file(self, request):
        if 'image' in request.FILES:
            uploaded_file = request.FILES['image']
            file_hash = self.calculate_file_hash(uploaded_file)
            existing_image = self.find_duplicate_image(file_hash)
            
            if existing_image:
                request.data._mutable = True
                request.data['image'] = existing_image.image
                request.data._mutable = False
                return True, file_hash, existing_image
            return True, file_hash, None
        
        return False, None, None

class ImageView(APIView):
    def get(self, request, format=None):
        try:
            categories = Image.objects.all()
            serializer = ImageSerializer(categories, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Imagens obtidas com sucesso!',
                    'images': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Image.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Imagens não encontradas!',
                },
                status=status.HTTP_200_OK,
            )
            
class CreateImageView(APIView, ImageDuplicationHandlerMixin):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, format=None):
        has_image, file_hash, existing_image = self.process_image_file(request)
        
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.save()
            
            if has_image and file_hash and not existing_image:
                self.store_image_hash(image, file_hash)
            
            images = Image.objects.all()
            imagesSerializer = ImageSerializer(images, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Imagem inserida com sucesso!',
                    'images': imagesSerializer.data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            message = ""
            for key in serializer.errors:
                message += serializer.errors[key][0]
            return Response(
                {
                    'success': False,
                    'message': message,
                },
                status=status.HTTP_200_OK,
            )
            
class UpdateImageView(APIView, ImageDuplicationHandlerMixin):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, image_id, format=None):
        try:
            image = Image.objects.get(id=image_id)
            
            has_image, file_hash, existing_image = self.process_image_file(request)
            
            if 'image' not in request.FILES:
                data = request.data.dict() if hasattr(request.data, 'dict') else request.data.copy()
                if 'image' in data:
                    data.pop('image')
                serializer = ImageSerializer(image, data=data, partial=True)
            else:
                serializer = ImageSerializer(image, data=request.data)
                
            if serializer.is_valid():
                updated_image = serializer.save()
                
                if has_image and file_hash and not existing_image:
                    self.store_image_hash(updated_image, file_hash)
                
                images = Image.objects.all()
                imagesSerializer = ImageSerializer(images, many=True)
                return Response(
                    {
                        'success': True,
                        'message': 'Imagem atualizada com sucesso!',
                        'images': imagesSerializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                message = ""
                for key in serializer.errors:
                    message += serializer.errors[key][0]
                return Response(
                    {
                        'success': False,
                        'message': message,
                    },
                    status=status.HTTP_200_OK,
                )
        except Image.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Imagem não encontrada!',
                },
                status=status.HTTP_404_NOT_FOUND,
            )