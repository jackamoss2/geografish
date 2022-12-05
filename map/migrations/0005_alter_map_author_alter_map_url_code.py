# Generated by Django 4.1.3 on 2022-12-05 17:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('map', '0004_rename_geospatial_data_geospatialdata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='map',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='maps', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='map',
            name='url_code',
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
    ]