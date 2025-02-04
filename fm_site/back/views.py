from django.shortcuts import render
from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
'''
from .models import Choirister

from .serializers import  ChoiristerSerializer
from rest_framework import generics

class ChoiristerListCreate(generics.ListCreateAPIView):
    queryset = Choirister.objects.get(is_deleted=False)
    serializer_class =  ChoiristerSerializer
'''
def index(request):
    '''
    latest_question_list = Question.objects.order_by("-pub_date")[:5]
    context = {
        "latest_question_list": latest_question_list,
    }'''
    return  render(request, "back/index.html")