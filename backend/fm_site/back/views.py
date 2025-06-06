from django.shortcuts import render
from django.db.models import F
from django.core import mail
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .serializers import *
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated


'''
pip uninstall python-magic-bin
pip uninstall libmagic
pip install python-magic-bin
pip install libmagic
'''
#import magic
import os
from botocore.exceptions import NoCredentialsError
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import csv

#from .minio import upload_to_s3, download_from_s3


EMAIL_SENDER = "noreply.choir.fm@gmail.com"

        
##################################################################################################################
##################################################################################################################
#Хористы

@api_view(['GET', 'POST'])
def choiristers(request):
    '''
    {
    "first_name": ,
    "last_name": ,
    "voice": ,
    "photo":
    }
    '''
    if request.method == 'GET':
        '''
        Вернуть список всех хористов (не удалённых)
        '''
        data = Choirister.objects.all().filter(is_deleted = False)
        serializer = ChoiristerSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        '''
        Добавить хориста
        '''
        serializer = ChoiristerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([IsAuthenticated])
@api_view(['PUT', 'DELETE'])
def edit_choirister(request, id):
    '''
    id: integer - id Хориста
    '''
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    try:
        choirister = Choirister.objects.get(id=id)
        #to_delete_photo = choirister.photo
    except Choirister.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if choirister.is_deleted == True:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':   
        '''
        Изменить хориста
        {
        "first_name": ,
        "last_name": ,
        "voice": ,
        "photo":
        }
        '''     
        serializer = ChoiristerSerializer(choirister, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        '''
        Удалить хориста
        '''
        choirister.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    
        
##################################################################################################################
##################################################################################################################
#Мероприятия

@api_view(['GET'])
def events_get(request, param):
    if request.method == 'GET':
        if param == "all":
            '''
            Получить список всех мероприятий (не удаленных)
            '''
            #Убывает
            data = Event.objects.all().filter(is_deleted = False).order_by('-event_time')
            serializer = EventSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
            '''
            elif param == "tree":
                data = Event.objects.all().filter(event_time__gte = datetime.datetime.now(), is_deleted = False).order_by('event_time')[:3]
                serializer = EventSerializer(data, context={'request': request}, many=True)
                return Response(serializer.data)
            '''
        elif param == "ten" or param == None:
            '''
            Получить список ближайших(время мероприятия ещё не наступило) 10 мероприятий (не удаленных).
            '''
            data = Event.objects.all().filter(event_time__gte = datetime.datetime.now(), is_deleted = False).order_by('event_time')[:10]
            serializer = EventSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
        else:
            '''
            Получить информацию о мероприятии по id
            '''
            #id values
            try:
                id = int(param)
                event = Event.objects.get(id=id) 
            except ValueError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            except Event.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            if event.is_deleted == True:
                return Response(status=status.HTTP_404_NOT_FOUND)
            serializer = EventSerializer(event, context={'request': request}, many=False)  
            return Response(serializer.data)
        
@permission_classes([IsAuthenticated])        
@api_view(['POST'])
def events_post(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'POST':
        '''
        Добавить новое мероприятие
        {
        "name_event": 
        "description": 
        "event_time":
        "photo":
        "has_registration":

        "limit_people":
        "date_time_open":
        "date_time_close":
        }
        '''
        
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            #Проверки на front
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['PUT', 'DELETE'])
def edit_event(request, id):
    '''
    id: integer - id Мероприятия
    '''
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    try:
        event = Event.objects.get(id=id)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if event.is_deleted == True:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        '''
        Изменить мероприятие
        {
        "name_event": 
        "description": 
        "event_time":
        "photo":
        "has_registration":

        "limit_people":
        "date_time_open":
        "date_time_close":
        }
       
        '''  
        
        serializer = EventSerializer(event, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        '''
        Удалить мероприятие
        '''
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

##################################################################################################################
##################################################################################################################
#Новости

@api_view(['GET'])
def news_get(request, param):
    if request.method == 'GET':
        if param == "all":
            '''
            Получить список всех нновостей (не удаленных)
            '''
            #Убывает
            data = News.objects.all().filter(is_deleted = False).order_by('-create_at')
            serializer = NewsSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
        elif param == "three":
            '''
            Получить список поледних 3-х новостей (не удаленных).
            '''
            data = News.objects.all().filter(is_deleted = False).order_by('-create_at')[:3]
            serializer = NewsSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
        elif param == "thirty":
            '''
            Получить список поледних 30-ти новостей (не удаленных).
            '''
            data = News.objects.all().filter(is_deleted = False).order_by('-create_at')[:30]
            serializer = NewsSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
        else:
            '''
            Получить информацию о новости по id.
            '''
            #id values
            try:
                id = int(param)
                news = News.objects.get(id=id) 
            except ValueError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            except News.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            if news.is_deleted == True:
                return Response(status=status.HTTP_404_NOT_FOUND)
            serializer = NewsSerializer(news, context={'request': request}, many=False)  
            return Response(serializer.data)
        
@permission_classes([IsAuthenticated])        
@api_view(['POST'])
def news_post(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'POST':
        '''
        Добавить новую новость
        {
        "title":
        "text_news":
        "photo"
        }
        '''
        #print(param)
        #if param is not None and param == "\n":
            #print("Here")
        #    return Response(status=status.HTTP_400_BAD_REQUEST)
        # print(request.data)
        serializer = NewsSerializer(data=request.data)
        
        if serializer.is_valid():
            #Проверки на front
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([IsAuthenticated])        
@api_view(['PUT', 'DELETE'])
def edit_news(request, id):
    '''
    id: integer - id Новости
    '''
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    try:
        news = News.objects.get(id=id)
    except News.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if news.is_deleted == True:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        '''
        Изменить новость
        {
        "title":
        "text_news":
        "photo"
        }
        '''
        serializer = NewsSerializer(news, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        '''
        Удалить новость
        '''
        news.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

##################################################################################################################
##################################################################################################################
#Прослушивания

@api_view(['GET'])
def rehersals_get(request, param):
    if request.method == 'GET':
        if param == "all" or param is None:
            '''
            Получить список всех прослушиваний
            '''
            #убывает
            data = Rehersal.objects.all().order_by('-create_at')
            serializer = RehersalSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
        elif param == "active":
            '''
            Получить активное прослушивание.
            Если вывод будет пустым, то нет прослушиваия на данный момент.
            Если на банный момент есть открытое прослушивание, то возвращается информация о нем. 
            '''
            try:
                rehersal = Rehersal.objects.get(is_last = True)
            except Rehersal.DoesNotExist:
                return Response({})
            if rehersal.is_open():
                serializer = RehersalSerializer(rehersal, context={'request': request}, many=False)
                return Response(serializer.data)
            else:
                #serializer = RehersalSerializer([], context={'request': request}, many=True)
                #return Response(serializer.data)
                return Response({})
        else: 
            '''
            Получить информацию о прослушивании по id.
            '''
            try:
                id = int(param)
                rehersal = Rehersal.objects.get(id=id) 
            except ValueError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            except Rehersal.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            serializer = RehersalSerializer(rehersal, context={'request': request}, many=False)  
            return Response(serializer.data)
        
@permission_classes([IsAuthenticated])        
@api_view(['POST'])        
def rehersals_post(request):
    if request.method == 'POST':  
        '''
        Добавить прослушивание
        {
        "title":
        "date_start":
        "date_end":
        }
        '''
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        data = {
                    "title": request.data.get('title'),
                    "date_start": request.data.get('date_start'),
                    "date_end": request.data.get('date_end'),
                    "is_last": True
                }
        serializer = RehersalSerializer(data=data)
        if serializer.is_valid():
            #Проверки на front
            prev = Rehersal.objects.filter(is_last=True)
            if len(prev) >= 1:
                #print('here')
                for item in prev:
                    if item is not None and item.date_end.date() > datetime.datetime.now().date():
                        item.date_end = datetime.datetime.now().date()
                    #print(item.id)
                    item.is_last = False
                    item.save()
                    serializer.save()
            elif len(prev) == 0:
                #print("save")
                serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
                     
@permission_classes([IsAuthenticated])    
@api_view(['PUT'])
def edit_rehersal(request, id):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'PUT':
        '''
        Редактировать прослушивание
        {
        "title":
        "date_start":
        "date_end":
        "is_last":
        }
        '''
        try:
            rehersal = Rehersal.objects.get(id=id)
        except Rehersal.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RehersalSerializer(rehersal, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
##################################################################################################################
##################################################################################################################
#Заявки на прослушивание
                   
@api_view(['POST'])   
def applicants(request):
    '''
        Добавить заявку на прослушивание
        {
        "data_applicant":
        "video":
        "status":
        "rehersal_ID":
        }
        Data_applicant состоит из полей:
            "name": 
            "program":
            "hasPass": 
            "source":
            "education": 
            "otherEducation": 
            "musicalInstrument": 
            "hasPerformanceExperience":
            "creativeExperience": 
            "otherCreativeExperience": 
            "musicPreferences": 
            "reasons": 
            "rehersalsTime": 
            "email": 
            "phone": 
            "vk":
            "tg": 
        '''
    if request.method == 'POST':
        serializer = ApplicantSerializer(data=request.data)
        if serializer.is_valid():
            rehersal_ID = request.data.get('rehersal_ID')
            try:
                if not Rehersal.objects.get(id = rehersal_ID).is_open():
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                serializer.save()
            except Rehersal.DoesNotExist:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)     
   
@permission_classes([IsAuthenticated])    
@api_view(['GET'])   
def admin_applicant_list(request, id, param):
    '''
    Вернуть список заявок на прослушивание
    В id записан id прослушивания
    '''
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        if param == "all":
            '''
            Получить список всех заявок на прослушивание с id=id
            '''
            #убывает
            data = Applicant.objects.all().filter(rehersal_ID=id).order_by('-create_at')
            serializer = ApplicantSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
        if param == "new":
            '''
            Получить список новых заявок на прослушивание с id=id
            '''
            #убывает
            data = Applicant.objects.all().filter(rehersal_ID=id, status = Applicant.ApplicantStatus.New_applicant).order_by('-create_at')
            serializer = ApplicantSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
        if param == "fail":
            '''
            Получить список прошедших на 2-й этап заявок на прослушивание с id=id
            '''
            #убывает
            data = Applicant.objects.all().filter(rehersal_ID=id, status = Applicant.ApplicantStatus.Failed_applicant).order_by('-create_at')
            serializer = ApplicantSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)
        if param == "pass":
            '''
            Получить список прошедших на 2-й этап заявок на прослушивание с id=id
            '''
            #убывает
            data = Applicant.objects.all().filter(rehersal_ID=id, status = Applicant.ApplicantStatus.Passed_applicant).order_by('-create_at')
            serializer = ApplicantSerializer(data, context={'request': request}, many=True)
            return Response(serializer.data)

@permission_classes([IsAuthenticated])    
@api_view(['GET', 'PATCH'])           
def admin_applicant(request, id):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        '''
        Получить информацию о заявке на прослушивание по её id
        '''
        try:
            applicant = Applicant.objects.get(id=id) 
        except Applicant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ApplicantSerializer(applicant, context={'request': request}, many=False)
        return Response(serializer.data)
    elif request.method == 'PATCH':
        '''
        Изменить статус заявки на прослушивание для заявки c id=id 
        {
        "status" :
        }
        '''
        #Здесь может быть только статус!
        try:
            applicant = Applicant.objects.get(id=id) 
        except Applicant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        count = len(request.data)
        if count != 1:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        status_applicant = request.data.get('status')
        if status_applicant is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        applicant.status = status_applicant
        applicant.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
##################################################################################################################
##################################################################################################################
#Посетители

@api_view(['POST']) 
def visitors(request):
    if request.method == 'POST':
        '''
        Добавить посетителя
        {
        "data_visitor":
        "event_ID":
        }
        в data_visitor присутствуют поля:
            {
            "name":
            "email":
            }
        '''
        serializer = VisitorSerializer(data=request.data)
        if serializer.is_valid():
            event_ID = request.data.get('event_ID')
            try:
                if not Event.objects.get(id = event_ID).is_open():
                    #print("Here1", Event.objects.get(id = event_ID).is_open())
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            except Event.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
@permission_classes([IsAuthenticated])
@api_view(['GET'])   
def admin_visitor_list(request, id):
    '''
    Получить список всех посетителей на мероприятие с id=id
    '''
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        #убывает
        data = Visitor.objects.all().filter(event_ID=id).order_by('-create_at')
        serializer = VisitorSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
        
@permission_classes([IsAuthenticated])
@api_view(['GET'])   
def admin_visitor(request, id):
    '''
    Получить информацию о  посетителе по его id
    '''
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        try:
            applicant = Visitor.objects.get(id=id) 
        except Visitor.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = VisitorSerializer(applicant, context={'request': request}, many=False)
        return Response(serializer.data)
        
##################################################################################################################
##################################################################################################################
#Рассылки

def send_email(emails, theme, body):
    '''
    Функция для отправки писем.
    emails - список электронных адресов
    theme - тема письма
    body - тело письма
    '''
    with mail.get_connection() as connection:
    #    connection = mail.get_connection()
        #connection.open()
        ending = "\n\nПожалуйста, не отвечайте на это сообщение.\nЕсли вы хотите с нами связаться пишите на почту choir.fm@gmail.com или в сообщения нашей группы ВК https://vk.com/hsechoir"
        # Construct an email message that uses the 
        
        emails_to_send = [] 
        '''
        file_names = []
        file_contents = []
        file_mimes = []
        for path in os.listdir('files/tmp'):
            with open(f'files/tmp/{path}', 'rb') as file:
                file_content = file.read()
                mime_type = magic.from_buffer(file_content, mime=True)
                # Extract the filename from the attachment_path
                file_name = os.path.basename(f'files/tmp/{path}')
                file_names += [file_name]
                file_contents += [file_content]
                file_mimes += [mime_type]
        '''
        #print(emails)
        for email in emails:
            #print(email)
            to_send = mail.EmailMessage(
                theme,
                body + ending,
                EMAIL_SENDER,
                [email],
                connection=connection,
                )
            '''
            for i in range(len(file_names)):
                email.attach(file_names[i], file_content[i], mime_type[i])
            emails_to_send += [to_send]
            '''
            emails_to_send += [to_send]
        connection.send_messages(emails_to_send) 

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def email_applicants(request, id):
    '''
    Отправить рассылку всем непрошедим прослушивание с id=id, если в emails пустой список.
    Иначе оправляется рассылка по переданным в emails электронным адресам. 

    Приходят запросы вида:
    {
    "emails": [] 
    "theme":
    "body":
    }
    ''' 
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)   
    if request.method == 'POST':
        #отправить email.
        #Автоматическая рассылка на все непрошедшие
        emails = request.data.get('emails')
        if len(emails) == 0:
            try:
                emails = Applicant.objects.filter(status=Applicant.ApplicantStatus.Failed_applicant, rehersal_ID=id).values_list('data_applicant__email', flat=True)
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        send_email(emails=emails, theme=request.data.get('theme'), body=request.data.get('body'))
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@permission_classes([IsAuthenticated])    
@api_view(['POST'])
def email_event(request, id):
    '''
    Отправить рассылку все посетителям мероприятия с id=id, если в emails пустой список.
    Иначе оправляется рассылка по переданным в emails электронным адресам. 
    Приходят запросы вида:
    {
    "emails": [] 
    "theme":
    "body":

    } 
    '''  
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)  
    if request.method == 'POST':
        #отправить email.
        #Автоматическая рассылка на все непрошедшие
        #print(request.data)
        emails = request.data.get('emails')
        #print(emails)
        if len(emails) == 0:
            try:
                if Event.objects.get(id =id).is_deleted():
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            except Event.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            emails = Visitor.objects.filter(events_ID=id).values_list('data_visitor__email', flat=True)
        #print(request.FILES)
        #for file in request.FILES:
        
        #data = { 
        #        'file' : request.data.get('attachment')
        #      }
        #serializer = FileModelSerializer(data=data)
        
        #print(serializer)

        #if serializer.is_valid():
        #    print('I am HERE2')
        #    serializer.save()   
            
        send_email(emails=emails, theme=request.data.get('theme'), body=request.data.get('body'))
        #FileModel.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


##################################################################################################################
##################################################################################################################
#Галлерея
@api_view(['GET', 'POST'])
def gallery(request):
    
    if request.method == 'GET':
        '''
        Получить список всех фото галлереи
        '''
        data = PhotoGallery.objects.all().order_by('id')
        serializer = PhotoGallerySerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        '''
        Добавить фото в галлерею
        {
        "photo":
        }
        '''
        serializer = PhotoGallerySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)       

@permission_classes([IsAuthenticated])
@api_view(['PUT', 'DELETE'])
def edit_gallery(request, id):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
    try:
        photo = PhotoGallery.objects.get(id=id)
    except PhotoGallery.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        '''
        Заменить фото в галлерии по id
        {
        "photo":
        }
        '''
        serializer = PhotoGallerySerializer(photo, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        '''
        Удалить фото по id
        ''' 
        if photo.photo and os.path.isfile(photo.photo.path):
            os.remove(photo.photo.path)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 
    

##################################################################################################################
##################################################################################################################
#Аутентификация

@api_view(['POST'])
def registration(request):
    '''
    Регистрация нового пользователя
    {
    "email":
    "role_user": (default=Roles.ADMIN)
    "password":
    "body_email": (тело письма)
    }
    '''
    if len(CustomUser.objects.filter(email=request.data.get("email"))):
       return Response({'error': 'Пользователь с таким email уже существует'},
                            status=status.HTTP_400_BAD_REQUEST) 
    data = {
        "username": request.data.get("email"),
        'email': request.data.get("email"),
        "role_user": request.data.get("role_user"),
        "password": request.data.get("password")
    }
    serializer = CustomUserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data.get("password"))
        user.save()
        refresh = RefreshToken.for_user(user) # Создание Refesh и Access
        refresh.payload.update({    # Полезная информация в самом токене
            'user_id': user.id,
            'email': user.email
        })
        send_email([user.email], "Ваш первичный пароль", request.data.get('body_email'))
        return Response(status=status.HTTP_201_CREATED)  
    return Response(status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['POST'])    
def login(request):
    '''
    Вход пользователя
    {
    "email":
    "password":
    }
    '''
    try:
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        if email is None or password is None:
            return Response({'error': 'Нужен и логин, и пароль'},
                    status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(email=email, password=password)
        if user is None:
            return Response({'error': 'Неверные данные'},
                    status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        refresh.payload.update({
            'user_id': user.id,
            'email': user.email
        })
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])    
def logout(request):
        '''
        Выход пользователя
        {
        "refresh_token":
        }
        '''
        
        refresh_token = request.data.get('refresh_token') # С клиента нужно отправить refresh token
        if not refresh_token:
            return Response({'error': 'Необходим Refresh token'},
                                status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist() # Добавить его в чёрный список
        except Exception as e:
            return Response({'error': 'Неверный Refresh token'},
                                status=status.HTTP_400_BAD_REQUEST)
        return Response({'success': 'Выход успешен'}, status=status.HTTP_200_OK)
        


@permission_classes([IsAuthenticated])
@api_view(['PUT'])
def change_pass(request):

    '''
    Смена хэша пароля (адиминам) админу и перезапись данных
    Приходит запрос
    #{
    "old_password":
    "new_password":
    }
    '''
    
    try:
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'},
                                status=status.HTTP_401_UNAUTHORIZED)
        
        user = request.user 
        if request.method == 'PUT':
            # Проблема с моками он не понимает, что это один и тот же мок
            auth_user = authenticate(email=user.email, password=request.data.get('old_password'))
            
            if auth_user is None:
                
                return Response({'error': 'Неверный email или пароль'},
                                status=status.HTTP_404_NOT_FOUND) 
            user.set_password(request.data.get('new_password'))
            user.save()
            #serializer = CustomUserSerializer(user, data=request.data, context={'request': request})
            #if serializer.is_valid():
            #    serializer.save()
            #    return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    

@api_view(['PUT'])
def email_change_pass(request):

        '''
        Приходит запрос
        {
        "email":
        "body_email":
        "password":
        }
        '''
        #Автоматическая рассылка с сгенерированным(на фронт) паролем админу и перезапись данных
        if request.method == 'PUT':
            try:
                try:
                    user= CustomUser.objects.get(email=request.data.get("email"))  
                except CustomUser.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                user.set_password(request.data.get('password'))
                user.save()
                send_email([user.email], "Восстановление пароля", request.data.get('body_email'))
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Exception as e:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
'''
@api_view(['GET'])
def test_get_users(request):
    data = CustomUser.objects.all()
    serializer = CustomUserSerializer(data, context={'request': request}, many=True)
    return Response(serializer.data)
'''