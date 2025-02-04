from django.db import models

import datetime
from django.utils import timezone
    
    #def __str__(self):
    #    return self.question_text
    #def was_published_recently(self):
    #    now = timezone.now()
    #    return now - datetime.timedelta(days=1) <= self.pub_date <= now

class Rehersal(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=400)
    date_start  = models.DateTimeField()
    days_for_registration  = models.IntegerField()
    is_last = models. BooleanField()
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)
    

class Applicant(models.Model):
    class ApplicantStatus(models.TextChoices):
        New_applicant = 'New'
        Failed_applicant = 'Fail'
        Passed_applicant = 'Pass'
    id = models.AutoField(primary_key=True)
    data_applicant = models.JSONField()
    status = models.CharField(
        max_length=4,
        choices=ApplicantStatus.choices,
        default=ApplicantStatus.New_applicant)
    rehersal_ID = models.ForeignKey(Rehersal, on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

class Choirister(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    is_conductor = models.BooleanField()
    description = models.TextField()
    photo = models.TextField() #Ссылка на S3 хранилище
    is_deleted = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)
    
    def update(self, first_name, last_name, description, photo):
        self.first_name = first_name
        self.last_name = last_name
        self.description = description
        self.photo = photo

    def delete(self):
        self.is_deleted = True

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name_event = models.CharField(max_length=500)
    description = models.TextField()
    event_time = models.DateTimeField()
    photo = models.TextField() #Ссылка на S3 хранилище
    has_registration = models.BooleanField()
    registration_is_open = models.BooleanField(null=True, blank=True) #Возможно это сделать методом
    limit_people = models.IntegerField()
    date_time_open = models.DateTimeField(blank=True, null=True)
    hours_for_registration = models.IntegerField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    create_at  = models.DateTimeField(auto_now_add = True)
    update_at  = models.DateTimeField(auto_now = True)

    def delete(self):
        self.is_deleted = True
    
class Visitor(models.Model):
    id = models.AutoField(primary_key=True)
    data_visitor = models.JSONField()
    event_ID = models.ForeignKey(Event, on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

class News(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=400)
    text_news = models.TextField()
    photo = models.TextField() #Ссылка на S3 хранилище
    is_deleted = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

    def delete(self):
        self.is_deleted = True


class User(models.Model):
    id = models.AutoField(primary_key=True)
    class Roles(models.TextChoices):
        CONDUCTOR = 'Conductor'
        ADMIN = 'Admin'
    email = models.CharField(max_length=100)
    password_hash = models.CharField(max_length=100)
    role_user  = models.CharField(
                    max_length=10,
                    choices=Roles.choices,
                    default=Roles.ADMIN)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

