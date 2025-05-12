
import unittest
from unittest.mock import patch, MagicMock, PropertyMock, ANY
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status
from django.contrib.auth.models import AnonymousUser
from back.views import *
from back.models import *  
from back.serializers import *
import datetime
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.request import Request
from rest_framework_simplejwt.tokens import RefreshToken
import tempfile

class ChoiristersViewTestCase(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    @patch('back.views.ChoiristerSerializer')
    @patch('back.views.Choirister')
    def test_get_choirister_one(self, mock_choirister, mock_serializer_class):
        # Создаём моковые объекты
        mock_queryset = MagicMock()
        mock_choirister.objects.all.return_value.filter.return_value = mock_queryset
        mock_serializer = MagicMock()
        mock_serializer.data = [{'first_name': 'John', 'last_name': 'Doe','voice':'Второй тенор', 'photo':'choiristers/Alexandr_Levin.jpg'}]
        mock_serializer_class.return_value = mock_serializer
        request = self.factory.get('/api/choiristers/')
        response = choiristers(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [{'first_name': 'John', 'last_name': 'Doe','voice':'Второй тенор', 'photo':'choiristers/Alexandr_Levin.jpg'}])

    @patch('back.views.ChoiristerSerializer')
    @patch('back.views.Choirister')
    def test_get_choiristers(self, mock_choirister, mock_serializer_class):
        # Создаем заглушку для возвращаемых данных
        mock_queryset = MagicMock()
        mock_choirister.objects.all.return_value.filter.return_value = mock_queryset
        mock_serializer = MagicMock()
        mock_serializer.data = [{'first_name': 'John', 'last_name': 'Doe','voice':'Второй тенор', 'photo':'choiristers/Alexandr_Levin.jpg'},\
                                {'first_name': 'Jane', 'last_name': 'Smith','voice':'Первый Альт', 'photo':'choiristers/Maria_Danilova.jpg'}]
        mock_serializer_class.return_value = mock_serializer
        # Выполняем GET-запрос
        request = self.factory.get('/api/choiristers/')
        response = choiristers(request)

        # Проверяем статус ответа
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Должно вернуть 2 хориста


    @patch('back.views.ChoiristerSerializer')
    def test_post_choirister_valid(self, mock_serializer_class):
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer

        data = {
            "first_name": "Анна",
            "last_name": "Фадеева",
            "voice": "Первое сопрано",
            "photo": "choiristers/Anna_Fadeeva.jpg"
        }

        request = self.factory.post('/api/choiristers/', data, format='json')
        response = choiristers(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('back.views.ChoiristerSerializer')
    def test_post_choirister_invalid(self, mock_serializer_class):
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'first_name': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        request = self.factory.post('/api/choiristers/', {"last_name": "Smith", "voice": "Второй Альт",}, format='json')
        response = choiristers(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'first_name': ['This field is required.']})

class EditChoiristerViewTestCase(unittest.TestCase):
    def setUp(self):
        self.user = MagicMock(is_authenticated=True)
        self.factory = APIRequestFactory()
        
        self.valid_data = {
            "first_name": "Test",
            "last_name": "User",
            "voice": "Бас",
            "photo": 'choiristers/Alexandr_Levin.jpg'
        }

    @patch('back.views.Choirister')
    @patch('back.views.ChoiristerSerializer')
    def test_put_success(self, mock_serializer_class, mock_choirister_model):
        mock_choirister = MagicMock()
        mock_choirister.is_deleted = False
        mock_choirister_model.objects.get.return_value = mock_choirister

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer

        request = self.factory.put('/api/edit_choirister/1/', data=self.valid_data, format='json')
        force_authenticate(request, user=self.user)
        response = edit_choirister(request, 1)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    @patch('back.views.Choirister')
    def test_get_not_found_deleted(self, mock_choirister_model):
        mock_choirister = MagicMock()
        mock_choirister.is_deleted = True
        mock_choirister_model.objects.get.return_value = mock_choirister

        request = self.factory.put('/api/choiristers/1/', data=self.valid_data, format='json')
        force_authenticate(request, user=self.user)
        response = edit_choirister(request, 1)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    #@patch('back.views.Choirister')
    @patch('back.models.Choirister.objects.get')
    def test_choirister_does_not_exist(self, mock_choirister_model):
        from back.models import Choirister
        mock_choirister_model.side_effect = Choirister.DoesNotExist()

        request = self.factory.put('/api/choiristers/99/', data=self.valid_data, format='json')
        force_authenticate(request, user=self.user)

        response = edit_choirister(request, 99)

        self.assertEqual(response.status_code, 404)

    @patch('back.views.Choirister')
    def test_delete_success(self, mock_choirister_model):
        mock_choirister = MagicMock()
        mock_choirister.is_deleted = False
        mock_choirister_model.objects.get.return_value = mock_choirister

        request = self.factory.delete('/api/choiristers/1/')
        force_authenticate(request, user=self.user)
        response = edit_choirister(request, 1)

        mock_choirister.delete.assert_called_once()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    @patch('back.views.Choirister')
    @patch('back.views.ChoiristerSerializer')
    def test_put_invalid_data(self, mock_serializer_class, mock_choirister_model):
        mock_choirister = MagicMock()
        mock_choirister.is_deleted = False
        mock_choirister_model.objects.get.return_value = mock_choirister

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {"first_name": ["This field is required."]}
        mock_serializer_class.return_value = mock_serializer

        request = self.factory.put('/api/choiristers/1/', data={}, format='json')
        force_authenticate(request, user=self.user)
        response = edit_choirister(request, 1)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("first_name", response.data)

    @patch('back.views.Choirister')
    def test_unauthenticated_access(self, mock_choirister_model):
        mock_choirister = MagicMock()
        mock_choirister.is_deleted = False
        mock_choirister_model.objects.get.return_value = mock_choirister

        request = self.factory.put('/api/choiristers/1/', data=self.valid_data, format='json')
        # Не вызываем force_authenticate
        response = edit_choirister(request, 1)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)



class EventsGetViewMockedTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.now = datetime.datetime.now()

        # Пример словаря с полями, как в EventSerializer
        self.sample_event_data = {
            'name_event': 'Event',
            'description': 'Some description',
            'event_time': self.now.isoformat() + (self.now + datetime.timedelta(days=1)).isoformat(),
            'photo': '/media/events/mock.jpg',
            'has_registration': True,
            'limit_people': 100,
            'date_time_open': (self.now - datetime.timedelta(days=2)).isoformat(),
            'date_time_close': (self.now + datetime.timedelta(days=1)).isoformat(),
            'is_deleted': False,
            'create_at': self.now.isoformat(),
            'update_at': self.now.isoformat(),
        }
        self.sample_event_data_past = {
            'name_event': 'Event',
            'description': 'Some description',
            'event_time': self.now.isoformat() + (self.now - datetime.timedelta(days=1)).isoformat(),
            'photo': '/media/events/mock.jpg',
            'has_registration': False,
            'limit_people': None,
            'date_time_open': None,
            'date_time_close': None,
            'is_deleted': False,
            'create_at': self.now.isoformat(),
            'update_at': self.now.isoformat(),
        }

    @patch('back.views.EventSerializer')
    @patch('back.views.Event')
    def test_get_all_events_one(self, mock_event_model, mock_serializer_class):
        request = self.factory.get('/api/events_get/all')

        mock_queryset = MagicMock()
        mock_event_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_event_data]
        mock_serializer_class.return_value = mock_serializer

        response = events_get(request, 'all')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name_event'], 'Event')
        self.assertEqual(response.data[0]['description'], 'Some description')

    @patch('back.views.EventSerializer')
    @patch('back.views.Event')
    def test_get_all_events_many(self, mock_event_model, mock_serializer_class):
        request = self.factory.get('/api/events_get/all')

        mock_queryset = MagicMock()
        mock_event_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_event_data]*30
        mock_serializer_class.return_value = mock_serializer

        response = events_get(request, 'all')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 30)
        self.assertEqual(response.data[0]['name_event'], 'Event')
        self.assertEqual(response.data[0]['description'], 'Some description')

    @patch('back.views.EventSerializer')
    @patch('back.views.Event')
    def test_get_ten_upcoming_events(self, mock_event_model, mock_serializer_class):
        request = self.factory.get('/api/events_get/ten')
        all_mock_events = [MagicMock(name=f"Event{i}") for i in range(20)]
        mock_qs = MagicMock()
        mock_qs.__getitem__.side_effect = lambda s: all_mock_events[s]  # эмулируем срез

        mock_event_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_qs
        mock_serializer_class.return_value.data = [self.sample_event_data for _ in range(10)]

        response = events_get(request, 'ten')

        # Проверим, что сериализатор получил ровно 10 объектов
        called_args, _ = mock_serializer_class.call_args  # извлекаем аргументы вызова
        self.assertEqual(len(called_args[0]), 10)  # первый аргумент — это список объектов
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 10)

    @patch('back.views.EventSerializer')
    @patch('back.views.Event')
    def test_get_ten_upcoming_events_less(self, mock_event_model, mock_serializer_class):
        request = self.factory.get('/api/events_get/ten')

        mock_queryset = MagicMock()
        mock_event_model.objects.all.return_value.filter.return_value.order_by.return_value.__getitem__.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_event_data]*2
        mock_serializer_class.return_value = mock_serializer

        response = events_get(request, 'ten')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        

    @patch('back.views.EventSerializer')
    @patch('back.views.Event')
    def test_get_event_by_id_success(self, mock_event_model, mock_serializer_class):
        request = self.factory.get('/api/events_get/1')

        mock_event = MagicMock()
        mock_event.is_deleted = False
        mock_event_model.objects.get.return_value = mock_event

        mock_serializer = MagicMock()
        mock_serializer.data = self.sample_event_data
        mock_serializer_class.return_value = mock_serializer

        response = events_get(request, '1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['description'], 'Some description')

    @patch('back.views.Event')
    def test_get_event_by_id_invalid_param(self, mock_event_model):
        request = self.factory.get('/api/events_get/invalid')
        response = events_get(request, 'invalid')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('back.views.Event.objects.get')
    def test_get_event_by_id_not_found(self, mock_get):
        request = self.factory.get('/api/events_get/999')
        mock_get.side_effect = Event.DoesNotExist 

        response = events_get(request, '999')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.Event')
    def test_get_event_by_id_deleted(self, mock_event_model):
        request = self.factory.get('/api/events_get/1')

        mock_event = MagicMock()
        mock_event.is_deleted = True
        mock_event_model.objects.get.return_value = mock_event

        response = events_get(request, '1')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class EventsPostViewTests(unittest.TestCase):
    def setUp(self):
        self.user = MagicMock(is_authenticated=True)
        self.factory = APIRequestFactory()
        self.valid_data = {
            "name_event": "Test Event",
            "description": "Test description",
            "event_time": "2025-05-10T12:00:00Z",
            "photo": None,
            "has_registration": True,
            "limit_people": 100,
            "date_time_open": "2025-05-01T10:00:00Z",
            "date_time_close": "2025-05-09T18:00:00Z"
        }

    def test_post_unauthenticated_returns_401(self):
        request = self.factory.post('/api/events_post/', data=self.valid_data, format='json')
        response = events_post(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    @patch('back.views.EventSerializer')
    def test_post_valid_data_returns_201(self, mock_serializer_class):
        
        request = self.factory.post('/api/events_post/', data=self.valid_data, format='json')
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer
        force_authenticate(request, user=self.user)
        response = events_post(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_serializer.is_valid.assert_called_once()
        mock_serializer.save.assert_called_once()

    @patch('back.views.EventSerializer')
    def test_post_invalid_data_returns_400(self, mock_serializer_class):
        request = self.factory.post('/api/events_post/', data={}, format='json') 
        force_authenticate(request, user=self.user)

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'name_event': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        response = events_post(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name_event', response.data)

class EditEventViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.sample_data = {
            "name_event": "Updated Event",
            "description": "Updated description",
            "event_time": "2030-01-01T10:00:00Z",
            "photo": None,
            "has_registration": False,
            "limit_people": 50,
            "date_time_open": "2029-12-01T00:00:00Z",
            "date_time_close": "2029-12-31T23:59:59Z"
        }

    @patch('back.views.EventSerializer')
    @patch('back.views.Event')
    def test_put_edit_event_success(self, mock_event_model, mock_serializer_class):
        request = self.factory.put('/api/edit_event/1/', data=self.sample_data, format='json')
        force_authenticate(request, user=self.user)

        mock_event = MagicMock()
        type(mock_event).is_deleted = PropertyMock(return_value=False)
        mock_event_model.objects.get.return_value = mock_event

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = edit_event(request, 1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        mock_serializer.save.assert_called_once()

    @patch('back.views.Event.objects.get')
    def test_event_not_found_returns_404(self, mock_event_model):
        request = self.factory.put('/api/edit_event/999/', data=self.sample_data, format='json')
        force_authenticate(request, user=self.user)
        mock_event_model.side_effect = Event.DoesNotExist
        response = edit_event(request, 999)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.Event')
    def test_event_is_deleted_returns_404(self, mock_event_model):
        request = self.factory.put('/api/edit_event/1/', data=self.sample_data, format='json')
        force_authenticate(request, user=self.user)

        mock_event = MagicMock()
        type(mock_event).is_deleted = PropertyMock(return_value=True)
        mock_event_model.objects.get.return_value = mock_event

        response = edit_event(request, 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.EventSerializer')
    @patch('back.views.Event')
    def test_put_invalid_data_returns_400(self, mock_event_model, mock_serializer_class):
        request = self.factory.put('/api/edit_event/1/', data={}, format='json')
        force_authenticate(request, user=self.user)

        mock_event = MagicMock()
        type(mock_event).is_deleted = PropertyMock(return_value=False)
        mock_event_model.objects.get.return_value = mock_event

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'name_event': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        response = edit_event(request, 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('back.views.Event')
    def test_delete_event_success(self, mock_event_model):
        request = self.factory.delete('/api/edit_event/1/')
        force_authenticate(request, user=self.user)

        mock_event = MagicMock()
        type(mock_event).is_deleted = PropertyMock(return_value=False)
        mock_event_model.objects.get.return_value = mock_event

        response = edit_event(request, 1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        mock_event.delete.assert_called_once()

    def test_unauthenticated_user_returns_401(self):
        request = self.factory.put('/api/edit_event/1/', data=self.sample_data, format='json')
        request.user = MagicMock(is_authenticated=False)

        response = edit_event(request, 1)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class NewsGetViewMockedTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.sample_news_data = {
            'id': 1,
            'title': 'Sample News',
            'text_news': 'News content here.',
            'photo': 'some_photo.jpg',
            'create_at': '2024-05-01T00:00:00Z',
            'is_deleted': False
        }

    @patch('back.views.NewsSerializer')
    @patch('back.views.News')
    def test_get_all_news(self, mock_news_model, mock_serializer_class):
        request = self.factory.get('/api/news_get/all')

        mock_queryset = MagicMock()
        mock_news_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_news_data] * 5
        mock_serializer_class.return_value = mock_serializer

        response = news_get(request, 'all')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 5)

    @patch('back.views.NewsSerializer')
    @patch('back.views.News')
    def test_get_three_news(self, mock_news_model, mock_serializer_class):
        request = self.factory.get('/api/news_get/three')

        mock_queryset = MagicMock()
        mock_news_model.objects.all.return_value.filter.return_value.order_by.return_value.__getitem__.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_news_data] * 3
        mock_serializer_class.return_value = mock_serializer

        response = news_get(request, 'three')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    @patch('back.views.NewsSerializer')
    @patch('back.views.News')
    def test_get_thirty_news(self, mock_news_model, mock_serializer_class):
        request = self.factory.get('/api/news_get/thirty')

        mock_queryset = MagicMock()
        mock_news_model.objects.all.return_value.filter.return_value.order_by.return_value.__getitem__.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_news_data] * 30
        mock_serializer_class.return_value = mock_serializer

        response = news_get(request, 'thirty')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 30)

    @patch('back.views.NewsSerializer')
    @patch('back.views.News')
    def test_get_news_by_id_success(self, mock_news_model, mock_serializer_class):
        request = self.factory.get('/api/news_get/1')
        mock_news = MagicMock()
        mock_news.is_deleted = False
        mock_news_model.objects.get.return_value = mock_news
        mock_serializer = MagicMock()
        mock_serializer.data = self.sample_news_data
        mock_serializer_class.return_value = mock_serializer

        response = news_get(request, '1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, self.sample_news_data)

    @patch('back.views.News')
    def test_get_news_by_id_invalid_id(self, mock_news_model):
        request = self.factory.get('/api/news_get/invalid')
        response = news_get(request, 'invalid')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('back.views.News.objects.get')
    def test_get_news_by_id_not_found(self, mock_news_model):
        request = self.factory.get('/api/news_get/999')
        mock_news_model.side_effect = News.DoesNotExist
        response = news_get(request, '999')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.News')
    def test_get_news_by_id_is_deleted(self, mock_news_model):
        request = self.factory.get('/api/news_get/1')
        mock_news = MagicMock()
        mock_news.is_deleted = True
        mock_news_model.objects.get.return_value = mock_news
        response = news_get(request, '1')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class NewsPostViewMockedTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        
        self.user = MagicMock(is_authenticated=True)
       
        self.sample_data = {
            'title': 'Test News',
            'text_news': 'This is a test.',
            'photo': 'photo.jpg'
        }

    @patch('back.views.NewsSerializer')
    def test_news_post_success(self, mock_serializer_class):
        request = self.factory.post('/api/news_post/param', data=self.sample_data, format='json')
        force_authenticate(request, user=self.user)

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = news_post(request, 'param')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('back.views.NewsSerializer')
    def test_news_post_invalid_data(self, mock_serializer_class):
        request = self.factory.post('/api/news_post/param', data={}, format='json')
        force_authenticate(request, user=self.user)

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'title': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        response = news_post(request, 'param')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_news_post_unauthenticated(self):
        request = self.factory.post('/api/news_post/param', data=self.sample_data, format='json')
        response = news_post(request, 'param')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)


class EditNewsViewTests(unittest.TestCase):
    def setUp(self):
        self.user = MagicMock(is_authenticated=True)
        self.user.save()
        self.factory = APIRequestFactory()
        self.sample_data = {
            "title": "Updated title",
            "text_news": "Updated content",
            "photo": None
        }

    def test_unauthenticated_access_returns_401(self):
        request = self.factory.put('/api/edit_news/1/', data=self.sample_data, format='json')
        response = edit_news(request, 1)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch('back.views.News.objects.get')
    def test_news_does_not_exist_returns_404(self, mock_news_model):
        request = self.factory.put('/api/edit_news/999/', data=self.sample_data, format='json')
        mock_news_model.side_effect = News.DoesNotExist
        force_authenticate(request, user=self.user)
        response = edit_news(request, 999)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.News')
    def test_news_is_deleted_returns_404(self, mock_news_model):
        request = self.factory.put('/api/edit_news/1/', data=self.sample_data, format='json')
        mock_news = MagicMock()
        mock_news.is_deleted = True
        mock_news_model.objects.get.return_value = mock_news
        force_authenticate(request, user=self.user)
        response = edit_news(request, 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)



    @patch('back.views.NewsSerializer')
    @patch('back.views.News')
    def test_valid_put_returns_204(self, mock_news_model, mock_serializer_class):
        request = self.factory.put('/api/edit_news/1/', data=self.sample_data, format='json')
        mock_news = MagicMock()
        mock_news.is_deleted = False
        mock_news_model.objects.get.return_value = mock_news

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer
        force_authenticate(request, user=self.user)
        response = edit_news(request, 1)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        mock_serializer.is_valid.assert_called_once()
        mock_serializer.save.assert_called_once()

    @patch('back.views.NewsSerializer')
    @patch('back.views.News')
    def test_invalid_put_returns_400(self, mock_news_model, mock_serializer_class):
        request = self.factory.put('/api/edit_news/1/', data={}, format='json')
        mock_news = MagicMock()
        mock_news.is_deleted = False
        mock_news_model.objects.get.return_value = mock_news

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {"title": ["This field is required."]}
        mock_serializer_class.return_value = mock_serializer
        force_authenticate(request, user=self.user)
        response = edit_news(request, 1)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    @patch('back.views.News')
    def test_delete_returns_204(self, mock_news_model):
        request = self.factory.delete('/api/edit_news/1/')
        mock_news = MagicMock()
        mock_news.is_deleted = False
        mock_news_model.objects.get.return_value = mock_news
        force_authenticate(request, user=self.user)
        response = edit_news(request, 1)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        mock_news.delete.assert_called_once()

    @patch('back.views.NewsSerializer')
    @patch('back.views.News')
    def test_valid_put_with_photo(self, mock_news_model, mock_serializer_class):
        photo_file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
        data_with_photo = {
            "title": "Updated title with photo",
            "text_news": "Updated content with image",
            "photo": photo_file
        }

        request = self.factory.put('/api/edit_news/1/', data=data_with_photo, format='multipart')

        mock_news = MagicMock()
        mock_news.is_deleted = False
        mock_news_model.objects.get.return_value = mock_news

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer
        force_authenticate(request, user=self.user)
        response = edit_news(request, 1)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        mock_serializer.is_valid.assert_called_once()
        mock_serializer.save.assert_called_once()


    @patch('back.views.NewsSerializer')
    @patch('back.views.News')
    def test_put_deleted_news_even_with_valid_data_returns_404(self, mock_news_model, mock_serializer_class):
        photo_file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
        request = self.factory.put(
            '/api/edit_news/1/', 
            data={
                "title": "Should Fail",
                "text_news": "This news is deleted",
                "photo": photo_file
            }, 
            format='multipart'
        )
        

        mock_news = MagicMock()
        mock_news.is_deleted = True
        mock_news_model.objects.get.return_value = mock_news
        force_authenticate(request, user=self.user)
        response = edit_news(request, 1)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        mock_serializer_class.assert_not_called()

    
class RehersalsGetViewMockedTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.sample_rehersal_data = {
            'id': 1,
            'title': 'Sample Rehersal',
            'date_start': '2025-05-01T00:00:00Z',
            'date_end': '2025-05-10T00:00:00Z',
            'is_last': True,
            'create_at': '2025-04-25T00:00:00Z',
        }

    @patch('back.views.RehersalSerializer')
    @patch('back.views.Rehersal')
    def test_get_all_rehersals(self, mock_rehersal_model, mock_serializer_class):
        request = self.factory.get('/api/rehersals_get/all')
        mock_queryset = MagicMock()
        mock_rehersal_model.objects.all.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_rehersal_data] * 5
        mock_serializer_class.return_value = mock_serializer

        response = rehersals_get(request, 'all')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 5)

    @patch('back.views.RehersalSerializer')
    @patch('back.views.Rehersal')
    def test_get_active_rehersal_open(self, mock_rehersal_model, mock_serializer_class):
        request = self.factory.get('/api/rehersals_get/active')
        mock_rehersal = MagicMock()
        mock_rehersal.is_open.return_value = True
        mock_rehersal_model.objects.get.return_value = mock_rehersal

        mock_serializer = MagicMock()
        mock_serializer.data = self.sample_rehersal_data
        mock_serializer_class.return_value = mock_serializer

        response = rehersals_get(request, 'active')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, self.sample_rehersal_data)

    @patch('back.views.Rehersal')
    def test_get_active_rehersal_closed(self, mock_rehersal_model):
        request = self.factory.get('/api/rehersals_get/active')
        mock_rehersal = MagicMock()
        mock_rehersal.is_open.return_value = False
        mock_rehersal_model.objects.get.return_value = mock_rehersal

        response = rehersals_get(request, 'active')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {})

    @patch('back.views.Rehersal.objects.get')
    def test_get_active_rehersal_not_found(self, mock_rehersal_model):
        request = self.factory.get('/api/rehersals_get/active')
        mock_rehersal_model.side_effect = Rehersal.DoesNotExist

        response = rehersals_get(request, 'active')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {})

    @patch('back.views.RehersalSerializer')
    @patch('back.views.Rehersal')
    def test_get_rehersal_by_id_success(self, mock_rehersal_model, mock_serializer_class):
        request = self.factory.get('/api/rehersals_get/1')
        mock_rehersal = MagicMock()
        mock_rehersal.is_deleted = False
        mock_rehersal_model.objects.get.return_value = mock_rehersal

        mock_serializer = MagicMock()
        mock_serializer.data = self.sample_rehersal_data
        mock_serializer_class.return_value = mock_serializer

        response = rehersals_get(request, '1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, self.sample_rehersal_data)

    @patch('back.views.Rehersal')
    def test_get_rehersal_by_id_invalid(self, mock_rehersal_model):
        request = self.factory.get('/api/rehersals_get/invalid')
        response = rehersals_get(request, 'invalid')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('back.views.Rehersal.objects.get')
    def test_get_rehersal_by_id_not_found(self, mock_rehersal_model):
        request = self.factory.get('/api/rehersals_get/999')
        mock_rehersal_model.side_effect = Rehersal.DoesNotExist
        response = rehersals_get(request, '999')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.Rehersal')
    def test_get_rehersal_by_id_is_deleted(self, mock_rehersal_model):
        request = self.factory.get('/api/rehersals_get/1')
        mock_rehersal = MagicMock()
        mock_rehersal.is_deleted = True
        mock_rehersal_model.objects.get.return_value = mock_rehersal
        response = rehersals_get(request, '1')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class RehersalsPostViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.sample_data = {
            'title': 'New Rehersal',
            'date_start': '2025-05-01T00:00:00Z',
            'date_end': '2025-05-10T00:00:00Z'
        }

    @patch('back.views.RehersalSerializer')
    @patch('back.views.Rehersal')
    def test_post_rehersal_with_previous(self, mock_rehersal_model, mock_serializer_class):
        request = self.factory.post('/api/rehersals_post', data=self.sample_data, format='json')
        force_authenticate(request, user=self.user)

        mock_prev = MagicMock()
        mock_prev.date_end.date.return_value = datetime.date(2025, 5, 20)
        mock_prev.is_last = True

        mock_qs = MagicMock()
        mock_qs.__len__.return_value = 1
        mock_qs.__iter__.return_value = iter([mock_prev])
        mock_rehersal_model.objects.filter.return_value = mock_qs

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = rehersals_post(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_prev.save.assert_called()

    @patch('back.views.RehersalSerializer')
    @patch('back.views.Rehersal')
    def test_post_rehersal_without_previous(self, mock_rehersal_model, mock_serializer_class):
        request = self.factory.post('/api/rehersals_post', data=self.sample_data, format='json')
        force_authenticate(request, user=self.user)

        mock_rehersal_model.objects.filter.return_value = []

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = rehersals_post(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_serializer.save.assert_called()

    @patch('back.views.RehersalSerializer')
    def test_post_rehersal_invalid_data(self, mock_serializer_class):
        request = self.factory.post('/api/rehersals_post', data={}, format='json')
        force_authenticate(request, user=self.user)

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'title': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        response = rehersals_post(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_post_rehersal_unauthenticated(self):
        request = self.factory.post('/api/rehersals_post', data=self.sample_data, format='json')
        response = rehersals_post(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EditRehersalViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.sample_data = {
            'title': 'Updated Rehersal',
            'date_start': '2025-05-01T00:00:00Z',
            'date_end': '2025-05-10T00:00:00Z'
        }

    @patch('back.views.RehersalSerializer')
    @patch('back.views.Rehersal')
    def test_edit_rehersal_success(self, mock_rehersal_model, mock_serializer_class):
        request = self.factory.put('/api/edit_rehersal/1/', data=self.sample_data, format='json')
        force_authenticate(request, user=self.user)

        mock_instance = MagicMock()
        mock_rehersal_model.objects.get.return_value = mock_instance

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = edit_rehersal(request, 1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        mock_serializer.save.assert_called_once()

    @patch('back.views.RehersalSerializer')
    @patch('back.views.Rehersal')
    def test_edit_rehersal_invalid_data(self, mock_rehersal_model, mock_serializer_class):
        request = self.factory.put('/api/edit_rehersal/1/', data={}, format='json')
        force_authenticate(request, user=self.user)

        mock_instance = MagicMock()
        mock_rehersal_model.objects.get.return_value = mock_instance

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'title': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        response = edit_rehersal(request, 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    @patch('back.views.Rehersal.objects.get')
    def test_edit_rehersal_not_found(self, mock_rehersal_model):
        request = self.factory.put('/api/edit_rehersal/999/', data=self.sample_data, format='json')
        force_authenticate(request, user=self.user)

        mock_rehersal_model.side_effect = Rehersal.DoesNotExist

        response = edit_rehersal(request, 999)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_edit_rehersal_unauthenticated(self):
        request = self.factory.put('/api/edit_rehersal/1/', data=self.sample_data, format='json')
        response = edit_rehersal(request, 1)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)


class ApplicantsViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.valid_data = {
            'data_applicant': {
                'Name': 'Иван Иванов',
                'Program': 'ФКН',
                'HasPass': True,
                'Source': 'Друзья',
                'Education_MusicSchool': False,
                'Education_SelfStudy': True,
                'Education_Individual': False,
                'Education_OtherText': '',
                'MusicalInstrument': '',
                'HasPerformanceExperience': True,
                'HasDanceExperience': False,
                'DanceExperienceText': '',
                'Creativity_Choir': True,
                'Creativity_Dance': False,
                'Creativity_Thaetre': False,
                'Creativity_Poetry': False,
                'Creativity_No': False,
                'Creativity_OtherText': '',
                'MusicPreferences': 'Поп',
                'Reasons': 'Хочу петь!',
                'RehersalsTime': 'Да',
                'Email': 'test@example.com',
                'Phone': '89999999999',
                'VK': '',
                'TG': '@ivan'
            },
            'video': 'video.mp4',
            'status': 'new',
            'rehersal_ID': 1
        }

    @patch('back.views.Rehersal')
    @patch('back.views.ApplicantSerializer')
    def test_successful_application_submission(self, mock_serializer_class, mock_rehersal_model):
        request = self.factory.post('/api/applicants/', data=self.valid_data, format='json')

        mock_rehersal = MagicMock()
        mock_rehersal.is_open.return_value = True
        mock_rehersal_model.objects.get.return_value = mock_rehersal

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = applicants(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_serializer.save.assert_called_once()

    @patch('back.views.ApplicantSerializer')
    def test_invalid_application_data(self, mock_serializer_class):
        request = self.factory.post('/api/applicants/', data={}, format='json')

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'data_applicant': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        response = applicants(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('data_applicant', response.data)

    @patch('back.views.Rehersal')
    @patch('back.views.ApplicantSerializer')
    def test_rehersal_not_open(self, mock_serializer_class, mock_rehersal_model):
        request = self.factory.post('/api/applicants/', data=self.valid_data, format='json')

        mock_rehersal = MagicMock()
        mock_rehersal.is_open.return_value = False
        mock_rehersal_model.objects.get.return_value = mock_rehersal

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = applicants(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('back.views.Rehersal.objects.get')
    @patch('back.views.ApplicantSerializer')
    def test_rehersal_does_not_exist(self, mock_serializer_class, mock_rehersal_model):
        request = self.factory.post('/api/applicants/', data=self.valid_data, format='json')

        mock_rehersal_model.side_effect = Rehersal.DoesNotExist

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = applicants(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class AdminApplicantListTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.rehersal_id = 1
        self.sample_applicant_data = {
            'id': 1,
            'data_applicant': {
                "Name": "Test Name",
                "Program": "Test Program",
                "HasPass": True,
                "Source": "Social media",
                "Education_MusicSchool": True,
                "Education_SelfStudy": False,
                "Education_Individual": False,
                "Education_OtherText": "",
                "MusicalInstrument": "",
                "HasPerformanceExperience": True,
                "HasDanceExperience": False,
                "DanceExperienceText": "",
                "Creativity_Choir": True,
                "Creativity_Dance": False,
                "Creativity_Thaetre": False,
                "Creativity_Poetry": False,
                "Creativity_No": False,
                "Creativity_OtherText": "",
                "MusicPreferences": "Jazz",
                "Reasons": "Love music",
                "RehersalsTime": "Weekends",
                "Email": "test@example.com",
                "Phone": "1234567890",
                "VK": "",
                "TG": "@testuser"
            },
            'status': Applicant.ApplicantStatus.New_applicant,
            'video': 'video.mp4',
            'rehersal_ID': self.rehersal_id,
            'create_at': '2024-05-01T00:00:00Z'
        }

    @patch('back.views.ApplicantSerializer')
    @patch('back.views.Applicant')
    def test_get_all_applicants(self, mock_applicant_model, mock_serializer_class):
        request = self.factory.get(f'/api/admin_applicant_list/{self.rehersal_id}/all')
        force_authenticate(request, user=self.user)

        mock_queryset = MagicMock()
        mock_applicant_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_applicant_data] * 3
        mock_serializer_class.return_value = mock_serializer

        response = admin_applicant_list(request, self.rehersal_id, 'all')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    @patch('back.views.ApplicantSerializer')
    @patch('back.views.Applicant')
    def test_get_new_applicants(self, mock_applicant_model, mock_serializer_class):
        request = self.factory.get(f'/api/admin_applicant_list/{self.rehersal_id}/new')
        force_authenticate(request, user=self.user)

        mock_queryset = MagicMock()
        mock_applicant_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_applicant_data]
        mock_serializer_class.return_value = mock_serializer

        response = admin_applicant_list(request, self.rehersal_id, 'new')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    @patch('back.views.ApplicantSerializer')
    @patch('back.views.Applicant')
    def test_get_failed_applicants(self, mock_applicant_model, mock_serializer_class):
        request = self.factory.get(f'/api/admin_applicant_list/{self.rehersal_id}/fail')
        force_authenticate(request, user=self.user)

        mock_queryset = MagicMock()
        mock_applicant_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = []
        mock_serializer_class.return_value = mock_serializer

        response = admin_applicant_list(request, self.rehersal_id, 'fail')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    @patch('back.views.ApplicantSerializer')
    @patch('back.views.Applicant')
    def test_get_passed_applicants(self, mock_applicant_model, mock_serializer_class):
        request = self.factory.get(f'/api/admin_applicant_list/{self.rehersal_id}/pass')
        force_authenticate(request, user=self.user)

        mock_queryset = MagicMock()
        mock_applicant_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_applicant_data]
        mock_serializer_class.return_value = mock_serializer

        response = admin_applicant_list(request, self.rehersal_id, 'pass')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_unauthenticated_request(self):
        request = self.factory.get(f'/api/admin_applicant_list/{self.rehersal_id}/all')
        response = admin_applicant_list(request, self.rehersal_id, 'all')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

class AdminApplicantTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.applicant_id = 1
        self.sample_applicant_data = {
            'id': 1,
            'data_applicant': {
                "Name": "Test Name",
                "Program": "Test Program",
                "HasPass": True,
                "Source": "Social media",
                "Education_MusicSchool": True,
                "Education_SelfStudy": False,
                "Education_Individual": False,
                "Education_OtherText": "",
                "MusicalInstrument": "",
                "HasPerformanceExperience": True,
                "HasDanceExperience": False,
                "DanceExperienceText": "",
                "Creativity_Choir": True,
                "Creativity_Dance": False,
                "Creativity_Thaetre": False,
                "Creativity_Poetry": False,
                "Creativity_No": False,
                "Creativity_OtherText": "",
                "MusicPreferences": "Jazz",
                "Reasons": "Love music",
                "RehersalsTime": "Weekends",
                "Email": "test@example.com",
                "Phone": "1234567890",
                "VK": "",
                "TG": "@testuser"
            },
            'status': Applicant.ApplicantStatus.New_applicant,
            'video': 'video.mp4',
            'rehersal_ID': 1,
            'create_at': '2024-05-01T00:00:00Z'
        }

    @patch('back.views.ApplicantSerializer')
    @patch('back.views.Applicant')
    def test_get_applicant_authenticated(self, mock_applicant_model, mock_serializer_class):
        request = self.factory.get(f'/api/admin_applicant/{self.applicant_id}')
        force_authenticate(request, user=self.user)

        mock_applicant_instance = MagicMock()
        mock_applicant_model.objects.get.return_value = mock_applicant_instance

        mock_serializer = MagicMock()
        mock_serializer.data = self.sample_applicant_data
        mock_serializer_class.return_value = mock_serializer

        response = admin_applicant(request, self.applicant_id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.applicant_id)

    @patch('back.views.Applicant.objects.get')
    def test_get_applicant_not_found(self, mock_applicant_model):
        request = self.factory.get(f'/api/admin_applicant/{self.applicant_id}')
        force_authenticate(request, user=self.user)

        mock_applicant_model.side_effect = Applicant.DoesNotExist

        response = admin_applicant(request, self.applicant_id)
        self.assertEqual(response.status_code, 404)

    @patch('back.views.Applicant.objects.get')
    def test_patch_applicant_not_found(self, mock_applicant_model):
        request = self.factory.patch(f'/api/admin_applicant/{self.applicant_id}', {'status': 'Fail'}, format='json')
        force_authenticate(request, user=self.user)

        mock_applicant_model.side_effect = Applicant.DoesNotExist

        response = admin_applicant(request, self.applicant_id)
        self.assertEqual(response.status_code, 404)

    @patch('back.views.Applicant')
    def test_patch_applicant_status_update(self, mock_applicant_model):
        request = self.factory.patch(f'/api/admin_applicant/{self.applicant_id}', {'status': 'Pass'}, format='json')
        force_authenticate(request, user=self.user)

        mock_applicant_instance = MagicMock()
        mock_applicant_model.objects.get.return_value = mock_applicant_instance

        response = admin_applicant(request, self.applicant_id)

        self.assertEqual(response.status_code, 204)
        mock_applicant_instance.save.assert_called_once()
        self.assertEqual(mock_applicant_instance.status, 'Pass')

    @patch('back.views.Applicant')
    def test_patch_no_data(self, mock_applicant_model):
        request = self.factory.patch(f'/api/admin_applicant/{self.applicant_id}', {'extra': 'oops'}, format='json')
        force_authenticate(request, user=self.user)
        mock_applicant_instance = MagicMock()
        mock_applicant_model.objects.get.return_value = mock_applicant_instance

        response = admin_applicant(request, self.applicant_id)
        self.assertEqual(response.status_code, 400)

    @patch('back.views.Applicant')
    def test_patch_invalid_payload(self, mock_applicant_model):
        request = self.factory.patch(f'/api/admin_applicant/{self.applicant_id}', {'status': 'Pass', 'extra': 'oops'})
        force_authenticate(request, user=self.user)

        mock_applicant_instance = MagicMock()
        mock_applicant_model.objects.get.return_value = mock_applicant_instance

        response = admin_applicant(request, self.applicant_id)
        self.assertEqual(response.status_code, 400)

    def test_unauthenticated_access(self):
        request = self.factory.get(f'/api/admin_applicant/{self.applicant_id}')
        response = admin_applicant(request, self.applicant_id)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class VisitorViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.sample_visitor_data = {
            'data_visitor': {
                'name': 'John Doe',
                'email': 'john@example.com'
            },
            'event_ID': 1
        }

    @patch('back.views.VisitorSerializer')
    @patch('back.views.Event')
    def test_create_visitor_success(self, mock_event_model, mock_serializer_class):
        request = self.factory.post('/api/visitors/', data=self.sample_visitor_data, format='json')

        mock_event_instance = MagicMock()
        mock_event_instance.is_open.return_value = True
        mock_event_model.objects.get.return_value = mock_event_instance

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = visitors(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_serializer.save.assert_called_once()

    @patch('back.views.VisitorSerializer')
    @patch('back.views.Event')
    def test_create_visitor_event_closed(self, mock_event_model, mock_serializer_class):
        request = self.factory.post('/api/visitors/', data=self.sample_visitor_data, format='json')

        mock_event_instance = MagicMock()
        mock_event_instance.is_open.return_value = False
        mock_event_model.objects.get.return_value = mock_event_instance

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = visitors(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_serializer.save.assert_not_called()

    @patch('back.views.VisitorSerializer')
    @patch('back.views.Event.objects.get')
    def test_create_visitor_event_not_found(self, mock_event_model, mock_serializer_class):
        request = self.factory.post('/api/visitors/', data=self.sample_visitor_data, format='json')

        mock_event_model.side_effect = Event.DoesNotExist

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer_class.return_value = mock_serializer

        response = visitors(request)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.VisitorSerializer')
    def test_create_visitor_invalid_data(self, mock_serializer_class):
        request = self.factory.post('/api/visitors/', data={}, format='json')

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'data_visitor': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        response = visitors(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('data_visitor', response.data)


class AdminVisitorListTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.event_id = 1
        self.sample_visitor_data = {
            'id': 1,
            'data_visitor': {
                'name': 'Jane Doe',
                'email': 'jane@example.com'
            },
            'event_ID': self.event_id,
            'create_at': '2024-05-01T12:00:00Z'
        }

    @patch('back.views.VisitorSerializer')
    @patch('back.views.Visitor')
    def test_get_visitor_list_success(self, mock_visitor_model, mock_serializer_class):
        request = self.factory.get(f'/admin/visitors/{self.event_id}/')
        force_authenticate(request, user=self.user)

        mock_queryset = MagicMock()
        mock_visitor_model.objects.all.return_value.filter.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [self.sample_visitor_data] * 2
        mock_serializer_class.return_value = mock_serializer

        response = admin_visitor_list(request, self.event_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        # Проверка вызова с правильными аргументами через .call_args
        args, kwargs = mock_serializer_class.call_args
        self.assertEqual(args[0], mock_queryset)
        self.assertIn('context', kwargs)
        self.assertIn('request', kwargs['context'])
        self.assertTrue(kwargs['many'])

        

    def test_unauthenticated_user(self):
        request = self.factory.get(f'/api/admin_visitor_list/{self.event_id}/')
        response = admin_visitor_list(request, self.event_id)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)


class AdminVisitorTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.visitor_id = 1
        self.sample_visitor_data = {
            'id': self.visitor_id,
            'data_visitor': {
                'name': 'Alice Smith',
                'email': 'alice@example.com'
            },
            'event_ID': 1,
            'create_at': '2024-05-01T12:00:00Z'
        }

    @patch('back.views.VisitorSerializer')
    @patch('back.views.Visitor')
    def test_get_visitor_success(self, mock_visitor_model, mock_serializer_class):
        request = self.factory.get(f'/admin/visitor/{self.visitor_id}/')
        force_authenticate(request, user=self.user)

        mock_visitor_instance = MagicMock()
        mock_visitor_model.objects.get.return_value = mock_visitor_instance

        mock_serializer = MagicMock()
        mock_serializer.data = self.sample_visitor_data
        mock_serializer_class.return_value = mock_serializer

        response = admin_visitor(request, self.visitor_id, None)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.sample_visitor_data)

        args, kwargs = mock_serializer_class.call_args
        self.assertEqual(args[0], mock_visitor_instance)
        self.assertIn('context', kwargs)
        self.assertTrue(kwargs['many'] is False)

    def test_unauthenticated_user(self):
        request = self.factory.get(f'/admin/visitor/{self.visitor_id}/')
        response = admin_visitor(request, self.visitor_id, None)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    @patch('back.views.Visitor.objects.get')
    def test_visitor_does_not_exist(self, mock_visitor_model):
        request = self.factory.get(f'/admin/visitor/{self.visitor_id}/')
        force_authenticate(request, user=self.user)

        mock_visitor_model.side_effect = Visitor.DoesNotExist

        response = admin_visitor(request, self.visitor_id, None)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.Visitor')
    def test_param_not_none_returns_400(self, mock_visitor_model):
        request = self.factory.get(f'/admin/visitor/{self.visitor_id}/extra_param')
        force_authenticate(request, user=self.user)

        mock_visitor_model.objects.get.return_value = MagicMock()

        response = admin_visitor(request, self.visitor_id, 'unexpected')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SendEmailTests(unittest.TestCase):

    @patch('back.views.mail.EmailMessage')
    @patch('back.views.mail.get_connection')
    def test_send_email_success(self, mock_get_connection, mock_email_message):
        mock_connection = MagicMock()
        mock_get_connection.return_value.__enter__.return_value = mock_connection
        mock_connection.send_messages = MagicMock()

        emails = ['test1@example.com', 'test2@example.com']
        theme = 'Test Subject'
        body = 'Hello, this is a test.'

        email_msg_instance = MagicMock()
        mock_email_message.return_value = email_msg_instance

        send_email(emails, theme, body)

        self.assertEqual(mock_email_message.call_count, len(emails))

        for call_args in mock_email_message.call_args_list:
            args, kwargs = call_args
            self.assertEqual(args[0], theme)
            self.assertTrue(body in args[1])
            self.assertIn(args[3][0], emails)

        mock_connection.send_messages.assert_called_once()
        sent_messages = mock_connection.send_messages.call_args[0][0]
        self.assertEqual(len(sent_messages), len(emails))

    @patch('back.views.mail.get_connection')
    def test_send_email_connection_failure(self, mock_get_connection):
        # Исключение будет выброшено при входе в with
        mock_get_connection.return_value.__enter__.side_effect = Exception("Connection error")

        with self.assertRaises(Exception):
            send_email(['test@example.com'], 'Test', 'Body')

class EmailApplicantsTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.rehersal_id = 1
        self.email_data = {
            "emails": ["user1@example.com", "user2@example.com"],
            "theme": "Test Theme",
            "body": "Test Body"
        }

    @patch('back.views.send_email')
    def test_send_email_to_provided_list(self, mock_send_email):
        request = self.factory.post(f'/api/email_applicants/{self.rehersal_id}/', data=self.email_data, format='json')
        force_authenticate(request, user=self.user)

        response = email_applicants(request, self.rehersal_id)

        mock_send_email.assert_called_once_with(
            emails=self.email_data['emails'],
            theme=self.email_data['theme'],
            body=self.email_data['body']
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    @patch('back.views.send_email')
    @patch('back.views.Applicant')
    def test_send_email_to_failed_applicants(self, mock_applicant_model, mock_send_email):
        self.email_data['emails'] = []

        mock_queryset = MagicMock()
        mock_applicant_model.objects.filter.return_value.values_list.return_value = ['fail1@example.com', 'fail2@example.com']

        request = self.factory.post(f'/api/email_applicants/{self.rehersal_id}/', data=self.email_data, format='json')
        force_authenticate(request, user=self.user)

        response = email_applicants(request, self.rehersal_id)

        mock_send_email.assert_called_once_with(
            emails=['fail1@example.com', 'fail2@example.com'],
            theme=self.email_data['theme'],
            body=self.email_data['body']
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthenticated_user(self):
        request = self.factory.post(f'/api/email_applicants/{self.rehersal_id}/', data=self.email_data, format='json')
        # no force_authenticate

        response = email_applicants(request, self.rehersal_id)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    @patch('back.views.Applicant')
    def test_email_fetching_fails(self, mock_applicant_model):
        self.email_data['emails'] = []

        # simulate DB error
        mock_applicant_model.objects.filter.side_effect = Exception("DB error")

        request = self.factory.post(f'/api/email_applicants/{self.rehersal_id}/', data=self.email_data, format='json')
        force_authenticate(request, user=self.user)

        response = email_applicants(request, self.rehersal_id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class EmailEventTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.event_id = 1
        self.email_data = {
            "emails": ["person1@example.com", "person2@example.com"],
            "theme": "Event Info",
            "body": "Details about the event."
        }

    @patch('back.views.send_email')
    def test_send_email_to_provided_list(self, mock_send_email):
        request = self.factory.post(f'/api/admin/email_event/{self.event_id}/', data=self.email_data, format='json')
        force_authenticate(request, user=self.user)

        response = email_event(request, self.event_id)

        mock_send_email.assert_called_once_with(
            emails=self.email_data['emails'],
            theme=self.email_data['theme'],
            body=self.email_data['body']
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    @patch('back.views.Visitor')
    @patch('back.views.Event')
    @patch('back.views.send_email')
    def test_send_email_to_event_visitors(self, mock_send_email, mock_event_model, mock_visitor_model):
        self.email_data['emails'] = []

        mock_event = MagicMock()
        mock_event.is_deleted.return_value = False
        mock_event_model.objects.get.return_value = mock_event

        mock_visitor_model.objects.filter.return_value.values_list.return_value = ['visit1@example.com', 'visit2@example.com']

        request = self.factory.post(f'/api/admin/email_event/{self.event_id}/', data=self.email_data, format='json')
        force_authenticate(request, user=self.user)

        response = email_event(request, self.event_id)

        mock_send_email.assert_called_once_with(
            emails=['visit1@example.com', 'visit2@example.com'],
            theme=self.email_data['theme'],
            body=self.email_data['body']
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthenticated_request(self):
        request = self.factory.post(f'/api/admin/email_event/{self.event_id}/', data=self.email_data, format='json')
        response = email_event(request, self.event_id)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    @patch('back.views.Event.objects.get')
    def test_event_not_found(self, mock_event_model):
        self.email_data['emails'] = []
        mock_event_model.side_effect = Event.DoesNotExist

        request = self.factory.post(f'/api/admin/email_event/{self.event_id}/', data=self.email_data, format='json')
        force_authenticate(request, user=self.user)

        response = email_event(request, self.event_id)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.Event')
    def test_event_is_deleted(self, mock_event_model):
        self.email_data['emails'] = []
        mock_event = MagicMock()
        mock_event.is_deleted.return_value = True
        mock_event_model.objects.get.return_value = mock_event

        request = self.factory.post(f'/api/admin/email_event/{self.event_id}/', data=self.email_data, format='json')
        force_authenticate(request, user=self.user)

        response = email_event(request, self.event_id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class GalleryViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.sample_photo_data = {
            'id': 1,
            'photo': 'http://example.com/photo.jpg'
        }

    @patch('back.views.PhotoGallerySerializer')
    @patch('back.views.PhotoGallery.objects')
    def test_get_gallery_photos(self, mock_photo_objects, mock_serializer_class):
        request = self.factory.get('/api/gallery/')

        mock_queryset = MagicMock()
        mock_photo_objects.all.return_value.order_by.return_value = mock_queryset

        mock_serializer = MagicMock()
        mock_serializer.data = [{'id': 1, 'photo': 'http://example.com/photo.jpg'}]
        mock_serializer_class.return_value = mock_serializer

        response = gallery(request)

        mock_serializer_class.assert_called_once_with(mock_queryset, context={'request': ANY}, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [{'id': 1, 'photo': 'http://example.com/photo.jpg'}])

    @patch('back.views.PhotoGallerySerializer')
    def test_post_gallery_photo_success(self, mock_serializer_class):
        image_file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
        data = {'photo': image_file}
        request = self.factory.post('/api/gallery/', data=data, format='multipart')

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer

        response = gallery(request)

        mock_serializer_class.assert_called_once()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('back.views.PhotoGallerySerializer')
    def test_post_gallery_photo_invalid(self, mock_serializer_class):
        request = self.factory.post('/api/gallery/', data=self.sample_photo_data, format='multipart')

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'photo': ['This field is required.']}
        mock_serializer_class.return_value = mock_serializer

        response = gallery(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'photo': ['This field is required.']})

    @patch('back.views.PhotoGallerySerializer')
    def test_post_gallery_photo_with_file(self, mock_serializer_class):
        # Создаём "файл"
        image_file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
        request = self.factory.post('/api/gallery/', data={'photo': image_file}, format='multipart')

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer
        response = gallery(request)

        # Проверка: сериализатор получил файл
        mock_serializer_class.assert_called_once()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class EditGalleryTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = MagicMock(is_authenticated=True)
        self.image = SimpleUploadedFile("test.jpg", b"image_content", content_type="image/jpeg")

    @patch('back.views.PhotoGallery.objects.get')
    @patch('back.views.PhotoGallerySerializer')
    def test_edit_gallery_put_success(self, mock_serializer_class, mock_get):
        photo_instance = MagicMock()
        mock_get.return_value = photo_instance

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer

        request = self.factory.put('/api/edit_gallery/1/', {'photo': self.image}, format='multipart')
        force_authenticate(request, user=self.user)

        response = edit_gallery(request, id=1)

        mock_serializer_class.assert_called_once_with(photo_instance, data=ANY, context=ANY)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    @patch('back.views.PhotoGallery.objects.get')
    @patch('back.views.PhotoGallerySerializer')
    def test_edit_gallery_put_invalid(self, mock_serializer_class, mock_get):
        mock_get.return_value = MagicMock()
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer.errors = {'photo': ['Invalid']}
        mock_serializer_class.return_value = mock_serializer

        request = self.factory.put('/api/edit_gallery/1/', {'photo': self.image}, format='multipart')
        force_authenticate(request, user=self.user)

        response = edit_gallery(request, id=1)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'photo': ['Invalid']})

    @patch('back.views.PhotoGallery.objects.get')
    def test_edit_gallery_delete_success(self, mock_get):
        photo_mock = MagicMock()
        photo_mock.photo.path = '/fake/path/test.jpg'
        photo_mock.photo and os.path.isfile(photo_mock.photo.path)  # fake path — os.remove won't run
        mock_get.return_value = photo_mock

        request = self.factory.delete('/api/edit_gallery/1/')
        force_authenticate(request, user=self.user)

        with patch('os.path.isfile', return_value=True), patch('os.remove') as mock_remove:
            response = edit_gallery(request, id=1)

        mock_remove.assert_called_once_with('/fake/path/test.jpg')
        photo_mock.delete.assert_called_once()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_edit_gallery_unauthenticated(self):
        request = self.factory.put('/api/edit_gallery/1/', {'photo': self.image}, format='multipart')
        # не аутентифицирован

        response = edit_gallery(request, id=1)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch('back.views.PhotoGallery.objects.get')
    def test_edit_gallery_not_found(self, mock_get):
        mock_get.side_effect = PhotoGallery.DoesNotExist

        request = self.factory.put('/api/edit_gallery/999/', {'photo': self.image}, format='multipart')
        force_authenticate(request, user=self.user)

        response = edit_gallery(request, id=999)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class RegistrationViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    @patch('back.views.CustomUser.objects')
    def test_registration_user_already_exists(self, mock_user_objects):
        mock_user_objects.filter.return_value = [MagicMock()]
        data = {
            'email': 'test@example.com',
            'password': '1234',
            'role_user': 'ADMIN',
            'body_email': 'Добро пожаловать!'
        }

        request = self.factory.post('/api/registration/', data)
        response = registration(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    @patch('back.views.send_email')
    @patch('back.views.RefreshToken')
    @patch('back.views.CustomUserSerializer')
    @patch('back.views.CustomUser.objects')
    def test_registration_success(self, mock_user_objects, mock_serializer_class, mock_refresh_class, mock_send_email):
        # Email is not taken
        mock_user_objects.filter.return_value = []

        # Setup serializer
        mock_user = MagicMock(id=1, email='test@example.com')
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = mock_user
        mock_serializer_class.return_value = mock_serializer

        # Setup token
        mock_token = MagicMock()
        mock_token.payload = {}
        mock_refresh_class.for_user.return_value = mock_token

        # Request data
        data = {
            'email': 'test@example.com',
            'password': 'securepass',
            'role_user': 'Admin',
            'body_email': 'Добро пожаловать!'
        }

        request = self.factory.post('/api/registration/', data)
        response = registration(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_serializer_class.assert_called_once_with(data={
            'email': 'test@example.com',
            'password': 'securepass',
            'role_user': 'Admin',
            'username': 'test@example.com'
        })
        mock_refresh_class.for_user.assert_called_once_with(mock_user)
        mock_send_email.assert_called_once_with(
            ['test@example.com'],
            'Ваш первичный пароль',
            'Добро пожаловать!'
        )

    @patch('back.views.CustomUser.objects')
    @patch('back.views.CustomUserSerializer')
    def test_registration_invalid_data(self, mock_serializer_class, mock_user_objects):
        mock_user_objects.filter.return_value = []
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer_class.return_value = mock_serializer

        data = {
            'email': 'bad-email',
            'password': '',
            'role_user': 'Admin',
            'body_email': 'Текст'
        }

        request = self.factory.post('/api/registration/', data)
        response = registration(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('back.views.send_email')
    @patch('back.views.CustomUser.objects')
    @patch('back.views.CustomUserSerializer')
    def test_registration_invalid_data_no_email_sent(self, mock_serializer_class, mock_user_objects, mock_send_email):
        mock_user_objects.filter.return_value = []

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = False
        mock_serializer_class.return_value = mock_serializer

        data = {
            'email': 'bademail',
            'password': '',
            'role_user': 'Admin',
            'body_email': 'Текст письма'
        }

        request = self.factory.post('/api/registration/', data)
        response = registration(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_send_email.assert_not_called()

    @patch('back.views.send_email')
    @patch('back.views.RefreshToken.for_user')
    @patch('back.views.CustomUserSerializer')
    @patch('back.views.CustomUser.objects')
    def test_registration_refresh_token_payload(self, mock_user_objects, mock_serializer_class, mock_refresh_for_user, mock_send_email):
        mock_user_objects.filter.return_value = []

        mock_user = MagicMock()
        mock_user.id = 123
        mock_user.email = 'user@example.com'

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = mock_user
        mock_serializer_class.return_value = mock_serializer

        mock_payload = MagicMock()
        mock_refresh_token = MagicMock()
        mock_refresh_token.payload = mock_payload
        mock_refresh_token.access_token = 'fake_access_token'
        mock_refresh_for_user.return_value = mock_refresh_token

        data = {
            'email': mock_user.email,
            'password': 'securepass123',
            'role_user': 'Admin',
            'body_email': 'Welcome!'
        }
        request = self.factory.post('/api/registration/', data)
        response = registration(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_payload.update.assert_called_once_with({
            'user_id': mock_user.id,
            'email': mock_user.email
        })

class LoginViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.url = '/api/login/'
        self.email = 'test@example.com'
        self.password = 'securepassword'


    def test_login_missing_fields(self):
        request = self.factory.post(self.url, {'email': 'user@example.com'})  # password отсутствует
        response = login(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    @patch('back.views.authenticate')
    def test_login_invalid_credentials(self, mock_authenticate):
        mock_authenticate.return_value = None
        data = {'email': 'user@example.com', 'password': 'wrongpass'}
        request = self.factory.post(self.url, data)
        response = login(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    @patch('back.views.RefreshToken.for_user')
    @patch('back.views.authenticate')
    def test_login_success(self, mock_authenticate, mock_for_user):
        mock_user = MagicMock()
        mock_user.id = 1
        mock_user.email = 'user@example.com'
        mock_authenticate.return_value = mock_user

        mock_payload = MagicMock()
        mock_token = MagicMock()
        mock_token.payload = mock_payload
        mock_token.access_token = 'access123'
        mock_for_user.return_value = mock_token

        data = {'email': mock_user.email, 'password': 'correctpass'}
        request = self.factory.post(self.url, data)
        response = login(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_payload.update.assert_called_once_with({
            'user_id': mock_user.id,
            'email': mock_user.email
        })
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)
    
    
    @patch('back.views.authenticate', side_effect=Exception("Auth failed"))
    def test_login_authenticate_exception_returns_500(self, mock_auth):
        request = self.factory.post('/api/login/', {
            'email': self.email,
            'password': self.password
        }, format='json')

        response = login(request)

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @patch('back.views.authenticate', side_effect=Exception("Unexpected error"))
    def test_login_unexpected_error_returns_500(self, mock_auth):
        request = self.factory.post('/api/login/', {
            'email': self.email,
            'password': self.password
        }, format='json')

        response = login(request)

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class LogoutViewTests(unittest.TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.valid_token = 'valid.refresh.token'
        self.invalid_token = 'invalid.token'

    @patch('back.views.RefreshToken')
    def test_logout_success(self, mock_refresh_token_class):
        mock_token = MagicMock()
        mock_refresh_token_class.return_value = mock_token

        request = self.factory.post('/api/logout/', {'refresh_token': self.valid_token}, format='json')
        response = logout(request)

        mock_refresh_token_class.assert_called_once_with(self.valid_token)
        mock_token.blacklist.assert_called_once()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'success': 'Выход успешен'})

    def test_logout_missing_token(self):
        request = self.factory.post('/api/logout/', {}, format='json')
        response = logout(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Необходим Refresh token'})

    @patch('back.views.RefreshToken', side_effect=Exception("Invalid token"))
    def test_logout_invalid_token(self, mock_refresh_token_class):
        request = self.factory.post('/api/logout/', {'refresh_token': self.invalid_token}, format='json')
        response = logout(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Неверный Refresh token'})

    @patch('back.views.RefreshToken')
    def test_logout_blacklist_exception(self, mock_refresh_token_class):
        mock_token = MagicMock()
        mock_token.blacklist.side_effect = Exception("Unexpected error")
        mock_refresh_token_class.return_value = mock_token

        request = self.factory.post('/api/logout/', {'refresh_token': self.valid_token}, format='json')
        response = logout(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Неверный Refresh token'})

class ChangePasswordTests(unittest.TestCase):
    def setUp(self):
        CustomUser.objects.all().delete()
        self.factory = APIRequestFactory()
        self.user = CustomUser(email="test@example.com", username="test@example.com")
        self.user.set_password("old_password")
        self.user.save()

    @patch('back.views.CustomUserSerializer')
    @patch('back.views.authenticate')
    def test_change_pass_success(self, mock_serializer_class, mock_authenticate):
        request = self.factory.put('/api/change_pass/', {
            'old_password': 'oldpass',
            'new_password': 'newpass'
        })
        force_authenticate(request, user=self.user)
        mock_authenticate.return_value = self.user
        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.save.return_value = None
        mock_serializer_class.return_value = mock_serializer

        response = change_pass(request)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        mock_serializer_class.assert_called_once()

    def test_change_pass_not_authenticated(self):
        request = self.factory.put('/api/change_pass/', {
            'old_password': 'oldpass',
            'new_password': 'newpass'
        })

        response = change_pass(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch('back.views.authenticate')
    def test_change_pass_wrong_old_password(self, mock_authenticate):
        
        request = self.factory.put('/api/change_pass/', {
            'old_password': 'wrongpass',
            'new_password': 'newpass'
        })
        mock_authenticate.return_value = None
        force_authenticate(request, user=self.user)
        response = change_pass(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'Неверный email или пароль'})

    @patch('back.views.authenticate', side_effect=Exception("Unexpected error"))
    def test_change_pass_unexpected_error(self, mock_auth):
        request = self.factory.put('/api/change_pass/', {
            'old_password': 'oldpass',
            'new_password': 'newpass'
        })
        force_authenticate(request, user=self.user)
        response = change_pass(request)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data, {'error': 'Internal server error'})

class EmailChangePassTests(unittest.TestCase):
    def setUp(self):
        CustomUser.objects.all().delete()
        self.factory = APIRequestFactory()
        self.user = CustomUser(email="test@example.com", username="test@example.com")
        self.user.set_password("old_password")
        self.user.save()

    def test_email_change_pass_user_not_found(self):
        request = self.factory.put('/api/email_change_pass/', {
            'email': 'nonexistent@example.com',
            'password': 'newpass',
            'body_email': 'Текст письма'
        })
        response = email_change_pass(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('back.views.send_email')
    def test_email_change_pass_success(self, mock_send_email):
        request = self.factory.put('/api/email_change_pass/', {
            'email': 'test@example.com',
            'password': 'newsecurepass',
            'body_email': 'Ваш новый пароль: newsecurepass'
        })

        response = email_change_pass(request)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Обновляем из БД
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newsecurepass'))
        mock_send_email.assert_called_once_with(
            ['test@example.com'],
            "Восстановление пароля",
            'Ваш новый пароль: newsecurepass'
        )

    @patch('back.views.send_email', side_effect=Exception("SMTP error"))
    def test_email_change_pass_send_email_fails(self, mock_send_email):
        request = self.factory.put('/api/email_change_pass/', {
            'email': 'test@example.com',
            'password': 'somepass',
            'body_email': 'Email text'
        })
        response = email_change_pass(request)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

class RehersalIsOpenTests(unittest.TestCase):
    def setUp(self):
        self.today = datetime.date.today()
        self.yesterday = self.today - datetime.timedelta(days=1)
        self.tomorrow = self.today + datetime.timedelta(days=1)

        self.now = datetime.datetime.now()

    def test_is_open_true(self):
        """Прослушивание открыто: is_last=True и сегодня в интервале"""
        rehersal = Rehersal.objects.create(
            title="Открытое Прослушивание",
            date_start=datetime.datetime.combine(self.yesterday, datetime.time.min),
            date_end=datetime.datetime.combine(self.tomorrow, datetime.time.max),
            is_last=True
        )
        self.assertTrue(rehersal.is_open())

    def test_is_open_false_not_last(self):
        """Прослушивание  не открыто, потому что is_last=False"""
        rehersal = Rehersal.objects.create(
            title="Закрытая по флагу",
            date_start=datetime.datetime.combine(self.yesterday, datetime.time.min),
            date_end=datetime.datetime.combine(self.tomorrow, datetime.time.max),
            is_last=False
        )
        self.assertFalse(rehersal.is_open())

    def test_is_open_false_before_start(self):
        """Прослушивание ещё не началось"""
        future_start = self.tomorrow + datetime.timedelta(days=1)
        future_end = self.tomorrow + datetime.timedelta(days=2)
        rehersal = Rehersal.objects.create(
            title="Будущее прослушивание",
            date_start=datetime.datetime.combine(future_start, datetime.time.min),
            date_end=datetime.datetime.combine(future_end, datetime.time.max),
            is_last=True
        )
        self.assertFalse(rehersal.is_open())

    def test_is_open_false_after_end(self):
        """Прослушивание  уже прошло"""
        past_start = self.yesterday - datetime.timedelta(days=2)
        past_end = self.yesterday - datetime.timedelta(days=1)
        rehersal = Rehersal.objects.create(
            title="Прошедшее прослушивание",
            date_start=datetime.datetime.combine(past_start, datetime.time.min),
            date_end=datetime.datetime.combine(past_end, datetime.time.max),
            is_last=True
        )
        self.assertFalse(rehersal.is_open())

    def test_is_open_today_only(self):
        """Дата начала и конца — сегодня"""
        rehersal = Rehersal.objects.create(
            title="Сегодняшнее прослушивание",
            date_start=datetime.datetime.combine(self.today, datetime.time.min),
            date_end=datetime.datetime.combine(self.today, datetime.time.max),
            is_last=True
        )
        self.assertTrue(rehersal.is_open())

class ChoiristerModelTests(unittest.TestCase):
    def setUp(self):
        self.test_file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")

    def test_default_voice(self):
        """По умолчанию голос — Первый альт"""
        choirister = Choirister.objects.create(
            first_name="Анна",
            last_name="Иванова",
            photo=self.test_file
        )
        self.assertEqual(choirister.voice, Choirister.Voices.FIRST_ALT)

    def test_soft_delete(self):
        """Метод delete() делает is_deleted=True, не удаляет запись"""
        choirister = Choirister.objects.create(
            first_name="Алексей",
            last_name="Петров",
            photo=self.test_file
        )
        choirister.delete()
        updated = Choirister.objects.get(id=choirister.id)
        self.assertTrue(updated.is_deleted)

    @patch("back.models.os.remove")
    @patch("back.models.os.path.isfile")
    def test_photo_replaced_old_deleted(self, mock_isfile, mock_remove):
        """При изменении photo старый файл удаляется"""
        mock_isfile.return_value = True

        choirister = Choirister.objects.create(
            first_name="Мария",
            last_name="Смирнова",
            photo=self.test_file
        )
        new_file = SimpleUploadedFile("new.jpg", b"new_content", content_type="image/jpeg")
        choirister.photo = new_file
        choirister.save()

        self.assertTrue(mock_remove.called)
        self.assertTrue(mock_isfile.called)

    def test_voice_choices_valid(self):
        """Все варианты голоса допустимы"""
        for choice in Choirister.Voices.choices:
            instance = Choirister.objects.create(
                first_name="Test",
                last_name="User",
                voice=choice[0],
                photo=self.test_file
            )
            self.assertEqual(instance.voice, choice[0])
       
class EventModelTests(unittest.TestCase):
    def setUp(self):
        self.test_file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")

    def create_event(self, **kwargs):
        defaults = {
            'name_event': 'Test Event',
            'description': 'Test Description',
            'event_time': datetime.datetime.now() - datetime.timedelta(days=1),
            'photo': self.test_file,
            'has_registration': True,
            'limit_people': 10,
            'date_time_open': datetime.datetime.now() - datetime.timedelta(days=2),
            'date_time_close': datetime.datetime.now() + datetime.timedelta(days=1),
        }
        defaults.update(kwargs)
        return Event.objects.create(**defaults)
    
    @patch('back.models.Visitor.objects.filter')
    def test_is_open_returns_true_when_conditions_met(self, mock_visitor_filter):
        mock_visitor_filter.return_value = [MagicMock()] * 5  # имитируем 5 посетителей
        event = self.create_event()
        self.assertTrue(event.is_open())

    @patch('back.models.Visitor.objects.filter')
    def test_is_open_returns_false_if_limit_reached(self, mock_visitor_filter):
        mock_visitor_filter.return_value = [MagicMock()] * 10
        event = self.create_event(limit_people=10)
        self.assertFalse(event.is_open())

    @patch('back.models.Visitor.objects.filter')
    def test_is_open_returns_false_if_registration_closed(self, mock_visitor_filter):
        mock_visitor_filter.return_value = []
        event = self.create_event(date_time_open=datetime.datetime.now() + datetime.timedelta(days=1))
        self.assertFalse(event.is_open())

    def test_delete_sets_is_deleted_true(self):
        event = self.create_event()
        event.delete()
        event.refresh_from_db()
        self.assertTrue(event.is_deleted)


    def test_delete_marks_event_as_deleted(self):
        event = self.create_event()
        event.delete()
        event.refresh_from_db()
        self.assertTrue(event.is_deleted)

    @patch('os.path.isfile')
    @patch('os.remove')
    def test_save_deletes_old_photo_if_changed(self, mock_remove, mock_isfile):
        event = self.create_event()
        old_photo_path = event.photo.path

        mock_isfile.return_value = True
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            new_photo = SimpleUploadedFile(tmp.name.split(os.sep)[-1], b"new_content", content_type="image/jpeg")

        event.photo = new_photo
        event.save()

        mock_remove.assert_called_once_with(old_photo_path)

    def tearDown(self):
        # Clean up uploaded test files
        for event in Event.objects.all():
            if event.photo and os.path.isfile(event.photo.path):
                os.remove(event.photo.path)


class NewsModelTests(unittest.TestCase):
    def setUp(self):
        self.test_photo = SimpleUploadedFile("test.jpg", b"image_content", content_type="image/jpeg")

    def create_news(self, **kwargs):
        defaults = {
            'title': 'Test News',
            'text_news': 'This is test news content.',
            'photo': self.test_photo
        }
        defaults.update(kwargs)
        return News.objects.create(**defaults)

    def test_soft_delete_sets_is_deleted_true(self):
        news = self.create_news()
        news.delete()
        news.refresh_from_db()
        self.assertTrue(news.is_deleted)

    @patch('os.path.isfile')
    @patch('os.remove')
    def test_save_deletes_old_photo_if_changed(self, mock_remove, mock_isfile):
        news = self.create_news()
        old_path = news.photo.path

        mock_isfile.return_value = True
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            new_photo = SimpleUploadedFile(tmp.name.split(os.sep)[-1], b"new image", content_type="image/jpeg")

        news.photo = new_photo
        news.save()

        mock_remove.assert_called_once_with(old_path)

    def tearDown(self):
        # Удаление временных файлов
        for news in News.objects.all():
            if news.photo and os.path.isfile(news.photo.path):
                os.remove(news.photo.path)

class PhotoGalleryModelTests(unittest.TestCase):
    def setUp(self):
        self.test_photo = SimpleUploadedFile("test.jpg", b"image_content", content_type="image/jpeg")

    def create_gallery_entry(self, **kwargs):
        defaults = {
            'photo': self.test_photo,
        }
        defaults.update(kwargs)
        return PhotoGallery.objects.create(**defaults)

    @patch('os.path.isfile')
    @patch('os.remove')
    def test_save_deletes_old_photo_if_changed(self, mock_remove, mock_isfile):
        gallery = self.create_gallery_entry()
        old_path = gallery.photo.path

        mock_isfile.return_value = True
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            new_photo = SimpleUploadedFile(tmp.name.split(os.sep)[-1], b"new image", content_type="image/jpeg")

        gallery.photo = new_photo
        gallery.save()

        mock_remove.assert_called_once_with(old_path)

    @patch('os.remove')
    def test_save_does_not_delete_photo_if_unchanged(self, mock_remove):
        gallery = self.create_gallery_entry()
        gallery.save()
        mock_remove.assert_not_called()

    def tearDown(self):
        # Удаление временных файлов
        for entry in PhotoGallery.objects.all():
            if entry.photo and os.path.isfile(entry.photo.path):
                os.remove(entry.photo.path)