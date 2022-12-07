from django.db import models


# Create your models here.
class Map(models.Model):
    title = models.CharField(max_length=32)
    url_code = models.CharField(max_length=16, null=True, blank=True)
    author = models.ForeignKey('auth.User', related_name="maps", on_delete=models.CASCADE, null=True, blank=True) # consider changing to protect
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    # data = the set(s) of data associated with the map
    # todo: add data 
    # todo: add map view settings foreign key

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created']

class GeospatialData(models.Model):
    title = models.CharField(max_length=32, null=True, blank=True,)
    maps = models.ManyToManyField(Map, related_name='data_sets',)
    geospatial_data = models.JSONField(null=True, blank=True,)
    data_hash = models.CharField(max_length=64, null=True, blank=True,) # SHA-256, used to check if geospatial_data exists already

    def __str__(self):
        return self.title

# todo: add map view settings model