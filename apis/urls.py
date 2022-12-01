from django.urls import path
from apis import views

urlpatterns = [
    path('maps/', views.map_list),
    path('maps/<int:pk>/', views.map_detail),
    path('data/', views.data_list),
    path('data/<int:pk>/', views.data_detail),
]