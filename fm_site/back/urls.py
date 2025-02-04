from django.urls import path
from . import views

app_name = "back"
urlpatterns = [
    #path('api/choiristers/', views.ChoiristerListCreate.as_view() ),
    path("", views.index, name="index"),
]