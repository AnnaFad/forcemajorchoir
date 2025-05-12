from django.db import models
import os
import datetime
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Group, Permission
    
    #def __str__(self):
    #    return self.question_text
    #def was_published_recently(self):
    #    now = timezone.now()
    #    return now - datetime.timedelta(days=1) <= self.pub_date <= now

class Rehersal(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=400)
    date_start  = models.DateTimeField()
    date_end  = models.DateTimeField(default=None)
    is_last = models.BooleanField(default=True)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

    def is_open(self):
        return self.is_last and self.date_start.replace(tzinfo=None).date() <= datetime.datetime.now().replace(tzinfo=None).date() \
                            and datetime.datetime.now().replace(tzinfo=None).date() <= self.date_end.replace(tzinfo=None).date()
    

class Applicant(models.Model):
    class ApplicantStatus(models.TextChoices):
        New_applicant = 'New'
        Failed_applicant = 'Fail'
        Passed_applicant = 'Pass'
    id = models.AutoField(primary_key=True)
    data_applicant = models.JSONField()
    '''
    data_applicant состоит из полей:
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
    status = models.CharField(
        max_length=4,
        choices=ApplicantStatus.choices,
        default=ApplicantStatus.New_applicant)
    video = models.FileField(upload_to='rehearsal/', default=None)
    rehersal_ID = models.ForeignKey(Rehersal, on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

class Choirister(models.Model):
    class Voices(models.TextChoices):
        FIRST_SOPRANO = 'Первое сопрано'
        SECOND_SOPRANO = 'Второе сопрано'
        FIRST_ALT = 'Первый альт'
        SECOND_ALT = 'Второй альт'
        FIRST_TENOR = 'Первый тенор'
        SECOND_TENOR = 'Второй тенор'
        BARITONE = 'Баритон'
        BASS = 'Бас'
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    voice = models.CharField(
                    max_length=15,
                    choices=Voices.choices,
                    default=Voices.FIRST_ALT)
    photo = models.FileField(upload_to='choiristers/')
    is_deleted = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

    def delete(self):
        self.is_deleted = True
        self.save()
    
    def save(self, *args, **kwargs):
        if self.id:  # Check if the object already exists
            old_instance = Choirister.objects.get(pk=self.id)
            if old_instance.photo != self.photo:
                if old_instance.photo and os.path.isfile(old_instance.photo.path):
                    os.remove(old_instance.photo.path)
        super().save(*args, **kwargs)
    
class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name_event = models.CharField(max_length=500)
    description = models.TextField()
    event_time = models.DateTimeField()
    photo = models.FileField(upload_to='events/')
    has_registration = models.BooleanField()
    
    limit_people = models.IntegerField(blank=True, null=True, default=None)
    date_time_open = models.DateTimeField(blank=True, null=True, default=None)
    date_time_close = models.DateTimeField(blank=True, null=True, default=None)
    is_deleted = models.BooleanField(default=False)
    create_at  = models.DateTimeField(auto_now_add = True)
    update_at  = models.DateTimeField(auto_now = True)

    def is_open(self):
        count_visitors = len(Visitor.objects.filter(event_ID=self.id))
        return  (self.has_registration and self.date_time_open.replace(tzinfo=None) <= datetime.datetime.now().replace(tzinfo=None) \
                            and datetime.datetime.now().replace(tzinfo=None) < self.date_time_close.replace(tzinfo=None) \
                            and (not self.is_deleted) and count_visitors < self.limit_people and self.event_time.replace(tzinfo=None) > datetime.datetime.now().replace(tzinfo=None))

    def delete(self):
        self.is_deleted = True
        if self.is_open:
            self.date_time_close = datetime.datetime.now()
        self.save()

    def save(self, *args, **kwargs):
        if self.id:  # Check if the object already exists
            old_instance = Event.objects.get(pk=self.id)
            if old_instance.photo != self.photo:
                if old_instance.photo and os.path.isfile(old_instance.photo.path):
                    os.remove(old_instance.photo.path)
        super().save(*args, **kwargs)

    
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
    photo = models.FileField(upload_to='news/')
    is_deleted = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

    def delete(self):
        self.is_deleted = True
        self.save()

    def save(self, *args, **kwargs):
        if self.id:  # Check if the object already exists
            old_instance = News.objects.get(pk=self.id)
            if old_instance.photo != self.photo:
                if old_instance.photo and os.path.isfile(old_instance.photo.path):
                    os.remove(old_instance.photo.path)
        super().save(*args, **kwargs)


class CustomUser(AbstractUser):
    class Roles(models.TextChoices):
        CONDUCTOR = 'Conductor'
        ADMIN = 'Admin'
    role_user  = models.CharField(
                    max_length=10,
                    choices=Roles.choices,
                    default=Roles.ADMIN) 
    
    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # Уникальное имя для обратной ссылки
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',  # Уникальное имя для обратной ссылки
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)  # Необязательный
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
  

class PhotoGallery(models.Model):
    id = models.AutoField(primary_key=True)
    photo = models.FileField(upload_to='gallery/')
    create_at = models.DateTimeField(auto_now_add = True)
    update_at = models.DateTimeField(auto_now = True)

    def save(self, *args, **kwargs):
        if self.id:  # Check if the object already exists
            old_instance = PhotoGallery.objects.get(pk=self.id)
            if old_instance.photo != self.photo:
                if old_instance.photo and os.path.isfile(old_instance.photo.path):
                    os.remove(old_instance.photo.path)
        super().save(*args, **kwargs)
'''
#Нужно только для рассылки, если не добавлю возможность прикрепления файлов, то не нужно
class FileModel(models.Model):
    id  = models.AutoField(primary_key=True)
    file = models.FileField(upload_to='files/tmp/')  
   
    def delete(self, *args, **kwargs):
        if self.id:  # Check if the object already exists
            if self.file and os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)
'''