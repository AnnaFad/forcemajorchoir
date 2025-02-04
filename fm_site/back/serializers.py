'''
from rest_framework import serializers
from .models import Rehersal, Applicant, Choirister, Event, Visitor, News, User

class RehersalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rehersal
        fields = ('id', 'title', 'date_start', 'days_for_registration', 'is_last', 'create_at', 'update_at')

class ApplicantSerializer(serializers.ModelSerializer):
    rehersal_ID = RehersalSerializer
    class Meta:
        model = Applicant
        fields = ('id', 'data_applicant', 'status', 'rehersal_ID',  'create_at', 'update_at')
       
class ChoiristerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choirister
        fields = ('id', 'first_name', 'last_name', 'is_conductor', 'description', 'photo', 'is_deleted', 'create_at', 'update_at')
        
class ChoiristerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choirister
        fields = ('id', 'first_name', 'last_name', 'is_conductor', 'description', 'photo', 'is_deleted', 'create_at', 'update_at')

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'name_event', 'description', 'event_time', 'photo', 'has_registration', 'registration_is_open', 
                  'limit_people', 'date_time_open', 'hours_for_registration', 'is_deleted', 'create_at', 'update_at')

class VisitorSerializer(serializers.ModelSerializer):
    event_ID = EventSerializer
    class Meta:
        model = Visitor
        fields = ('id', 'data_visitor', 'event_ID', 'create_at', 'update_at')

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ('id', 'title', 'text_news', 'photo', 'is_deleted', 'create_at', 'update_at')
       
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password_hash', 'role_user', 'create_at', 'update_at')
       
'''  