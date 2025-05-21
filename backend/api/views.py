import hashlib
import requests
import secrets
import datetime
import dateutil.parser
from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.core.mail import EmailMessage
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import *
from .serializers import *

SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"
URL = "http://localhost:5173"

def verify_recaptcha(recaptcha_token):
    recaptcha_secret = '6Lf3Jg0rAAAAAAbHjR4o5pkQJzhqJNY0djK6_yzl'
    
    recaptcha_response = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data={
            'secret': recaptcha_secret,
            'response': recaptcha_token,
        }
    )
    recaptcha_result = recaptcha_response.json()
    
    if not recaptcha_result.get('success', False) or recaptcha_result.get('score', 0) < 0.5:
        return False
    
    return True

class LoginView(APIView):
    def post(self, request, format=None):
        recaptcha_token = request.data['recaptcha_token']
        
        if not verify_recaptcha(recaptcha_token):
            return Response(
                {
                    'success': False,
                    'message': 'Falha na validação do reCAPTCHA.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
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
                serializer = UserSerializer(user)
                return Response(
                    {
                        'success': True,
                        'message': 'Login efetuado com sucesso!',
                        'user': serializer.data,
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
            
class GetUserView(APIView):
    def get(self, request, user_id, format=None):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(
                {
                    'success': True,
                    'message': 'Utilizador obtido com sucesso!',
                    'user': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Utilizador não encontrado!',
                },
                status=status.HTTP_200_OK,
            )

class PasswordResetView(APIView):
    def post(self, request, format=None):
        recaptcha_token = request.data.get('recaptcha_token', '')
        
        if not verify_recaptcha(recaptcha_token):
            return Response(
                {
                    'success': False,
                    'message': 'Falha na validação do reCAPTCHA.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        email = request.data.get('email', '')
        name = request.data.get('name', '')

        if not email or not name:
            return Response(
                {
                    'success': False,
                    'message': 'Email e nome são obrigatórios.',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Verificar se o utilizador existe
            user = User.objects.get(email=email, name=name)
            
            # Gerar token de redefinição único (válido por 1 hora)
            token = secrets.token_urlsafe(32)
            expiry = datetime.datetime.now() + datetime.timedelta(hours=1)
            
            # Armazenar temporariamente o token (pode ser melhorado com um modelo dedicado)
            user.reset_token = token
            user.reset_token_expiry = expiry
            user.save()
            
            # Construir link de redefinição
            reset_link = f"{URL}/admin/reset-password?token={token}&email={email}"
            
            # Enviar email com o link
            email_message = EmailMessage(
                subject='Redefinição de Palavra-Passe GlebSat',
                body=f"""
Olá {name},

Foi solicitada a redefinição da sua palavra-passe para a conta GlebSat.
Clique na ligação abaixo para definir uma nova palavra-passe:
{reset_link}

Esta ligação é válida por 1 hora.

Se não solicitou esta redefinição, pode ignorar este email.

Atenciosamente,
Equipa GlebSat
                """,
                from_email='canpansatpat@gmail.com',
                to=[email],
            )
            email_message.send()

            return Response(
                {
                    'success': True,
                    'message': 'Instruções de redefinição enviadas para o seu email.',
                },
                status=status.HTTP_200_OK,
            )
            
        except User.DoesNotExist:
            # Por segurança, não revelar se o utilizador existe ou não
            return Response(
                {
                    'success': False,
                    'message': 'Erro ao redefinir palavra-passe.',
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Erro ao processar pedido: {str(e)}',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            
class VerifyResetTokenView(APIView):
    def post(self, request, format=None):
        token = request.data.get('token', '')
        email = request.data.get('email', '')
        
        if not token or not email:
            return Response(
                {
                    'success': False,
                    'message': 'Token e email são obrigatórios.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user = User.objects.get(email=email, reset_token=token)
            
            # Verificar se o token ainda é válido
            if not user.reset_token_expiry or user.reset_token_expiry < timezone.now():
                return Response(
                    {
                        'success': False,
                        'message': 'O token expirou. Por favor, solicite uma nova redefinição.'
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            return Response(
                {
                    'success': True,
                    'message': 'Token válido.'
                },
                status=status.HTTP_200_OK,
            )
            
        except User.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Token inválido.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

class CompleteResetPasswordView(APIView):
    def post(self, request, format=None):
        recaptcha_token = request.data.get('recaptcha_token', '')
        
        if not verify_recaptcha(recaptcha_token):
            return Response(
                {
                    'success': False,
                    'message': 'Falha na validação do reCAPTCHA.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        token = request.data.get('token', '')
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        
        if not token or not email or not password:
            return Response(
                {
                    'success': False,
                    'message': 'Todos os campos são obrigatórios.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if len(password) < 8:
            return Response(
                {
                    'success': False,
                    'message': 'A palavra-passe deve ter pelo menos 8 caracteres.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user = User.objects.get(email=email, reset_token=token)
            
            # Verificar se o token ainda é válido
            if not user.reset_token_expiry or user.reset_token_expiry < timezone.now():
                return Response(
                    {
                        'success': False,
                        'message': 'O token expirou. Por favor, solicite uma nova redefinição.'
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Atualizar a palavra-passe
            user.password = make_password(password=password, salt=SALT)
            user.reset_token = None
            user.reset_token_expiry = None
            user.save()
            
            return Response(
                {
                    'success': True,
                    'message': 'Palavra-passe redefinida com sucesso.'
                },
                status=status.HTTP_200_OK,
            )
            
        except User.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Token inválido.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

class NewsArticleView(APIView):
    def get(self, request, format=None):
        try:
            news_articles = NewsArticle.objects.all().order_by('-published_date')
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
    
class GetNewsArticleView(APIView):
    def get(self, request, news_article_id, format=None):
        try:
            news_article = NewsArticle.objects.get(id=news_article_id)
            serializer = NewsArticleSerializer(news_article)
            return Response(
                {
                    'success': True,
                    'message': 'Notícia obtida com sucesso!',
                    'news_article': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except NewsArticle.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Notícia não encontrada!',
                },
                status=status.HTTP_200_OK,
            )
            
class GetNewsArticleImagesView(APIView):
    def get(self, request, news_article_id, format=None):
        try:
            news_article = NewsArticle.objects.get(id=news_article_id)
            images = Image.objects.filter(news_article=news_article)
            serializer = ImageSerializer(images, many=True)
            
            return Response(
                {
                    'success': True,
                    'message': 'Imagens obtidas com sucesso!',
                    'images': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except NewsArticle.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Notícia não encontrada!',
                },
                status=status.HTTP_404_NOT_FOUND,
            )
            
class CreateNewsArticleView(APIView):
    def post(self, request, format=None):
        serializer = NewsArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            news_articles = NewsArticle.objects.all()
            serializer = NewsArticleSerializer(news_articles, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Notícia criada com sucesso!',
                    'news_articles': serializer.data,
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
            
class UpdateNewsArticleView(APIView):
    def post(self, request, news_article_id, format=None):
        try:
            news_article = NewsArticle.objects.get(id=news_article_id)
            serializer = NewsArticleSerializer(news_article, data=request.data)
            if serializer.is_valid():
                serializer.save()
                
                news_articles = NewsArticle.objects.all()
                serializer = NewsArticleSerializer(news_articles, many=True)
                return Response(
                    {
                        'success': True,
                        'message': 'Notícia atualizada com sucesso!',
                        'news_articles': serializer.data,
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
        except NewsArticle.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Notícia não encontrada!',
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
            images = Image.objects.all()
            serializer = ImageSerializer(images, many=True)
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

class MissionView(APIView):
    def get(self, request, format=None):
        try:
            missions = Mission.objects.all()
            serializer = MissionSerializer(missions, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Missões obtidas com sucesso!',
                    'missions': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Mission.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Missões não encontradas!',
                },
                status=status.HTTP_200_OK,
            )

class GetMissionView(APIView):
    def get(self, request, mission_id, format=None):
        try:
            mission = Mission.objects.get(id=mission_id)
            serializer = MissionSerializer(mission)
            return Response(
                {
                    'success': True,
                    'message': 'Missão obtida com sucesso!',
                    'mission': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Mission.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Missão não encontrada!',
                },
                status=status.HTTP_404_NOT_FOUND,
            )

class CreateMissionView(APIView):
    def post(self, request, format=None):
        serializer = MissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            missions = Mission.objects.all()
            serializer = MissionSerializer(missions, many=True)
            return Response(
                {
                    'success': True,
                    'message': 'Missão inserida com sucesso!',
                    'missions': serializer.data,
                },
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

class UpdateMissionView(APIView):
    def post(self, request, mission_id, format=None):
        try:
            mission = Mission.objects.get(id=mission_id)
            
            # Update specific fields
            if 'end_date' in request.data:
                mission.end_date = request.data['end_date']
            
            if 'duration' in request.data:
                # For duration, convert string format to timedelta
                duration_str = request.data['duration']
                if duration_str:
                    hours, minutes, seconds = map(int, duration_str.split(':'))
                    duration_td = timezone.timedelta(
                        hours=hours,
                        minutes=minutes,
                        seconds=seconds
                    )
                    mission.duration = duration_td
            
            mission.save()
            
            return Response(
                {
                    'success': True,
                    'message': 'Missão atualizada com sucesso!',
                },
                status=status.HTTP_200_OK,
            )
            
        except Mission.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Missão não encontrada!'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Erro ao atualizar missão: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class MissionRecordsView(APIView):
    def get(self, request, mission_id, format=None):
        try:
            mission = Mission.objects.get(id=mission_id)
            records = Record.objects.filter(mission=mission)
            
            if not records:
                return Response(
                    {
                        'success': True,
                        'message': 'Nenhum registo encontrado para esta missão',
                        'records': []
                    },
                    status=status.HTTP_200_OK,
                )
                
            records_data = []
            for record in records:
                record_info = {
                    'id': record.id,
                    'data': record.data,
                    'created_at': record.created_at
                }
                records_data.append(record_info)
                
            return Response(
                {
                    'success': True,
                    'message': 'registos obtidos com sucesso',
                    'records': records_data
                },
                status=status.HTTP_200_OK,
            )
            
        except Mission.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Missão não encontrada'
                },
                status=status.HTTP_404_NOT_FOUND,
            )

class ImportMissionRecordsView(APIView):
    def post(self, request, mission_id, format=None):
        try:
            mission = Mission.objects.get(id=mission_id)
            records_data = request.data.get('records', [])
            
            if not records_data:
                return Response(
                    {
                        'success': False,
                        'message': 'Nenhum registo fornecido para importação'
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
                            
            # Sort records by timestamp if available
            if 'data' in records_data[0] and 'timestamp' in records_data[0]['data']:
                sorted_records = sorted(
                    records_data, 
                    key=lambda x: x['data'].get('timestamp', 0)
                )
                
                # Get first and last timestamp for start and end dates
                first_timestamp = None
                last_timestamp = None
                
                for record in sorted_records:
                    if 'timestamp' in record['data']:
                        timestamp_str = record['data']['timestamp']
                        try:
                            # Parse timestamp and explicitly preserve its timezone (or assume local timezone)
                            timestamp = dateutil.parser.parse(timestamp_str)
                            
                            # Make timestamp timezone-aware with the correct timezone
                            # Django uses UTC internally, so convert to the same timezone as Django's settings
                            if timestamp.tzinfo is None:
                                # Attach Portugal timezone (Europe/Lisbon) to the naive timestamp
                                from django.utils import timezone
                                timestamp = timezone.make_aware(timestamp)
                                
                            # Now Django won't adjust the time when storing/retrieving
                            if first_timestamp is None or timestamp < first_timestamp:
                                first_timestamp = timestamp
                            if last_timestamp is None or timestamp > last_timestamp:
                                last_timestamp = timestamp
                        except:
                            pass
                
                # For import missions, set the start_date if it's NULL
                if mission.start_date is None and first_timestamp:
                    mission.start_date = first_timestamp
                    
                # Set end_date and calculate duration
                if last_timestamp:
                    mission.end_date = last_timestamp
                    
                    if mission.start_date:
                        duration = last_timestamp - mission.start_date
                        mission.duration = duration
                
                mission.save()
            
            # Import records
            imported_count = 0
            for record_item in records_data:
                Record.objects.create(
                    mission=mission,
                    data=record_item['data']
                )
                imported_count += 1
                
            return Response(
                {
                    'success': True,
                    'message': f'{imported_count} registos importados com sucesso',
                    'count': imported_count,
                    'mission_id': mission.id
                },
                status=status.HTTP_200_OK,
            )
            
        except Mission.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Missão não encontrada'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Erro ao importar registos: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class AddMissionRecordView(APIView):
    def post(self, request, mission_id, format=None):
        try:
            # Find the mission by ID
            mission = Mission.objects.get(id=mission_id)
            
            # Check if mission is already completed
            if mission.end_date:
                return Response(
                    {
                        'success': False,
                        'message': 'Cannot add records to completed missions'
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Get the data from request body
            record_data = request.data
            
            if not record_data:
                return Response(
                    {
                        'success': False,
                        'message': 'No data provided'
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Create a new record
            record = Record.objects.create(
                mission=mission,
                data=record_data
            )
            
            # If mission is realtime and this is first record, set start_date
            if mission.is_realtime and mission.start_date is None:
                mission.start_date = timezone.now()
                mission.save()
            
            return Response(
                {
                    'success': True,
                    'message': 'Record added successfully',
                    'record_id': record.id
                },
                status=status.HTTP_200_OK,
            )
            
        except Mission.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Mission not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Error adding record: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            
class GetCurrentMissionView(APIView):
    def post(self, request, format=None):
        try:
            current_mission = Mission.objects.filter(
                start_date__isnull=True,
                is_realtime=True
            ).last()

            if current_mission:
                return Response(
                    {
                        'success': True,
                        'message': 'Current active mission found',
                        'mission_id': current_mission.id,
                        'timestamp': timezone.now()
                    },
                    status=status.HTTP_200_OK,
                )
        except Mission.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'No active mission found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Error fetching current mission: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
       
class ContactView(APIView):
    def post(self, request, format=None):
        recaptcha_token = request.data.get('recaptcha_token', '')
        
        if not verify_recaptcha(recaptcha_token):
            return Response(
                {
                    'success': False,
                    'message': 'Falha na validação do reCAPTCHA.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        name = request.data.get('name', '')
        email = request.data.get('email', '')
        subject = request.data.get('subject', 'Sem Assunto')
        message = request.data.get('message', '')

        if not email or not message:
            return Response(
                {
                    'success': False,
                    'message': 'O email e a mensagem são obrigatórios.',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            email_message = EmailMessage(
                subject=subject,
                body=f"Mensagem de {name}: {email}\n\n{message}",
                from_email='canpansatpat@gmail.com',
                to=['canpansatpat@gmail.com'],
                reply_to=[email],
            )
            email_message.send()

            return Response(
                {
                    'success': True,
                    'message': 'Email enviado com sucesso!',
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Erro ao enviar o email: {str(e)}',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )