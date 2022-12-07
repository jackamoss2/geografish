from rest_framework import serializers
from map import models

class DataHashSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GeospatialData
        fields = ['id', 'title', 'data_hash',]

class GeospatialDataSerializer(serializers.ModelSerializer):
    maps = serializers.PrimaryKeyRelatedField(many=True, queryset=models.Map.objects.all(), required=False,)
    class Meta:
        model = models.GeospatialData
        fields = ['id', 'title', 'geospatial_data', 'maps', 'data_hash',]  

class MapSerializer(serializers.ModelSerializer):
    geospatial_data = serializers.StringRelatedField(many=True, read_only=True)
    # types = TypeSerializer(many=True, read_only=True)
    class Meta:
        # todo: add map settings field
        fields = ['id', 'title', 'url_code', 'author', 'created', 'updated', 'geospatial_data',]
        model = models.Map

