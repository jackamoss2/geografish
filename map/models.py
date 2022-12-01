from django.db import models

# Create your models here.
class Map(models.Model):
    title = models.CharField(max_length=32)
    url_code = models.CharField(max_length=16)
    author = models.ForeignKey('auth.User', related_name="maps", on_delete=models.CASCADE) # consider changing to protect
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
    title = models.CharField(max_length=32)
    maps = models.ManyToManyField(Map, related_name='data_sets')
    geospatial_data = models.JSONField()

    def __str__(self):
        return self.title

# todo: add map view settings model