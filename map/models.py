from django.db import models


# Create your models here.
class Map(models.Model):
    title = models.CharField(max_length=127)
    url_code = models.CharField(max_length=16, null=True, blank=True)
    author = models.ForeignKey('auth.User', related_name="maps", on_delete=models.CASCADE, null=True, blank=True) # consider changing to protect
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    default_view = models.JSONField(null=True, blank=True,)
    # data = the set(s) of data associated with the map
    # todo: add data 
    # todo: add map view settings foreign key

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created']

class GeospatialData(models.Model):
    title = models.CharField(max_length=127, null=True, blank=True,)
    maps = models.ManyToManyField(Map, related_name='data_sets',)
    geospatial_data = models.JSONField(null=True, blank=True,)
    data_hash = models.CharField(max_length=64, null=True, blank=True,) # SHA-256, used to check if geospatial_data exists already

    def __str__(self):
        return self.title

class Renderer(models.Model):
    linked_map_id = models.ForeignKey(Map, related_name="renderer", on_delete=models.CASCADE, null=True, blank=True) # consider changing to protect
    linked_data_id = models.ForeignKey(GeospatialData, related_name="renderer", on_delete=models.CASCADE, null=True, blank=True) # consider changing to protect
    # see link for renderer example https://developers.arcgis.com/javascript/latest/style-a-feature-layer/
    renderer = models.JSONField(null=True, blank=True,)

    def __str__(self):
        return self.id