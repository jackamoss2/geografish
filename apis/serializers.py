from rest_framework import serializers
from map import models

class DataHashSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'title', 'data_hash',]
        model = models.GeospatialData

class GeospatialDataSerializer(serializers.ModelSerializer):
    maps = serializers.PrimaryKeyRelatedField(many=True, queryset=models.Map.objects.all(), required=False,)
    class Meta:
        model = models.GeospatialData
        fields = ['id', 'title', 'geospatial_data', 'maps', 'data_hash',]  

class MapSerializer(serializers.ModelSerializer):
    geospatial_data = serializers.StringRelatedField(many=True, read_only=True)
    class Meta:
        fields = ['id', 'title', 'url_code', 'author', 'created', 'updated', 'default_view', 'geospatial_data',]
        model = models.Map

class RendererSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'renderer', 'linked_data_id', 'linked_map_id',]
        model = models.Renderer
