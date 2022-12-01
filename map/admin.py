from django.contrib import admin
from .models import Map, GeospatialData

admin.site.register(Map)
admin.site.register(GeospatialData)