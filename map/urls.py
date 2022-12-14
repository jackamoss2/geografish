from django.urls import path
from . import views

app_name = "map"

urlpatterns = [
    path('', views.home, name='home'),
    path('map/create', views.create_map, name='create_map'),
    path('map/<str:url_code>/', views.view_map, name='view_map'),
    path('about', views.about, name='about'),
    path('contact', views.contact, name='contact'),
    path('instructions', views.instructions, name='instructions'),
    # path('<int:pk>/', DetailMap.as_view()),
    # path('map/new/', views.BlogCreateView.as_view(), name='new'),
    # path('map/<int:pk>/edit/', views.BlogEditView.as_view(), name='edit'),
    # path('map/<int:pk>/delete/', views.BlogDeleteView.as_view(), name='delete'),
]