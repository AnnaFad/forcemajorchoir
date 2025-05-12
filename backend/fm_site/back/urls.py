from django.urls import path, re_path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.conf import settings
from django.conf.urls.static import static

app_name = "back"
urlpatterns = [
    #path("", views.index, name="index"),
    #path("api/about_as/", views.about_as, name="about_as"),
    re_path(r'^api/choiristers/$', views.choiristers, name="choiristers"),
    re_path(r'^api/edit_choirister/(\d+)$', views.edit_choirister, name="edit-choirister"),

    re_path(r'^api/events_get/(ten|all|\d+)$$', views.events_get, name="events"),
    re_path(r'^api/events_post/$$', views.events_post, name="events"),
    re_path(r'^api/edit_event/(\d+)$', views.edit_event, name="edit-event"),

    re_path(r'^api/news_get/(three|thirty|all|\d+)$$', views.news_get, name="news"),
    re_path(r'^api/news_post/$$', views.news_post, name="news"),
    re_path(r'^api/edit_news/(\d+)$', views.edit_news, name="edit-news"),

    re_path(r'^api/rehersals_get/(all|active|\d+)$$', views.rehersals_get, name="rehersals"),
    re_path(r'^api/rehersals_post/$$', views.rehersals_post, name="rehersals"),
    re_path(r'^api/edit_rehersal/(\d+)$', views.edit_rehersal, name="edit-rehersal"),

    re_path(r'^api/applicants/$', views.applicants, name="applicants"),
    re_path(r'^api/admin_applicant_list/(\d+)/(all|pass|new|fail)$', views.admin_applicant_list, name="admin_applicant_list"),
    re_path(r'^api/admin_applicant/(\d+)$', views.admin_applicant, name="admin_applicant"),

    re_path(r'^api/visitors/$', views.visitors, name="visitors"),
    re_path(r'^api/admin_visitor/(\d+)$', views.admin_visitor, name="admin_visitor"),
    re_path(r'^api/admin_visitor_list/(\d+)$', views.admin_visitor_list, name="admin_visitor_list"),

    re_path(r'^api/email_event/(\d*)$', views.email_event, name="email"),
    re_path(r'^api/email_applicants/(\d*)$$', views.email_applicants, name="email"),
    re_path(r'^api/gallery/$$', views.gallery, name="gallery"),
    re_path(r'^api/edit_gallery/(\d+)$$', views.edit_gallery, name="edit-gallery"),
    #re_path(r'^api/csv_by_rehersal/$$', views.csv_by_rehersal, name="csv"),

    re_path(r'^api/registration/$$', views.registration, name="registration"),
    re_path(r'^api/login/$$', views.login, name="login"),
    re_path(r'^api/logout/$$', views.logout, name="logout"),
    re_path(r'^api/change_pass/$$', views.change_pass, name="change_pass"),
    re_path(r'^api/email_change_pass/$$', views.email_change_pass, name="email_change_pass"),

    #re_path(r'^api/test_get_users/$$', views.test_get_users, name="test_get_users"),
    path('token/create/', TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)